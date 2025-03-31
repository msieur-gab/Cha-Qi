// FlavorMappings.js
// Core data definitions for flavor to element mappings in TCM

// Five basic TCM flavors and their primary element mappings
export const tcmFlavorElements = {
  sour: { wood: 0.95, fire: 0.0, earth: 0.0, metal: 0.0, water: 0.05 },
  bitter: { fire: 0.95, earth: 0.0, wood: 0.05, metal: 0.0, water: 0.0 },
  sweet: { earth: 0.95, fire: 0.0, wood: 0.0, metal: 0.0, water: 0.05 },
  pungent: { metal: 0.95, fire: 0.05, wood: 0.0, earth: 0.0, water: 0.0 },
  salty: { water: 0.9, metal: 0.0, earth: 0.05, wood: 0.05, fire: 0.0 }
};

// Flavor wheel categories and their TCM flavor associations
export const flavorWheelCategories = {
  fruity: {
    tcmFlavor: "sweet",
    secondaryTcmFlavor: "sour",
    distribution: { sweet: 0.7, sour: 0.3 }
  },
  floral: {
    tcmFlavor: "pungent",
    secondaryTcmFlavor: "sweet",
    distribution: { pungent: 0.6, sweet: 0.4 }
  },
  vegetal: {
    // Adjusted to emphasize bitter more strongly
    tcmFlavor: "bitter",
    secondaryTcmFlavor: "sweet",
    distribution: { bitter: 0.7, sweet: 0.3 }
  },
  // New category for fresh vegetal notes with Wood (sour) primary
  green_vegetal: {
    tcmFlavor: "sour",
    secondaryTcmFlavor: "bitter",
    // Strengthened Wood element for green tea characteristics
    distribution: { sour: 0.8, bitter: 0.1, sweet: 0.1 }
  },
  spicy: {
    tcmFlavor: "pungent",
    secondaryTcmFlavor: "bitter",
    distribution: { pungent: 0.95, bitter: 0.05 }
  },
  woody: {
    tcmFlavor: "bitter",
    secondaryTcmFlavor: "sour",
    distribution: { bitter: 0.7, sour: 0.3 }
  },
  earthy: {
    tcmFlavor: "sweet",
    secondaryTcmFlavor: "salty",
    distribution: { sweet: 0.7, salty: 0.3 }
  },
  nutty: {
    tcmFlavor: "sweet",
    secondaryTcmFlavor: "bitter",
    distribution: { sweet: 0.7, bitter: 0.3 }
  },
  animal: {
    tcmFlavor: "salty",
    secondaryTcmFlavor: "bitter",
    distribution: { salty: 0.7, bitter: 0.3 }
  },
  marine: {
    tcmFlavor: "salty",
    secondaryTcmFlavor: "sour", // Changed from "pungent" to "sour" for Wood element
    // Adjusted distribution to include Wood component for green teas
    distribution: { salty: 0.7, sour: 0.3 }
  },
  mineral: {
    tcmFlavor: "salty",
    secondaryTcmFlavor: "pungent",
    // Strengthened salty association for mineral flavors to emphasize Water element
    distribution: { salty: 0.95, pungent: 0.05 }
  },
  roasted: {
    tcmFlavor: "bitter",
    secondaryTcmFlavor: "sweet",
    distribution: { bitter: 0.7, sweet: 0.3 }
  },
  citrus: {
    tcmFlavor: "sour",
    secondaryTcmFlavor: "sweet",
    distribution: { sour: 0.9, sweet: 0.1 }
  },
  // Revised aged category to emphasize Earth (sweet) due to fermentation
  aged: {
    tcmFlavor: "sweet",
    secondaryTcmFlavor: "bitter",
    distribution: { sweet: 0.6, bitter: 0.3, pungent: 0.1 }
  },
  tobacco: {
    tcmFlavor: "bitter",
    secondaryTcmFlavor: "pungent",
    distribution: { bitter: 0.7, pungent: 0.3 }
  },
  caramel: {
    tcmFlavor: "sweet",
    secondaryTcmFlavor: "bitter",
    distribution: { sweet: 0.9, bitter: 0.1 }
  },
  umami: {
    tcmFlavor: "salty",
    secondaryTcmFlavor: "sour", // Changed from "sweet" to "sour" (Wood) based on TCM wheel observations
    // Revised umami mapping with flavor interaction effects
    distribution: { salty: 0.6, sour: 0.3, sweet: 0.1 }
  }
};

