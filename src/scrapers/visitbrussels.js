import axios from 'axios';
import * as cheerio from 'cheerio';

class VisitBrusselsScraper {
  constructor() {
    this.baseUrl = 'https://visit.brussels';
    this.eventsUrl = `${this.baseUrl}/en/visitors/agenda/all-events-wizard`;
  }

  async scrapeEvents(maxPages = 5) {
    const events = [];
    
    try {
      for (let page = 1; page <= maxPages; page++) {
        console.log(`Scraping Visit Brussels page ${page}...`);
        const pageEvents = await this.scrapePage(page);
        events.push(...pageEvents);
        
        if (pageEvents.length === 0) break;
      }
    } catch (error) {
      console.error('Error scraping Visit Brussels:', error);
    }

    return events;
  }

  async scrapePage(pageNumber) {
    const events = [];
    
    try {
      const url = pageNumber > 1 ? `${this.eventsUrl}?page=${pageNumber}` : this.eventsUrl;
      const response = await axios.get(url, {
        headers: {
          'User-Agent': process.env.USER_AGENT || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Cache-Control': 'no-cache'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      
      // Try multiple selectors based on actual website structure
      const selectors = [
        '.event-card',
        '.card',
        'article',
        '.agenda-item',
        '[class*="event"]',
        '.teaser',
        '.item'
      ];

      let foundEvents = false;
      for (const selector of selectors) {
        const elements = $(selector);
        if (elements.length > 0) {
          console.log(`Found ${elements.length} elements with selector: ${selector}`);
          foundEvents = true;
          
          elements.slice(0, 20).each((index, element) => {
            try {
              const event = this.parseEvent($, element);
              if (event && event.title && event.title.length > 2) {
                events.push(event);
              }
            } catch (err) {
              console.error('Error parsing event:', err);
            }
          });
          
          if (events.length > 0) break; // Found working selector
        }
      }

      if (!foundEvents) {
        console.log('No events found, trying JSON-LD extraction...');
        // Try to extract structured data
        $('script[type="application/ld+json"]').each((index, script) => {
          try {
            const data = JSON.parse($(script).html());
            if (data['@type'] === 'Event' || (Array.isArray(data) && data.some(item => item['@type'] === 'Event'))) {
              const eventData = Array.isArray(data) ? data.filter(item => item['@type'] === 'Event') : [data];
              for (const item of eventData) {
                events.push(this.parseJsonLdEvent(item));
              }
            }
          } catch (e) {
            // Skip invalid JSON
          }
        });
      }

    } catch (error) {
      console.error(`Error scraping page ${pageNumber}:`, error.message);
    }

    return events;
  }

  parseJsonLdEvent(data) {
    const imageUrl = data.image?.url || data.image || null;
    
    return {
      title: data.name || 'Brussels Event',
      description: data.description || '',
      date: this.parseDate(data.startDate),
      time: this.extractTime(data.startDate),
      location: data.location?.name || data.location?.address?.streetAddress || 'Brussels',
      type: 'Event',
      image_url: imageUrl && imageUrl.startsWith('http') ? imageUrl : null,
      registration_url: data.url,
      tags: [],
      community: {
        name: 'Visit Brussels',
        slug: 'visit-brussels',
        description: 'Official tourism and events organization for Brussels',
        website: 'https://visit.brussels',
        city: 'Brussels',
        logo_url: null,
        tags: []
      }
    };
  }

  parseEvent($, element) {
    const $el = $(element);
    
    // Try multiple selectors for title
    const titleSelectors = ['h1', 'h2', 'h3', 'h4', '.title', '.event-title', '.card-title', '[class*="title"]'];
    let title = '';
    for (const selector of titleSelectors) {
      title = $el.find(selector).first().text().trim();
      if (title && title.length > 2) break;
    }
    
    // Try multiple selectors for description  
    const descSelectors = ['.description', '.summary', '.excerpt', 'p', '.content', '[class*="description"]'];
    let description = '';
    for (const selector of descSelectors) {
      description = $el.find(selector).first().text().trim();
      if (description && description.length > 10) break;
    }
    
    // Try multiple selectors for date
    const dateSelectors = ['time', '.date', '.event-date', '[datetime]', '[class*="date"]'];
    let dateText = '';
    for (const selector of dateSelectors) {
      const element = $el.find(selector).first();
      dateText = element.attr('datetime') || element.text().trim();
      if (dateText) break;
    }
    
    // Try multiple selectors for location
    const locationSelectors = ['.location', '.venue', '.address', '[class*="location"]', '[class*="venue"]'];
    let location = '';
    for (const selector of locationSelectors) {
      location = $el.find(selector).first().text().trim();
      if (location) break;
    }
    
    // Get link
    const link = $el.find('a').first().attr('href') || $el.attr('href');
    
    // Try to get image with better selectors
    let imageUrl = '';
    const imgSelectors = ['img[src]', '[style*="background-image"]', 'img[data-src]'];
    for (const selector of imgSelectors) {
      const img = $el.find(selector).first();
      imageUrl = img.attr('src') || img.attr('data-src');
      
      // Check background image
      if (!imageUrl && selector.includes('background-image')) {
        const style = img.attr('style');
        if (style) {
          const match = style.match(/url\(['"]?([^'"\)]+)['"]?\)/);
          if (match) imageUrl = match[1];
        }
      }
      
      if (imageUrl) break;
    }
    
    const category = $el.find('.category, .tag, .type').first().text().trim();

    const registration_url = link ? (link.startsWith('http') ? link : `${this.baseUrl}${link}`) : null;
    const image_url = imageUrl ? (imageUrl.startsWith('http') ? imageUrl : `${this.baseUrl}${imageUrl}`) : null;

    return {
      title: title || null,
      description: description || '',
      date: this.parseDate(dateText),
      time: this.extractTime(dateText),
      location: location || 'Brussels',
      type: category || 'Event',
      image_url: image_url,
      registration_url: registration_url,
      tags: [],
      community: {
        name: 'Visit Brussels',
        slug: 'visit-brussels',
        description: 'Official tourism and events organization for Brussels',
        website: 'https://visit.brussels',
        city: 'Brussels',
        logo_url: null,
        tags: []
      }
    };
  }

  parseDate(dateString) {
    if (!dateString) return new Date().toISOString().split('T')[0];
    
    try {
      const date = new Date(dateString);
      if (!isNaN(date)) {
        return date.toISOString().split('T')[0];
      }
    } catch (e) {}
    
    return dateString;
  }

  extractTime(dateString) {
    const timeMatch = dateString.match(/(\d{1,2}):(\d{2})/);
    return timeMatch ? timeMatch[0] : null;
  }
}

export default VisitBrusselsScraper;