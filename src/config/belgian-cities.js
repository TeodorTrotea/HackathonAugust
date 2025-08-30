// Belgian cities configuration for consistent scraping across all platforms

// Main Belgian cities to search for events
export const belgianCities = [
  'Brussels',
  'Antwerp', 
  'Ghent',
  'Bruges',
  'Leuven',
  'Namur',
  'Liege',
  'Charleroi',
  'Mons',
  'Kortrijk',
  'Ostend',
  'Hasselt',
  'Mechelen'
];

// All Belgian city names (including translations) for location validation
export const allBelgianCityNames = [
  // Dutch names
  'brussels', 'brussel', 'antwerp', 'antwerpen', 'ghent', 'gent', 'bruges', 'brugge',
  'leuven', 'namur', 'namen', 'liege', 'luik', 'charleroi', 'mons', 'bergen',
  'kortrijk', 'courtrai', 'ostend', 'oostende', 'hasselt', 'mechelen', 'malines',
  'aalst', 'alost', 'sint-niklaas', 'saint-nicolas', 'turnhout', 'roeselare', 'roulers',
  'wavre', 'waver', 'verviers', 'genk', 'seraing', 'mouscron', 'doornik', 'tournai',
  
  // French names
  'bruxelles', 'anvers', 'gand', 'louvain', 'liège', 'malines',
  
  // Regional names
  'flemish brabant', 'vlaams-brabant', 'walloon brabant', 'brabant wallon',
  'west flanders', 'west-vlaanderen', 'east flanders', 'oost-vlaanderen',
  'limburg', 'antwerp province', 'provincie antwerpen', 'hainaut', 'henegouwen',
  'luxembourg', 'luxemburg', 'namur province', 'provincie namen'
];

// Belgian regions and country identifiers
export const belgianRegions = [
  'belgium', 'belgique', 'belgië', 'flanders', 'vlaanderen', 'wallonia',
  'wallonie', 'brussels-capital', 'brussels capital region', 'région bruxelles-capitale',
  'brussels hoofdstedelijk gewest', 'flemish', 'walloon', 'belgian'
];

// Non-Belgian cities that should be excluded (major European cities)
export const nonBelgianCities = [
  // Netherlands
  'amsterdam', 'rotterdam', 'utrecht', 'eindhoven', 'tilburg', 'groningen',
  'almere', 'breda', 'nijmegen', 'enschede', 'haarlem', 'arnhem', 'zaanstad',
  'haarlemmermeer', 'den haag', 'the hague', 's-hertogenbosch', 'apeldoorn',
  
  // Germany
  'berlin', 'munich', 'münchen', 'hamburg', 'cologne', 'köln', 'frankfurt',
  'stuttgart', 'düsseldorf', 'dortmund', 'essen', 'leipzig', 'bremen',
  'dresden', 'hannover', 'nürnberg', 'nuremberg', 'duisburg', 'bochum',
  
  // France
  'paris', 'lyon', 'marseille', 'toulouse', 'nice', 'nantes', 'montpellier',
  'strasbourg', 'bordeaux', 'lille', 'rennes', 'reims', 'toulon', 'saint-étienne',
  'le havre', 'grenoble', 'dijon', 'angers', 'nîmes', 'villeurbanne',
  
  // United Kingdom
  'london', 'manchester', 'birmingham', 'leeds', 'glasgow', 'edinburgh',
  'liverpool', 'bristol', 'sheffield', 'cardiff', 'belfast', 'nottingham',
  'newcastle', 'brighton', 'hull', 'plymouth', 'stoke-on-trent', 'wolverhampton',
  
  // Other European cities
  'madrid', 'barcelona', 'valencia', 'seville', 'bilbao', 'rome', 'milan',
  'naples', 'turin', 'florence', 'zurich', 'geneva', 'basel', 'bern',
  'vienna', 'salzburg', 'graz', 'copenhagen', 'aarhus', 'odense',
  'stockholm', 'gothenburg', 'malmo', 'oslo', 'bergen', 'trondheim',
  'helsinki', 'tampere', 'turku', 'dublin', 'cork', 'galway',
  'lisbon', 'porto', 'athens', 'thessaloniki', 'prague', 'brno',
  'warsaw', 'krakow', 'gdansk', 'budapest', 'debrecen', 'bucharest',
  'cluj-napoca', 'sofia', 'plovdiv', 'zagreb', 'split', 'ljubljana',
  'maribor', 'bratislava', 'kosice'
];

// Helper function to check if a location is in Belgium
export function isLocationInBelgium(eventLocation, searchLocation = '') {
  const location = eventLocation.toLowerCase();
  const search = searchLocation.toLowerCase();
  
  // Check if location contains non-Belgian cities (immediate exclusion)
  for (const city of nonBelgianCities) {
    if (location.includes(city)) {
      return false;
    }
  }
  
  // Check if location contains Belgian city names
  for (const city of allBelgianCityNames) {
    if (location.includes(city)) {
      return true;
    }
  }
  
  // Check if location contains Belgian regions
  for (const region of belgianRegions) {
    if (location.includes(region)) {
      return true;
    }
  }
  
  // Check if it matches the search location
  if (search && location.includes(search)) {
    return true;
  }
  
  // If location is empty or very short, assume it's in the searched city
  if (location.length < 3) {
    return true;
  }
  
  // Default to false for unclear locations
  return false;
}

export default {
  belgianCities,
  allBelgianCityNames,
  belgianRegions,
  nonBelgianCities,
  isLocationInBelgium
};