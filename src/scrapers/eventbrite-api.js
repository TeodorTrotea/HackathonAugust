import axios from 'axios';

class EventbriteAPIScraper {
  constructor() {
    // Eventbrite API - requires API key but has free tier
    this.baseUrl = 'https://www.eventbriteapi.com/v3';
    this.token = process.env.EVENTBRITE_API_TOKEN; // Add this to your .env
  }

  async scrapeEvents() {
    if (!this.token) {
      console.log('No Eventbrite API token found, skipping Eventbrite API scraping');
      return [];
    }

    const events = [];
    const locations = [
      { name: 'Brussels', coordinates: '50.8503,4.3517' },
      { name: 'Antwerp', coordinates: '51.2194,4.4025' },
      { name: 'Ghent', coordinates: '51.0543,3.7174' }
    ];

    for (const location of locations) {
      try {
        console.log(`Fetching Eventbrite events for ${location.name}...`);
        const locationEvents = await this.fetchLocationEvents(location);
        events.push(...locationEvents);
      } catch (error) {
        console.error(`Error fetching Eventbrite events for ${location.name}:`, error.message);
      }
    }

    return events;
  }

  async fetchLocationEvents(location) {
    const events = [];
    
    try {
      const response = await axios.get(`${this.baseUrl}/events/search/`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        },
        params: {
          'location.latitude': location.coordinates.split(',')[0],
          'location.longitude': location.coordinates.split(',')[1],
          'location.within': '25km',
          'categories': '102,103', // Tech categories
          'start_date.keyword': 'today',
          'sort_by': 'date',
          'expand': 'venue,organizer'
        }
      });

      if (response.data && response.data.events) {
        for (const event of response.data.events) {
          events.push(this.formatEvent(event, location.name));
        }
      }
    } catch (error) {
      if (error.response?.status === 401) {
        console.error('Invalid Eventbrite API token');
      } else {
        throw error;
      }
    }

    return events;
  }

  formatEvent(eventData, city) {
    const venue = eventData.venue || {};
    const organizer = eventData.organizer || {};
    
    return {
      title: eventData.name?.text || 'Untitled Event',
      description: eventData.description?.text || '',
      date: eventData.start?.local ? eventData.start.local.split('T')[0] : new Date().toISOString().split('T')[0],
      time: eventData.start?.local ? eventData.start.local.split('T')[1].substring(0, 5) : null,
      location: venue.name || city,
      type: 'Meetup',
      website_url: eventData.url,
      image_url: eventData.logo?.url || null,
      tags: [],
      community: {
        name: organizer.name || 'Eventbrite',
        slug: organizer.name ? organizer.name.toLowerCase().replace(/\s+/g, '-') : 'eventbrite',
        description: organizer.description?.text || `Events in ${city}`,
        website: 'https://www.eventbrite.com',
        city: city,
        logo_url: null,
        tags: []
      }
    };
  }
}

export default EventbriteAPIScraper;