// ThermalMappings.js
// Mapping of tea components to thermal properties in TCM

export const ThermalMappings = {
  // Flavor thermal mappings (TCM basis)
  flavor: {
    // TCM Flavor mappings
    bitter: -0.3,  // Cooling
    sweet: 0.2,    // Warming
    sour: -0.2,    // Cooling
    pungent: 0.3,  // Warming
    salty: -0.1,   // Mildly cooling
    
    // Category mappings derived from TCM flavors
    fruity: 0.1,      // Generally warming (sweet with sour)
    floral: 0.0,      // Neutral (pungent with sweet)
    vegetal: -0.3,    // Cooling (bitter with sweet)
    green_vegetal: -0.3, // Cooling (sour with bitter)
    spicy: 0.4,       // Strongly warming (pungent)
    woody: -0.2,      // Cooling (bitter with sour)
    earthy: 0.0,      // Neutral (sweet with salty)
    nutty: 0.2,       // Warming (sweet with bitter)
    animal: 0.1,      // Mildly warming (salty with bitter)
    marine: -0.2,     // Cooling (salty with sour)
    mineral: -0.2,    // Cooling (salty with pungent)
    roasted: 0.3,     // Warming (bitter with sweet)
    citrus: -0.3,     // Cooling (sour with sweet)
    aged: 0.1,        // Mildly warming (sweet with bitter)
    tobacco: 0.2,     // Warming (bitter with pungent)
    caramel: 0.3,     // Warming (sweet with bitter)
    umami: -0.2       // Cooling (salty with sour)
  },
  
  // Processing thermal mappings
  processing: {
    // Oxidation levels
    "non-oxidized": -0.3,
    "minimally-oxidized": -0.3,
    "lightly-oxidized": -0.2,
    "medium-oxidized": 0.0,
    "highly-oxidized": 0.3,
    "fully-oxidized": 0.4,
    
    // Heat application methods
    "steamed": -0.2,
    "pan-fired": 0.2,
    "baked": 0.3,
    "roasted": 0.4,
    "charcoal-roasted": 0.5,
    "heavily-roasted": 0.6,
    "smoke-dried": 0.5,
    
    // Drying methods
    "sun-dried": 0.1,
    "shade-dried": -0.2,
    "oven-dried": 0.2,
    
    // Special processing methods
    "withered": -0.1,
    "fermented": 0.2,
    "aged": 0.1,
    "post-fermented": 0.2,
    "pile-fermented": 0.3,
    "wet-piled": 0.2,
    "yellowing": -0.1,
    
    // Specialty processing
    "shade-grown": -0.3,
    "bug-bitten": 0.0,
    "gaba-processed": -0.1,
    "kill-green": -0.1,
    "ground": 0.1,
    "CTC": 0.2,
    "orthodox": 0.0,
    "minimal-processing": -0.2
  },
  
  // Geography thermal mappings
  geography: {
    // Climate types
    "tropical": 0.3,
    "subtropical": 0.2,
    "temperate": 0.0,
    "alpine": -0.2,
    "arid": 0.2,
    "humid": -0.1,
    
    // Altitude
    "high-altitude": -0.2,
    "low-altitude": 0.1,
    "medium-altitude": 0.0,
    
    // Region (examples)
    "india-assam": 0.3,   // Hot, humid lowlands
    "india-darjeeling": -0.1, // Cooler high mountains
    "china-fujian": 0.1,
    "china-yunnan": 0.1,
    "japan": -0.2,
    "taiwan": 0.0,
    "kenya": 0.1,
    "sri-lanka": 0.2
  }
};

export default ThermalMappings;