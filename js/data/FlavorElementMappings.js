// FlavorElementMappings.js
// Comprehensive mapping of tea flavor profiles to the Five Elements

// Each flavor is mapped to elements with weights (summing to 1.0)
// This allows nuanced multi-element flavor associations
export const flavorElementMappings = {
  // PRIMARY FLAVOR CATEGORIES
  
  // SWEET FLAVORS - Primary Earth Element
  "sweet": { earth: 0.8, water: 0.2 },
  "honey": { earth: 0.7, fire: 0.2, wood: 0.1 },
  "caramel": { earth: 0.6, fire: 0.4 },
  "malty": { earth: 0.7, fire: 0.3 },
  "chocolate": { earth: 0.6, water: 0.3, fire: 0.1 },
  "vanilla": { earth: 0.8, water: 0.2 },
  "toffee": { earth: 0.6, fire: 0.4 },
  "maple": { earth: 0.6, wood: 0.2, fire: 0.2 },
  "brown sugar": { earth: 0.7, fire: 0.3 },
  "molasses": { earth: 0.5, water: 0.3, fire: 0.2 },
  
  // SOUR FLAVORS - Primary Wood Element
  "sour": { wood: 0.8, fire: 0.2 },
  "tart": { wood: 0.7, metal: 0.2, fire: 0.1 },
  "citrusy": { wood: 0.6, fire: 0.3, metal: 0.1 },
  "lemony": { wood: 0.7, metal: 0.2, fire: 0.1 },
  "grapefruit": { wood: 0.6, metal: 0.3, water: 0.1 },
  "lime": { wood: 0.8, metal: 0.2 },
  "acidic": { wood: 0.7, metal: 0.3 },
  "tangy": { wood: 0.6, earth: 0.2, metal: 0.2 },
  "vinegary": { wood: 0.9, metal: 0.1 },
  
  // BITTER FLAVORS - Primary Fire Element
  "bitter": { fire: 0.8, wood: 0.1, metal: 0.1 },
  "char": { fire: 0.9, metal: 0.1 },
  "burnt": { fire: 0.8, metal: 0.2 },
  "coffee": { fire: 0.6, earth: 0.2, water: 0.2 },
  "cocoa": { fire: 0.5, earth: 0.3, water: 0.2 },
  "dark chocolate": { fire: 0.5, earth: 0.3, water: 0.2 },
  "roasted": { fire: 0.7, earth: 0.2, metal: 0.1 },
  "smoky": { fire: 0.8, metal: 0.1, water: 0.1 },
  "medicinal": { fire: 0.6, metal: 0.3, wood: 0.1 },
  "tobacco": { fire: 0.5, water: 0.3, earth: 0.2 },
  
  // SALTY FLAVORS - Primary Water Element
  "salty": { water: 0.9, earth: 0.1 },
  "briny": { water: 0.8, metal: 0.1, earth: 0.1 },
  "mineral": { water: 0.6, metal: 0.4 },
  "sea-like": { water: 0.9, metal: 0.1 },
  "umami": { water: 0.5, earth: 0.4, metal: 0.1 },
  "savory": { water: 0.5, earth: 0.3, fire: 0.2 },
  
  // PUNGENT/SPICY FLAVORS - Primary Metal Element
  "pungent": { metal: 0.8, fire: 0.2 },
  "spicy": { metal: 0.6, fire: 0.4 },
  "peppery": { metal: 0.7, fire: 0.3 },
  "ginger": { metal: 0.6, fire: 0.3, wood: 0.1 },
  "clove": { metal: 0.7, fire: 0.2, earth: 0.1 },
  "cinnamon": { metal: 0.5, fire: 0.4, earth: 0.1 },
  "cardamom": { metal: 0.6, wood: 0.2, earth: 0.2 },
  "anise": { metal: 0.6, fire: 0.2, water: 0.2 },
  "licorice": { metal: 0.4, earth: 0.4, water: 0.2 },
  "camphor": { metal: 0.7, water: 0.3 },
  "menthol": { metal: 0.6, water: 0.4 },
  
  // SECONDARY FLAVOR CATEGORIES
  
  // FLORAL FLAVORS - Mixed Elements
  "floral": { wood: 0.4, metal: 0.4, fire: 0.2 },
  "jasmine": { metal: 0.5, wood: 0.3, water: 0.2 },
  "orchid": { metal: 0.5, wood: 0.3, water: 0.2 },
  "rose": { metal: 0.4, fire: 0.3, wood: 0.3 },
  "chrysanthemum": { metal: 0.5, wood: 0.3, water: 0.2 },
  "magnolia": { metal: 0.4, water: 0.3, wood: 0.3 },
  "lilac": { metal: 0.5, wood: 0.3, water: 0.2 },
  "osmanthus": { metal: 0.4, earth: 0.3, wood: 0.3 },
  "lavender": { metal: 0.5, water: 0.3, wood: 0.2 },
  "chamomile": { water: 0.5, earth: 0.3, metal: 0.2 },
  "geranium": { metal: 0.5, wood: 0.3, fire: 0.2 },
  
  // FRUITY FLAVORS - Mostly Wood with others
  "fruity": { wood: 0.6, fire: 0.2, earth: 0.2 },
  "apple": { wood: 0.5, earth: 0.3, metal: 0.2 },
  "pear": { wood: 0.5, earth: 0.3, water: 0.2 },
  "peach": { wood: 0.5, earth: 0.3, fire: 0.2 },
  "apricot": { wood: 0.5, fire: 0.3, earth: 0.2 },
  "plum": { wood: 0.5, water: 0.3, earth: 0.2 },
  "cherry": { wood: 0.5, fire: 0.3, earth: 0.2 },
  "berry": { wood: 0.6, fire: 0.2, water: 0.2 },
  "currant": { wood: 0.7, fire: 0.2, water: 0.1 },
  "raisin": { earth: 0.5, fire: 0.3, wood: 0.2 },
  "fig": { earth: 0.6, water: 0.3, wood: 0.1 },
  "date": { earth: 0.6, water: 0.3, fire: 0.1 },
  "tropical": { wood: 0.5, fire: 0.3, water: 0.2 },
  "citrus": { wood: 0.6, metal: 0.2, fire: 0.2 },
  "orange": { wood: 0.5, fire: 0.3, earth: 0.2 },
  "lemon": { wood: 0.7, metal: 0.3 },
  "lychee": { wood: 0.5, water: 0.3, fire: 0.2 },
  "pineapple": { wood: 0.5, fire: 0.3, earth: 0.2 },
  "mango": { wood: 0.4, fire: 0.3, earth: 0.3 },
  "passion fruit": { wood: 0.6, fire: 0.3, water: 0.1 },
  "melon": { wood: 0.4, water: 0.4, earth: 0.2 },
  "grape": { wood: 0.5, water: 0.3, earth: 0.2 },
  "muscatel": { wood: 0.5, fire: 0.3, metal: 0.2 },
  "stone fruit": { wood: 0.5, earth: 0.3, fire: 0.2 },
  
  // VEGETAL FLAVORS - Mostly Wood
  "vegetal": { wood: 0.8, water: 0.1, earth: 0.1 },
  "grassy": { wood: 0.9, earth: 0.1 },
  "green": { wood: 0.8, water: 0.1, metal: 0.1 },
  "leafy": { wood: 0.8, earth: 0.1, water: 0.1 },
  "herbaceous": { wood: 0.7, metal: 0.2, water: 0.1 },
  "hay": { wood: 0.6, earth: 0.3, metal: 0.1 },
  "straw": { wood: 0.5, earth: 0.4, metal: 0.1 },
  "bamboo": { wood: 0.7, water: 0.2, earth: 0.1 },
  "cucumber": { wood: 0.6, water: 0.4 },
  "spinach": { wood: 0.8, water: 0.2 },
  "kale": { wood: 0.7, earth: 0.2, metal: 0.1 },
  "artichoke": { wood: 0.6, earth: 0.2, water: 0.2 },
  "asparagus": { wood: 0.7, water: 0.2, metal: 0.1 },
  "celery": { wood: 0.6, water: 0.3, metal: 0.1 },
  "zucchini": { wood: 0.6, water: 0.3, earth: 0.1 },
  
  // NUTTY FLAVORS - Earth and Water
  "nutty": { earth: 0.6, water: 0.3, fire: 0.1 },
  "almond": { earth: 0.6, water: 0.3, metal: 0.1 },
  "walnut": { earth: 0.5, water: 0.4, metal: 0.1 },
  "hazelnut": { earth: 0.6, fire: 0.2, water: 0.2 },
  "chestnut": { earth: 0.7, water: 0.2, wood: 0.1 },
  "pecan": { earth: 0.6, fire: 0.2, water: 0.2 },
  "coconut": { earth: 0.4, water: 0.4, wood: 0.2 },
  "roasted nut": { earth: 0.5, fire: 0.4, water: 0.1 },
  
  // TOASTY FLAVORS - Fire and Earth
  "toasty": { fire: 0.5, earth: 0.4, metal: 0.1 },
  "baked bread": { earth: 0.6, fire: 0.3, metal: 0.1 },
  "pastry": { earth: 0.7, fire: 0.2, metal: 0.1 },
  "graham cracker": { earth: 0.6, fire: 0.3, wood: 0.1 },
  "toast": { fire: 0.5, earth: 0.4, metal: 0.1 },
  "biscuit": { earth: 0.7, fire: 0.2, metal: 0.1 },
  "cereal": { earth: 0.6, wood: 0.2, fire: 0.2 },
  "grain": { earth: 0.7, wood: 0.2, metal: 0.1 },
  "rice": { earth: 0.7, water: 0.2, metal: 0.1 },
  "barley": { earth: 0.6, wood: 0.3, metal: 0.1 },
  "wheat": { earth: 0.7, wood: 0.2, metal: 0.1 },
  
  // EARTHY FLAVORS - Earth and Water
  "earthy": { earth: 0.5, water: 0.5 },
  "soil": { earth: 0.7, water: 0.3 },
  "mineral soil": { earth: 0.5, water: 0.3, metal: 0.2 },
  "forest floor": { earth: 0.5, water: 0.4, wood: 0.1 },
  "petrichor": { water: 0.5, earth: 0.3, metal: 0.2 },
  "mushroom": { earth: 0.5, water: 0.4, wood: 0.1 },
  "truffle": { earth: 0.4, water: 0.4, wood: 0.2 },
  "moss": { water: 0.5, wood: 0.3, earth: 0.2 },
  "loam": { earth: 0.6, water: 0.3, wood: 0.1 },
  "compost": { earth: 0.5, water: 0.3, wood: 0.2 },
  "peat": { earth: 0.5, water: 0.3, fire: 0.2 },
  
  // MINERAL FLAVORS - Metal and Water
  "mineral": { metal: 0.6, water: 0.4 },
  "wet stone": { metal: 0.5, water: 0.5 },
  "flint": { metal: 0.7, water: 0.2, fire: 0.1 },
  "slate": { metal: 0.7, water: 0.3 },
  "limestone": { metal: 0.6, earth: 0.2, water: 0.2 },
  "chalky": { metal: 0.6, earth: 0.3, water: 0.1 },
  "metallic": { metal: 0.9, water: 0.1 },
  
  // WOODY FLAVORS - Water and Wood
  "woody": { water: 0.5, wood: 0.4, earth: 0.1 },
  "oak": { water: 0.4, wood: 0.4, earth: 0.2 },
  "pine": { wood: 0.5, water: 0.3, metal: 0.2 },
  "cedar": { wood: 0.4, water: 0.4, metal: 0.2 },
  "sandalwood": { water: 0.5, wood: 0.3, fire: 0.2 },
  "bark": { water: 0.5, wood: 0.4, earth: 0.1 },
  "autumn leaves": { water: 0.4, metal: 0.3, wood: 0.3 },
  "eucalyptus": { wood: 0.4, metal: 0.3, water: 0.3 },
  
  // MARINE FLAVORS - Water and Metal
  "marine": { water: 0.8, metal: 0.2 },
  "seaweed": { water: 0.7, wood: 0.2, metal: 0.1 },
  "oceanic": { water: 0.8, metal: 0.2 },
  "fishy": { water: 0.8, metal: 0.1, earth: 0.1 },
  "kelp": { water: 0.6, wood: 0.3, metal: 0.1 },
  "iodine": { water: 0.6, metal: 0.4 },
  
  // LEATHER/ANIMAL FLAVORS - Water and Fire
  "leather": { water: 0.4, fire: 0.3, earth: 0.3 },
  "meaty": { water: 0.4, fire: 0.4, earth: 0.2 },
  "gamey": { water: 0.5, fire: 0.4, earth: 0.1 },
  "barnyard": { earth: 0.5, water: 0.3, fire: 0.2 },
  
  // DAIRY FLAVORS - Earth and Water
  "creamy": { earth: 0.6, water: 0.4 },
  "buttery": { earth: 0.7, water: 0.2, fire: 0.1 },
  "milky": { earth: 0.6, water: 0.4 },
  "yogurt": { earth: 0.5, water: 0.3, wood: 0.2 },
  
  // HERBAL/MEDICINAL FLAVORS - Mixed Elements
  "herbal": { wood: 0.4, metal: 0.3, water: 0.3 },
  "mint": { metal: 0.5, water: 0.3, wood: 0.2 },
  "basil": { wood: 0.5, metal: 0.3, fire: 0.2 },
  "thyme": { wood: 0.4, metal: 0.4, fire: 0.2 },
  "sage": { wood: 0.3, metal: 0.4, water: 0.3 },
  "rosemary": { wood: 0.3, metal: 0.4, fire: 0.3 },
  "dill": { wood: 0.5, metal: 0.3, water: 0.2 },
  "eucalyptus": { metal: 0.5, water: 0.3, wood: 0.2 },
  
  // FERMENTED FLAVORS - Earth and Water with transformation (Fire)
  "fermented": { earth: 0.4, water: 0.4, fire: 0.2 },
  "yeasty": { earth: 0.5, fire: 0.3, water: 0.2 },
  "sourdough": { earth: 0.4, wood: 0.3, fire: 0.3 },
  "cheese": { earth: 0.4, water: 0.3, fire: 0.3 },
  
  // ALCOHOLIC FLAVORS - Fire and Water
  "wine": { fire: 0.4, water: 0.4, wood: 0.2 },
  "whiskey": { fire: 0.5, water: 0.3, wood: 0.2 },
  "rum": { fire: 0.4, earth: 0.3, water: 0.3 },
  "bourbon": { fire: 0.5, earth: 0.3, water: 0.2 },
  "brandy": { fire: 0.4, earth: 0.3, water: 0.3 },
  
  // RESINOUS FLAVORS - Wood and Fire
  "resin": { wood: 0.5, fire: 0.3, water: 0.2 },
  "sap": { wood: 0.7, water: 0.2, earth: 0.1 },
  "pine sap": { wood: 0.6, metal: 0.2, water: 0.2 },
  
  // MISCELLANEOUS FLAVORS
  "astringent": { wood: 0.4, metal: 0.4, fire: 0.2 },
  "tannic": { wood: 0.5, metal: 0.3, fire: 0.2 },
  "bright": { fire: 0.4, wood: 0.3, metal: 0.3 },
  "clean": { metal: 0.6, water: 0.3, wood: 0.1 },
  "crisp": { metal: 0.5, wood: 0.3, water: 0.2 },
  "fresh": { wood: 0.5, water: 0.3, metal: 0.2 },
  "round": { earth: 0.6, water: 0.3, fire: 0.1 },
  "balanced": { earth: 0.5, water: 0.2, wood: 0.2, fire: 0.05, metal: 0.05 },
  "complex": { water: 0.3, earth: 0.3, wood: 0.2, fire: 0.1, metal: 0.1 },
  "full-bodied": { earth: 0.5, fire: 0.3, water: 0.2 },
  "light": { metal: 0.4, wood: 0.3, water: 0.3 },
  "lingering": { water: 0.4, earth: 0.3, fire: 0.3 },
  "brisk": { wood: 0.5, fire: 0.3, metal: 0.2 },
  "dry": { metal: 0.5, fire: 0.3, wood: 0.2 },
  "clean finish": { metal: 0.6, water: 0.3, wood: 0.1 },
  "umami": { water: 0.5, earth: 0.4, metal: 0.1 },
  "juicy": { wood: 0.6, water: 0.3, earth: 0.1 }
}