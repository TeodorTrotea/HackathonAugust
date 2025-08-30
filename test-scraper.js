import Database from './src/database.js';
import { randomUUID } from 'crypto';

async function testScraper() {
  const db = new Database();
  
  try {
    await db.initialize();
    console.log('Database initialized');
    
    // Add a test event
    const testEvent = {
      title: 'Test Event in Brussels',
      description: 'This is a test event to verify the scraper structure',
      date: '2025-09-15',
      time: '18:00:00',
      location: 'Brussels Central Station',
      type: 'Meetup',
      image_url: 'https://example.com/image.jpg',
      registration_url: `https://example.com/event-${randomUUID()}`,
      tags: ['Tech', 'Networking'],
      community: {
        name: 'Test Community Brussels',
        slug: 'test-community-brussels',
        description: 'A test community for events',
        website: 'https://example.com',
        city: 'Brussels',
        logo_url: 'https://example.com/logo.jpg',
        tags: ['Tech']
      }
    };
    
    console.log('Adding test event...');
    const eventId = await db.saveEvent(testEvent);
    console.log(`Event saved with ID: ${eventId}`);
    
    // Check the data
    const events = await db.all('SELECT * FROM events');
    console.log(`\nTotal events in database: ${events.length}`);
    
    const communities = await db.all('SELECT * FROM communities');
    console.log(`Total communities in database: ${communities.length}`);
    
    const links = await db.all('SELECT * FROM communities_to_events');
    console.log(`Total event-community links: ${links.length}`);
    
    console.log('\nFirst event:', events[0]);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await db.close();
  }
}

testScraper();