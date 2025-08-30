#!/usr/bin/env node

import dotenv from 'dotenv';
import ScraperService from './services/ScraperService.js';
import DatabaseService from './services/DatabaseService.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
dotenv.config();

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];

async function main() {
  const scraperService = new ScraperService();
  const dbService = new DatabaseService();

  console.log('🚀 Belgium Tech Events Scraper CLI\n');

  switch (command) {
    case 'scrape':
      const url = args[1];
      if (!url) {
        console.error('❌ Please provide a URL to scrape');
        console.log('Usage: npm run scrape scrape <url>');
        process.exit(1);
      }
      
      console.log(`🔍 Scraping: ${url}`);
      try {
        const events = await scraperService.scrapeWebsite(url);
        console.log(`✅ Found ${events.length} events`);
        
        const saved = dbService.saveEvents(events);
        console.log(`💾 Saved ${saved} events to database`);
        
        // Display first few events
        events.slice(0, 3).forEach(event => {
          console.log(`\n📅 ${event.title}`);
          console.log(`   Date: ${event.date}`);
          console.log(`   Location: ${event.location}`);
        });
        
      } catch (error) {
        console.error('❌ Scraping failed:', error.message);
      }
      break;

    case 'scrape-all':
      console.log('🔄 Scraping all configured sites...');
      try {
        const sites = dbService.getSites(true);
        console.log(`📋 Found ${sites.length} sites to scrape`);
        
        const results = await scraperService.scrapeMultipleSites(sites);
        console.log(`✅ Total events found: ${results.length}`);
        
        const saved = dbService.saveEvents(results);
        console.log(`💾 Saved ${saved} events to database`);
        
      } catch (error) {
        console.error('❌ Batch scraping failed:', error.message);
      }
      break;

    case 'list-sites':
      console.log('📋 Configured scraping sites:\n');
      const sites = dbService.getSites();
      sites.forEach((site, index) => {
        console.log(`${index + 1}. ${site.name}`);
        console.log(`   URL: ${site.url}`);
        console.log(`   Frequency: ${site.frequency}`);
        console.log(`   Enabled: ${site.enabled ? '✅' : '❌'}`);
        console.log(`   Last scraped: ${site.last_scraped || 'Never'}\n`);
      });
      break;

    case 'add-site':
      const siteName = args[1];
      const siteUrl = args[2];
      
      if (!siteName || !siteUrl) {
        console.error('❌ Please provide name and URL');
        console.log('Usage: npm run scrape add-site <name> <url>');
        process.exit(1);
      }
      
      try {
        const siteId = dbService.saveSite({
          name: siteName,
          url: siteUrl,
          frequency: 'daily',
          enabled: true
        });
        console.log(`✅ Site added successfully (ID: ${siteId})`);
      } catch (error) {
        console.error('❌ Failed to add site:', error.message);
      }
      break;

    case 'export':
      console.log('📤 Exporting events to CSV...');
      try {
        const csv = dbService.exportToCSV();
        const exportPath = path.join(__dirname, '../data/events_export.csv');
        fs.writeFileSync(exportPath, csv);
        console.log(`✅ Events exported to: ${exportPath}`);
      } catch (error) {
        console.error('❌ Export failed:', error.message);
      }
      break;

    case 'stats':
      console.log('📊 Database Statistics:\n');
      const events = dbService.getEvents();
      const logs = dbService.getScrapeLogs(10);
      
      console.log(`Total active events: ${events.length}`);
      
      // Group by location
      const locations = {};
      events.forEach(event => {
        const loc = event.location || 'Unknown';
        locations[loc] = (locations[loc] || 0) + 1;
      });
      
      console.log('\nEvents by location:');
      Object.entries(locations)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .forEach(([loc, count]) => {
          console.log(`  ${loc}: ${count}`);
        });
      
      console.log('\nRecent scrape logs:');
      logs.slice(0, 5).forEach(log => {
        const status = log.success ? '✅' : '❌';
        console.log(`  ${status} ${log.site_name} - ${log.events_found} events (${log.scraped_at})`);
      });
      break;

    case 'cleanup':
      const days = parseInt(args[1]) || 90;
      console.log(`🧹 Cleaning up events older than ${days} days...`);
      const archived = dbService.cleanupOldEvents(days);
      console.log(`✅ Archived ${archived} old events`);
      break;

    default:
      console.log('Available commands:\n');
      console.log('  scrape <url>         - Scrape a single URL');
      console.log('  scrape-all           - Scrape all configured sites');
      console.log('  list-sites           - List all configured sites');
      console.log('  add-site <name> <url> - Add a new site to scrape');
      console.log('  export               - Export events to CSV');
      console.log('  stats                - Show database statistics');
      console.log('  cleanup [days]       - Archive old events (default: 90 days)');
      console.log('\nExample:');
      console.log('  npm run scrape scrape https://www.meetup.com/find/?keywords=tech&location=be--brussels');
  }

  // Cleanup
  dbService.close();
  await scraperService.cleanup();
  process.exit(0);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});