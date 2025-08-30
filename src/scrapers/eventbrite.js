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
          'User-Agent': process.env.USER_AGENT || 'Mozilla/5.0',
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      });

      const $ = cheerio.load(response.data);
      
      $('.event-card, article[data-testid="event-card"], .search-event-card').each((index, element) => {
        try {
          const event = this.parseEvent($, element, location);
          if (event && event.title) {
            events.push(event);
          }
        } catch (err) {
          console.error('Error parsing Eventbrite event:', err);
        }
      });
    } catch (error) {
      console.error(`Error scraping Eventbrite for ${location}:`, error.message);
    }

    return events;
  }

  parseEvent($, element, city) {
    const $el = $(element);
    
    const title = $el.find('[data-testid="event-name"], .event-card__title, h3').first().text().trim();
    const description = $el.find('.event-card__description, .summary').first().text().trim();
    const dateText = $el.find('[data-testid="event-date"], .event-card__date, time').first().text().trim();
    const venue = $el.find('[data-testid="venue-name"], .event-card__venue').first().text().trim();
    const price = $el.find('[data-testid="event-price"], .event-card__price').first().text().trim();
    const link = $el.find('a').first().attr('href');
    const image = $el.find('img').first().attr('src');
    const organizer = $el.find('.event-card__organizer, .organizer').first().text().trim();

    const website_url = link ? (link.startsWith('http') ? link : `${this.baseUrl}${link}`) : null;

    return {
      title: title || 'Untitled Event',
      description: description || '',
      date: this.parseDate(dateText),
      time: this.extractTime(dateText),
      location: venue || city,
      type: 'Meetup',
      image_url: image,
      registration_url: website_url,
      tags: [],
      community: {
        name: organizer || `Eventbrite ${city}`,
        slug: organizer ? organizer.toLowerCase().replace(/\s+/g, '-') : `eventbrite-${city.toLowerCase()}`,
        description: organizer || `Events in ${city}`,
        website: 'https://www.eventbrite.com',
        city: city,
        logo_url: null,
        tags: []
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