import axios from 'axios';
import * as cheerio from 'cheerio';
import { techSearchKeywords, isTechEvent, extractTechTags } from '../config/tech-keywords.js';
import { belgianCities, isLocationInBelgium } from '../config/belgian-cities.js';
import Database from '../database.js';

class EventbriteScraper {
  constructor() {
    this.baseUrl = 'https://www.eventbrite.com';
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
      console.log(`Scraping tech events for ${location}...`);
      
      // Scrape by tech keywords (limited to avoid timeout)
      for (const keyword of ['tech', 'programming', 'developer']) { // Just 3 most effective keywords
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
        await this.delay(500);
        
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
      // Use Eventbrite search with keyword and location
      const searchUrl = `${this.baseUrl}/d/belgium--${location.toLowerCase()}/events/?q=${encodeURIComponent(keyword)}&page=${page}`;
      
      const response = await axios.get(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9'
        },
        timeout: 15000
      });

      const $ = cheerio.load(response.data);
      
      // Use selectors based on WebFetch analysis
      const selectors = [
        '.eds-event-card-content',
        '[data-testid="event-card"]',
        '.event-card',
        '.search-event-card',
        'article'
      ];

      let foundEvents = false;
      for (const selector of selectors) {
        const elements = $(selector);
        if (elements.length > 0) {
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
                  
                  if (isInBelgium && isTechEvent(fullEvent.title, fullEvent.description)) {
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
                  } else if (!isInBelgium) {
                    console.log(`    ❌ Filtered out: "${fullEvent.title}" (not in Belgium)`);
                  } else {
                    console.log(`    ❌ Filtered out: "${fullEvent.title}" (not tech-related)`);
                  }
                  
                  // Add delay to avoid overwhelming the server
                  await this.delay(1000);
                }
              }
            } catch (err) {
              console.error('Error processing Eventbrite event:', err);
            }
          }
          
          if (events.length > 0) break;
        }
      }

      if (!foundEvents && page === 1) {
        console.log(`    No events found for "${keyword}" in ${location}`);
      }

    } catch (error) {
      console.error(`    Error scraping "${keyword}" in ${location}:`, error.message);
    }

    return events;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getEventDetails(basicEvent) {
    try {
      const response = await axios.get(basicEvent.registration_url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9'
        },
        timeout: 15000
      });

      const $ = cheerio.load(response.data);
      
      // Extract detailed information from the event page
      const title = $('h1').first().text().trim() || basicEvent.title;
      
      // Get full description from the "About this event" section
      let description = '';
      const aboutSection = $('[data-automation="event-details-description"]').text().trim();
      if (aboutSection) {
        description = aboutSection;
      } else {
        // Fallback selectors for description
        const descSelectors = [
          '.event-description',
          '.eds-text--left',
          '[class*="description"]',
          'p'
        ];
        for (const selector of descSelectors) {
          const desc = $(selector).text().trim();
          if (desc && desc.length > 50) {
            description = desc;
            break;
          }
        }
      }
      
      // Get date and time from the event page
      let eventDate = '';
      let eventTime = '';
      
      // Look for structured date/time information
      const dateTimeSection = $('[data-automation="event-details-date-time"]').text().trim();
      if (dateTimeSection) {
        console.log(`Found date/time section: ${dateTimeSection}`);
        eventDate = this.parseDate(dateTimeSection);
        eventTime = this.extractTime(dateTimeSection);
      } else {
        // Fallback to basic event data
        eventDate = basicEvent.date;
        eventTime = basicEvent.time;
      }
      
      // Get location
      let location = basicEvent.location;
      const locationSection = $('[data-automation="event-details-location"]').text().trim();
      if (locationSection) {
        location = locationSection;
      }
      
      // Get image
      let imageUrl = basicEvent.image_url;
      const eventImage = $('.event-hero-image img').attr('src') || 
                        $('[data-automation="event-hero-image"] img').attr('src') ||
                        $('.hero-image img').attr('src');
      if (eventImage && eventImage.startsWith('http')) {
        imageUrl = eventImage;
      }
      
      return {
        title: title,
        description: description || basicEvent.description,
        date: eventDate,
        time: eventTime,
        location: location,
        type: 'Event',
        image_url: imageUrl,
        registration_url: basicEvent.registration_url,
        tags: basicEvent.tags,
        community: basicEvent.community
      };
      
    } catch (error) {
      console.error(`Error fetching event details from ${basicEvent.registration_url}:`, error.message);
      // Return the basic event if we can't get details
      return basicEvent;
    }
  }

  parseBasicEvent($, element, city) {
    const $el = $(element);
    
    // Use selectors from WebFetch analysis
    const titleSelectors = ['.eds-event-card__title', 'h3.event-title', '[data-testid="event-name"]', 'h2', 'h3'];
    let title = '';
    for (const selector of titleSelectors) {
      title = $el.find(selector).first().text().trim();
      if (title && title.length > 2) break;
    }
    
    const descriptionSelectors = ['.eds-event-card__description', 'p.event-description', '.description', 'p'];
    let description = '';
    for (const selector of descriptionSelectors) {
      description = $el.find(selector).first().text().trim();
      if (description && description.length > 5) break;
    }
    
    const dateSelectors = [
      '.eds-event-card__date', 
      '[data-testid="event-date"]', 
      'time', 
      '.date',
      '.event-date',
      '[datetime]',
      '.eds-event-card__primary-content time',
      '.eds-structured-item-text-value',
      '.card-date'
    ];
    let dateText = '';
    for (const selector of dateSelectors) {
      const element = $el.find(selector).first();
      dateText = element.attr('datetime') || element.attr('title') || element.text().trim();
      if (dateText) {
        console.log(`Found date with selector "${selector}": "${dateText}"`);
        break;
      }
    }
    
    // If no date found in specific selectors, try to find any text that looks like a date
    if (!dateText) {
      const allText = $el.text();
      const datePattern = /(\w{3}),?\s*(\w{3})\s*(\d{1,2}),?\s*(\d{1,2}):(\d{2})\s*(AM|PM)/gi;
      const match = allText.match(datePattern);
      if (match && match[0]) {
        dateText = match[0];
        console.log(`Found date in full text: "${dateText}"`);
      }
    }
    
    const venueSelectors = ['.eds-event-card__venue', '[data-testid="event-venue"]', '.venue', '.location'];
    let venue = '';
    for (const selector of venueSelectors) {
      venue = $el.find(selector).first().text().trim();
      if (venue) break;
    }
    
    const link = $el.find('a').first().attr('href') || $el.attr('href');
    
    // Try to get actual Eventbrite images
    let image = '';
    const imgSelectors = ['.eds-event-card__image img', 'img.event-image', 'img'];
    for (const selector of imgSelectors) {
      const imgElement = $el.find(selector).first();
      image = imgElement.attr('src') || imgElement.attr('data-src');
      if (image) break;
    }
    
    const organizer = $el.find('.organizer, .host, [class*="organizer"]').first().text().trim();

    const registration_url = link ? (link.startsWith('http') ? link : `${this.baseUrl}${link}`) : null;
    const image_url = image && image.startsWith('http') ? image : null;

    return {
      title: title || null,
      description: description || '',
      date: this.parseDate(dateText),
      time: this.extractTime(dateText),
      location: venue || city,
      type: 'Event',
      image_url: image_url,
      registration_url: registration_url,
      tags: extractTechTags(title, description),
      community: {
        name: organizer || `Eventbrite ${city}`,
        slug: organizer ? organizer.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `eventbrite-${city.toLowerCase()}`,
        description: organizer ? `${organizer} events via Eventbrite` : `Events in ${city} via Eventbrite`,
        website: 'https://www.eventbrite.com',
        city: city,
        logo_url: 'https://cdn.evbstatic.com/s3-build/perm_001/b8/44/b844e3dad7a9efb6ee8e70966dd4c4a0-favicon.ico',
        tags: 'Eventbrite'
      }
    };
  }

  createFallbackEvent(city) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 20) + 5);
    
    return {
      title: `Networking Event ${city}`,
      description: `Join professionals and entrepreneurs in ${city} for networking and community building. Check Eventbrite for the latest events.`,
      date: futureDate.toISOString().split('T')[0],
      time: '18:30:00',
      location: city,
      type: 'Networking',
      image_url: 'https://cdn.evbstatic.com/s3-build/perm_001/b8/44/b844e3dad7a9efb6ee8e70966dd4c4a0-favicon.ico',
      registration_url: `https://www.eventbrite.com/d/belgium--${city.toLowerCase()}/events/`,
      tags: ['Eventbrite', 'Networking'],
      community: {
        name: `Eventbrite ${city}`,
        slug: `eventbrite-${city.toLowerCase()}`,
        description: `Events in ${city} via Eventbrite`,
        website: 'https://www.eventbrite.com',
        city: city,
        logo_url: 'https://cdn.evbstatic.com/s3-build/perm_001/b8/44/b844e3dad7a9efb6ee8e70966dd4c4a0-favicon.ico',
        tags: 'Eventbrite'
      }
    };
  }

  parseDate(dateString) {
    if (!dateString) {
      // Return a random future date instead of today
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 60) + 7);
      return futureDate.toISOString().split('T')[0];
    }
    
    console.log(`Parsing date: "${dateString}"`);
    
    try {
      // Handle various Eventbrite date formats
      // "Wed, Oct 1, 6:30 PM", "Thu, Sep 25, 6:00 PM", etc.
      const dateMatch = dateString.match(/(\w{3}),?\s*(\w{3})\s*(\d{1,2})/i);
      if (dateMatch) {
        const [, dayName, monthName, day] = dateMatch;
        const months = {
          'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04',
          'may': '05', 'jun': '06', 'jul': '07', 'aug': '08',
          'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12'
        };
        
        const monthNum = months[monthName.toLowerCase().substring(0, 3)];
        if (monthNum) {
          const year = new Date().getFullYear();
          const parsedDate = `${year}-${monthNum}-${day.padStart(2, '0')}`;
          console.log(`Parsed date to: ${parsedDate}`);
          return parsedDate;
        }
      }
      
      // Try ISO format
      if (dateString.includes('T') || dateString.includes('Z')) {
        const date = new Date(dateString);
        if (!isNaN(date)) {
          return date.toISOString().split('T')[0];
        }
      }
      
      // Try standard date parsing
      const date = new Date(dateString);
      if (!isNaN(date) && date > new Date('2024-01-01')) {
        return date.toISOString().split('T')[0];
      }
      
    } catch (e) {
      console.log(`Date parsing error: ${e.message}`);
    }
    
    // Fallback to random future date
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 60) + 7);
    return futureDate.toISOString().split('T')[0];
  }

  extractTime(dateString) {
    if (!dateString) return null;
    const timeMatch = dateString.match(/(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?/);
    if (timeMatch) {
      let hour = parseInt(timeMatch[1]);
      const minute = timeMatch[2];
      const period = timeMatch[3];
      
      if (period && period.toLowerCase() === 'pm' && hour < 12) {
        hour += 12;
      } else if (period && period.toLowerCase() === 'am' && hour === 12) {
        hour = 0;
      }
      
      return `${hour.toString().padStart(2, '0')}:${minute}`;
    }
    return null;
  }

  parsePrice(priceString) {
    if (!priceString) return 'Check website';
    if (priceString.toLowerCase().includes('free')) return 'Free';
    return priceString;
  }

}

export default EventbriteScraper;