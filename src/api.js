import express from 'express';
import Database from './database.js';

const app = express();
const port = process.env.PORT || 3000;
const db = new Database();

app.use(express.json());

app.get('/api/events', async (req, res) => {
  try {
    const { city, category, fromDate, toDate, limit = 50 } = req.query;
    
    const filters = {};
    if (city) filters.city = city;
    if (category) filters.category = category;
    if (fromDate) filters.fromDate = fromDate;
    if (toDate) filters.toDate = toDate;
    
    const events = await db.getEvents(filters);
    const limitedEvents = events.slice(0, parseInt(limit));
    
    res.json({
      success: true,
      count: limitedEvents.length,
      total: events.length,
      events: limitedEvents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await db.get('SELECT * FROM events WHERE id = ?', [req.params.id]);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }
    
    res.json({
      success: true,
      event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/cities', async (req, res) => {
  try {
    const cities = await db.all('SELECT DISTINCT city FROM events ORDER BY city');
    
    res.json({
      success: true,
      cities: cities.map(c => c.city)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const categories = await db.all('SELECT DISTINCT category FROM events ORDER BY category');
    
    res.json({
      success: true,
      categories: categories.map(c => c.category)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const totalEvents = await db.get('SELECT COUNT(*) as count FROM events');
    const eventsByCity = await db.all(
      'SELECT city, COUNT(*) as count FROM events GROUP BY city'
    );
    const eventsByCategory = await db.all(
      'SELECT category, COUNT(*) as count FROM events GROUP BY category'
    );
    const eventsBySource = await db.all(
      'SELECT source, COUNT(*) as count FROM events GROUP BY source'
    );
    
    res.json({
      success: true,
      stats: {
        totalEvents: totalEvents.count,
        byCity: eventsByCity,
        byCategory: eventsByCategory,
        bySource: eventsBySource
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

async function startServer() {
  await db.initialize();
  
  app.listen(port, () => {
    console.log(`API server running at http://localhost:${port}`);
    console.log('\nAvailable endpoints:');
    console.log(`GET /api/events - List events (query params: city, category, fromDate, toDate, limit)`);
    console.log(`GET /api/events/:id - Get event by ID`);
    console.log(`GET /api/cities - List all cities`);
    console.log(`GET /api/categories - List all categories`);
    console.log(`GET /api/stats - Get statistics`);
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startServer();
}

export default app;