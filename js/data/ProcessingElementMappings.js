// ProcessingElementMappings.js
// Mapping of tea processing methods to the Five Elements

export const processingElementMappings = {
  // OXIDATION LEVELS
  "non-oxidized": { 
    wood: 0.7, metal: 0.2, water: 0.1,
    description: "Preserves the fresh, green qualities of the leaf with minimal transformation",
    examples: ["Green tea", "Yellow tea"]
  },
  "minimally-oxidized": { 
    wood: 0.6, metal: 0.3, water: 0.1,
    description: "Very light oxidation that preserves fresh characteristics with subtle complexity",
    examples: ["White tea", "Some premium green teas"]
  },
  "lightly-oxidized": { 
    wood: 0.5, metal: 0.3, fire: 0.1, water: 0.1,
    description: "Allows subtle transformation while maintaining vegetal freshness",
    examples: ["Light oolong", "Some white teas"]
  },
  "medium-oxidized": { 
    wood: 0.2, fire: 0.3, earth: 0.3, metal: 0.2,
    description: "Creates balance between fresh qualities and deeper notes",
    examples: ["Traditional oolong", "Some white teas"]
  },
  "highly-oxidized": { 
    fire: 0.5, earth: 0.3, water: 0.1, wood: 0.1,
    description: "Transforms leaf substantially, developing rich character",
    examples: ["Dark oolong", "Some black teas"]
  },
  "fully-oxidized": { 
    fire: 0.7, earth: 0.2, water: 0.1,
    description: "Complete transformation of leaf compounds",
    examples: ["Black tea", "Some dark oolongs"]
  },
  
  // HEAT APPLICATION METHODS
  "steamed": { 
    water: 0.5, wood: 0.3, metal: 0.2,
    description: "Quick heat application with moisture that preserves green qualities",
    examples: ["Japanese green teas", "Some Chinese greens"]
  },
  "pan-fired": { 
    fire: 0.5, wood: 0.3, metal: 0.2,
    description: "Dry heat application that develops nutty-toasty notes while preserving some freshness",
    examples: ["Chinese green teas", "Some oolongs"]
  },
  "baked": { 
    fire: 0.5, earth: 0.3, wood: 0.2,
    description: "Slower heat application that develops deeper complexity",
    examples: ["Some oolongs", "Some black teas"]
  },
  "roasted": { 
    fire: 0.6, earth: 0.3, metal: 0.1,
    description: "Higher heat application that creates pronounced toasty character",
    examples: ["Roasted oolongs", "Hojicha"]
  },
  "charcoal-roasted": { 
    fire: 0.7, earth: 0.2, water: 0.1,
    description: "Traditional roasting method that imparts deep, smoky character",
    examples: ["Traditional Wuyi oolongs", "Some roasted Tieguanyin"]
  },
  "heavily-roasted": { 
    fire: 0.8, earth: 0.1, water: 0.1,
    description: "Prolonged roasting that creates pronounced roast character",
    examples: ["Dark roasted oolongs", "Some specialty teas"]
  },
  "smoke-dried": { 
    fire: 0.7, metal: 0.2, water: 0.1,
    description: "Drying over smoke that imparts distinctive smoky character",
    examples: ["Lapsang Souchong", "Some specialty black teas"]
  },
  
  // DRYING METHODS
  "sun-dried": { 
    fire: 0.2, wood: 0.4, metal: 0.3, earth: 0.1,
    description: "Natural drying that preserves compounds while adding subtle complexity",
    examples: ["White tea", "Some Pu-erh maocha"]
  },
  "shade-dried": { 
    wood: 0.4, water: 0.3, metal: 0.2, earth: 0.1,
    description: "Gentle drying that maximally preserves delicate compounds",
    examples: ["Some premium white teas", "Specialty hand-processed teas"]
  },
  "oven-dried": { 
    fire: 0.4, metal: 0.3, earth: 0.2, wood: 0.1,
    description: "Controlled drying that creates predictable results",
    examples: ["Many commercial teas", "Some specialty teas"]
  },
  
  // SHAPING/ROLLING METHODS
  "twisted": { 
    wood: 0.4, metal: 0.3, earth: 0.2, fire: 0.1,
    description: "Traditional shaping that concentrates flavors while maintaining leaf integrity",
    examples: ["Many oolongs", "Some black teas"]
  },
  "rolled": { 
    earth: 0.3, metal: 0.3, wood: 0.3, fire: 0.1,
    description: "Tight rolling that concentrates flavors and aromas",
    examples: ["Ball-shaped oolongs", "Gunpowder green"]
  },
  "compressed": { 
    earth: 0.5, water: 0.3, metal: 0.2,
    description: "Pressing tea into cakes, bricks, or other shapes for aging",
    examples: ["Pu-erh cakes", "Tea bricks"]
  },
  "flattened": { 
    metal: 0.4, wood: 0.3, earth: 0.2, fire: 0.1,
    description: "Processing that creates flat leaf shapes",
    examples: ["Dragonwell", "Tai Ping Hou Kui"]
  },
  
  // SPECIAL PROCESSING METHODS
  "withered": { 
    wood: 0.4, metal: 0.3, earth: 0.2, water: 0.1,
    description: "Initial soft wilting that begins flavor development",
    examples: ["Oolong", "Black tea", "White tea"]
  },
  "fermented": { 
    earth: 0.6, water: 0.25, fire: 0.15,
    description: "Microbial transformation that develops complex earthy character",
    examples: ["Shou Pu-erh", "Liu Bao", "Dark tea"]
  },
  "aged": { 
    water: 0.5, earth: 0.3, fire: 0.1, metal: 0.1,
    description: "Extended storage allowing natural transformation over time",
    examples: ["Aged white tea", "Aged oolong", "Sheng Pu-erh"]
  },
  "post-fermented": { 
    water: 0.5, earth: 0.3, wood: 0.1, fire: 0.1,
    description: "Category of teas allowed to transform through aging with microbial activity",
    examples: ["Pu-erh", "Liu Bao", "Fu brick"]
  },
  "pile-fermented": { 
    earth: 0.65, water: 0.25, fire: 0.1,
    description: "Accelerated fermentation through controlled moisture and heat",
    examples: ["Shou Pu-erh", "Some dark teas"]
  },
  "wet-piled": { 
    earth: 0.65, water: 0.25, fire: 0.1,
    description: "Traditional method for accelerating fermentation",
    examples: ["Shou Pu-erh", "Some Liu Bao"]
  },
  "wet-piling": { 
    earth: 0.65, water: 0.25, fire: 0.1,
    description: "Traditional method for accelerating fermentation",
    examples: ["Shou Pu-erh", "Some Liu Bao"]
  },
  "yellowing": { 
    wood: 0.4, earth: 0.4, fire: 0.1, metal: 0.1,
    description: "Unique slight oxidation with dampness and heat that develops mellow character",
    examples: ["Yellow tea"]
  },
  
  // SCENTING/FLAVORING METHODS
  "jasmine-scented": { 
    metal: 0.4, wood: 0.3, fire: 0.2, earth: 0.1,
    description: "Traditional scenting using fresh jasmine flowers",
    examples: ["Jasmine Pearls", "Jasmine Silver Needle"]
  },
  "flower-scented": { 
    metal: 0.4, wood: 0.3, earth: 0.2, fire: 0.1,
    description: "Traditional scenting using various flowers",
    examples: ["Rose tea", "Osmanthus oolong"]
  },
  "fumigated": { 
    fire: 0.4, metal: 0.4, wood: 0.1, water: 0.1,
    description: "Adding character through exposure to smoke or steam",
    examples: ["Lapsang Souchong", "Some specialty teas"]
  },
  
  // SPECIALTY PROCESSING
  "shade-grown": { 
    water: 0.4, wood: 0.3, metal: 0.2, earth: 0.1,
    description: "Growing tea under shade to increase amino acids and decrease tannins",
    examples: ["Gyokuro", "Kabusecha", "Matcha"]
  },
  "bug-bitten": { 
    wood: 0.4, fire: 0.3, earth: 0.2, water: 0.1,
    description: "Natural insect biting that triggers sweet honey notes",
    examples: ["Oriental Beauty", "Mi Xiang", "Some Gui Fei"]
  },
  "gaba-processed": { 
    water: 0.5, earth: 0.3, metal: 0.2,
    description: "Anaerobic processing that increases GABA content",
    examples: ["GABA oolong", "Some specialty teas"]
  },
  "kill-green": { 
    fire: 0.4, wood: 0.3, metal: 0.2, water: 0.1,
    description: "Initial heating that halts oxidation",
    examples: ["Green tea", "White tea"]
  },
  "ground": { 
    metal: 0.5, earth: 0.3, wood: 0.2,
    description: "Grinding tea leaves to powder",
    examples: ["Matcha", "Powdered teas"]
  },
  "CTC": { 
    metal: 0.6, fire: 0.3, earth: 0.1,
    description: "Crush-Tear-Curl machine processing for small, uniform particles",
    examples: ["Commercial black tea", "Tea bags"]
  },
  "orthodox": { 
    wood: 0.3, earth: 0.3, metal: 0.2, fire: 0.2,
    description: "Traditional whole-leaf processing methods",
    examples: ["Most premium teas", "Whole leaf teas"]
  },
  "minimal-processing": { 
    wood: 0.6, water: 0.2, metal: 0.2,
    description: "Limited processing to preserve natural leaf character",
    examples: ["White tea", "Some green teas"]
  }
};

export default {
  processingElementMappings
};
