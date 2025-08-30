import axios from 'axios';
import * as cheerio from 'cheerio';
import { isTechEvent, extractTechTags } from '../config/tech-keywords.js';
import { belgianCities, isLocationInBelgium } from '../config/belgian-cities.js';
import Database from '../database.js';

class LumaScraper {
  constructor() {
    this.baseUrl = 'https://luma.com';
    this.db = null;
  }

  async initialize() {
    this.db = new Database();
    await this.db.initialize();
  }

  async scrapeEvents(locations = belgianCities) {
    if (!this.db) {
      await this.initialize();
    }
    
    const events = [];
    
    for (const location of locations) {
      console.log(`Scraping tech events for ${location} on Luma...`);
      
      // Scrape by specific tech keywords
      const techKeywords = [
        'javascript', 'python', 'react', 'programming', 'developer',
        'ai', 'machine learning', 'blockchain', 'hackathon', 'coding',
        'software development', 'web development', 'nodejs', 'typescript'
      ];
      for (const keyword of techKeywords.slice(0, 5)) { // Limit to 5 most effective
        console.log(`  Searching for "${keyword}" in ${location}...`);
        const keywordEvents = await this.scrapeByKeyword(location, keyword);
        events.push(...keywordEvents);
      }
    }

    // Remove duplicates based on registration_url
    const uniqueEvents = [];
    const seenUrls = new Set();
    
    for (const event of events) {
      if (event.registration_url && !seenUrls.has(event.registration_url)) {
        seenUrls.add(event.registration_url);
        uniqueEvents.push(event);
      }
    }

    return uniqueEvents;
  }

  async scrapeByKeyword(location, keyword, maxPages = 2) {
    const events = [];
    
    for (let page = 1; page <= maxPages; page++) {
      try {
        console.log(`    Page ${page} for "${keyword}" in ${location}...`);
        const pageEvents = await this.scrapePage(location, keyword, page);
        events.push(...pageEvents);
        
        if (pageEvents.length === 0) {
          console.log(`    No more events found on page ${page}, stopping pagination`);
          break;
        }
        
        // Add delay between requests to avoid rate limiting
        await this.delay(800);
        
      } catch (error) {
        console.error(`    Error scraping page ${page}:`, error.message);
        break;
      }
    }
    
    return events;
  }

  async scrapePage(location, keyword, page = 1) {
    const events = [];
    
    try {
      // Luma search URL with location and keyword  
      const searchUrl = `${this.baseUrl}/discover?q=${encodeURIComponent(keyword + ' ' + location)}&page=${page}`;
      
      const response = await axios.get(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache'
        },
        timeout: 15000
      });

      const $ = cheerio.load(response.data);
      
      // Look for event rows based on WebFetch analysis
      const selectors = [
        '.event-row',
        '[class*="event-row"]',
        '.event-card',
        '[class*="event-card"]',
        'a[href*="/event/"]',
        'a[href^="/"]'
      ];

      let foundEvents = false;
      for (const selector of selectors) {
        const elements = $(selector);
        if (elements.length > 0) {
          console.log(`    Found ${elements.length} Luma elements with selector: ${selector}`);
          foundEvents = true;
          
          for (let i = 0; i < elements.length; i++) {
            try {
              const element = elements[i];
              const basicEvent = this.parseBasicEvent($, element, location);
              
              if (basicEvent && basicEvent.title && basicEvent.registration_url) {
                // Visit individual event page to get full details
                console.log(`    Fetching details for: ${basicEvent.title}`);
                const fullEvent = await this.getEventDetails(basicEvent);
                
                if (fullEvent) {
                  // Check if event is actually in Belgium
                  const isInBelgium = isLocationInBelgium(fullEvent.location, location);
                  console.log(`    Location check: ${isInBelgium} - "${fullEvent.location}" (searching for ${location})`);
                  
                  if (isInBelgium) {
                    // Use stricter tech filtering since Luma search seems less accurate
                    const isTech = this.isStrictlyTechEvent(fullEvent.title, fullEvent.description);
                    console.log(`    Tech validation: ${isTech} for "${fullEvent.title}"`);
                    console.log(`    Content check: "${fullEvent.title}" | "${fullEvent.description.substring(0, 100)}..."`);
                    
                    if (isTech) {
                      fullEvent.tags = extractTechTags(fullEvent.title, fullEvent.description);
                      
                      // Save directly to database
                      if (this.db) {
                        try {
                          await this.db.saveEvent(fullEvent);
                          console.log(`    ✅ Saved to DB: "${fullEvent.title}"`);
                        } catch (error) {
                          console.log(`    ❌ DB Error: ${error.message}`);
                        }
                      }
                      
                      events.push(fullEvent);
                      console.log(`    ✅ Added event: "${fullEvent.title}"`);
                    } else {
                      console.log(`    ❌ Filtered out: "${fullEvent.title}" (not tech-related)`);
                    }
                  } else {
                    console.log(`    ❌ Filtered out: "${fullEvent.title}" (not in Belgium)`);
                  }
                  
                  // Add delay to avoid overwhelming the server
                  await this.delay(1000);
                }
              }
            } catch (err) {
              console.error('Error processing Luma event:', err);
            }
          }
          
          if (events.length > 0) break;
        }
      }

