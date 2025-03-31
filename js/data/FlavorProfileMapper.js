// FlavorProfileMapper.js
// Implements a hierarchical approach to mapping tea flavors to TCM elements

export class FlavorProfileMapper {
  constructor() {
    // Define the five basic TCM flavors and their primary element mappings
    // Updated to align with TCM Flavor Wheel observations
    this.tcmFlavorElements = {
      sour: { wood: 0.95, fire: 0.0, earth: 0.0, metal: 0.0, water: 0.05 },
      bitter: { fire: 0.95, earth: 0.0, wood: 0.05, metal: 0.0, water: 0.0 },
      sweet: { earth: 0.95, fire: 0.0, wood: 0.0, metal: 0.0, water: 0.05 },
      pungent: { metal: 0.95, fire: 0.05, wood: 0.0, earth: 0.0, water: 0.0 },
      salty: { water: 0.9, metal: 0.0, earth: 0.05, wood: 0.05, fire: 0.0 }
    };
    
    // Define flavor wheel categories and their TCM flavor associations
    this.flavorWheelCategories = {
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
    this.flavorNoteToCategory = {
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
    this.directTcmFlavors = {
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
  }
  
  // Helper method to check if a flavor profile contains any of the specified notes
  profileContainsAny(flavorNotes, notesToFind) {
    if (!flavorNotes || !notesToFind) return false;
    
    const normalizedNotes = flavorNotes.map(note => note.toLowerCase().trim());
    const normalizedFind = notesToFind.map(note => note.toLowerCase().trim());
    
    return normalizedNotes.some(note => normalizedFind.includes(note));
  }
  
  // Check if a flavor profile is predominantly salty or water-related
  isSaltyWaterProfile(flavorNotes) {
    if (!flavorNotes || flavorNotes.length === 0) return false;
    
    const waterKeywords = ["salty", "salt", "briny", "marine", "seaweed", "ocean", "sea", "kelp", "algae"];
    let waterCount = 0;
    
    flavorNotes.forEach(note => {
      const normalized = note.toLowerCase().trim();
      if (waterKeywords.includes(normalized) || 
          normalized.includes("salt") || 
          normalized.includes("sea") || 
          normalized.includes("brine")) {
        waterCount++;
      }
    });
    
    // If at least 2 water-related notes or more than 1/3 of profile is water-related
    return waterCount >= 2 || (waterCount / flavorNotes.length > 0.3);
  }
  
  /**
   * Detects common flavor combinations in famous teas and returns their TCM element affinities
   * @param {Array} flavors - Array of flavor descriptors
   * @return {Object|null} - Element distribution or null if no specific combination detected
   */
  getElementAffinityForCombination(flavors) {
    if (!flavors || !Array.isArray(flavors) || flavors.length < 2) {
      return null; // No combination to detect
    }
    
    // Normalize flavor array for consistent matching
    const normalizedFlavors = flavors.map(f => f.toLowerCase().trim());
    
    // Helper function to check for flavor matches
    const hasAnyFlavor = (targetFlavors) => 
      targetFlavors.some(f => normalizedFlavors.includes(f));
    
    const hasAllFlavors = (targetFlavors) => 
      targetFlavors.every(f => normalizedFlavors.includes(f));
      
    // ==========================================
    // Japanese Green Tea Combinations
    // ==========================================
    
    // Gyokuro / High-grade Sencha (Umami + Marine + Vegetal)
    if (hasAnyFlavor(["umami", "savory", "brothy"]) && 
        hasAnyFlavor(["marine", "seaweed", "oceanic"]) && 
        hasAnyFlavor(["vegetal", "green", "grassy"])) {
      return { 
        wood: 0.70,  // Dominant Wood (fresh, green)
        water: 0.20, // Supporting Water (umami, marine)
        earth: 0.05, // Minor Earth (subtle sweetness)
        metal: 0.05, // Minimal Metal
        fire: 0.00   // Virtually no Fire (no roasting)
      };
    }
    
    // Sencha (Grassy + Sweet + Light Astringent)
    if (hasAnyFlavor(["grassy", "fresh", "green"]) && 
        hasAnyFlavor(["sweet", "vegetable sweetness"]) && 
        !hasAnyFlavor(["roasted", "umami"])) {
      return { 
        wood: 0.65,  // Strong Wood (fresh, grassy)
        earth: 0.15, // Moderate Earth (sweet notes)
        metal: 0.10, // Some Metal (light astringency)
        water: 0.10, // Minor Water
        fire: 0.00   // No Fire
      };
    }
    
    // Kabusecha / Light-shaded Green (Balanced Umami + Vegetal)
    if (hasAnyFlavor(["umami", "savory"]) && 
        hasAnyFlavor(["vegetal", "green"]) && 
        !hasAnyFlavor(["roasted", "smoky", "woody"])) {
      return { 
        wood: 0.60,  // Dominant Wood
        water: 0.25, // Supporting Water
        earth: 0.10, // Minor Earth
        metal: 0.05, // Minimal Metal
        fire: 0.00   // No Fire
      };
    }
    
    // ==========================================
    // Chinese Green Tea Combinations
    // ==========================================
    
    // Dragon Well / Longjing (Chestnut + Vegetal + Buttery)
    if ((hasAnyFlavor(["chestnut", "nutty"]) && hasAnyFlavor(["vegetal", "green"])) || 
        hasAllFlavors(["chestnut", "buttery"])) {
      return { 
        wood: 0.55,  // Primary Wood (vegetal)
        earth: 0.25, // Strong Earth (nutty, sweet)
        metal: 0.10, // Some Metal (clean finish)
        fire: 0.05,  // Slight Fire (pan-firing)
        water: 0.05  // Minimal Water
      };
    }
    
    // Bi Luo Chun (Fruity + Floral + Vegetal)
    if (hasAnyFlavor(["fruity", "apricot", "peach"]) && 
        hasAnyFlavor(["floral", "orchid"]) && 
        hasAnyFlavor(["vegetal", "fresh"])) {
      return { 
        wood: 0.50,  // Wood (fresh, vegetal)
        earth: 0.25, // Earth (fruity sweetness)
        metal: 0.15, // Metal (floral aspects)
        water: 0.05, // Minimal Water
        fire: 0.05   // Minimal Fire
      };
    }
    
    // ==========================================
    // White Tea Combinations
    // ==========================================
    
    // Silver Needle / Bai Hao Yinzhen (Delicate + Honeyed + Hay)
    if (hasAnyFlavor(["honey", "honeyed", "nectar"]) && 
        hasAnyFlavor(["hay", "straw", "dried grass"]) && 
        !hasAnyFlavor(["roasted", "smoky"])) {
      return { 
        metal: 0.40, // Primary Metal (delicate, clean)
        wood: 0.30,  // Strong Wood (fresh notes)
        earth: 0.25, // Significant Earth (honey sweetness)
        water: 0.05, // Minor Water
        fire: 0.00   // No Fire
      };
    }
    
    // White Peony / Bai Mu Dan (Fruity + Floral + Hay)
    if (hasAnyFlavor(["fruity", "melon", "peach"]) && 
        hasAnyFlavor(["floral", "white flowers"]) && 
        hasAnyFlavor(["hay", "dried herbs"])) {
      return { 
        metal: 0.35, // Primary Metal (clean, bright)
        wood: 0.30,  // Strong Wood (fresh herb notes)
        earth: 0.30, // Strong Earth (fruit sweetness)
        water: 0.05, // Minor Water
        fire: 0.00   // No Fire 
      };
    }
    
    // Aged White Tea (Dried Fruit + Honey + Woody)
    if (hasAnyFlavor(["dried fruit", "raisin", "date"]) && 
        hasAnyFlavor(["honey", "sweet"]) && 
        hasAnyFlavor(["woody", "aged"])) {
      return { 
        earth: 0.40, // Primary Earth (dried fruit, honey)
        metal: 0.25, // Strong Metal (clean complexity)
        wood: 0.15,  // Moderate Wood (woody notes)
        fire: 0.15,  // Moderate Fire (aged character)
        water: 0.05  // Minor Water
      };
    }
    
    // ==========================================
    // Oolong Tea Combinations
    // ==========================================
    
    // Light Oolong / High Mountain (Floral + Creamy + Fresh)
    if (hasAnyFlavor(["floral", "orchid", "gardenia"]) && 
        hasAnyFlavor(["creamy", "buttery", "milk"]) && 
        !hasAnyFlavor(["roasted", "toasted", "charcoal"])) {
      return { 
        metal: 0.35, // Primary Metal (floral, bright)
        earth: 0.30, // Strong Earth (creamy, sweet)
        wood: 0.20,  // Moderate Wood (fresh notes)
        fire: 0.10,  // Light Fire (light oxidation)
        water: 0.05  // Minor Water
      };
    }
    
    // Traditional Tie Guan Yin (Roasted + Floral + Mineral)
    if (hasAnyFlavor(["roasted", "toasted"]) && 
        hasAnyFlavor(["floral", "orchid"]) && 
        hasAnyFlavor(["mineral"])) {
      return { 
        fire: 0.45,  // Primary Fire (roasted)
        earth: 0.25, // Strong Earth (underlying sweetness)
        metal: 0.20, // Moderate Metal (floral, mineral)
        wood: 0.05,  // Minor Wood
        water: 0.05  // Minor Water
      };
    }
    
    // Dan Cong Oolong (Fruity + Floral + Honey + Roast)
    if (hasAnyFlavor(["fruity", "peach", "apricot", "lychee"]) && 
        hasAnyFlavor(["floral", "orchid"]) && 
        hasAnyFlavor(["honey", "sweet"])) {
      // Check if it's heavily roasted
      const isRoasted = hasAnyFlavor(["roasted", "toasted", "charcoal"]);
      
      return isRoasted ? 
        { 
          fire: 0.40,  // Primary Fire (roast)
          earth: 0.25, // Strong Earth (fruit, honey)
          metal: 0.25, // Strong Metal (floral)
          wood: 0.05,  // Minor Wood
          water: 0.05  // Minor Water
        } : 
        { 
          metal: 0.35, // Primary Metal (floral)
          earth: 0.35, // Primary Earth (fruit, honey)
          fire: 0.15,  // Moderate Fire (light roast)
          wood: 0.10,  // Minor Wood
          water: 0.05  // Minor Water
        };
    }
    
    // ==========================================
    // Black Tea Combinations
    // ==========================================
    
    // Yunnan Black / Dian Hong (Malty + Honey + Cocoa)
    if (hasAnyFlavor(["malty", "malt"]) && 
        hasAnyFlavor(["honey", "sweet"]) && 
        hasAnyFlavor(["cocoa", "chocolate"])) {
      return { 
        fire: 0.45,  // Primary Fire (full oxidation)
        earth: 0.35, // Strong Earth (malty, honey)
        wood: 0.10,  // Minor Wood
        metal: 0.05, // Minimal Metal
        water: 0.05  // Minimal Water
      };
    }
    
    // Assam / Strong Black (Malty + Astringent + Brisk)
    if (hasAnyFlavor(["malty", "malt"]) && 
        hasAnyFlavor(["astringent", "brisk", "strong"])) {
      return { 
        fire: 0.55,  // Dominant Fire (full oxidation, briskness)
        earth: 0.25, // Strong Earth (malty)
        metal: 0.15, // Moderate Metal (astringency)
        wood: 0.05,  // Minimal Wood
        water: 0.00  // No Water
      };
    }
    
    // Darjeeling (Muscatel + Floral + Brisk)
    if (hasAnyFlavor(["muscatel", "grape", "wine"]) && 
        hasAnyFlavor(["floral", "fragrant"])) {
      return { 
        fire: 0.35,  // Primary Fire (oxidation)
        metal: 0.30, // Strong Metal (floral, bright)
        earth: 0.20, // Moderate Earth (grape sweetness)
        wood: 0.15,  // Light Wood (fresh quality)
        water: 0.00  // No Water
      };
    }
    
    // ==========================================
    // Pu-erh Tea Combinations
    // ==========================================
    
    // Shou/Ripe Pu-erh (Earthy + Woody + Sweet)
    if (hasAnyFlavor(["earthy", "earth", "soil", "compost"]) && 
        hasAnyFlavor(["woody", "wood"]) && 
        !hasAnyFlavor(["fruity", "floral"])) {
      return { 
        earth: 0.60, // Dominant Earth (earthy, composted)
        fire: 0.20,  // Moderate Fire (fermentation warmth)
        wood: 0.10,  // Light Wood (woody notes)
        water: 0.10, // Light Water (deep, heavy)
        metal: 0.00  // No Metal
      };
    }
    
    // Aged Sheng/Raw Pu-erh (Woody + Fruity + Medicinal)
    if (hasAnyFlavor(["woody", "wood"]) && 
        (hasAnyFlavor(["fruity", "apricot", "dried fruit"]) || 
         hasAnyFlavor(["medicinal", "herbal", "camphor"]))) {
      return { 
        earth: 0.40, // Primary Earth (aged sweetness)
        wood: 0.25,  // Strong Wood (woody character)
        fire: 0.20,  // Moderate Fire (aging warmth)
        water: 0.10, // Light Water (depth)
        metal: 0.05  // Minimal Metal (brightness)
      };
    }
    
    // Young Sheng/Raw Pu-erh (Bitter + Astringent + Vegetal)
    if (hasAnyFlavor(["bitter", "astringent"]) && 
        hasAnyFlavor(["vegetal", "green", "grass"])) {
      return { 
        fire: 0.40,  // Primary Fire (bitter, astringent)
        wood: 0.30,  // Strong Wood (vegetal, fresh)
        metal: 0.20, // Moderate Metal (bright, crisp)
        earth: 0.05, // Minimal Earth
        water: 0.05  // Minimal Water
      };
    }
    
    // ==========================================
    // Yellow Tea Combinations
    // ==========================================
    
    // Junshan Yinzhen / Yellow Tea (Mellow + Sweet + Hay)
    if (hasAnyFlavor(["mellow", "gentle"]) && 
        hasAnyFlavor(["sweet", "honey"]) && 
        hasAnyFlavor(["hay", "dried grass"])) {
      return { 
        earth: 0.45, // Primary Earth (mellow sweetness)
        wood: 0.30,  // Strong Wood (vegetal base)
        metal: 0.15, // Moderate Metal (clean)
        water: 0.05, // Minimal Water
        fire: 0.05   // Minimal Fire (slight oxidation)
      };
    }
    
    // ==========================================
    // General Flavor Profile Categories
    // ==========================================
    
    // Strong Umami Profile (Japanese Greens)
    if (hasAnyFlavor(["umami", "savory", "brothy"]) && 
        !hasAnyFlavor(["roasted", "smoky", "woody", "spicy"])) {
      return { 
        wood: 0.50,  // Strong Wood (fresh, green base)
        water: 0.35, // Strong Water (umami)
        earth: 0.10, // Light Earth (subtle sweetness)
        metal: 0.05, // Minimal Metal
        fire: 0.00   // No Fire
      };
    }
    
    // Heavy Roast Profile (Strong Fire Element)
    if ((hasAnyFlavor(["roasted", "charcoal", "smoky", "burnt"]) && 
         hasAnyFlavor(["dark", "deep", "strong"])) || 
        (normalizedFlavors.filter(f => f.includes("roast") || f.includes("char")).length >= 2)) {
      return { 
        fire: 0.60,  // Dominant Fire (roast, char)
        earth: 0.25, // Strong Earth (developed sweetness)
        metal: 0.05, // Minimal Metal
        wood: 0.05,  // Minimal Wood
        water: 0.05  // Minimal Water
      };
    }
    
    // Floral-Dominant Profile (Strong Metal Element)
    if (hasAnyFlavor(["floral", "flowers", "orchid", "jasmine", "rose"]) && 
        normalizedFlavors.filter(f => 
          f.includes("floral") || 
          f.includes("flower") || 
          f.includes("blossom")).length >= 2) {
      return { 
        metal: 0.50, // Dominant Metal (floral)
        earth: 0.25, // Strong Earth (sweet undertones)
        wood: 0.15,  // Moderate Wood (fresh aspects)
        fire: 0.05,  // Minimal Fire
        water: 0.05  // Minimal Water
      };
    }
    
    // Citrus-Dominant Profile (Strong Wood Element)
    if (normalizedFlavors.filter(f => 
        f.includes("citrus") || 
        f.includes("lemon") || 
        f.includes("orange") || 
        f.includes("bergamot")).length >= 2) {
      return { 
        wood: 0.60,  // Dominant Wood (sour, citrus)
        metal: 0.20, // Moderate Metal (bright, clean)
        earth: 0.15, // Light Earth (sweet undertones)
        fire: 0.05,  // Minimal Fire
        water: 0.00  // No Water
      };
    }
    
    // Earthy/Woody Dominant (Strong Earth Element)
    if (normalizedFlavors.filter(f => 
        f.includes("earth") || 
        f.includes("soil") || 
        f.includes("wood") || 
        f.includes("forest")).length >= 2) {
      return { 
        earth: 0.50, // Dominant Earth (earthy)
        wood: 0.25,  // Strong Wood (woody)
        water: 0.15, // Moderate Water (depth)
        fire: 0.10,  // Light Fire (aged)
        metal: 0.00  // No Metal
      };
    }
    
    // Umami + Vegetal combination (common in Japanese greens like Gyokuro) - fallback from original implementation
    if (this.profileContainsAny(normalizedFlavors, ["umami", "savory", "brothy"]) && 
        this.profileContainsAny(normalizedFlavors, ["vegetal", "green", "grassy", "fresh", "green bean", "bamboo"])) {
      return { 
        wood: 0.6,  // Strong Wood affinity
        water: 0.3, // Moderate Water affinity
        earth: 0.1, // Minor Earth affinity
        fire: 0.0,
        metal: 0.0
      };
    }
    
    // Marine + Vegetal combination (like some Japanese green teas) - fallback from original implementation
    if (this.profileContainsAny(normalizedFlavors, ["marine", "seaweed", "algae"]) && 
        this.profileContainsAny(normalizedFlavors, ["vegetal", "green", "grassy", "fresh"])) {
      return { 
        wood: 0.5,  // Strong Wood affinity
        water: 0.4, // Strong Water affinity
        earth: 0.05, // Minor Earth affinity
        fire: 0.0,
        metal: 0.05
      };
    }
    
    // Roasted + Sweet combination (like some oolongs) - fallback from original implementation
    if (this.profileContainsAny(normalizedFlavors, ["roasted", "toasted", "charcoal", "smoky"]) && 
        this.profileContainsAny(normalizedFlavors, ["sweet", "caramel", "honey", "fruit"])) {
      return { 
        fire: 0.5,  // Strong Fire affinity
        earth: 0.4, // Strong Earth affinity
        wood: 0.05, // Minor Wood affinity
        water: 0.0,
        metal: 0.05
      };
    }
    
    // No specific combination detected
    return null;
  }
  
  // Map a single flavor note to TCM elements
  mapFlavorToElements(flavor, context = null) {
    if (!flavor || typeof flavor !== 'string') {
      return null;
    }
    
    const normalizedFlavor = flavor.toLowerCase().trim();
    
    // Handle special cases with context
    if (normalizedFlavor === "malty" && context && this.profileContainsAny(context, ["roasted", "toast", "roast"])) {
      // When malty appears with roasted notes, adjust to have Fire (bitter) component
      return { earth: 0.6, fire: 0.4, wood: 0.0, metal: 0.0, water: 0.0 };
    }
    
    // Special case for umami in Japanese green teas - strengthened
    if (normalizedFlavor === "umami" && context && this.profileContainsAny(context, ["green", "grassy", "fresh", "japanese", "vegetal", "green bean"])) {
      // Stronger wood component for umami in green teas
      return { wood: 0.6, water: 0.3, earth: 0.1, fire: 0.0, metal: 0.0 };
    }
    
    // Check if it's a direct TCM flavor
    if (this.directTcmFlavors[normalizedFlavor]) {
      const tcmFlavor = this.directTcmFlavors[normalizedFlavor];
      return { ...this.tcmFlavorElements[tcmFlavor] };
    }
    
    // Map to flavor wheel category
    const category = this.flavorNoteToCategory[normalizedFlavor];
    if (category) {
      // Get TCM flavor distribution for this category
      const categoryInfo = this.flavorWheelCategories[category];
      if (categoryInfo) {
        // Initialize element distribution
        const elements = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
        
        // Apply TCM flavor distributions to elements
        Object.entries(categoryInfo.distribution).forEach(([tcmFlavor, weight]) => {
          const flavorElements = this.tcmFlavorElements[tcmFlavor];
          if (flavorElements) {
            Object.entries(flavorElements).forEach(([element, value]) => {
              elements[element] += value * weight;
            });
          }
        });
        
        // Normalize to ensure sum is 1.0
        const elementTotal = Object.values(elements).reduce((sum, val) => sum + val, 0);
        if (elementTotal > 0) {
          Object.keys(elements).forEach(element => {
            elements[element] = elements[element] / elementTotal;
          });
        }
        
        return elements;
      }
    }
    
    // If no match is found, return null to let the caller try other methods
    return null;
  }
  
  // Check if there's a dominant flavor in the TCM flavor counts
  hasDominantFlavor(tcmFlavorCounts) {
    if (!tcmFlavorCounts) return false;
    
    const values = Object.values(tcmFlavorCounts);
    const total = values.reduce((sum, val) => sum + val, 0);
    if (total === 0) return false;
    
    // Sort flavor counts in descending order
    const sortedValues = [...values].sort((a, b) => b - a);
    
    // Check if the highest count is significantly higher than the second highest
    return sortedValues[0] > (total * 0.6) || (sortedValues[0] > 0 && sortedValues[0] >= 3 * (sortedValues[1] || 0.01));
  }
  
  // Map a full flavor profile to TCM elements
  mapFlavorProfileToElements(flavorNotes) {
    if (!flavorNotes || flavorNotes.length === 0) {
      return { wood: 0.2, fire: 0.2, earth: 0.2, metal: 0.2, water: 0.2 };
    }
    
    // Normalize flavor notes
    const normalizedNotes = flavorNotes.map(note => 
      typeof note === 'string' ? note.toLowerCase().trim() : ''
    ).filter(note => note);
    
    // First check for known flavor combinations with special element affinities
    const combinationAffinity = this.getElementAffinityForCombination(normalizedNotes);
    if (combinationAffinity) {
      return combinationAffinity;
    }
    
    // Initialize element scores and TCM flavor counts
    const elements = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
    const tcmFlavorCounts = {
      sour: 0,
      bitter: 0,
      sweet: 0,
      pungent: 0,
      salty: 0
    };
    
    // Go through each flavor note
    normalizedNotes.forEach(note => {
      // Check if this is a direct TCM flavor
      if (this.directTcmFlavors[note]) {
        const tcmFlavor = this.directTcmFlavors[note];
        tcmFlavorCounts[tcmFlavor]++;
        
        // Add elements from this TCM flavor
        const flavorElements = this.tcmFlavorElements[tcmFlavor];
        Object.entries(flavorElements).forEach(([element, weight]) => {
          elements[element] += weight;
        });
        return;
      }
      
      // Map flavor to TCM elements, passing all notes as context
      const flavorElements = this.mapFlavorToElements(note, normalizedNotes);
      if (flavorElements) {
        // Add element weights
        Object.entries(flavorElements).forEach(([element, weight]) => {
          elements[element] += weight;
        });
        
        // Determine TCM flavor category for this note
        const category = this.flavorNoteToCategory[note];
        if (category && this.flavorWheelCategories[category]) {
          const primaryTcmFlavor = this.flavorWheelCategories[category].tcmFlavor;
          tcmFlavorCounts[primaryTcmFlavor]++;
          
          const secondaryTcmFlavor = this.flavorWheelCategories[category].secondaryTcmFlavor;
          if (secondaryTcmFlavor) {
            tcmFlavorCounts[secondaryTcmFlavor] += 0.5; // Count secondary as half
          }
        }
      }
    });
    
    // Check if we have element data
    const elementTotal = Object.values(elements).reduce((sum, val) => sum + val, 0);
    if (elementTotal > 0) {
      // Check if there's a dominant flavor that should be emphasized
      const hasDominant = this.hasDominantFlavor(tcmFlavorCounts);
      
      // For dominant flavor profiles, skip normalization to preserve strong associations
      if (!hasDominant) {
        // Normalize element distribution
        Object.keys(elements).forEach(element => {
          elements[element] = elements[element] / elementTotal;
        });
      }
    } else {
      // Default distribution if no TCM flavors could be determined
      return { wood: 0.2, fire: 0.2, earth: 0.2, metal: 0.2, water: 0.2 };
    }
    
    return elements;
  }
  
  // Generate a detailed analysis of flavor profile
  analyzeFlavorProfile(flavorNotes) {
    if (!flavorNotes || flavorNotes.length === 0) {
      return {
        elements: { wood: 0.2, fire: 0.2, earth: 0.2, metal: 0.2, water: 0.2 },
        tcmFlavors: {},
        subcategories: {},
        dominantTcmFlavor: null,
        dominantElement: null
      };
    }
    
    // Count TCM flavor categories
    const tcmFlavorCounts = {
      sour: 0,
      bitter: 0,
      sweet: 0,
      pungent: 0,
      salty: 0
    };
    
    // Track subcategories used
    const subcategoryCounts = {};
    
    // Process each flavor note
    flavorNotes.forEach(note => {
      const normalizedNote = note.toLowerCase();
      
      // Special case for "malty" with context
      if (normalizedNote === "malty" && this.profileContainsAny(flavorNotes, ["roasted", "toast", "roast"])) {
        // When malty appears with roasted notes, add both sweet and bitter flavors
        tcmFlavorCounts.sweet += 1;
        tcmFlavorCounts.bitter += 0.5;
        subcategoryCounts["caramel"] = (subcategoryCounts["caramel"] || 0) + 0.6;
        subcategoryCounts["roasted"] = (subcategoryCounts["roasted"] || 0) + 0.4;
        return;
      }
      
      // Special case for umami in Japanese green teas
      if (normalizedNote === "umami" && this.profileContainsAny(flavorNotes, ["green", "grassy", "fresh", "japanese"])) {
        // Stronger wood component for umami in green teas
        tcmFlavorCounts.sour += 1;  // Wood
        tcmFlavorCounts.salty += 0.5;  // Water
        subcategoryCounts["umami"] = (subcategoryCounts["umami"] || 0) + 0.5;
        subcategoryCounts["green_vegetal"] = (subcategoryCounts["green_vegetal"] || 0) + 0.5;
        return;
      }
      
      // Direct TCM flavor
      if (this.directTcmFlavors[normalizedNote]) {
        const tcmFlavor = this.directTcmFlavors[normalizedNote];
        tcmFlavorCounts[tcmFlavor] += 1;
        return;
      }
      
      // Find category
      const category = this.flavorNoteToCategory[normalizedNote];
      if (category) {
        // Increment subcategory count
        subcategoryCounts[category] = (subcategoryCounts[category] || 0) + 1;
        
        // Get TCM flavor distribution from this category
        const categoryInfo = this.flavorWheelCategories[category];
        if (categoryInfo) {
          // Add primary and secondary flavors
          const primaryFlavor = categoryInfo.tcmFlavor;
          if (primaryFlavor) {
            tcmFlavorCounts[primaryFlavor] += 1;
          }
          
          const secondaryFlavor = categoryInfo.secondaryTcmFlavor;
          if (secondaryFlavor) {
            tcmFlavorCounts[secondaryFlavor] += 0.5; // Count secondary as half
          }
        }
      }
    });
    
    // Calculate element distribution
    const elements = this.mapFlavorProfileToElements(flavorNotes);
    
    // Determine dominant TCM flavor
    let dominantTcmFlavor = null;
    let highestCount = 0;
    
    Object.entries(tcmFlavorCounts).forEach(([flavor, count]) => {
      if (count > highestCount) {
        highestCount = count;
        dominantTcmFlavor = flavor;
      }
    });
    
    // Determine dominant element
    let dominantElement = null;
    let highestWeight = 0;
    
    Object.entries(elements).forEach(([element, weight]) => {
      if (weight > highestWeight) {
        highestWeight = weight;
        dominantElement = element;
      }
    });
    
    return {
      elements,
      tcmFlavors: tcmFlavorCounts,
      subcategories: subcategoryCounts,
      dominantTcmFlavor,
      dominantElement
    };
  }
  
  // Find the flavor wheel category for a given flavor
  findCategoryForFlavor(flavor) {
    if (!flavor) return null;
    
    const normalizedFlavor = flavor.toLowerCase().trim();
    return this.flavorNoteToCategory[normalizedFlavor] || null;
  }
  
  // Test method for the salty profile edge case
  testPurelySaltyProfile() {
    const saltyProfile = ["salty", "briny", "seaweed"];
    return this.mapFlavorProfileToElements(saltyProfile);
  }
  
  // Test method for the citrus-grassy profile edge case
  testCitrusGrassyProfile() {
    const citrusGrassyProfile = ["citrus", "grassy", "lemon", "fresh"];
    return this.mapFlavorProfileToElements(citrusGrassyProfile);
  }
}

// Default export
export default FlavorProfileMapper; 