import puppeteer from 'puppeteer';

class UitInVlaanderenScraper {
  constructor() {
    this.baseUrl = 'https://www.uitinvlaanderen.be';
    this.searchUrl = `${this.baseUrl}/agenda/search`;
  }

  async scrapeEvents(cities = ['brussel', 'antwerpen', 'gent', 'leuven'], maxEvents = 50) {
    const events = [];
    let browser;

    try {
      browser = await puppeteer.launch({ 
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      for (const city of cities) {
        console.log(`Scraping events for ${city}...`);
        const cityEvents = await this.scrapeCity(browser, city, maxEvents);
        events.push(...cityEvents);
      }
    } catch (error) {
      console.error('Error scraping UiT in Vlaanderen:', error);
    } finally {
      if (browser) await browser.close();
    }

    return events;
  }

  async scrapeCity(browser, city, maxEvents) {
    const events = [];
    
    try {
      const page = await browser.newPage();
      await page.setUserAgent(process.env.USER_AGENT || 'Mozilla/5.0');
      
      const searchUrl = `${this.searchUrl}?location=${city}`;
      await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      
      await page.waitForSelector('.search-result, .event-item, article', { timeout: 10000 });
      
      const eventElements = await page.$$eval('.search-result, .event-item, article', (elements) => {
        return elements.slice(0, 50).map(el => {
          const title = el.querySelector('h2, h3, .title')?.textContent?.trim();
          const description = el.querySelector('.description, .summary, p')?.textContent?.trim();
          const date = el.querySelector('.date, time, .when')?.textContent?.trim();
          const location = el.querySelector('.location, .where, .venue')?.textContent?.trim();
          const price = el.querySelector('.price, .cost')?.textContent?.trim();
          const category = el.querySelector('.category, .type, .tag')?.textContent?.trim();
          const link = el.querySelector('a')?.href;
          const image = el.querySelector('img')?.src;
          
          return {
            title,
            description,
            date,
            location,
            price,
            category,
            link,
            image
          };
        });
      });

      for (const eventData of eventElements) {
        if (eventData.title) {
          events.push({
            title: eventData.title,
            description: eventData.description || '',
            date: this.parseDate(eventData.date),
            time: this.extractTime(eventData.date),
            location: eventData.location || city,
            type: eventData.category || 'Meetup',
            image_url: eventData.image,
            registration_url: eventData.link,
            tags: [],
            community: {
              name: `UiT in ${city.charAt(0).toUpperCase() + city.slice(1)}`,
              slug: `uit-in-${city}`,
              description: 'Cultural events and activities platform for Flanders',
              website: 'https://www.uitinvlaanderen.be',
              city: city.charAt(0).toUpperCase() + city.slice(1),
              logo_url: null,
              tags: ['Culture', 'Events']
            }
          });
        }
      }

      await page.close();
    } catch (error) {
      console.error(`Error scraping ${city}:`, error.message);
    }

    return events;
  }

  parseDate(dateString) {
    if (!dateString) return new Date().toISOString().split('T')[0];
    
    try {
      const cleanDate = dateString.replace(/[^\d\s\-\/\.:]/g, '').trim();
      const date = new Date(cleanDate);
      if (!isNaN(date)) {
        return date.toISOString().split('T')[0];
      }
    } catch (e) {}
    
    return new Date().toISOString().split('T')[0];
  }

  extractTime(dateString) {
    if (!dateString) return null;
    const timeMatch = dateString.match(/(\d{1,2})[:\.](\d{2})/);
    return timeMatch ? `${timeMatch[1]}:${timeMatch[2]}` : null;
  }
}

export default UitInVlaanderenScraper;