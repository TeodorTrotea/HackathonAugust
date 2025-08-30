import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class DatabaseService {
  constructor() {
    const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../data/events.db');
    
    // Ensure data directory exists
    const dataDir = path.dirname(dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    this.db = new Database(dbPath);
    this.initializeDatabase();
  }

  initializeDatabase() {
    // Create events table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        date TEXT,
        time TEXT,
        location TEXT,
        type TEXT,
        image_url TEXT,
        registration_url TEXT,
        tags TEXT,
        status TEXT DEFAULT 'active',
        price TEXT,
        organizer TEXT,
        source_url TEXT,
        scraped_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(title, date, location)
      )
    `);

    // Create scrape logs table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS scrape_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        site_name TEXT,
        site_url TEXT,
        events_found INTEGER,
        success BOOLEAN,
        error_message TEXT,
        scraped_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create sites configuration table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS scrape_sites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        url TEXT NOT NULL UNIQUE,
        selectors TEXT,
        frequency TEXT DEFAULT 'daily',
        enabled BOOLEAN DEFAULT 1,
        last_scraped TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
      CREATE INDEX IF NOT EXISTS idx_events_location ON events(location);
      CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
      CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
    `);
  }

  // Event operations
  saveEvent(event) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO events (
        id, title, description, date, time, location, type,
        image_url, registration_url, tags, status, price,
        organizer, source_url, scraped_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP
      )
    `);

    try {
      const result = stmt.run(
        event.id,
        event.title,
        event.description,
        event.date,
        event.time,
        event.location,
        event.type,
        event.image_url || event.imageUrl,
        event.registration_url || event.registrationUrl,
        event.tags,
        event.status || 'active',
        event.price,
        event.organizer,
        event.source_url || event.sourceUrl,
        event.scraped_at || event.scrapedAt
      );
      return result.changes > 0;
    } catch (error) {
      console.error('Error saving event:', error);
      return false;
    }
  }

  saveEvents(events) {
    const saved = events.map(event => this.saveEvent(event));
    return saved.filter(Boolean).length;
  }

  getEvents(filters = {}) {
    let query = 'SELECT * FROM events WHERE status = "active"';
    const params = [];

    if (filters.location) {
      query += ' AND location LIKE ?';
      params.push(`%${filters.location}%`);
    }

    if (filters.type) {
      query += ' AND type LIKE ?';
      params.push(`%${filters.type}%`);
    }

    if (filters.afterDate) {
      query += ' AND date >= ?';
      params.push(filters.afterDate);
    }

    if (filters.search) {
      query += ' AND (title LIKE ? OR description LIKE ? OR tags LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
    }

    query += ' ORDER BY date ASC LIMIT ?';
    params.push(filters.limit || 100);

    const stmt = this.db.prepare(query);
    return stmt.all(...params);
  }

  getEventById(id) {
    const stmt = this.db.prepare('SELECT * FROM events WHERE id = ?');
    return stmt.get(id);
  }

  updateEventStatus(id, status) {
    const stmt = this.db.prepare('UPDATE events SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    const result = stmt.run(status, id);
    return result.changes > 0;
  }

  // Scrape site operations
  saveSite(site) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO scrape_sites (name, url, selectors, frequency, enabled)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      site.name,
      site.url,
      JSON.stringify(site.selectors || {}),
      site.frequency || 'daily',
      site.enabled !== false ? 1 : 0
    );
    
    return result.lastInsertRowid;
  }

  getSites(enabled = null) {
    let query = 'SELECT * FROM scrape_sites';
    if (enabled !== null) {
      query += ' WHERE enabled = ?';
      const stmt = this.db.prepare(query);
      return stmt.all(enabled ? 1 : 0).map(site => ({
        ...site,
        selectors: JSON.parse(site.selectors || '{}')
      }));
    }
    
    const stmt = this.db.prepare(query);
    return stmt.all().map(site => ({
      ...site,
      selectors: JSON.parse(site.selectors || '{}')
    }));
  }

  updateSiteLastScraped(siteUrl) {
    const stmt = this.db.prepare('UPDATE scrape_sites SET last_scraped = CURRENT_TIMESTAMP WHERE url = ?');
    const result = stmt.run(siteUrl);
    return result.changes > 0;
  }

  // Scrape log operations
  logScrape(site, eventsFound, success, errorMessage = null) {
    const stmt = this.db.prepare(`
      INSERT INTO scrape_logs (site_name, site_url, events_found, success, error_message)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      site.name || 'Unknown',
      site.url,
      eventsFound,
      success ? 1 : 0,
      errorMessage
    );
    
    return result.lastInsertRowid;
  }

  getScrapeLogs(limit = 100) {
    const stmt = this.db.prepare('SELECT * FROM scrape_logs ORDER BY scraped_at DESC LIMIT ?');
    return stmt.all(limit);
  }

  // Export to CSV
  exportToCSV() {
    const events = this.db.prepare('SELECT * FROM events WHERE status = "active" ORDER BY date ASC').all();
    
    const headers = Object.keys(events[0] || {}).join(',');
    const rows = events.map(event => 
      Object.values(event).map(val => 
        typeof val === 'string' && val.includes(',') ? `"${val}"` : val
      ).join(',')
    );
    
    return [headers, ...rows].join('\n');
  }

  // Cleanup old events
  cleanupOldEvents(daysOld = 90) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    const cutoffDateStr = cutoffDate.toISOString().split('T')[0];
    
    const stmt = this.db.prepare('UPDATE events SET status = "archived" WHERE date < ? AND status = "active"');
    const result = stmt.run(cutoffDateStr);
    
    return result.changes;
  }

  close() {
    this.db.close();
  }
}

export default DatabaseService;