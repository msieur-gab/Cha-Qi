// Test script for the expanded flavor combination mapping
// To run: node validation/unit-tests/test-expanded-flavor-mapping.js

import { FlavorProfileMapper } from '../../js/data/FlavorProfileMapper.js';

// Create a subclass with expanded tea mapping capabilities
class EnhancedFlavorProfileMapper extends FlavorProfileMapper {
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
    
    // If no specific advanced combination detected, try the original implementation
    return super.getElementAffinityForCombination(flavors);
  }
}

// Create an instance of the enhanced mapper
const mapper = new EnhancedFlavorProfileMapper();

// Test cases for various famous tea types
const testCases = [
  {
    name: "Gyokuro",
    flavors: ["umami", "vegetal", "marine", "sweet", "green", "fresh"]
  },
  {
    name: "Dragon Well",
    flavors: ["chestnut", "vegetal", "nutty", "buttery", "green"]
  },
  {
    name: "Silver Needle White",
    flavors: ["honey", "hay", "melon", "cucumber", "delicate"]
  },
  {
    name: "Traditional Tie Guan Yin",
    flavors: ["roasted", "floral", "mineral", "orchid", "warm"]
  },
  {
    name: "Yunnan Black",
    flavors: ["malty", "honey", "cocoa", "peppery", "sweet"]
  },
  {
    name: "Darjeeling First Flush",
    flavors: ["muscatel", "floral", "bright", "astringent"]
  },
  {
    name: "Aged Sheng Pu-erh",
    flavors: ["woody", "fruity", "medicinal", "camphor", "sweet"]
  },
  {
    name: "Sencha",
    flavors: ["grassy", "fresh", "green", "sweet", "oceanic"]
  },
  {
    name: "Assam Black",
    flavors: ["malty", "robust", "astringent", "brisk", "strong"]
  },
  {
    name: "Yellow Tea",
    flavors: ["mellow", "sweet", "hay", "honey", "gentle"]
  }
];

// Helper function to format percentages
const formatPercent = (value) => (value * 100).toFixed(1) + "%";

console.log("===== EXPANDED FLAVOR COMBINATION MAPPING TEST =====\n");

// Test each tea profile
testCases.forEach(tea => {
  console.log(`Testing ${tea.name} (${tea.flavors.join(', ')})`);
  
  // Map flavor profile to elements using expanded implementation
  const elements = mapper.getElementAffinityForCombination(tea.flavors);
  
  if (elements) {
    console.log("Element Distribution:");
    Object.entries(elements)
      .sort(([, a], [, b]) => b - a)
      .forEach(([element, value]) => {
        console.log(`  ${element.charAt(0).toUpperCase() + element.slice(1)}: ${formatPercent(value)}`);
      });
  } else {
    console.log("  No specific combination detected");
  }
  
  console.log("\n");
});

console.log("===== TEST COMPLETE ====="); 