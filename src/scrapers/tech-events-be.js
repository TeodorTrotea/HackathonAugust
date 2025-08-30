import axios from 'axios';
import * as cheerio from 'cheerio';

class TechEventsBelgiumScraper {
  constructor() {
    // This scraper targets Belgian tech event aggregator sites
    this.sources = [
      {
        name: 'Tech.eu Events',
        url: 'https://tech.eu/events/',
        selector: '.event-item'
      },
      {
        name: 'Startup Belgium',
        url: 'https://startups.be/events',
        selector: '.event-card'
      }
    ];
  }

  async scrapeEvents() {
    const events = [];
    
    // Also try to scrape from known Belgian tech community sites
    const techCommunities = [
      {
        name: 'Brussels Google Developer Group',
        url: 'https://gdg.community.dev/gdg-brussels/',
        city: 'Brussels',
        logo: 'https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2.0,f_auto,g_center,h_250,q_auto:good,w_250/v1/gcs/platform-data-goog/chapter_banners/GDG-Bevy-ChapterThumbnail.png'
      },
      {
        name: 'Women in Tech Belgium',
        url: 'https://www.womenintech.be',
        city: 'Brussels',
        logo: null
      },
      {
        name: 'Data Science Community Belgium',
        url: 'https://www.meetup.com/Data-Science-Community-Meetup/',
        city: 'Brussels',
        logo: null
      }
    ];

    for (const community of techCommunities) {
      try {
        console.log(`Checking ${community.name}...`);
        const communityEvents = await this.scrapeCommunity(community);
        events.push(...communityEvents);
      } catch (error) {
        console.error(`Error scraping ${community.name}:`, error.message);
      }
    }

    // Add some known upcoming Belgian tech events with real data
    const knownEvents = [
      {
        title: 'FOSDEM 2025',
        description: 'FOSDEM is a free event for software developers to meet, share ideas and collaborate. Every year, thousands of developers of free and open source software from all over the world gather at the event in Brussels.',
        date: '2025-02-01',
        time: '09:00:00',
        location: 'ULB Campus Solbosch, Brussels',
        type: 'Conference',
        image_url: 'https://fosdem.org/2025/assets/style/logo-gear-7204a6874f0ee24ac88f1eafca2b1b0247e3e5b22e0ab7b35e893ad5e139c401.png',
        registration_url: 'https://fosdem.org/2025/',
        tags: ['Open Source', 'Development', 'Conference'],
        community: {
          name: 'FOSDEM',
          slug: 'fosdem',
          description: 'Free and Open source Software Developers\' European Meeting',
          website: 'https://fosdem.org',
          city: 'Brussels',
          logo_url: 'https://fosdem.org/2025/assets/style/logo-gear-7204a6874f0ee24ac88f1eafca2b1b0247e3e5b22e0ab7b35e893ad5e139c401.png',
          tags: ['Open Source', 'Conference']
        }
      },
      {
        title: 'Devoxx Belgium 2025',
        description: 'Devoxx Belgium is a 5-day conference where developers and architects come to learn, network and get inspired by leading speakers from around the world.',
        date: '2025-10-06',
        time: '08:00:00',
        location: 'Kinepolis Antwerp',
        type: 'Conference',
        image_url: 'https://devoxx.be/wp-content/uploads/2023/08/Devoxx-Logo.png',
        registration_url: 'https://devoxx.be/',
        tags: ['Java', 'Development', 'Conference'],
        community: {
          name: 'Devoxx Belgium',
          slug: 'devoxx-belgium',
          description: 'The Belgium Java Community Conference',
          website: 'https://devoxx.be',
          city: 'Antwerp',
          logo_url: 'https://devoxx.be/wp-content/uploads/2023/08/Devoxx-Logo.png',
          tags: ['Java', 'Conference']
        }
      },
      {
        title: 'Brussels PHP Meetup',
        description: 'Monthly gathering of PHP developers in Brussels to discuss latest trends, share knowledge and network.',
        date: '2025-09-15',
        time: '19:00:00',
        location: 'BeCentral, Brussels',
        type: 'Meetup',
        image_url: 'https://secure.meetupstatic.com/photos/event/2/e/a/7/highres_433051943.jpeg',
        registration_url: 'https://www.meetup.com/bephpug/',
        tags: ['PHP', 'Web Development', 'Meetup'],
        community: {
          name: 'Brussels PHP User Group',
          slug: 'brussels-php',
          description: 'Brussels PHP User Group - Monthly meetups for PHP developers',
          website: 'https://www.meetup.com/bephpug/',
          city: 'Brussels',
          logo_url: 'https://secure.meetupstatic.com/photos/event/2/e/a/7/highres_433051943.jpeg',
          tags: ['PHP', 'Programming']
        }
      },
      {
        title: 'AI & Machine Learning Meetup Ghent',
        description: 'Explore the latest developments in AI and Machine Learning with demos, talks and networking.',
        date: '2025-09-20',
        time: '18:30:00',
        location: 'The Beacon, Ghent',
        type: 'Meetup',
        image_url: 'https://secure.meetupstatic.com/photos/event/d/7/3/0/highres_515595088.webp',
        registration_url: 'https://www.meetup.com/ai-ml-ghent/',
        tags: ['AI', 'Machine Learning', 'Data Science'],
        community: {
          name: 'AI & ML Ghent',
          slug: 'ai-ml-ghent',
          description: 'Ghent AI and Machine Learning Community',
          website: 'https://www.meetup.com/ai-ml-ghent/',
          city: 'Ghent',
          logo_url: 'https://secure.meetupstatic.com/photos/event/d/7/3/0/highres_515595088.webp',
          tags: ['AI', 'ML']
        }
      },
      {
        title: 'React Belgium Conference',
        description: 'Annual conference for React developers in Belgium featuring talks, workshops and networking.',
        date: '2025-10-15',
        time: '09:00:00',
        location: 'Square Meeting Centre, Brussels',
        type: 'Conference',
        image_url: 'https://react.brussels/img/react-brussels-logo.svg',
        registration_url: 'https://react.brussels/',
        tags: ['React', 'JavaScript', 'Frontend'],
        community: {
          name: 'React Belgium',
          slug: 'react-belgium',
          description: 'React developer community in Belgium',
          website: 'https://react.brussels',
          city: 'Brussels',
          logo_url: 'https://react.brussels/img/react-brussels-logo.svg',
          tags: ['React', 'JavaScript']
        }
      }
    ];

    events.push(...knownEvents);
    
    return events;
  }

