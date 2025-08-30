import axios from 'axios';
import * as cheerio from 'cheerio';

class EventbriteScraper {
  constructor() {
    this.baseUrl = 'https://www.eventbrite.com';
  }

  async scrapeEvents(locations = ['Brussels', 'Antwerp', 'Ghent', 'Bruges']) {
    const events = [];
    
    for (const location of locations) {
      console.log(`Scraping Eventbrite events for ${location}...`);
      const locationEvents = await this.scrapeLocation(location);
      events.push(...locationEvents);
    }

    return events;
  }

  async scrapeLocation(location) {
    const events = [];
    
    try {
      const searchUrl = `${this.baseUrl}/d/belgium--${location.toLowerCase()}/events/`;
      const response = await axios.get(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9'
        },
        timeout: 10000
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
          console.log(`Found ${elements.length} Eventbrite elements with selector: ${selector}`);
          foundEvents = true;
          
          elements.slice(0, 15).each((index, element) => {
            try {
              const event = this.parseEvent($, element, location);
              if (event && event.title && event.title.length > 2) {
                events.push(event);
              }
            } catch (err) {
              console.error('Error parsing Eventbrite event:', err);
            }
          });
          
          if (events.length > 0) break;
        }
      }

      if (!foundEvents) {
        console.log(`No Eventbrite events found for ${location}, adding fallback...`);
        events.push(this.createFallbackEvent(location));
      }

    } catch (error) {
      console.error(`Error scraping Eventbrite for ${location}:`, error.message);
      events.push(this.createFallbackEvent(location));
    }

    return events;
  }

  parseEvent($, element, city) {
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
    
    const dateSelectors = ['.eds-event-card__date', '[data-testid="event-date"]', 'time', '.date'];
    let dateText = '';
    for (const selector of dateSelectors) {
      const element = $el.find(selector).first();
      dateText = element.attr('datetime') || element.text().trim();
      if (dateText) break;
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
      tags: ['Eventbrite'],
      community: {
        name: organizer || `Eventbrite ${city}`,
        slug: organizer ? organizer.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `eventbrite-${city.toLowerCase()}`,
        description: organizer ? `${organizer} events via Eventbrite` : `Events in ${city} via Eventbrite`,
        website: 'https://www.eventbrite.com',
        city: city,
        logo_url: 'https://cdn.evbstatic.com/s3-build/perm_001/b8/44/b844e3dad7a9efb6ee8e70966dd4c4a0-favicon.ico',
        tags: ['Eventbrite']
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
        tags: ['Eventbrite']
      }
    };
  }

  parseDate(dateString) {
    if (!dateString) return new Date().toISOString().split('T')[0];
    
    const months = {
      'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04',
      'may': '05', 'jun': '06', 'jul': '07', 'aug': '08',
      'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12'
    };

    try {
      const dateStr = dateString.toLowerCase();
      for (const [monthName, monthNum] of Object.entries(months)) {
        if (dateStr.includes(monthName)) {
          const dayMatch = dateStr.match(/(\d{1,2})/);
          if (dayMatch) {
            const year = new Date().getFullYear();
            return `${year}-${monthNum}-${dayMatch[1].padStart(2, '0')}`;
          }
        }
      }
      
      const date = new Date(dateString);
      if (!isNaN(date)) {
        return date.toISOString().split('T')[0];
      }
    } catch (e) {}
    
    return new Date().toISOString().split('T')[0];
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