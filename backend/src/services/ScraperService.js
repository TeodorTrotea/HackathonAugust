import puppeteer from 'puppeteer';
import { ChatOpenAI } from '@langchain/openai';
import { z } from 'zod';
import { StructuredOutputParser } from 'langchain/output_parsers';
import PQueue from 'p-queue';
import winston from 'winston';
import { format, parseISO, isValid } from 'date-fns';

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    }),
    new winston.transports.File({ filename: 'scraper.log' })
  ]
});

// Event schema for structured extraction
const EventSchema = z.object({
  title: z.string().describe('Event title'),
  description: z.string().describe('Event description'),
  date: z.string().describe('Event date in ISO format (YYYY-MM-DD)'),
  time: z.string().nullable().describe('Event time in HH:MM format'),
  location: z.string().describe('Event location/venue'),
  type: z.string().describe('Event type (Conference, Meetup, Workshop, etc)'),
  tags: z.array(z.string()).describe('Event tags/categories'),
  registrationUrl: z.string().url().optional().describe('Registration/ticket URL'),
  imageUrl: z.string().url().optional().describe('Event image URL'),
  price: z.string().optional().describe('Event price or "Free"'),
  organizer: z.string().optional().describe('Event organizer')
});

const EventsListSchema = z.object({
  events: z.array(EventSchema).describe('List of extracted events')
});

class ScraperService {
  constructor() {
    this.llm = new ChatOpenAI({
      modelName: 'gpt-4o-mini',
      temperature: 0.1,
      openAIApiKey: process.env.OPENAI_API_KEY
    });
    
    this.parser = StructuredOutputParser.fromZodSchema(EventsListSchema);
    this.queue = new PQueue({ concurrency: parseInt(process.env.MAX_CONCURRENT_SCRAPERS || '3') });
    this.browser = null;
  }

  async initialize() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async scrapeWebsite(url, selectors = {}) {
    logger.info(`Starting scrape for: ${url}`);
    
    try {
      await this.initialize();
      const page = await this.browser.newPage();
      
      // Set user agent
      await page.setUserAgent(process.env.USER_AGENT || 'Mozilla/5.0 (compatible; EventScraper/1.0)');
      
      // Navigate to the page
      await page.goto(url, { 
        waitUntil: 'networkidle2',
        timeout: parseInt(process.env.SCRAPE_TIMEOUT || '30000')
      });

      // Wait for content to load
      if (selectors.waitFor) {
        await page.waitForSelector(selectors.waitFor, { timeout: 10000 }).catch(() => {
          logger.warn(`Selector ${selectors.waitFor} not found, continuing...`);
        });
      }

      // Extract page content
      const content = await this.extractPageContent(page, selectors);
      
      // Use AI to extract structured event data
      const events = await this.extractEventsWithAI(content, url);
      
      await page.close();
      
      logger.info(`Extracted ${events.length} events from ${url}`);
      return events;
      
    } catch (error) {
      logger.error(`Error scraping ${url}:`, error);
      throw error;
    }
  }

  async extractPageContent(page, selectors) {
    // Extract text content based on selectors or full page
    const content = await page.evaluate((sel) => {
      let text = '';
      
      // Try specific selectors first
      if (sel.eventContainer) {
        const containers = document.querySelectorAll(sel.eventContainer);
        containers.forEach(container => {
          text += container.innerText + '\n\n';
        });
      }
      
      // Fallback to common event-related elements
      if (!text) {
        const eventSelectors = [
          '[class*="event"]',
          '[class*="Event"]',
          '[id*="event"]',
          'article',
          '.card',
          '.item',
          '[itemtype*="Event"]'
        ];
        
        eventSelectors.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => {
            text += el.innerText + '\n\n';
          });
        });
      }
      
      // Last resort - get main content
      if (!text) {
        const main = document.querySelector('main') || document.body;
        text = main.innerText;
      }
      
      // Also extract links
      const links = [];
      document.querySelectorAll('a[href]').forEach(link => {
        links.push({
          text: link.innerText,
          href: link.href
        });
      });
      
      return {
        text: text.substring(0, 50000), // Limit text length
        links: links.slice(0, 100), // Limit number of links
        title: document.title,
        url: window.location.href
      };
    }, selectors);
    
    return content;
  }

  async extractEventsWithAI(content, sourceUrl) {
    const prompt = `
You are an expert at extracting event information from web pages. 
Analyze the following content from ${sourceUrl} and extract ALL tech-related events you can find.

Page Title: ${content.title}
Content: ${content.text}

Extract events with as much detail as possible. For each event, provide:
- Title (required)
- Description (detailed summary)
- Date (in YYYY-MM-DD format)
- Time (in HH:MM format if available)
- Location (venue, city, country)
- Type (Conference, Meetup, Workshop, Webinar, etc)
- Tags (technologies, topics mentioned)
- Registration URL (if found)
- Image URL (if found)
- Price (or "Free")
- Organizer (if mentioned)

Focus on tech events including: AI, ML, software development, startups, innovation, digital transformation, blockchain, cloud, DevOps, etc.

${this.parser.getFormatInstructions()}
`;

    try {
      const response = await this.llm.invoke(prompt);
      const parsed = await this.parser.parse(response.content);
      
      // Enhance events with source URL and validation
      const enhancedEvents = parsed.events.map(event => ({
        ...event,
        sourceUrl,
        scrapedAt: new Date().toISOString(),
        tags: Array.isArray(event.tags) ? event.tags.join(';') : '',
        status: 'scraped',
        id: this.generateEventId(event)
      }));
      
      return enhancedEvents.filter(event => this.validateEvent(event));
      
    } catch (error) {
      logger.error('AI extraction error:', error);
      return [];
    }
  }

  validateEvent(event) {
    // Basic validation
    if (!event.title || event.title.length < 3) return false;
    
    // Validate date
    if (event.date) {
      try {
        const date = parseISO(event.date);
        if (!isValid(date)) return false;
      } catch {
        return false;
      }
    }
    
    // Check if it's actually a tech event
    const techKeywords = ['tech', 'ai', 'ml', 'software', 'digital', 'data', 'cloud', 'dev', 'code', 'startup', 'innovation'];
    const eventText = `${event.title} ${event.description} ${event.tags}`.toLowerCase();
    
    return techKeywords.some(keyword => eventText.includes(keyword));
  }

  generateEventId(event) {
    // Generate unique ID based on event properties
    const baseString = `${event.title}-${event.date}-${event.location}`;
    return Buffer.from(baseString).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);
  }

  async scrapeMultipleSites(sites) {
    logger.info(`Starting batch scrape for ${sites.length} sites`);
    
    const results = await Promise.allSettled(
      sites.map(site => 
        this.queue.add(() => this.scrapeWebsite(site.url, site.selectors))
      )
    );
    
    const allEvents = [];
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allEvents.push(...result.value);
      } else {
        logger.error(`Failed to scrape ${sites[index].url}:`, result.reason);
      }
    });
    
    await this.cleanup();
    
    logger.info(`Batch scrape complete. Total events: ${allEvents.length}`);
    return allEvents;
  }
}

export default ScraperService;