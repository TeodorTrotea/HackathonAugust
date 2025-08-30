import axios from 'axios';
import * as cheerio from 'cheerio';
import OpenAI from 'openai';
import Database from '../database.js';
import dotenv from 'dotenv';

dotenv.config();

class AIScraper {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.db = null;
  }

  async initialize() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    this.db = new Database();
    await this.db.initialize();
  }

  async scrapeEventFromUrl(url, options = {}) {
    if (!this.db) {
      await this.initialize();
    }

    console.log(`\nAnalyzing URL with AI: ${url}`);

    try {
      // Fetch the HTML content
      const htmlContent = await this.fetchHtmlContent(url);
      
      if (!htmlContent) {
        console.log('❌ Failed to fetch HTML content');
        return null;
      }

      // Debug mode: show content preview
      if (options.debug) {
        console.log('\n🔍 DEBUG: HTML Content Preview');
        console.log('================================');
        const $ = cheerio.load(htmlContent);
        const textContent = $('body').text().trim();
        console.log(textContent.substring(0, 1000) + '...\n');
      }

      // Use AI to determine if it's a tech event and extract data
      const eventData = await this.analyzeWithAI(htmlContent, url, options);
      
      if (!eventData) {
        console.log('❌ AI determined this is not a tech event or could not extract data');
        return null;
      }

      // Save to database if valid
      if (this.validateEventData(eventData)) {
        try {
          await this.db.saveEvent(eventData);
          console.log(`✅ Successfully saved event: "${eventData.title}"`);
          return eventData;
        } catch (error) {
          console.error('❌ Database error:', error.message);
          return eventData; // Still return the data even if DB save failed
        }
      } else {
        console.log('❌ Event data validation failed');
        return null;
      }

    } catch (error) {
      console.error(`❌ Error scraping ${url}:`, error.message);
      return null;
    }
  }

  async fetchHtmlContent(url) {
    try {
      console.log('📡 Fetching HTML content...');
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        timeout: 15000,
        maxRedirects: 5
      });

      if (response.status !== 200) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      console.log(`✅ Successfully fetched content (status: ${response.status})`);

      // Clean up HTML and extract meaningful content
      const $ = cheerio.load(response.data);
      
      // Remove script tags, style tags, and comments to reduce noise
      $('script, style, noscript, iframe').remove();
      $('*').contents().filter((i, node) => node.nodeType === 8).remove(); // Remove comments
      
      // Get the cleaned HTML
      const cleanedHtml = $.html();
      
      // Truncate if too long (OpenAI has token limits)
      const maxLength = 50000; // Conservative limit for GPT-4o-mini
      const truncatedHtml = cleanedHtml.length > maxLength 
        ? cleanedHtml.substring(0, maxLength) + '\n... [Content truncated]'
        : cleanedHtml;

      console.log(`📄 Processed HTML content (${truncatedHtml.length} characters)`);
      return truncatedHtml;

    } catch (error) {
      if (error.response) {
        console.error(`❌ HTTP Error ${error.response.status}: ${error.response.statusText}`);
        console.error(`   URL: ${url}`);
      } else if (error.request) {
        console.error(`❌ Network Error: No response received from ${url}`);
      } else {
        console.error(`❌ Request Error: ${error.message}`);
      }
      return null;
    }
  }

  async analyzeWithAI(htmlContent, url, options = {}) {
    try {
      const prompt = `
You are an expert event analyzer. Analyze the following HTML content from ${url} and determine:

1. Is this a technology-related event? (programming, software development, AI, data science, web development, mobile development, DevOps, cybersecurity, blockchain, etc.)
2. If yes, extract all relevant event information in the exact JSON format specified below.

IMPORTANT: Only return events that are clearly technology-related. Exclude:
- General business events, networking without tech focus
- Art, music, food, fitness, travel, or lifestyle events  
- Academic conferences unless clearly tech-focused
- Job fairs unless tech-specific

CRITICAL: Return ONLY raw JSON, no code blocks, no markdown, no other text.

If tech event, return this exact format:
{
  "isTechEvent": true,
  "event": {
    "title": "Event title",
    "description": "Detailed event description", 
    "date": "YYYY-MM-DD format",
    "time": "HH:MM:SS format (24-hour)",
    "location": "Full address or venue name and city",
    "type": "Event type (Workshop, Conference, Meetup, Hackathon, etc.)",
    "image_url": "Main event image URL (full HTTP URL)",
    "registration_url": "${url}",
    "tags": ["relevant", "tech", "tags"],
    "community": {
      "name": "Organizing community/company name",
      "slug": "organizing-community-slug",
      "description": "Brief description of the organizer",
      "website": "Organizer website URL",
      "city": "City where organizer is based",
      "logo_url": "Organizer logo URL",
      "tags": "Organizer category/type"
    }
  }
}

If NOT a tech event, return: {"isTechEvent": false}

HTML Content:
${htmlContent}
`;

      console.log('🤖 Sending to OpenAI for analysis...');
      
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o-mini", // Better performance for this task
        messages: [
          {
            role: "system", 
            content: "You are a precise event analyzer. Return only valid JSON responses as specified. Be strict about what qualifies as a tech event."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.1, // Low temperature for consistent, factual responses
        max_tokens: 2000
      });

      const response = completion.choices[0].message.content.trim();
      console.log('🤖 AI Response received');

      // Parse the JSON response (handle markdown code blocks)
      try {
        let cleanResponse = response.trim();
        
        // Remove markdown code blocks if present
        if (cleanResponse.startsWith('```json') || cleanResponse.startsWith('```')) {
          cleanResponse = cleanResponse.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
        }
        
        const parsedResponse = JSON.parse(cleanResponse);
        
        if (!parsedResponse.isTechEvent) {
          console.log('🤖 AI determined: Not a tech event');
          return null;
        }

        if (!parsedResponse.event) {
          console.log('🤖 AI response missing event data');
          return null;
        }

        console.log(`🤖 AI determined: Tech event - "${parsedResponse.event.title}"`);
        return parsedResponse.event;

      } catch (parseError) {
        console.error('❌ Failed to parse AI response as JSON:', parseError.message);
        console.log('Raw AI response:', response.substring(0, 500) + '...');
        return null;
      }

    } catch (error) {
      console.error('❌ OpenAI API error:', error.message);
      return null;
    }
  }

  validateEventData(event) {
    if (!event || typeof event !== 'object') {
      console.log('❌ Validation failed: Invalid event object');
      return false;
    }

    if (!event.title || event.title.trim().length < 3) {
      console.log('❌ Validation failed: Missing or invalid title');
      return false;
    }

    if (!event.registration_url || !this.isValidUrl(event.registration_url)) {
      console.log('❌ Validation failed: Missing or invalid registration URL');
      return false;
    }

    if (!event.description || event.description.trim().length < 10) {
      console.log('❌ Validation failed: Missing or insufficient description');
      return false;
    }

    // Validate date format (YYYY-MM-DD)
    if (event.date && !event.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      console.log('❌ Validation failed: Invalid date format');
      return false;
    }

    // Validate time format (HH:MM:SS)
    if (event.time && !event.time.match(/^\d{2}:\d{2}(:\d{2})?$/)) {
      console.log('❌ Validation failed: Invalid time format');
      return false;
    }

    console.log('✅ Event data validation passed');
    return true;
  }

  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  // Utility method to scrape multiple URLs
  async scrapeMultipleUrls(urls, options = {}) {
    const results = [];
    const delay = options.delay || 2000; // 2 second delay between requests
    const maxConcurrent = options.maxConcurrent || 1; // Process one at a time by default

    console.log(`\n🚀 Starting AI scraping of ${urls.length} URLs...`);

    for (let i = 0; i < urls.length; i += maxConcurrent) {
      const batch = urls.slice(i, i + maxConcurrent);
      const batchPromises = batch.map(url => this.scrapeEventFromUrl(url));
      
      const batchResults = await Promise.allSettled(batchPromises);
      
      batchResults.forEach((result, index) => {
        const url = batch[index];
        if (result.status === 'fulfilled' && result.value) {
          results.push(result.value);
          console.log(`✅ Success: ${url}`);
        } else {
          console.log(`❌ Failed: ${url}`);
        }
      });

      // Add delay between batches
      if (i + maxConcurrent < urls.length) {
        console.log(`⏱️ Waiting ${delay}ms before next batch...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    console.log(`\n📊 Scraping complete: ${results.length}/${urls.length} successful`);
    return results;
  }

  async close() {
    if (this.db) {
      await this.db.close();
    }
  }
}

export default AIScraper;