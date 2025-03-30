// FlavorElementMapper.js
// Maps tea flavor profiles to Five Elements

export class FlavorElementMapper {
  constructor(config, flavorMappings) {
    this.config = config;
    this.flavorMappings = flavorMappings;
  }
  
  /**
   * Maps a flavor to Five Elements
   * 
   * @param {string} flavor - Tea flavor to map
   * @returns {Object|null} Element scores object with elements as keys and weights (0-1) as values, or null if not found
   */
  mapFlavorToElements(flavor) {
    if (!flavor || typeof flavor !== 'string') {
      return null;
    }
    
    const normalizedFlavor = flavor.toLowerCase().trim();
    
    // Check for exact match
    if (this.flavorMappings[normalizedFlavor]) {
      return { ...this.flavorMappings[normalizedFlavor] };
    }
    
    // Check for partial matches
    for (const [mappedFlavor, elements] of Object.entries(this.flavorMappings)) {
      // Match if flavor contains the mapped flavor or vice versa
      if (normalizedFlavor.includes(mappedFlavor) || mappedFlavor.includes(normalizedFlavor)) {
        return { ...elements };
      }
    }
    
    // If no match found, return a default mapping based on closest match
    return this._findClosestFlavorMapping(normalizedFlavor);
  }
  
  /**
   * Maps an array of flavors to Five Elements, accounting for diminishing returns
   * 
   * @param {string[]} flavors - Array of tea flavors
   * @returns {Object} Combined element scores
   */
  mapFlavorProfileToElements(flavors) {
    if (!flavors || !Array.isArray(flavors) || flavors.length === 0) {
      return this._getDefaultElements();
    }
    
    // Initialize element scores
    const elements = this._getDefaultElements();
    
    // Track flavor occurrences for diminishing returns
    const flavorCounts = {};
    let totalContribution = 0;
    
    // Process each flavor
    flavors.forEach(flavor => {
      const normalizedFlavor = flavor.toLowerCase().trim();
      
      // Track flavor occurrences
      flavorCounts[normalizedFlavor] = (flavorCounts[normalizedFlavor] || 0) + 1;
      
      // Get flavor element mapping
      const flavorElements = this.mapFlavorToElements(normalizedFlavor);
      if (!flavorElements) return;
      
      // Apply diminishing returns for repeated flavors
      const repetitionFactor = this._calculateDiminishingReturns(flavorCounts[normalizedFlavor]);
      
      // Add weighted flavor contribution
      Object.keys(elements).forEach(element => {
        if (flavorElements[element]) {
          const contribution = flavorElements[element] * repetitionFactor;
          elements[element] += contribution;
          totalContribution += contribution;
        }
      });
    });
    
    // Normalize element scores if we have contributions
    if (totalContribution > 0) {
      Object.keys(elements).forEach(element => {
        elements[element] = elements[element] / totalContribution;
      });
    }
    
    return elements;
  }
  
  /**
   * Analyzes flavor profile in TCM terms
   * 
   * @param {string[]} flavors - Array of tea flavors
   * @returns {Object} TCM analysis of flavor profile
   */
  analyzeFlavorProfile(flavors) {
    if (!flavors || !Array.isArray(flavors) || flavors.length === 0) {
      return {
        primaryElement: null,
        elementDistribution: this._getDefaultElements(),
        tcmProfile: null
      };
    }
    
    // Map flavors to elements
    const elements = this.mapFlavorProfileToElements(flavors);
    
    // Find dominant element
    const sortedElements = Object.entries(elements)
      .sort(([, a], [, b]) => b - a);
    
    const dominantElement = sortedElements[0][0];
    const dominantScore = sortedElements[0][1];
    
    // Create flavor TCM profile
    const tcmProfile = this._createTcmFlavorProfile(flavors, elements);
    
    return {
      primaryElement: dominantElement,
      elementDistribution: elements,
      dominantScore,
      tcmProfile
    };
  }
  
