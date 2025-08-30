import 'dotenv/config';
import cron from 'node-cron';
import EventScraper from './scraper.js';
import Database from './database.js';

class EventScraperService {
  constructor() {
    this.scraper = new EventScraper();
    this.db = new Database();
    this.isRunning = false;
  }

  async initialize() {
    console.log('Initializing Event Scraper Service...');
    await this.db.initialize();
    await this.scraper.initialize();
    
    console.log('Running initial scrape...');
    await this.runScrape();
    
    this.scheduleScrapingJobs();
    console.log('Event Scraper Service initialized successfully');
  }

  scheduleScrapingJobs() {
    const cronSchedule = process.env.SCRAPE_INTERVAL || '0 */6 * * *';
    
    console.log(`Scheduling scraping job with cron: ${cronSchedule}`);
    
    cron.schedule(cronSchedule, async () => {
      await this.runScrape();
    });

    cron.schedule('0 0 * * *', async () => {
      await this.cleanupOldEvents();
    });

    console.log('Scheduled jobs:');
    console.log('- Scraping: Every 6 hours');
    console.log('- Cleanup: Daily at midnight');
  }

  async runScrape() {
    if (this.isRunning) {
      console.log('Scraping already in progress, skipping...');
      return;
    }

    this.isRunning = true;
    const startTime = new Date();
    
    try {
      console.log(`\n[${startTime.toISOString()}] Starting scheduled scrape...`);
      const eventCount = await this.scraper.scrapeAll();
      
      const duration = ((Date.now() - startTime.getTime()) / 1000).toFixed(2);
      console.log(`[${new Date().toISOString()}] Scraping completed: ${eventCount} events in ${duration}s`);
      
      await this.logScrapingResult({
        timestamp: startTime,
        duration: parseFloat(duration),
        eventCount,
        status: 'success'
      });
    } catch (error) {
      console.error('Scraping failed:', error);
      
      await this.logScrapingResult({
        timestamp: startTime,
        duration: 0,
        eventCount: 0,
        status: 'failed',
        error: error.message
      });
    } finally {
      this.isRunning = false;
    }
  }

  async cleanupOldEvents() {
    console.log('Running cleanup for old events...');
    
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const cutoffDate = thirtyDaysAgo.toISOString().split('T')[0];
      
      await this.db.run(
        'DELETE FROM events WHERE date < ? AND date != ""',
        [cutoffDate]
      );
      
      console.log(`Cleaned up events older than ${cutoffDate}`);
    } catch (error) {
      console.error('Cleanup failed:', error);
    }
  }

  async logScrapingResult(result) {
    try {
      await this.db.run(`
        CREATE TABLE IF NOT EXISTS scraping_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          timestamp DATETIME,
          duration REAL,
          event_count INTEGER,
          status TEXT,
          error TEXT
        )
      `);

      await this.db.run(
        `INSERT INTO scraping_logs (timestamp, duration, event_count, status, error) 
         VALUES (?, ?, ?, ?, ?)`,
        [result.timestamp, result.duration, result.eventCount, result.status, result.error || null]
      );
    } catch (error) {
      console.error('Failed to log scraping result:', error);
    }
  }

  async getUpcomingEvents(limit = 10) {
    const today = new Date().toISOString().split('T')[0];
    const events = await this.db.all(
      `SELECT * FROM events 
       WHERE date >= ? 
       ORDER BY date ASC 
       LIMIT ?`,
      [today, limit]
    );
    
    return events;
  }

  async getEventsByCity(city) {
    return await this.db.getEvents({ city });
  }

  async getStats() {
    return await this.scraper.getStats();
  }

  async shutdown() {
    console.log('Shutting down Event Scraper Service...');
    await this.db.close();
    process.exit(0);
  }
}

async function main() {
  const service = new EventScraperService();
  
  process.on('SIGINT', async () => {
    console.log('\nReceived SIGINT, shutting down gracefully...');
    await service.shutdown();
  });

  process.on('SIGTERM', async () => {
    console.log('\nReceived SIGTERM, shutting down gracefully...');
    await service.shutdown();
  });

  try {
    await service.initialize();
    
    console.log('\n=================================');
    console.log('Event Scraper Service is running');
    console.log('=================================');
    console.log('Press Ctrl+C to stop\n');
    
    const upcomingEvents = await service.getUpcomingEvents(5);
    if (upcomingEvents.length > 0) {
      console.log('Upcoming events:');
      upcomingEvents.forEach(event => {
        console.log(`- ${event.date}: ${event.title} (${event.city})`);
      });
    }
    
    const stats = await service.getStats();
    console.log('\nCurrent statistics:');
    console.log(`Total events: ${stats.total}`);
    console.log(`Cities: ${Object.keys(stats.cities).join(', ')}`);
  } catch (error) {
    console.error('Failed to start service:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default EventScraperService;