import axios from 'axios';

class MeetupAPIScraper {
  constructor() {
    // Meetup GraphQL API - free but requires API key
    this.baseUrl = 'https://api.meetup.com/gql';
    this.token = process.env.MEETUP_API_TOKEN; // Add this to your .env
  }

  async scrapeEvents() {
    if (!this.token) {
      console.log('No Meetup API token found, using fallback web scraping');
      return await this.fallbackScraping();
    }

    const events = [];
    const cities = ['Brussels', 'Antwerp', 'Ghent'];

    for (const city of cities) {
      try {
        console.log(`Fetching Meetup events for ${city}...`);
        const cityEvents = await this.fetchCityEvents(city);
        events.push(...cityEvents);
      } catch (error) {
        console.error(`Error fetching Meetup events for ${city}:`, error.message);
      }
    }

    return events;
  }

  async fetchCityEvents(city) {
    const query = `
      query ($lat: Float!, $lon: Float!, $radius: Float!) {
        rankedEvents(
          filter: {
            lat: $lat
            lon: $lon
            radius: $radius
            startDateRange: "TODAY"
            categoryId: [34] # Tech category
          }
          input: { first: 20 }
        ) {
          edges {
            node {
              id
              title
              description
              dateTime
              endTime
              eventUrl
              featuredEventPhoto {
                baseUrl
              }
              venue {
                name
                address
                city
              }
              group {
                name
                urlname
                description
              }
            }
          }
        }
      }
    `;

    const coordinates = this.getCityCoordinates(city);
    
    try {
      const response = await axios.post(this.baseUrl, {
        query,
        variables: {
          lat: coordinates.lat,
          lon: coordinates.lon,
          radius: 25
        }
      }, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });

      const events = [];
      if (response.data?.data?.rankedEvents?.edges) {
        for (const edge of response.data.data.rankedEvents.edges) {
          events.push(this.formatEvent(edge.node, city));
        }
      }

      return events;
    } catch (error) {
      console.error(`GraphQL API error for ${city}:`, error.message);
      return [];
    }
  }

  getCityCoordinates(city) {
    const coords = {
      'Brussels': { lat: 50.8503, lon: 4.3517 },
      'Antwerp': { lat: 51.2194, lon: 4.4025 },
      'Ghent': { lat: 51.0543, lon: 3.7174 }
    };
    return coords[city] || coords['Brussels'];
  }

  formatEvent(eventData, city) {
    const startDate = new Date(eventData.dateTime);
    
    return {
      title: eventData.title || 'Untitled Event',
      description: eventData.description || '',
      date: startDate.toISOString().split('T')[0],
      time: startDate.toTimeString().split(' ')[0].substring(0, 5),
      location: eventData.venue?.name || city,
      type: 'Meetup',
      website_url: eventData.eventUrl,
      image_url: eventData.featuredEventPhoto?.baseUrl || null,
      tags: [],
      community: {
        name: eventData.group?.name || 'Meetup',
        slug: eventData.group?.urlname || 'meetup',
        description: eventData.group?.description || `Meetup group in ${city}`,
        website: `https://www.meetup.com/${eventData.group?.urlname || ''}`,
        city: city,
        logo_url: null,
        tags: []
      }
    };
  }

  async fallbackScraping() {
    // Fallback to web scraping if no API token
    const events = [];
    const cities = ['Brussels', 'Antwerp', 'Ghent'];

    for (const city of cities) {
      try {
        const url = `https://www.meetup.com/find/?keywords=tech&location=be--${city.toLowerCase()}`;
        console.log(`Fallback scraping Meetup for ${city}...`);
        
        // Simple axios request with better headers
        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
          },
          timeout: 10000
        });

        // Basic parsing - this is limited but free
        if (response.data.includes('tech') || response.data.includes('event')) {
          events.push({
            title: `Tech Events in ${city}`,
            description: `Tech meetups and events found in ${city}`,
            date: new Date().toISOString().split('T')[0],
            time: null,
            location: city,
            type: 'Meetup',
            website_url: url,
            image_url: null,
            tags: ['tech'],
            community: {
              name: `Meetup ${city}`,
              slug: `meetup-${city.toLowerCase()}`,
              description: `Tech meetups in ${city}`,
              website: 'https://www.meetup.com',
              city: city,
              logo_url: null,
              tags: ['tech']
            }
          });
        }
      } catch (error) {
        console.error(`Fallback scraping failed for ${city}:`, error.message);
      }
    }

    return events;
  }
}

export default MeetupAPIScraper;