// Map specific flavor notes to their flavor wheel category
export const flavorNoteToCategory = {
  // Fruity notes
  "apple": "fruity",
  "berry": "fruity",
  "peach": "fruity",
  "pear": "fruity",
  "tropical": "fruity",
  "cherry": "fruity",
  "plum": "fruity",
  "apricot": "fruity",
  "currant": "fruity",
  "grape": "fruity",
  "melon": "fruity",
  "pineapple": "fruity",
  "mango": "fruity",
  "passion fruit": "fruity",
  "lychee": "fruity",
  "fruity": "fruity",
  "raisin": "fruity",
  "fig": "fruity",
  "date": "fruity",
  "muscatel": "fruity",
  "stone fruit": "fruity",
  "dried fruit": "fruity",
  
  // Citrus notes (separated from fruity for stronger sour association)
  "citrus": "citrus",
  "lemon": "citrus",
  "orange": "citrus",
  "lime": "citrus",
  "grapefruit": "citrus",
  "bergamot": "citrus",
  "yuzu": "citrus",
  "tangerine": "citrus",
  "mandarin": "citrus",
  
  // Floral notes
  "jasmine": "floral",
  "rose": "floral",
  "orchid": "floral",
  "chrysanthemum": "floral",
  "osmanthus": "floral",
  "lavender": "floral",
  "geranium": "floral",
  "floral": "floral",
  "flower": "floral",
  "blossom": "floral",
  "magnolia": "floral",
  "lilac": "floral",
  "chamomile": "floral",
  "bloom": "floral",
  
  // Vegetal notes - more mature/cooked vegetation with bitter emphasis
  "artichoke": "vegetal",
  "spinach": "vegetal",
  "kale": "vegetal",
  "asparagus": "vegetal",
  "celery": "vegetal",
  "zucchini": "vegetal",
  "cooked greens": "vegetal",
  "cooked vegetal": "vegetal",
  
  // Green vegetal notes - fresher vegetation with sour emphasis (Wood)
  // Changed "vegetal" from "vegetal" to "green_vegetal" for Wood element emphasis
  "vegetal": "green_vegetal",
  "green": "green_vegetal",
  "grassy": "green_vegetal", 
  "fresh": "green_vegetal",
  "leafy": "green_vegetal",
  "herbaceous": "green_vegetal",
  "cucumber": "green_vegetal",
  "bamboo": "green_vegetal",
  "hay": "green_vegetal",
  "straw": "green_vegetal",
  "herb": "green_vegetal",
  "young": "green_vegetal",
  "spring": "green_vegetal",
  "green bean": "green_vegetal",  // Added based on TCM Flavor Wheel
  "bamboo leaf": "green_vegetal", // Added based on TCM Flavor Wheel
  "fresh vegetal": "green_vegetal",
  
  // Spicy notes - increased pungent association
  "cinnamon": "spicy",
  "pepper": "spicy",
  "peppery": "spicy",
  "clove": "spicy",
  "cardamom": "spicy",
  "ginger": "spicy",
  "spicy": "spicy",
  "spice": "spicy",
  "anise": "spicy",
  "licorice": "spicy",
  "camphor": "spicy",
  "menthol": "spicy",
  "sharp": "spicy",
  "peppercorn": "spicy",
  
  // Woody notes
  "woody": "woody",
  "oak": "woody",
  "cedar": "woody",
  "pine": "woody",
  "bark": "woody",
  "wood": "woody",
  "forest": "woody",
  "stem": "woody",
  "sandalwood": "woody",
  "eucalyptus": "woody",
  
  // Earthy notes
  "earthy": "earthy",
  "soil": "earthy",
  "forest floor": "earthy",
  "mushroom": "earthy",
  "moss": "earthy",
  "loam": "earthy",
  "compost": "earthy",
  "earth": "earthy",
  "dirt": "earthy",
  "peat": "earthy",
  "truffle": "earthy",
  "petrichor": "earthy",
  
  // Nutty notes
  "nutty": "nutty",
  "almond": "nutty",
  "hazelnut": "nutty",
  "walnut": "nutty",
  "chestnut": "nutty",
  "pecan": "nutty",
  "nut": "nutty",
  "coconut": "nutty",
  
  // Animal notes
  "leather": "animal",
  "gamey": "animal",
  "barnyard": "animal",
  "animal": "animal",
  
  // Marine notes
  "marine": "marine",
  "seaweed": "marine",
  "oceanic": "marine",
  "fishy": "marine",
  "algae": "marine",    // Added based on TCM Flavor Wheel
  "fish": "marine",     // Added based on TCM Flavor Wheel
  "seafood": "marine",  // Added based on TCM Flavor Wheel
  
  // Added umami-related terms to umami category
  "umami": "umami",
  "savory": "umami",
  "brothy": "umami",
  "meaty": "umami",
  "rich": "umami"
};

// Direct TCM flavor assignments
export const directTcmFlavors = {
  "sour": "sour",
  "bitter": "bitter",
  "sweet": "sweet", 
  "pungent": "pungent",
  "salty": "salty",
  "briny": "salty", // Directly map briny to salty for Water element
  "astringent": "sour",
  "tart": "sour",
  "tangy": "sour",
  "acidic": "sour",
  "spicy": "pungent",
  "hot": "pungent",
  "acrid": "pungent",
  "saline": "salty",
  "umami": "salty" // Default mapping (can be context-modified)
};

