import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from './database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class CSVExporter {
  constructor() {
    this.db = new Database();
  }

  async initialize() {
    await this.db.initialize();
  }

  formatCSVValue(value) {
    if (value === null || value === undefined) {
      return '';
    }
    
    const stringValue = String(value);
    
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    
    return stringValue;
  }

  async exportEvents() {
    const events = await this.db.all(`
      SELECT id, title, description, date, time, location, type, 
             image_url, registration_url, tags, status, created_at, updated_at
      FROM events
      ORDER BY created_at
    `);

    const headers = ['id', 'title', 'description', 'date', 'time', 'location', 'type', 
                     'image_url', 'registration_url', 'tags', 'status', 'created_at', 'updated_at'];
    
    const csv = [
      headers.join(','),
      ...events.map(event => {
        return headers.map(header => {
          if (header === 'tags') {
            try {
              const tags = JSON.parse(event[header] || '[]');
              return this.formatCSVValue(tags.join(';'));
            } catch {
              return this.formatCSVValue(event[header]);
            }
          }
          return this.formatCSVValue(event[header]);
        }).join(',');
      })
    ].join('\n');

    const outputPath = path.join(__dirname, '..', 'data', 'events_export.csv');
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, csv, 'utf8');
    
    console.log(`Exported ${events.length} events to ${outputPath}`);
    return outputPath;
  }

  async exportCommunities() {
    const communities = await this.db.all(`
      SELECT id, name, slug, description, website, city, 
             created_at, updated_at, user_id, logo_url, tags
      FROM communities
      ORDER BY created_at
    `);

    const headers = ['id', 'name', 'slug', 'description', 'website', 'city',
                     'created_at', 'updated_at', 'user_id', 'logo_url', 'tags'];
    
    const csv = [
      headers.join(','),
      ...communities.map(community => {
        return headers.map(header => {
          if (header === 'tags') {
            try {
              const tags = JSON.parse(community[header] || '[]');
              return this.formatCSVValue(tags.join(';'));
            } catch {
              return this.formatCSVValue(community[header]);
            }
          }
          return this.formatCSVValue(community[header]);
        }).join(',');
      })
    ].join('\n');

    const outputPath = path.join(__dirname, '..', 'data', 'communities_export.csv');
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, csv, 'utf8');
    
    console.log(`Exported ${communities.length} communities to ${outputPath}`);
    return outputPath;
  }

  async exportLinks() {
    const links = await this.db.all(`
      SELECT id, event_id, community_id, role, created_at
      FROM communities_to_events
      ORDER BY created_at
    `);

    const headers = ['id', 'event_id', 'community_id', 'role', 'created_at'];
    
    const csv = [
      headers.join(','),
      ...links.map(link => {
        return headers.map(header => {
          return this.formatCSVValue(link[header]);
        }).join(',');
      })
    ].join('\n');

    const outputPath = path.join(__dirname, '..', 'data', 'communities_to_events_export.csv');
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, csv, 'utf8');
    
    console.log(`Exported ${links.length} community-event links to ${outputPath}`);
    return outputPath;
  }

  async exportAll() {
    console.log('Starting CSV export...');
    
    const eventPath = await this.exportEvents();
    const communityPath = await this.exportCommunities();
    const linkPath = await this.exportLinks();
    
    console.log('\nExport completed successfully!');
    console.log('Files created:');
    console.log(`  - ${eventPath}`);
    console.log(`  - ${communityPath}`);
    console.log(`  - ${linkPath}`);
    
    return {
      events: eventPath,
      communities: communityPath,
      links: linkPath
    };
  }

  async close() {
    await this.db.close();
  }
}

async function main() {
  const exporter = new CSVExporter();
  
  try {
    await exporter.initialize();
    await exporter.exportAll();
  } catch (error) {
    console.error('Export failed:', error);
  } finally {
    await exporter.close();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default CSVExporter;