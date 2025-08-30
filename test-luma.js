import LumaScraper from './src/scrapers/luma.js';
import Database from './src/database.js';
import { belgianCities } from './src/config/belgian-cities.js';

async function testLuma() {
  console.log('Testing Luma scraper - First page only (saving to DB)...\n');
  
  const scraper = new LumaScraper();
  const db = new Database();
  
  try {
    // Initialize database
    await db.initialize();
    
    // Test first 3 Belgian cities with one keyword, first page only
    const events = [];
    for (const city of belgianCities.slice(0, 3)) {
      console.log(`\nTesting ${city}...`);
      const cityEvents = await scraper.scrapeByKeyword(city, 'javascript', 1);
      events.push(...cityEvents);
    }
    
    console.log(`\nFound ${events.length} events from Luma:`);
    
    let savedCount = 0;
    for (const event of events) {
      console.log(`\n--- Event ${savedCount + 1} ---`);
      console.log(`Title: ${event.title}`);
      console.log(`Date: ${event.date}`);
      console.log(`Time: ${event.time}`);
      console.log(`Location: ${event.location}`);
      console.log(`URL: ${event.registration_url}`);
      console.log(`Description: ${event.description.substring(0, 200)}${event.description.length > 200 ? '...' : ''}`);
      console.log(`Tags: ${event.tags.join(', ')}`);
      
      try {
        // Save event to database
        await db.saveEvent(event);
        console.log(`✅ Saved to database`);
        savedCount++;
      } catch (error) {
        console.log(`❌ Error saving to database: ${error.message}`);
      }
    }
    
    console.log(`\n🎉 Test complete! Saved ${savedCount}/${events.length} events to database`);
    
  } catch (error) {
    console.error('Error testing Luma scraper:', error);
  } finally {
    await db.close();
  }
}

testLuma();