// Special tea flavor combinations with known element affinities
export const flavorCombinationElements = {
  // Japanese Green Tea Combinations
  "gyokuro": { 
    // High-grade Japanese green tea (umami + marine + vegetal)
    flavors: ["umami", "marine", "seaweed", "vegetal", "grassy", "green"],
    elements: { 
      wood: 0.70,  // Dominant Wood (fresh, green)
      water: 0.20, // Supporting Water (umami, marine)
      earth: 0.05, // Minor Earth (subtle sweetness)
      metal: 0.05, // Minimal Metal
      fire: 0.00   // Virtually no Fire (no roasting)
    }
  },
  "sencha": {
    // Japanese green tea (grassy + sweet + astringent)
    flavors: ["grassy", "fresh", "green", "vegetal", "sweet"],
    elements: { 
      wood: 0.65,  // Strong Wood (fresh, grassy)
      earth: 0.15, // Moderate Earth (sweet notes)
      metal: 0.10, // Some Metal (light astringency)
      water: 0.10, // Minor Water
      fire: 0.00   // No Fire
    }
  },
  
  // Chinese Green Tea Combinations
  "dragonwell": {
    // Dragon Well / Longjing (chestnut + vegetal + buttery)
    flavors: ["chestnut", "nutty", "vegetal", "green", "buttery"],
    elements: { 
      wood: 0.55,  // Primary Wood (vegetal)
      earth: 0.25, // Strong Earth (nutty, sweet)
      metal: 0.10, // Some Metal (clean finish)
      fire: 0.05,  // Slight Fire (pan-firing)
      water: 0.05  // Minimal Water
    }
  },
  
  // White Tea Combinations
  "silver_needle": {
    // Silver Needle / Bai Hao Yinzhen (delicate + honeyed + hay)
    flavors: ["honey", "honeyed", "hay", "straw", "dried grass"],
    elements: { 
      metal: 0.40, // Primary Metal (delicate, clean)
      wood: 0.30,  // Strong Wood (fresh notes)
      earth: 0.25, // Significant Earth (honey sweetness)
      water: 0.05, // Minor Water
      fire: 0.00   // No Fire
    }
  },
  
  // Oolong Tea Combinations
  "high_mountain_oolong": {
    // Light Oolong / High Mountain (floral + creamy + fresh)
    flavors: ["floral", "orchid", "creamy", "buttery", "milk"],
    elements: { 
      metal: 0.35, // Primary Metal (floral, bright)
      earth: 0.30, // Strong Earth (creamy, sweet)
      wood: 0.20,  // Moderate Wood (fresh notes)
      fire: 0.10,  // Light Fire (light oxidation)
      water: 0.05  // Minor Water
    }
  },
  "roasted_oolong": {
    // Traditional Roasted Oolong (roasted + floral + mineral)
    flavors: ["roasted", "toasted", "floral", "orchid", "mineral"],
    elements: { 
      fire: 0.45,  // Primary Fire (roasted)
      earth: 0.25, // Strong Earth (underlying sweetness)
      metal: 0.20, // Moderate Metal (floral, mineral)
      wood: 0.05,  // Minor Wood
      water: 0.05  // Minor Water
    }
  },
  
  // Black Tea Combinations  
  "yunnan_black": {
    // Yunnan Black / Dian Hong (malty + honey + cocoa)
    flavors: ["malty", "malt", "honey", "sweet", "cocoa", "chocolate"],
    elements: { 
      fire: 0.45,  // Primary Fire (full oxidation)
      earth: 0.35, // Strong Earth (malty, honey)
      wood: 0.10,  // Minor Wood
      metal: 0.05, // Minimal Metal
      water: 0.05  // Minimal Water
    }
  },
  "assam": {
    // Assam / Strong Black (malty + astringent + brisk)
    flavors: ["malty", "malt", "astringent", "brisk", "strong"],
    elements: { 
      fire: 0.55,  // Dominant Fire (full oxidation, briskness)
      earth: 0.25, // Strong Earth (malty)
      metal: 0.15, // Moderate Metal (astringency)
      wood: 0.05,  // Minimal Wood
      water: 0.00  // No Water
    }
  },
  
  // Pu-erh Tea Combinations
  "shou_puerh": {
    // Shou/Ripe Pu-erh (earthy + woody + sweet)
    flavors: ["earthy", "earth", "soil", "compost", "woody", "wood"],
    elements: { 
      earth: 0.65, // Dominant Earth (earthy, composted)
      fire: 0.15,  // Moderate Fire (fermentation warmth)
      wood: 0.10,  // Light Wood (woody notes)
      water: 0.05, // Light Water (deep, heavy)
      metal: 0.05  // Small amount of Metal for clarity
    }
  },
  "sheng_puerh": {
    // Young Sheng/Raw Pu-erh (bitter + astringent + vegetal)
    flavors: ["bitter", "astringent", "vegetal", "green", "grass"],
    elements: { 
      fire: 0.40,  // Primary Fire (bitter, astringent)
      wood: 0.30,  // Strong Wood (vegetal, fresh)
      metal: 0.20, // Moderate Metal (bright, crisp)
      earth: 0.05, // Minimal Earth
      water: 0.05  // Minimal Water
    }
  }
};

export default {
  tcmFlavorElements,
  flavorWheelCategories,
  flavorNoteToCategory,
  directTcmFlavors,
  flavorCombinationElements
};