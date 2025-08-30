import axios from 'axios';
import * as cheerio from 'cheerio';

class MeetupScraper {
  constructor() {
    this.baseUrl = 'https://www.meetup.com';
  }

  async scrapeEvents() {
    const events = [];
    const cities = [
      { name: 'Brussels', code: 'be--brussels' },
      { name: 'Antwerp', code: 'be--antwerp' },
      { name: 'Ghent', code: 'be--ghent' }
    ];

    for (const city of cities) {
      try {
        console.log(`Scraping Meetup.com for ${city.name}...`);
        const cityEvents = await this.scrapeCity(city);
        events.push(...cityEvents);
      } catch (error) {
        console.error(`Error scraping ${city.name}:`, error.message);
      }
    }

    return events;
  }

  async scrapeCity(city) {
    const events = [];
    
    try {
      const url = `${this.baseUrl}/find/?location=${city.code}&source=EVENTS`;
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'en-US,en;q=0.9'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      
      // Look for event cards in various possible selectors
      const eventSelectors = [
        'div[data-testid="event-card"]',
        'div.eventCard',
        'article.event-card',
        'div[class*="eventCard"]',
        'a[href*="/events/"]'
      ];

      let foundEvents = false;
      for (const selector of eventSelectors) {
        const elements = $(selector);
        if (elements.length > 0) {
          foundEvents = true;
          elements.slice(0, 10).each((index, element) => {
            try {
              const event = this.parseEvent($, element, city.name);
              if (event && event.title && event.registration_url) {
                events.push(event);
              }
            } catch (err) {
              console.error('Error parsing event:', err.message);
            }
          });
          break;
        }
      }

      if (!foundEvents) {
        // Try to extract from JSON-LD structured data
        const jsonLdScripts = $('script[type="application/ld+json"]');
        jsonLdScripts.each((index, script) => {
          try {
            const data = JSON.parse($(script).html());
            if (data['@type'] === 'Event' || (Array.isArray(data) && data.some(item => item['@type'] === 'Event'))) {
              const eventData = Array.isArray(data) ? data.filter(item => item['@type'] === 'Event') : [data];
              for (const item of eventData) {
                events.push(this.parseJsonLdEvent(item, city.name));
              }
            }
          } catch (err) {
            // Invalid JSON, skip
          }
        });
      }

    } catch (error) {
      console.error(`Failed to fetch Meetup data for ${city.name}:`, error.message);
    }

    return events;
  }

  parseEvent($, element, cityName) {
    const $el = $(element);
    
    // Extract title
    const title = $el.find('h2, h3, [class*="eventCardHead"], .eventName').first().text().trim() ||
                  $el.find('span[class*="title"]').first().text().trim();
    
    // Extract description
    const description = $el.find('p, .description, [class*="description"]').first().text().trim();
    
    // Extract date and time
    const dateText = $el.find('time, [datetime], .eventTimeDisplay').first().attr('datetime') ||
                     $el.find('.date, .eventDate').first().text().trim();
    
    // Extract location
    const location = $el.find('.venue, .location, [class*="location"], address').first().text().trim() ||
                     `${cityName}, Belgium`;
    
    // Extract link
    let link = $el.find('a').first().attr('href') || $el.attr('href');
    if (link && !link.startsWith('http')) {
      link = `${this.baseUrl}${link}`;
    }
    
    // Extract image - this is the key part for real images
    let imageUrl = null;
    
    // Try different image selectors
    const imgSelectors = [
      'img[src*="secure.meetupstatic.com"]',
      'img[class*="event"]',
      'img',
      '[style*="background-image"]'
    ];
    
    for (const selector of imgSelectors) {
      const imgEl = $el.find(selector).first();
      if (imgEl.length > 0) {
        imageUrl = imgEl.attr('src') || imgEl.attr('data-src');
        
        // Check for background-image style
        if (!imageUrl) {
          const style = imgEl.attr('style');
          if (style) {
            const match = style.match(/url\(['"]?([^'"\)]+)['"]?\)/);
            if (match) imageUrl = match[1];
          }
        }
        
        if (imageUrl) break;
      }
    }
    
    // Ensure absolute URL for images
    if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = imageUrl.startsWith('//') ? `https:${imageUrl}` : `${this.baseUrl}${imageUrl}`;
    }
    
    // Extract group/organizer info
    const groupName = $el.find('.groupName, [class*="group"]').first().text().trim() || 
                      `Meetup ${cityName}`;

    return {
      title: title || 'Meetup Event',
      description: description || `Join us for this event in ${cityName}`,
      date: this.parseDate(dateText),
      time: this.extractTime(dateText),
      location: location,
      type: 'Meetup',
      image_url: imageUrl,
      registration_url: link,
      tags: ['Meetup', cityName],
      community: {
        name: groupName,
        slug: groupName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: `${groupName} - Meetup group in ${cityName}`,
        website: 'https://www.meetup.com',
        city: cityName,
        logo_url: imageUrl, // Use event image as community logo if available
        tags: ['Meetup', 'Community']
      }
    };
  }

  parseJsonLdEvent(data, cityName) {
    const imageUrl = data.image?.url || data.image || null;
    const location = data.location?.address?.addressLocality || 
                    data.location?.name || cityName;
    
    return {
      title: data.name || 'Meetup Event',
      description: data.description || '',
      date: this.parseDate(data.startDate),
      time: this.extractTime(data.startDate),
      location: location,
      type: 'Meetup',
      image_url: imageUrl,
      registration_url: data.url,
      tags: ['Meetup', cityName],
      community: {
        name: data.organizer?.name || `Meetup ${cityName}`,
        slug: (data.organizer?.name || `meetup-${cityName}`).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: data.organizer?.description || `Meetup group in ${cityName}`,
        website: data.organizer?.url || 'https://www.meetup.com',
        city: cityName,
        logo_url: data.organizer?.logo?.url || imageUrl,
        tags: ['Meetup', 'Community']
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
    
    return new Date().toISOString().split('T')[0];
  }

  extractTime(dateString) {
    if (!dateString) return '19:00:00';
    
    try {
      const date = new Date(dateString);
      if (!isNaN(date)) {
        return date.toTimeString().split(' ')[0];
      }
    } catch (e) {}
    
    const timeMatch = dateString.match(/(\d{1,2}):(\d{2})/);
    return timeMatch ? `${timeMatch[1].padStart(2, '0')}:${timeMatch[2]}:00` : '19:00:00';
  }
}

export default MeetupScraper;