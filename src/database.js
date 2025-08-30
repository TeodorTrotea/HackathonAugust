import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '..', 'events.db');

class Database {
  constructor() {
    this.db = new sqlite3.Database(dbPath);
    this.run = promisify(this.db.run.bind(this.db));
    this.get = promisify(this.db.get.bind(this.db));
    this.all = promisify(this.db.all.bind(this.db));
  }

  async initialize() {
    await this.run(`
      CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        date DATE,
        time TIME,
        location TEXT,
        type TEXT,
        image_url TEXT,
        registration_url TEXT UNIQUE,
        tags TEXT,
        status TEXT DEFAULT 'PUBLISHED',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await this.run(`
      CREATE TABLE IF NOT EXISTS communities (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE,
        description TEXT,
        website TEXT,
        city TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_id TEXT,
        logo_url TEXT,
        tags TEXT
      )
    `);

    await this.run(`
      CREATE TABLE IF NOT EXISTS communities_to_events (
        id TEXT PRIMARY KEY,
        event_id TEXT,
        community_id TEXT,
        role TEXT DEFAULT 'host',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES events(id),
        FOREIGN KEY (community_id) REFERENCES communities(id)
      )
    `);

    await this.run(`
      CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
    `);

    await this.run(`
      CREATE INDEX IF NOT EXISTS idx_communities_city ON communities(city);
    `);

    await this.run(`
      CREATE INDEX IF NOT EXISTS idx_communities_slug ON communities(slug);
    `);

    console.log('Database initialized successfully');
  }

  async saveEvent(event) {
    const {
      title,
      description,
      date,
      time,
      location,
      type,
      image_url,
      registration_url,
      tags,
      community
    } = event;

    try {
      const existing = await this.get('SELECT id FROM events WHERE registration_url = ?', [registration_url]);
      
      if (existing) {
        await this.run(`
          UPDATE events 
          SET title = ?, description = ?, date = ?, time = ?,
              location = ?, type = ?, image_url = ?, tags = ?,
              updated_at = CURRENT_TIMESTAMP
          WHERE registration_url = ?
        `, [title, description, date, time, location, type, 
            image_url, JSON.stringify(tags || []), registration_url]);
        
        console.log(`Updated event: ${title}`);
        return existing.id;
      } else {
        const eventId = randomUUID();
        await this.run(`
          INSERT INTO events (
            id, title, description, date, time, location, type,
            image_url, registration_url, tags, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PUBLISHED')
        `, [eventId, title, description, date, time, location, type,
            image_url, registration_url, JSON.stringify(tags || [])]);
        
        console.log(`Saved new event: ${title}`);
        
        if (community) {
          await this.linkEventToCommunity(eventId, community);
        }
        
        return eventId;
      }
    } catch (error) {
      console.error(`Error saving event ${title}:`, error);
    }
  }

  async saveCommunity(community) {
    const {
      name,
      slug,
      description,
      website,
      city,
      logo_url,
      tags
    } = community;

    try {
      const existing = await this.get('SELECT id FROM communities WHERE slug = ?', [slug]);
      
      if (existing) {
        await this.run(`
          UPDATE communities 
          SET name = ?, description = ?, website = ?, city = ?,
              logo_url = ?, tags = ?, updated_at = CURRENT_TIMESTAMP
          WHERE slug = ?
        `, [name, description, website, city, logo_url, 
            JSON.stringify(tags || []), slug]);
        
        return existing.id;
      } else {
        const communityId = randomUUID();
        const userId = randomUUID();
        
        await this.run(`
          INSERT INTO communities (
            id, name, slug, description, website, city, user_id, logo_url, tags
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [communityId, name, slug, description, website, city, 
            userId, logo_url, JSON.stringify(tags || [])]);
        
        console.log(`Created community: ${name}`);
        return communityId;
      }
    } catch (error) {
      console.error(`Error saving community ${name}:`, error);
    }
  }

  async linkEventToCommunity(eventId, community) {
    try {
      let communityId;
      
      if (typeof community === 'string') {
        communityId = community;
      } else {
        communityId = await this.saveCommunity(community);
      }
      
      if (communityId) {
        const linkId = randomUUID();
        await this.run(`
          INSERT INTO communities_to_events (id, event_id, community_id, role)
          VALUES (?, ?, ?, 'host')
        `, [linkId, eventId, communityId]);
      }
    } catch (error) {
      console.error('Error linking event to community:', error);
    }
  }

  async getEvents(filters = {}) {
    let query = `
      SELECT e.*, c.name as community_name, c.city as community_city
      FROM events e
      LEFT JOIN communities_to_events ce ON e.id = ce.event_id
      LEFT JOIN communities c ON ce.community_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.city) {
      query += ' AND (e.location LIKE ? OR c.city = ?)';
      params.push(`%${filters.city}%`, filters.city);
    }

    if (filters.type) {
      query += ' AND e.type = ?';
      params.push(filters.type);
    }

    if (filters.fromDate) {
      query += ' AND e.date >= ?';
      params.push(filters.fromDate);
    }

    if (filters.toDate) {
      query += ' AND e.date <= ?';
      params.push(filters.toDate);
    }

    query += ' ORDER BY e.date ASC';

    return await this.all(query, params);
  }

  async exportToCSV() {
    const events = await this.all('SELECT * FROM events ORDER BY created_at');
    const communities = await this.all('SELECT * FROM communities ORDER BY created_at');
    const links = await this.all('SELECT * FROM communities_to_events ORDER BY created_at');
    
    return {
      events,
      communities,
      links
    };
  }

  async close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

export default Database;