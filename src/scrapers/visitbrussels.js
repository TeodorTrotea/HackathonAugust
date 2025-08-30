import axios from 'axios';
import * as cheerio from 'cheerio';

class VisitBrusselsScraper {
  constructor() {
    this.baseUrl = 'https://www.visit.brussels';
    this.eventsUrl = `${this.baseUrl}/en/agenda`;
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
      const response = await axios.get(`${this.eventsUrl}?page=${pageNumber}`, {
        headers: {
          'User-Agent': process.env.USER_AGENT || 'Mozilla/5.0'
        }
      });

      const $ = cheerio.load(response.data);
      
      $('.event-card, .agenda-item, article').each((index, element) => {
        try {
          const event = this.parseEvent($, element);
          if (event && event.title) {
            events.push(event);
          }
        } catch (err) {
          console.error('Error parsing event:', err);
        }
      });
    } catch (error) {
      console.error(`Error scraping page ${pageNumber}:`, error.message);
    }

    return events;
  }

  parseEvent($, element) {
    const $el = $(element);
    
    const title = $el.find('h2, h3, .event-title, .title').first().text().trim();
    const description = $el.find('.description, .summary, p').first().text().trim();
    const dateText = $el.find('.date, .event-date, time').first().text().trim();
    const location = $el.find('.location, .venue, .address').first().text().trim();
    const link = $el.find('a').first().attr('href');
    const imageUrl = $el.find('img').first().attr('src');
    const category = $el.find('.category, .tag').first().text().trim();

    const registration_url = link ? (link.startsWith('http') ? link : `${this.baseUrl}${link}`) : null;
    const image_url = imageUrl ? (imageUrl.startsWith('http') ? imageUrl : `${this.baseUrl}${imageUrl}`) : null;

    return {
      title: title || 'Untitled Event',
      description: description || '',
      date: this.parseDate(dateText),
      time: this.extractTime(dateText),
      location: location || 'Brussels',
      type: category || 'Meetup',
      image_url: image_url,
      registration_url: registration_url,
      tags: [],
      community: {
        name: 'Visit Brussels',
        slug: 'visit-brussels',
        description: 'Official tourism and events organization for Brussels',
        website: 'https://www.visit.brussels',
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