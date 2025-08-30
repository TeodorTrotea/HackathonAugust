// Tech keywords for searching events
export const techSearchKeywords = [
  'tech', 'technology', 'programming', 'developer', 'coding', 'software',
  'ai', 'artificial intelligence', 'machine learning', 'data science',
  'javascript', 'python', 'react', 'nodejs', 'web development',
  'startup', 'innovation', 'digital', 'blockchain', 'crypto',
  'cybersecurity', 'cloud', 'devops', 'agile', 'scrum',
  'ux', 'ui', 'design', 'product management', 'fintech',
  'iot', 'robotics', 'vr', 'ar', 'virtual reality', 'augmented reality',
  'networking', 'conference', 'hackathon', 'meetup', 'workshop'
];

// Tech-related terms to identify tech events in title/description
export const techIdentifiers = [
  'tech', 'dev', 'code', 'programming', 'software', 'ai', 'ml',
  'data', 'digital', 'startup', 'innovation', 'cyber', 'cloud',
  'javascript', 'python', 'react', 'angular', 'vue', 'node',
  'java', 'php', 'ruby', 'golang', 'rust', 'kotlin', 'swift',
  'blockchain', 'crypto', 'fintech', 'api', 'database', 'sql',
  'nosql', 'mongodb', 'postgresql', 'docker', 'kubernetes',
  'aws', 'azure', 'google cloud', 'devops', 'ci/cd', 'git',
  'agile', 'scrum', 'product', 'ux', 'ui', 'design thinking',
  'hackathon', 'coderdojo', 'developer', 'engineer', 'architect',
  'frontend', 'backend', 'fullstack', 'mobile', 'app development',
  'open source', 'github', 'gitlab', 'bitbucket', 'version control',
  'microservices', 'serverless', 'lambda', 'containers', 'orchestration',
  'machine learning', 'deep learning', 'neural networks', 'nlp',
  'computer vision', 'data mining', 'big data', 'analytics'
];

// Programming languages and frameworks
export const programmingTerms = [
  'javascript', 'typescript', 'python', 'java', 'c#', 'c++', 'go',
  'rust', 'kotlin', 'swift', 'php', 'ruby', 'scala', 'r',
  'react', 'vue', 'angular', 'svelte', 'next.js', 'nuxt',
  'node.js', 'express', 'fastify', 'django', 'flask', 'spring',
  'laravel', 'symfony', 'rails', '.net', 'asp.net'
];

// Tech event types
export const techEventTypes = [
  'hackathon', 'bootcamp', 'workshop', 'seminar', 'webinar',
  'conference', 'summit', 'meetup', 'networking', 'training',
  'certification', 'demo day', 'pitch', 'accelerator', 'incubator'
];

// Function to check if an event is tech-related
export function isTechEvent(title, description = '') {
  const text = `${title} ${description}`.toLowerCase();
  
  return techIdentifiers.some(term => text.includes(term.toLowerCase())) ||
         programmingTerms.some(term => text.includes(term.toLowerCase())) ||
         techEventTypes.some(term => text.includes(term.toLowerCase()));
}

// Function to extract tech tags from event content
export function extractTechTags(title, description = '') {
  const text = `${title} ${description}`.toLowerCase();
  const foundTags = [];
  
  [...techIdentifiers, ...programmingTerms, ...techEventTypes].forEach(term => {
    if (text.includes(term.toLowerCase())) {
      // Capitalize first letter
      const tag = term.charAt(0).toUpperCase() + term.slice(1);
      if (!foundTags.includes(tag)) {
        foundTags.push(tag);
      }
    }
  });
  
  return foundTags;
}