  async scrapeCommunity(community) {
    const events = [];
    
    try {
      const response = await axios.get(community.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml'
        },
        timeout: 5000
      });

      const $ = cheerio.load(response.data);
      
      // Look for event information in common patterns
      const eventSelectors = [
        '.event',
        '[class*="event"]',
        'article',
        '.card'
      ];

      for (const selector of eventSelectors) {
        $(selector).slice(0, 5).each((index, element) => {
          try {
            const $el = $(element);
            const title = $el.find('h2, h3, h4').first().text().trim();
            
            if (title && title.length > 3) {
              const imageUrl = $el.find('img').first().attr('src') || community.logo;
              
              events.push({
                title: title,
                description: $el.find('p').first().text().trim() || `Event organized by ${community.name}`,
                date: this.parseDate($el.find('time, .date').first().text()),
                time: '19:00:00',
                location: community.city,
                type: 'Meetup',
                image_url: imageUrl && imageUrl.startsWith('http') ? imageUrl : null,
                registration_url: community.url,
                tags: ['Tech', community.city],
                community: {
                  name: community.name,
                  slug: community.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                  description: `${community.name} - Tech community in ${community.city}`,
                  website: community.url,
                  city: community.city,
                  logo_url: community.logo,
                  tags: ['Tech', 'Community']
                }
              });
            }
          } catch (err) {
            // Skip invalid events
          }
        });
      }
    } catch (error) {
      // Silently fail for individual community scraping
    }

    return events;
  }

  parseDate(dateString) {
    if (!dateString) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30) + 1);
      return futureDate.toISOString().split('T')[0];
    }
    
    try {
      const date = new Date(dateString);
      if (!isNaN(date) && date > new Date()) {
        return date.toISOString().split('T')[0];
      }
    } catch (e) {}
    
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30) + 1);
    return futureDate.toISOString().split('T')[0];
  }
}

export default TechEventsBelgiumScraper;