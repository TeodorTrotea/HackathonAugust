#!/usr/bin/env node

import AIScraper from './src/scrapers/ai-scraper.js';

async function main() {
  const url = process.argv[2];
  
  if (!url) {
    console.log('Usage: npm run aiscrape <url>');
    console.log('Example: npm run aiscrape https://www.eventbrite.com/e/some-tech-event');
    process.exit(1);
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Error: OPENAI_API_KEY environment variable is required');
    console.error('Please add OPENAI_API_KEY=your_key_here to your .env file');
    process.exit(1);
  }

  const scraper = new AIScraper();
  
  try {
    console.log('🤖 AI Scraper Test');
    console.log('==================');
    console.log(`Target URL: ${url}\n`);
    
    // Add debug flag to see page content
    const debug = process.argv.includes('--debug');
    
    if (debug) {
      console.log('🔍 DEBUG MODE: Will show page content preview\n');
    }
    
    const result = await scraper.scrapeEventFromUrl(url, { debug });
    
    if (result) {
      console.log('\n✅ SUCCESS! Event extracted:');
      console.log('============================');
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log('\n❌ No tech event found or extraction failed');
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await scraper.close();
  }
}

main();