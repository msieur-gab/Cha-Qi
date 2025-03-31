// FlavorProfileMapper.js
// Maps tea flavor profiles to TCM elements using the Five Elements framework

import {
  tcmFlavorElements,
  flavorWheelCategories,
  flavorNoteToCategory,
  directTcmFlavors,
  flavorCombinationElements
} from '../data/FlavorMappings.js';

export class FlavorProfileMapper {
  constructor() {
    // We now import the data from FlavorMappings.js instead of defining it here
  }
  
  /**
   * Helper method to check if a flavor profile contains any of the specified notes
   * @param {string[]} flavorNotes - Array of flavor descriptors
   * @param {string[]} notesToFind - Array of flavor descriptors to look for
   * @returns {boolean} True if any notes are found
   */
  profileContainsAny(flavorNotes, notesToFind) {
    if (!flavorNotes || !notesToFind) return false;
    
    const normalizedNotes = flavorNotes.map(note => note.toLowerCase().trim());
    const normalizedFind = notesToFind.map(note => note.toLowerCase().trim());
    
    return normalizedNotes.some(note => normalizedFind.includes(note));
  }
  
  /**
   * Check if a flavor profile is predominantly salty or water-related
   * @param {string[]} flavorNotes - Array of flavor descriptors
   * @returns {boolean} True if profile is predominantly water-related
   */
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
   * @param {string[]} flavors - Array of flavor descriptors
   * @return {Object|null} - Element distribution or null if no specific combination detected
   */
  getElementAffinityForCombination(flavors) {
    if (!flavors || !Array.isArray(flavors) || flavors.length < 2) {
      return null; // No combination to detect
    }
    
    // Normalize flavor array for consistent matching
    const normalizedFlavors = flavors.map(f => f.toLowerCase().trim());
    
    // 1. First, check for exact matches in our flavor combination data
    for (const [teaType, combination] of Object.entries(flavorCombinationElements)) {
      const requiredFlavors = combination.flavors.map(f => f.toLowerCase().trim());
      
      // If at least 2 of the required flavors match, return the corresponding element distribution
      const matchCount = requiredFlavors.filter(f => normalizedFlavors.includes(f)).length;
      if (matchCount >= 2) {
        return { ...combination.elements };
      }
    }
    
    // 2. Helper functions for checking flavors
    const hasAnyFlavor = (targetFlavors) => 
      targetFlavors.some(f => normalizedFlavors.includes(f));
    
    const hasAllFlavors = (targetFlavors) => 
      targetFlavors.every(f => normalizedFlavors.includes(f));
    
    // 3. Japanese Green Tea Combinations
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
    
    // More pattern detection can be added here...
    
    // No specific combination detected
    return null;
  }
  
  /**
   * Map a single flavor note to TCM elements
   * @param {string} flavor - Flavor descriptor
   * @param {string[]} context - Other flavors in the profile for context
   * @returns {Object|null} Element distribution or null if no mapping found
   */
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
    if (directTcmFlavors[normalizedFlavor]) {
      const tcmFlavor = directTcmFlavors[normalizedFlavor];
      return { ...tcmFlavorElements[tcmFlavor] };
    }
    
    // Map to flavor wheel category
    const category = flavorNoteToCategory[normalizedFlavor];
    if (category) {
      // Get TCM flavor distribution for this category
      const categoryInfo = flavorWheelCategories[category];
      if (categoryInfo) {
        // Initialize element distribution
        const elements = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
        
        // Apply TCM flavor distributions to elements
        Object.entries(categoryInfo.distribution).forEach(([tcmFlavor, weight]) => {
          const flavorElements = tcmFlavorElements[tcmFlavor];
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
  
  /**
   * Check if there's a dominant flavor in the TCM flavor counts
   * @param {Object} tcmFlavorCounts - Count of each TCM flavor
   * @returns {boolean} True if a dominant flavor exists
   */
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
  
  /**
   * Map a full flavor profile to TCM elements
   * @param {string[]} flavorNotes - Array of flavor descriptors
   * @returns {Object} Element distribution with values for each element (wood, fire, earth, metal, water)
   */
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
      if (directTcmFlavors[note]) {
        const tcmFlavor = directTcmFlavors[note];
        tcmFlavorCounts[tcmFlavor]++;
        
        // Add elements from this TCM flavor
        const flavorElements = tcmFlavorElements[tcmFlavor];
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
        const category = flavorNoteToCategory[note];
        if (category && flavorWheelCategories[category]) {
          const primaryTcmFlavor = flavorWheelCategories[category].tcmFlavor;
          tcmFlavorCounts[primaryTcmFlavor]++;
          
          const secondaryTcmFlavor = flavorWheelCategories[category].secondaryTcmFlavor;
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
  
  /**
   * Generate a detailed analysis of flavor profile
   * @param {string[]} flavorNotes - Array of flavor descriptors
   * @returns {Object} Detailed flavor analysis
   */
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
      if (directTcmFlavors[normalizedNote]) {
        const tcmFlavor = directTcmFlavors[normalizedNote];
        tcmFlavorCounts[tcmFlavor] += 1;
        return;
      }
      
      // Find category
      const category = flavorNoteToCategory[normalizedNote];
      if (category) {
        // Increment subcategory count
        subcategoryCounts[category] = (subcategoryCounts[category] || 0) + 1;
        
        // Get TCM flavor distribution from this category
        const categoryInfo = flavorWheelCategories[category];
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
  
  /**
   * Find the flavor wheel category for a given flavor
   * @param {string} flavor - Flavor descriptor
   * @returns {string|null} Category name or null if not found
   */
  findCategoryForFlavor(flavor) {
    if (!flavor) return null;
    
    const normalizedFlavor = flavor.toLowerCase().trim();
    return flavorNoteToCategory[normalizedFlavor] || null;
  }
  
  /**
   * Test method for the salty profile edge case
   * @returns {Object} Element distribution for a salty profile
   */
  testPurelySaltyProfile() {
    const saltyProfile = ["salty", "briny", "seaweed"];
    return this.mapFlavorProfileToElements(saltyProfile);
  }
  
  /**
   * Test method for the citrus-grassy profile edge case
   * @returns {Object} Element distribution for a citrus-grassy profile
   */
  testCitrusGrassyProfile() {
    const citrusGrassyProfile = ["citrus", "grassy", "lemon", "fresh"];
    return this.mapFlavorProfileToElements(citrusGrassyProfile);
  }
}

export default FlavorProfileMapper;