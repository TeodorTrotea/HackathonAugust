# Belgium Events Scraper

A comprehensive web scraper that collects events from multiple Belgian event websites and stores them in a structured database matching the provided CSV format.

## Features

- Scrapes events from multiple sources:
  - Visit Brussels
  - UiT in Vlaanderen
  - Eventbrite Belgium
- Stores events with UUID identifiers
- Manages communities (organizations/venues) separately
- Links events to communities with relationships
- Exports data to CSV format matching the example structure
- Automated scheduling with cron jobs
- REST API for querying events
- Duplicate detection and updates

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file with:

```
DATABASE_PATH=./events.db
SCRAPE_INTERVAL=0 */6 * * *
USER_AGENT=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
PORT=3000
```

## Usage

### Run the scraper once
```bash
npm run scrape
```

### Export to CSV files
```bash
npm run export
```

### Run the scheduler service
```bash
npm start
```

### Start the API server
```bash
node src/api.js
```

## Database Structure

### Events Table
- `id` - UUID primary key
- `title` - Event name
- `description` - Event description
- `date` - Event date (YYYY-MM-DD)
- `time` - Event time (HH:MM:SS)
- `location` - Event location
- `type` - Event type (Meetup, Workshop, Conference, etc.)
- `image_url` - Event image URL
- `registration_url` - Registration link (unique)
- `tags` - JSON array of tags
- `status` - Event status (PUBLISHED, etc.)
- `created_at` - Creation timestamp
- `updated_at` - Update timestamp

### Communities Table
- `id` - UUID primary key
- `name` - Community/organization name
- `slug` - URL-friendly identifier
- `description` - Community description
- `website` - Community website
- `city` - City location
- `logo_url` - Logo image URL
- `tags` - JSON array of tags
- `user_id` - Creator user ID
- `created_at` - Creation timestamp
- `updated_at` - Update timestamp

### Communities to Events Table
- `id` - UUID primary key
- `event_id` - Foreign key to events
- `community_id` - Foreign key to communities
- `role` - Relationship role (host, sponsor, etc.)
- `created_at` - Creation timestamp

## CSV Export

The scraper exports data to three CSV files in the `data/` directory:
- `events_export.csv` - All scraped events
- `communities_export.csv` - All communities/organizations
- `communities_to_events_export.csv` - Event-community relationships

## API Endpoints

- `GET /api/events` - List events with filters
  - Query params: `city`, `type`, `fromDate`, `toDate`, `limit`
- `GET /api/events/:id` - Get specific event
- `GET /api/cities` - List all cities
- `GET /api/categories` - List all event types
- `GET /api/stats` - Get statistics

## Notes

- Events are linked to communities automatically during scraping
- Each scraper creates appropriate community entries for event organizers
- The scraper runs every 6 hours by default
- Old events (>30 days past) are automatically cleaned up
- Duplicate events are detected by registration URL and updated instead of duplicated