      if (!foundEvents && page === 1) {
        console.log(`    No events found for "${keyword}" in ${location} on Luma`);
      }

    } catch (error) {
      console.error(`    Error scraping "${keyword}" in ${location} on Luma:`, error.message);
    }

    return events;
  }

  async getEventDetails(basicEvent) {
    try {
      console.log(`    Fetching full details from: ${basicEvent.registration_url}`);
      
      const response = await axios.get(basicEvent.registration_url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9'
        },
        timeout: 15000
      });

      const $ = cheerio.load(response.data);
      
      // Extract detailed information from the Luma event page
      const title = $('h1').first().text().trim() || 
                   $('.event-title').first().text().trim() || 
                   $('[data-testid="event-title"]').first().text().trim() ||
                   basicEvent.title;
      
      console.log(`    Found title: "${title}"`);
      
      // Get full description from multiple possible locations
      let description = '';
      const descSelectors = [
        '[data-testid="event-description"]',
        '.event-description',
        '.description',
        '.event-details',
        '.event-content',
        '[class*="description"]',
        '[class*="about"]',
        '.content',
        'section p',
        'div[class*="text"] p'
      ];
      
      for (const selector of descSelectors) {
        const elements = $(selector);
        elements.each((_, elem) => {
          const text = $(elem).text().trim();
          if (text && text.length > description.length && text.length > 50) {
            description = text;
          }
        });
        if (description && description.length > 100) break;
      }
      
      // If still no good description, get all paragraph text
      if (!description || description.length < 50) {
        const allParagraphs = $('p').map((_, elem) => $(elem).text().trim()).get();
        const longestP = allParagraphs.reduce((longest, current) => 
          current.length > longest.length ? current : longest, '');
        if (longestP.length > 50) description = longestP;
      }
      
      console.log(`    Found description: ${description.substring(0, 100)}...`);
      
      // Get date and time from multiple sources
      let eventDate = basicEvent.date;
      let eventTime = basicEvent.time;
      
      // Look for structured data or time elements
      const dateSelectors = [
        '[data-testid="event-date"]',
        '[data-testid="event-time"]', 
        '.event-date',
        '.date-time',
        '.event-time',
        'time',
        '[datetime]',
        '[class*="date"]',
        '[class*="time"]'
      ];
      
      for (const selector of dateSelectors) {
        const element = $(selector).first();
        const dateText = element.attr('datetime') || 
                        element.attr('title') || 
                        element.text().trim();
        if (dateText) {
          console.log(`    Found date/time text: "${dateText}"`);
          eventDate = this.parseDate(dateText);
          eventTime = this.extractTime(dateText);
          break;
        }
      }
      
      // Also check page text for date patterns
      if (eventDate === basicEvent.date) {
        const pageText = $('body').text();
        const datePatterns = [
          /(\w{3}),?\s*(\w{3})\s*(\d{1,2}),?\s*(\d{4})?.*?(\d{1,2}):(\d{2})\s*(AM|PM)/gi,
          /(\d{1,2})\/(\d{1,2})\/(\d{4}).*?(\d{1,2}):(\d{2})\s*(AM|PM)?/gi
        ];
        
        for (const pattern of datePatterns) {
          const match = pageText.match(pattern);
          if (match && match[0]) {
            console.log(`    Found date pattern: "${match[0]}"`);
            eventDate = this.parseDate(match[0]);
            eventTime = this.extractTime(match[0]);
            break;
          }
        }
      }
      
      // Get location with more comprehensive search
      let location = basicEvent.location;
      const locationSelectors = [
        '[data-testid="event-location"]',
        '[data-testid="venue"]',
        '.event-location',
        '.location',
        '.venue',
        '.address',
        '[class*="location"]',
        '[class*="venue"]',
        '[class*="address"]'
      ];
      
      for (const selector of locationSelectors) {
        const loc = $(selector).text().trim();
        if (loc && loc.length > 3) {
          location = loc;
          console.log(`    Found location: "${location}"`);
          break;
        }
      }
      
      // Get organizer information
      let organizer = basicEvent.community?.name || '';
      const organizerSelectors = [
        '[data-testid="event-host"]',
        '[data-testid="organizer"]',
        '.event-host',
        '.organizer',
        '.host',
        '.creator',
        '[class*="host"]',
        '[class*="organizer"]',
        '[class*="creator"]'
      ];
      
      for (const selector of organizerSelectors) {
        const org = $(selector).text().trim();
        if (org && org.length > 2 && !org.toLowerCase().includes('luma')) {
          organizer = org;
          console.log(`    Found organizer: "${organizer}"`);
          break;
        }
      }
      
      // Get high quality image
      let imageUrl = basicEvent.image_url;
      const imageSelectors = [
        '.event-hero-image img',
        '.hero-image img', 
        '[data-testid="event-image"] img',
        '.event-cover img',
        '.cover-image img',
        'img[src*="event"]',
        'img[src*="hero"]',
        'img[src*="cover"]',
        'main img',
        'header img'
      ];
      
      for (const selector of imageSelectors) {
        const img = $(selector).first();
        const src = img.attr('src') || img.attr('data-src');
        if (src && src.startsWith('http') && !src.includes('avatar') && !src.includes('icon')) {
          imageUrl = src;
          console.log(`    Found image: ${imageUrl.substring(0, 80)}...`);
          break;
        }
      }
      
      // Get event type/category
      let eventType = 'Event';
      const typeSelectors = [
        '[data-testid="event-category"]',
        '.category',
        '.event-type',
        '.tag',
        '[class*="category"]',
        '[class*="type"]'
      ];
      
      for (const selector of typeSelectors) {
        const type = $(selector).text().trim();
        if (type && type.length > 2) {
          eventType = type;
          break;
        }
      }
      
      return {
        title: title,
        description: description || basicEvent.description || `Event in ${location}`,
        date: eventDate,
        time: eventTime,
        location: location,
        type: eventType,
        image_url: imageUrl,
        registration_url: basicEvent.registration_url,
        tags: extractTechTags(title, description),
        community: {
          name: organizer || `Luma ${location}`,
          slug: organizer ? organizer.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `luma-${location.toLowerCase()}`,
          description: organizer ? `${organizer} events via Luma` : `Events in ${location} via Luma`,
          website: 'https://luma.com',
          city: location.includes(',') ? location.split(',')[1]?.trim() : location,
          logo_url: 'https://luma.com/favicon.ico',
          tags: 'Luma'
        }
      };
      
    } catch (error) {
      console.error(`Error fetching event details from ${basicEvent.registration_url}:`, error.message);
      // Return the basic event if we can't get details
      return basicEvent;
    }
  }

  parseBasicEvent($, element, city) {
    const $el = $(element);
    
    // Try multiple selectors for title
    const titleSelectors = ['h1', 'h2', 'h3', 'h4', '.title', '[class*="title"]', '[class*="Title"]'];
    let title = '';
    for (const selector of titleSelectors) {
      title = $el.find(selector).first().text().trim();
      if (title && title.length > 2) break;
    }
    
    // If still no title, try getting from href or data attributes
    if (!title) {
      const href = $el.attr('href') || $el.find('a').first().attr('href');
      if (href) {
        const pathSegments = href.split('/');
        title = pathSegments[pathSegments.length - 1]?.replace(/-/g, ' ') || '';
      }
    }
    
    // Try multiple selectors for description
    const descSelectors = ['.description', '.summary', '.excerpt', 'p', '.content', '[class*="description"]'];
    let description = '';
    for (const selector of descSelectors) {
      description = $el.find(selector).first().text().trim();
      if (description && description.length > 10) break;
    }
    
    // Try multiple selectors for date
    const dateSelectors = ['time', '.date', '[datetime]', '[class*="date"]', '[class*="Date"]'];
    let dateText = '';
    for (const selector of dateSelectors) {
      const element = $el.find(selector).first();
      dateText = element.attr('datetime') || element.attr('title') || element.text().trim();
      if (dateText) break;
    }
    
    // Try multiple selectors for location
    const locationSelectors = ['.location', '.venue', '.address', '[class*="location"]', '[class*="venue"]'];
    let location = '';
    for (const selector of locationSelectors) {
      location = $el.find(selector).first().text().trim();
      if (location) break;
    }
    
    // Get link - Luma events typically have short codes
    let link = $el.find('.event-link').first().attr('href') || 
               $el.find('a').first().attr('href') || 
               $el.attr('href');
    
    if (link && !link.startsWith('http')) {
      link = link.startsWith('/') ? `${this.baseUrl}${link}` : `${this.baseUrl}/${link}`;
    }
    
    // Try to get image with Luma-specific selectors
    let imageUrl = '';
    const imgSelectors = ['img[src]', '[style*="background-image"]', 'img[data-src]'];
    for (const selector of imgSelectors) {
      const img = $el.find(selector).first();
      imageUrl = img.attr('src') || img.attr('data-src');
      
      // Check background image
      if (!imageUrl && selector.includes('background-image')) {
        const style = img.attr('style');
        if (style) {
          const match = style.match(/url\\(['\"]?([^'\"\\)]+)['\"]?\\)/);
          if (match) imageUrl = match[1];
        }
      }
      
      if (imageUrl) break;
    }
    
    // Try to extract organizer
    const organizer = $el.find('.organizer, .host, [class*="organizer"]').first().text().trim();

    const registration_url = link;
    const image_url = imageUrl && imageUrl.startsWith('http') ? imageUrl : null;

    return {
      title: title || null,
      description: description || '',
      date: this.parseDate(dateText),
      time: this.extractTime(dateText),
      location: location || city,
      type: 'Event',
      image_url: image_url,
      registration_url: registration_url,
      tags: extractTechTags(title, description),
      community: {
        name: organizer || `Luma ${city}`,
        slug: organizer ? organizer.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `luma-${city.toLowerCase()}`,
        description: organizer ? `${organizer} events via Luma` : `Events in ${city} via Luma`,
        website: 'https://luma.com',
        city: city,
        logo_url: 'https://luma.com/favicon.ico',
        tags: 'Luma'
      }
    };
  }

  parseDate(dateString) {
    if (!dateString) {
      // Default to a future date
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30) + 1);
      return futureDate.toISOString().split('T')[0];
    }
    
    console.log(`Parsing Luma date: "${dateString}"`);
    
    try {
      // Handle various date formats
      let cleanDate = dateString.replace(/[^\\d\\s\\-\\/\\.:]/g, '').trim();
      
      // Try to parse ISO format first
      if (dateString.includes('T') || dateString.includes('Z')) {
        const date = new Date(dateString);
        if (!isNaN(date)) {
          return date.toISOString().split('T')[0];
        }
      }
      
      // Try standard date parsing
      const date = new Date(cleanDate);
      if (!isNaN(date) && date > new Date('2024-01-01')) {
        return date.toISOString().split('T')[0];
      }
      
      // Handle relative dates like "Tomorrow", "Next week"
      if (dateString.toLowerCase().includes('tomorrow')) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
      }
      
      if (dateString.toLowerCase().includes('today')) {
        return new Date().toISOString().split('T')[0];
      }
      
    } catch (e) {
      console.error('Date parsing error:', e);
    }
    
    // Fallback to a future date
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30) + 1);
    return futureDate.toISOString().split('T')[0];
  }

  extractTime(dateString) {
    if (!dateString) return '19:00:00';
    
    try {
      // Try to parse full datetime first
      const date = new Date(dateString);
      if (!isNaN(date)) {
        return date.toTimeString().split(' ')[0];
      }
    } catch (e) {}
    
    // Look for time patterns
    const timeMatch = dateString.match(/(\\d{1,2}):(\\d{2})\\s*(AM|PM|am|pm)?/);
    if (timeMatch) {
      let hour = parseInt(timeMatch[1]);
      const minute = timeMatch[2];
      const period = timeMatch[3];
      
      if (period && period.toLowerCase() === 'pm' && hour < 12) {
        hour += 12;
      } else if (period && period.toLowerCase() === 'am' && hour === 12) {
        hour = 0;
      }
      
      return `${hour.toString().padStart(2, '0')}:${minute}:00`;
    }
    
    return '19:00:00'; // Default time
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  isLikelyTechEvent(title, description = '') {
    const text = `${title} ${description}`.toLowerCase();
    
    // Simple exclusion list for obviously non-tech events
    const nonTechExclusions = [
      'cooking', 'recipe', 'restaurant', 'fitness', 'yoga', 'meditation',
      'music concert', 'art gallery', 'painting', 'dance', 'theater',
      'real estate', 'insurance', 'dating', 'singles', 'parenting',
      'travel', 'tourism', 'hiking', 'sports', 'football', 'basketball',
      'medical', 'healthcare', 'wellness', 'fashion', 'beauty'
    ];
    
    // Since we're already searching with tech terms, just exclude obvious non-tech
    const hasNonTechExclusion = nonTechExclusions.some(term => text.includes(term));
    
    // Allow most events through since we're using targeted searches
    return !hasNonTechExclusion;
  }

  isStrictlyTechEvent(title, description = '') {
    const text = `${title} ${description}`.toLowerCase();
    
    // Must contain at least one of these tech terms
    const strictTechTerms = [
      // Programming languages
      'javascript', 'python', 'java', 'typescript', 'php', 'ruby', 'go', 'rust',
      'kotlin', 'swift', 'c++', 'c#', 'scala', 'html', 'css', 'sql',
      
      // Frameworks and libraries  
      'react', 'vue', 'angular', 'svelte', 'nextjs', 'nuxt', 'django', 'flask',
      'spring', 'laravel', 'rails', 'express', 'fastapi', 'node.js', 'nodejs',
      
      // Tech concepts
      'programming', 'coding', 'development', 'software', 'app development',
      'web development', 'mobile development', 'frontend', 'backend', 'fullstack',
      'devops', 'api', 'rest api', 'graphql', 'microservices', 'database',
      
      // Tech tools
      'docker', 'kubernetes', 'git', 'github', 'gitlab', 'jenkins', 'terraform',
      'ansible', 'mongodb', 'postgresql', 'redis', 'elasticsearch', 'kafka',
      
      // AI/ML terms
      'artificial intelligence', 'machine learning', 'deep learning', 'ai',
      'data science', 'neural networks', 'computer vision', 'nlp', 'chatgpt',
      'openai', 'tensorflow', 'pytorch', 'ml model', 'llm',
      
      // Cloud platforms
      'aws', 'azure', 'google cloud', 'gcp', 'cloud computing',
      
      // Tech events/activities
      'hackathon', 'coding bootcamp', 'programming workshop', 'tech talk',
      'developer meetup', 'code review', 'pair programming', 'tech conference',
      
      // Blockchain/Crypto
      'blockchain', 'cryptocurrency', 'smart contracts', 'defi', 'nft', 'web3',
      'bitcoin', 'ethereum', 'solidity',
      
      // Cybersecurity
      'cybersecurity', 'infosec', 'penetration testing', 'ethical hacking',
      'security', 'encryption'
    ];
    
    // Must have at least one strict tech term
    const hasStrictTech = strictTechTerms.some(term => text.includes(term));
    
    // Strong exclusions for definitely non-tech events
    const strongExclusions = [
      'cooking', 'recipe', 'food', 'restaurant', 'culinary', 'chef',
      'fitness', 'workout', 'gym', 'yoga', 'pilates', 'meditation', 'wellness',
      'music', 'concert', 'band', 'singing', 'dj', 'festival',
      'art', 'painting', 'drawing', 'sculpture', 'gallery', 'exhibition',
      'dance', 'dancing', 'ballet', 'salsa', 'tango',
      'theater', 'theatre', 'drama', 'acting', 'play',
      'real estate', 'property', 'house', 'apartment',
      'insurance', 'banking', 'finance', 'investment', 'trading', 'forex',
      'dating', 'singles', 'relationship', 'love', 'romance',
      'parenting', 'children', 'kids', 'baby', 'family',
      'travel', 'tourism', 'vacation', 'trip', 'holiday',
      'sports', 'football', 'soccer', 'basketball', 'tennis', 'golf',
      'medical', 'healthcare', 'doctor', 'therapy', 'clinic',
      'fashion', 'beauty', 'makeup', 'skincare', 'style',
      'language learning', 'english class', 'spanish', 'french', 'german',
      'book club', 'reading', 'literature', 'poetry',
      'gardening', 'plants', 'flowers'
    ];
    
    const hasStrongExclusion = strongExclusions.some(term => text.includes(term));
    
    // Must have tech terms AND not have strong exclusions
    return hasStrictTech && !hasStrongExclusion;
  }

}

export default LumaScraper;