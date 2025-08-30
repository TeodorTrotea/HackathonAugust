import Database from './database.js';
import EventbriteScraper from './scrapers/eventbrite.js';
import LumaScraper from './scrapers/luma.js';

class EventScraper {
  constructor() {
    this.db = new Database();
    this.scrapers = [
      new EventbriteScraper(),         // Eventbrite Belgium
      new LumaScraper()                // Luma events
    ];
  }

  async initialize() {
    await this.db.initialize();
  }

  async scrapeAll() {
    console.log('Starting scraping process...');
    const startTime = Date.now();
    let totalEvents = 0;

    try {
      for (const scraper of this.scrapers) {
        console.log(`\nScraping with ${scraper.constructor.name}...`);
        
        try {
          const events = await scraper.scrapeEvents();
          console.log(`Found ${events.length} events from ${scraper.constructor.name}`);
          
          for (const event of events) {
            if (this.validateEvent(event)) {
              await this.db.saveEvent(event);
              totalEvents++;
            }
          }
        } catch (error) {
          console.error(`Error with ${scraper.constructor.name}:`, error.message);
        }
      }

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`\nScraping completed in ${duration} seconds`);
      console.log(`Total events processed: ${totalEvents}`);
      
      return totalEvents;
    } catch (error) {
      console.error('Scraping error:', error);
      throw error;
    }
  }

  validateEvent(event) {
    if (!event.title || event.title.trim() === '') {
      return false;
    }
    
    if (!event.website_url && !event.description) {
      return false;
    }

    return true;
  }

  async getStats() {
    const events = await this.db.getEvents();
    const cities = {};
    const categories = {};
    const sources = {};

    events.forEach(event => {
      cities[event.city] = (cities[event.city] || 0) + 1;
      categories[event.category] = (categories[event.category] || 0) + 1;
      sources[event.source] = (sources[event.source] || 0) + 1;
    });

    return {
      total: events.length,
      cities,
      categories,
      sources,
      lastUpdate: new Date().toISOString()
    };
  }

  async searchEvents(filters) {
    return await this.db.getEvents(filters);
  }

  async close() {
    await this.db.close();
  }
}

async function main() {
  const scraper = new EventScraper();
  
  try {
    await scraper.initialize();
    await scraper.scrapeAll();
    
    const stats = await scraper.getStats();
    console.log('\nDatabase Statistics:');
    console.log(JSON.stringify(stats, null, 2));
  } catch (error) {
    console.error('Fatal error:', error);
  } finally {
    await scraper.close();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default EventScraper;