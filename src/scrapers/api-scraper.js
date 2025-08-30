import axios from 'axios';
import * as cheerio from 'cheerio';
import { ChatOpenAI } from '@langchain/openai';
import { z } from 'zod';
import { StructuredOutputParser } from 'langchain/output_parsers';

// Event schema for AI parsing
const EventSchema = z.object({
  title: z.string().describe('Event title'),
  description: z.string().describe('Event description'),
  date: z.string().describe('Event date in YYYY-MM-DD format'),
  time: z.string().nullable().describe('Event time in HH:MM format'),
  location: z.string().describe('Event location/venue'),
  type: z.string().describe('Event type'),
  website_url: z.string().url().optional().describe('Event URL'),
  image_url: z.string().url().optional().describe('Event image URL')
});

const EventsListSchema = z.object({
  events: z.array(EventSchema).describe('List of extracted events')
});

class APIScraper {
  constructor() {
    this.llm = new ChatOpenAI({
      modelName: 'gpt-4o-mini',
      temperature: 0.1,
      openAIApiKey: process.env.OPENAI_API_KEY
    });
    this.parser = StructuredOutputParser.fromZodSchema(EventsListSchema);
  }

  async scrapeEvents() {
    const events = [];
    
    // List of event websites to scrape
    const websites = [
      {
        url: 'https://www.meetup.com/find/?keywords=tech&location=be--brussels',
        source: 'Meetup Brussels'
      },
      {
        url: 'https://www.eventbrite.com/d/belgium--brussels/events/',
        source: 'Eventbrite Brussels'
      },
      {
        url: 'https://www.facebook.com/events/search/?q=tech%20events%20brussels',
        source: 'Facebook Events'
      }
    ];

    for (const site of websites) {
      try {
        console.log(`Scraping ${site.source}...`);
        const siteEvents = await this.scrapeWebsite(site.url, site.source);
        events.push(...siteEvents);
      } catch (error) {
        console.error(`Error scraping ${site.source}:`, error.message);
      }
    }

    return events;
  }

  async scrapeWebsite(url, source) {
    try {
      // Use free scraping method with axios and user agent rotation
      const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      ];

      const headers = {
        'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)],
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive'
      };

      const response = await axios.get(url, { 
        headers,
        timeout: 30000,
        maxRedirects: 5
      });

      const $ = cheerio.load(response.data);
      
      // Extract text content for AI processing
      const content = this.extractContent($);
      
      // Use AI to parse events
      const events = await this.parseEventsWithAI(content, url, source);
      
      return events;
    } catch (error) {
      console.error(`Error scraping ${url}:`, error.message);
      return [];
    }
  }

  extractContent($) {
    // Remove script and style elements
    $('script, style, nav, footer, header').remove();
    
    // Extract main content
    let content = '';
    
    // Look for event-related content
    const eventSelectors = [
      '[class*="event"]',
      '[class*="Event"]',
      '[data-testid*="event"]',
      'article',
      '.card',
      '.item',
      '[itemtype*="Event"]'
    ];
    
    eventSelectors.forEach(selector => {
      $(selector).each((i, el) => {
        if (i < 20) { // Limit to first 20 elements
          content += $(el).text() + '\n\n';
        }
      });
    });

    // Fallback to main content
    if (!content.trim()) {
      const main = $('main').length ? $('main') : $('body');
      content = main.text();
    }

    return content.substring(0, 15000); // Limit content length
  }

  async parseEventsWithAI(content, sourceUrl, source) {
    const prompt = `
Extract tech-related events from this webpage content. Focus on events in Belgium, particularly Brussels, Antwerp, Ghent.

Source: ${source}
URL: ${sourceUrl}

Content:
${content}

Extract events with these details:
- Title (required)
- Description
- Date (YYYY-MM-DD format)
- Time (HH:MM format if available)
- Location (venue/city)
- Type (Conference, Meetup, Workshop, etc)
- Event URL (if found)
- Image URL (if found)

Only include tech-related events (AI, ML, software, startups, digital, programming, etc).

${this.parser.getFormatInstructions()}
`;

    try {
      const response = await this.llm.invoke(prompt);
      const parsed = await this.parser.parse(response.content);
      
      return parsed.events.map(event => ({
        ...event,
        tags: [],
        community: {
          name: source,
          slug: source.toLowerCase().replace(/\s+/g, '-'),
          description: `Events from ${source}`,
          website: sourceUrl,
          city: 'Brussels',
          logo_url: null,
          tags: []
        }
      }));
    } catch (error) {
      console.error('AI parsing error:', error.message);
      return [];
    }
  }
}

export default APIScraper;