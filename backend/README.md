# Belgium Tech Events Scraper Backend

An intelligent web scraping service that automatically discovers and extracts tech events from various websites using AI-powered content extraction.

## 🚀 Features

- **AI-Powered Extraction**: Uses GPT-4 to intelligently extract event information from any webpage
- **Multi-Site Support**: Scrape multiple websites concurrently
- **Automatic Scheduling**: Set up cron jobs for regular scraping
- **Database Storage**: SQLite database for efficient event storage
- **REST API**: Complete API for managing scraping and accessing events
- **Duplicate Detection**: Automatically prevents duplicate events
- **Export Functionality**: Export events to CSV format

## 📋 Prerequisites

- Node.js 18+ 
- OpenAI API key
- Chrome/Chromium (for Puppeteer)

## 🛠️ Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Add your OpenAI API key to `.env`:
```
OPENAI_API_KEY=your_api_key_here
```

## 🎯 Usage

### Start the API Server

```bash
npm start
# or for development with auto-reload
npm run dev
```

The server will run on `http://localhost:3001`

### CLI Commands

```bash
# Scrape a single website
npm run scrape scrape https://example.com/events

# Scrape all configured sites
npm run scrape scrape-all

# List configured sites
npm run scrape list-sites

# Add a new site
npm run scrape add-site "Site Name" "https://example.com/events"

# Export events to CSV
npm run scrape export

# Show statistics
npm run scrape stats

# Cleanup old events
npm run scrape cleanup 90
```

## 🌐 API Endpoints

### Events

- `GET /api/events` - Get all events with filters
  - Query params: `location`, `type`, `search`, `afterDate`, `limit`
- `GET /api/events/:id` - Get single event
- `GET /api/export/csv` - Export events as CSV

### Scraping

- `POST /api/scrape` - Trigger manual scrape
  ```json
  {
    "url": "https://example.com/events",
    "selectors": {
      "eventContainer": ".event-card"
    }
  }
  ```

- `POST /api/scrape-all` - Scrape all configured sites

### Sites Management

- `GET /api/scrape-sites` - Get all configured sites
- `POST /api/scrape-sites` - Add new site
  ```json
  {
    "name": "Site Name",
    "url": "https://example.com/events",
    "selectors": {},
    "frequency": "daily"
  }
  ```

### Monitoring

- `GET /api/scrape-logs` - Get scraping logs
- `GET /health` - Health check

## 🔧 Configuration

### Adding New Sites

Edit `config/scrape-sites.json`:

```json
{
  "sites": [
    {
      "name": "Your Event Site",
      "url": "https://your-site.com/events",
      "selectors": {
        "eventContainer": ".event-class",
        "waitFor": ".event-class"
      },
      "frequency": "daily"
    }
  ]
}
```

### Selectors (Optional)

You can provide CSS selectors to help the scraper:
- `eventContainer`: CSS selector for event containers
- `waitFor`: Wait for this element before scraping

If no selectors are provided, the AI will intelligently extract events from the entire page.

### Environment Variables

```bash
# OpenAI
OPENAI_API_KEY=your_key

# Database
DATABASE_PATH=./data/events.db

# Server
PORT=3001
NODE_ENV=development

# Scraping
MAX_CONCURRENT_SCRAPERS=3
SCRAPE_TIMEOUT=30000
USER_AGENT=Mozilla/5.0...

# Scheduling
SCRAPE_SCHEDULE=0 0 * * *  # Cron expression
AUTO_SCRAPE_ENABLED=false
```

## 📊 Database Schema

### Events Table
- `id` - Unique identifier
- `title` - Event title
- `description` - Event description
- `date` - Event date (YYYY-MM-DD)
- `time` - Event time (HH:MM)
- `location` - Venue/location
- `type` - Event type (Conference, Meetup, etc.)
- `tags` - Semicolon-separated tags
- `registration_url` - Registration link
- `image_url` - Event image
- `price` - Price or "Free"
- `organizer` - Event organizer
- `source_url` - Where it was scraped from
- `status` - active/archived

## 🤖 AI Extraction

The service uses GPT-4 to:
1. Analyze webpage content
2. Identify tech events
3. Extract structured data
4. Validate and normalize information

The AI looks for:
- Tech conferences, meetups, workshops
- AI/ML events
- Startup events
- Developer gatherings
- Innovation summits
- Digital transformation events

## 📈 Monitoring

Check scraping logs:
```bash
npm run scrape stats
```

View recent scrapes in the database:
```sql
SELECT * FROM scrape_logs ORDER BY scraped_at DESC LIMIT 10;
```

## 🚨 Troubleshooting

### Puppeteer Issues
If Puppeteer fails to launch:
```bash
# Install Chrome dependencies (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install -y chromium-browser

# macOS
brew install chromium
```

### Rate Limiting
If you encounter rate limits:
- Adjust `MAX_CONCURRENT_SCRAPERS` in `.env`
- Increase delays between requests
- Use rotating proxies if needed

### Memory Issues
For large-scale scraping:
```bash
NODE_OPTIONS=--max-old-space-size=4096 npm run scrape scrape-all
```

## 📝 License

MIT

## 🤝 Contributing

1. Add new sites to `config/scrape-sites.json`
2. Test with `npm run scrape scrape <url>`
3. Submit a pull request

## 💡 Tips

- Start with a single site to test: `npm run scrape scrape <url>`
- Check logs for extraction quality
- Adjust selectors if needed for better results
- Use the stats command to monitor database growth
- Export regularly for backups