  /**
   * Creates a TCM flavor profile analysis
   */
  _createTcmFlavorProfile(flavors, elements) {
    // Define flavor categories in TCM terms
    const flavorCategories = {
      sour: {
        element: 'wood',
        organs: ['Liver', 'Gallbladder'],
        actions: ['Astringes', 'Consolidates'],
        examples: ['citrus', 'tart', 'vinegary', 'sour']
      },
      bitter: {
        element: 'fire',
        organs: ['Heart', 'Small Intestine'],
        actions: ['Drains', 'Dries', 'Clears Heat'],
        examples: ['bitter', 'dark chocolate', 'coffee', 'burnt']
      },
      sweet: {
        element: 'earth',
        organs: ['Spleen', 'Stomach'],
        actions: ['Tonifies', 'Harmonizes', 'Moistens'],
        examples: ['sweet', 'honey', 'malty', 'caramel']
      },
      pungent: {
        element: 'metal',
        organs: ['Lungs', 'Large Intestine'],
        actions: ['Disperses', 'Promotes circulation'],
        examples: ['spicy', 'peppery', 'ginger', 'cinnamon']
      },
      salty: {
        element: 'water',
        organs: ['Kidneys', 'Bladder'],
        actions: ['Softens', 'Descends', 'Purges'],
        examples: ['salty', 'mineral', 'marine', 'briny']
      }
    };
    
    // Identify which TCM flavor categories are present
    const presentCategories = {};
    
    // Match flavors to categories
    flavors.forEach(flavor => {
      const normalizedFlavor = flavor.toLowerCase().trim();
      
      Object.entries(flavorCategories).forEach(([category, info]) => {
        if (info.examples.some(example => 
            normalizedFlavor.includes(example) || example.includes(normalizedFlavor))) {
          presentCategories[category] = (presentCategories[category] || 0) + 1;
        }
      });
    });
    
    // Sort categories by frequency
    const sortedCategories = Object.entries(presentCategories)
      .sort(([, a], [, b]) => b - a)
      .map(([category]) => category);
    
    // Create TCM flavor description
    let flavorDescription = "";
    
    if (sortedCategories.length > 0) {
      const primaryCategory = sortedCategories[0];
      const primaryInfo = flavorCategories[primaryCategory];
      
      flavorDescription = `Primary ${primaryCategory} flavor supports ${primaryInfo.organs.join('/')} and ${primaryInfo.actions.join(', ')}. `;
      
      if (sortedCategories.length > 1) {
        const secondaryCategory = sortedCategories[1];
        const secondaryInfo = flavorCategories[secondaryCategory];
        
        flavorDescription += `Secondary ${secondaryCategory} flavor supports ${secondaryInfo.organs.join('/')} function.`;
      }
    } else {
      flavorDescription = "No distinct TCM flavor categories detected.";
    }
    
    // Get the dominant element
    const dominantElement = Object.entries(elements)
      .sort(([, a], [, b]) => b - a)[0][0];
    
    return {
      primaryFlavor: sortedCategories[0] || null,
      secondaryFlavor: sortedCategories[1] || null,
      dominantElement,
      flavorDescription
    };
  }
  
  /**
   * Find closest flavor mapping when no exact match is found
   */
  _findClosestFlavorMapping(flavor) {
    // Default balanced element distribution
    const defaultElements = this._getDefaultElements();
    
    // Check for flavor categories (these are broad flavor families)
    if (flavor.includes('floral')) {
      return { wood: 0.4, metal: 0.4, fire: 0.1, earth: 0.05, water: 0.05 };
    } else if (flavor.includes('fruit')) {
      return { wood: 0.6, fire: 0.2, earth: 0.1, metal: 0.05, water: 0.05 };
    } else if (flavor.includes('spic') || flavor.includes('pung')) {
      return { metal: 0.6, fire: 0.2, wood: 0.1, earth: 0.05, water: 0.05 };
    } else if (flavor.includes('sweet') || flavor.includes('honey')) {
      return { earth: 0.6, fire: 0.2, water: 0.1, wood: 0.05, metal: 0.05 };
    } else if (flavor.includes('sour') || flavor.includes('tart')) {
      return { wood: 0.6, fire: 0.2, metal: 0.1, earth: 0.05, water: 0.05 };
    } else if (flavor.includes('bitter')) {
      return { fire: 0.6, metal: 0.2, earth: 0.1, wood: 0.05, water: 0.05 };
    } else if (flavor.includes('roast') || flavor.includes('toast')) {
      return { fire: 0.5, earth: 0.3, metal: 0.1, wood: 0.05, water: 0.05 };
    } else if (flavor.includes('veg') || flavor.includes('grass')) {
      return { wood: 0.7, water: 0.1, earth: 0.1, metal: 0.05, fire: 0.05 };
    } else if (flavor.includes('earth') || flavor.includes('soil')) {
      return { earth: 0.5, water: 0.3, wood: 0.1, metal: 0.05, fire: 0.05 };
    } else if (flavor.includes('mineral') || flavor.includes('stone')) {
      return { metal: 0.5, water: 0.3, earth: 0.1, wood: 0.05, fire: 0.05 };
    } else if (flavor.includes('sea') || flavor.includes('marine')) {
      return { water: 0.7, metal: 0.2, wood: 0.1, earth: 0, fire: 0 };
    } else if (flavor.includes('wood') || flavor.includes('herb')) {
      return { wood: 0.4, water: 0.3, metal: 0.2, earth: 0.05, fire: 0.05 };
    }
    
    return defaultElements;
  }
  
  /**
   * Calculate diminishing returns for repeated flavors
   */
  _calculateDiminishingReturns(count) {
    if (count <= 1) return 1.0;
    
    // Apply diminishing returns formula based on config
    const formula = this.config.get('diminishingReturns.formula') || 'Math.pow(count, -0.3)';
    
    try {
      // Safely evaluate the formula with the count value
      return eval(formula.replace(/count/g, count));
    } catch (e) {
      // Fallback to default diminishing returns
      return 1.0 / Math.sqrt(count);
    }
  }
  
  /**
   * Default balanced element distribution
   */
  _getDefaultElements() {
    return {
      wood: 0.2,
      fire: 0.2,
      earth: 0.2,
      metal: 0.2,
      water: 0.2
    };
  }
}

export default FlavorElementMapper;