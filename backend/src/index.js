import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ScraperService from './services/ScraperService.js';
import DatabaseService from './services/DatabaseService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize services
const scraperService = new ScraperService();
const dbService = new DatabaseService();

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    services: {
      database: 'connected',
      scraper: 'ready'
    }
  });
});

// Get all events
app.get('/api/events', (req, res) => {
  try {
    const filters = {
      location: req.query.location,
      type: req.query.type,
      search: req.query.search,
      afterDate: req.query.afterDate || new Date().toISOString().split('T')[0],
      limit: parseInt(req.query.limit) || 100
    };
    
    const events = dbService.getEvents(filters);
    res.json({
      events,
      count: events.length,
      filters
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get single event
app.get('/api/events/:id', (req, res) => {
  try {
    const event = dbService.getEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// Get scrape sites
app.get('/api/scrape-sites', (req, res) => {
  try {
    const sites = dbService.getSites();
    res.json({ sites });
  } catch (error) {
    console.error('Error fetching sites:', error);
    res.status(500).json({ error: 'Failed to fetch sites' });
  }
});

// Add new scrape site
app.post('/api/scrape-sites', (req, res) => {
  try {
    const { name, url, selectors, frequency } = req.body;
    
    if (!name || !url) {
      return res.status(400).json({ error: 'Name and URL are required' });
    }
    
    const siteId = dbService.saveSite({
      name,
      url,
      selectors: selectors || {},
      frequency: frequency || 'daily'
    });
    
    res.json({ 
      success: true, 
      siteId,
      message: 'Site added successfully' 
    });
  } catch (error) {
    console.error('Error adding site:', error);
    res.status(500).json({ error: 'Failed to add site' });
  }
});

// Trigger manual scrape
app.post('/api/scrape', async (req, res) => {
  try {
    const { url, selectors } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    console.log(`Manual scrape requested for: ${url}`);
    
    // Start scraping in background
    res.json({ 
      message: 'Scraping started', 
      url 
    });
    
    // Perform scrape
    const events = await scraperService.scrapeWebsite(url, selectors || {});
    
    // Save to database
    const savedCount = dbService.saveEvents(events);
    
    // Log the scrape
    dbService.logScrape(
      { name: 'Manual', url },
      events.length,
      true
    );
    
    console.log(`Scrape complete: ${events.length} events found, ${savedCount} saved`);
    
  } catch (error) {
    console.error('Scrape error:', error);
    dbService.logScrape(
      { name: 'Manual', url: req.body.url },
      0,
      false,
      error.message
    );
  }
});

// Scrape all configured sites
app.post('/api/scrape-all', async (req, res) => {
  try {
    const sites = dbService.getSites(true); // Get enabled sites only
    
    res.json({ 
      message: 'Batch scraping started', 
      sitesCount: sites.length 
    });
    
    // Scrape all sites
    const results = await scraperService.scrapeMultipleSites(sites);
    
    // Save events
    const savedCount = dbService.saveEvents(results);
    
    // Update last scraped time for each site
    sites.forEach(site => {
      dbService.updateSiteLastScraped(site.url);
    });
    
    console.log(`Batch scrape complete: ${results.length} total events, ${savedCount} saved`);
    
  } catch (error) {
    console.error('Batch scrape error:', error);
  }
});

// Get scrape logs
app.get('/api/scrape-logs', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const logs = dbService.getScrapeLogs(limit);
    res.json({ logs });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

// Export events as CSV
app.get('/api/export/csv', (req, res) => {
  try {
    const csv = dbService.exportToCSV();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="events.csv"');
    res.send(csv);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    res.status(500).json({ error: 'Failed to export CSV' });
  }
});

// Initialize sites from config
async function initializeSites() {
  try {
    const configPath = path.join(__dirname, '../config/scrape-sites.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      
      for (const site of config.sites) {
        dbService.saveSite(site);
      }
      
      console.log(`Initialized ${config.sites.length} scrape sites from config`);
    }
  } catch (error) {
    console.error('Error initializing sites:', error);
  }
}

// Schedule automatic scraping
if (process.env.AUTO_SCRAPE_ENABLED === 'true') {
  const schedule = process.env.SCRAPE_SCHEDULE || '0 0 * * *'; // Daily at midnight
  
  cron.schedule(schedule, async () => {
    console.log('Starting scheduled scrape...');
    
    try {
      const sites = dbService.getSites(true);
      const results = await scraperService.scrapeMultipleSites(sites);
      const savedCount = dbService.saveEvents(results);
      
      console.log(`Scheduled scrape complete: ${savedCount} events saved`);
      
      // Cleanup old events
      const archived = dbService.cleanupOldEvents(90);
      console.log(`Archived ${archived} old events`);
      
    } catch (error) {
      console.error('Scheduled scrape error:', error);
    }
  });
  
  console.log(`Automatic scraping scheduled: ${schedule}`);
}

// Start server
app.listen(PORT, async () => {
  console.log(`
╔════════════════════════════════════════╗
║   Belgium Tech Events Scraper Backend   ║
╠════════════════════════════════════════╣
║   Server running on port ${PORT}          ║
║   Environment: ${process.env.NODE_ENV || 'development'}         ║
║   Auto-scrape: ${process.env.AUTO_SCRAPE_ENABLED || 'false'}           ║
╚════════════════════════════════════════╝
  `);
  
  // Initialize sites on startup
  await initializeSites();
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  dbService.close();
  scraperService.cleanup();
  process.exit(0);
});

export default app;