// ProcessingElementMapper.js
// Maps tea processing methods to Five Elements

export class ProcessingElementMapper {
  constructor(config, processingMappings) {
    this.config = config;
    this.processingMappings = processingMappings;
  }
  
  /**
   * Maps a processing method to Five Elements
   * 
   * @param {string} method - Processing method to map
   * @returns {Object|null} Element scores object with elements as keys and weights (0-1) as values, or null if not found
   */
  mapProcessingToElements(method) {
    if (!method || typeof method !== 'string') {
      return null;
    }
    
    const normalizedMethod = method.toLowerCase().trim()
      // Standardize hyphenation and spacing
      .replace(/\s+/g, '-');
    
    // Check for exact match in processing mappings
    if (this.processingMappings.processingElementMappings[normalizedMethod]) {
      return { ...this.processingMappings.processingElementMappings[normalizedMethod] };
    }
    
    // Check for partial matches
    for (const [mappedMethod, elements] of Object.entries(this.processingMappings.processingElementMappings)) {
      // Match if method contains the mapped method or vice versa
      // Also check with hyphens replaced by spaces for more flexible matching
      const mappedMethodAlt = mappedMethod.replace(/-/g, ' ');
      const normalizedMethodAlt = normalizedMethod.replace(/-/g, ' ');
      
      if (normalizedMethod.includes(mappedMethod) || 
          mappedMethod.includes(normalizedMethod) ||
          normalizedMethodAlt.includes(mappedMethodAlt) ||
          mappedMethodAlt.includes(normalizedMethodAlt)) {
        return { ...elements };
      }
    }
    
    // If no match found, return null to indicate no valid mapping
    return null;
  }
  
  /**
   * Maps an array of processing methods to Five Elements, accounting for diminishing returns
   * 
   * @param {string[]} methods - Array of processing methods
   * @returns {Object} Combined element scores
   */
  mapProcessingMethodsToElements(methods) {
    if (!methods || !Array.isArray(methods) || methods.length === 0) {
      return null; // Return null to indicate no data
    }
    
    // Initialize element scores to zero
    const elements = this._getZeroElements();
    
    // Track method categories for diminishing returns
    const categoryCount = {};
    let totalContribution = 0;
    
    // Flag to track if we found any valid method
    let hasValidMethod = false;
    
    // Process each method
    methods.forEach(method => {
      const methodElements = this.mapProcessingToElements(method);
      if (!methodElements) return;
      
      hasValidMethod = true;
      
      // Identify method category (if available)
      const normalizedMethod = method.toLowerCase().trim();
      const methodData = this.processingMappings.processingElementMappings[normalizedMethod];
      const category = methodData ? methodData.category : 'general';
      
      // Track category occurrences
      categoryCount[category] = (categoryCount[category] || 0) + 1;
      
      // Apply diminishing returns for repeated categories
      const repetitionFactor = this._calculateDiminishingReturns(categoryCount[category]);
      
      // Get category weight from config
      const categoryWeight = this._getCategoryWeight(category);
      
      // Apply combined factor (repetition and category weight)
      const combinedFactor = repetitionFactor * categoryWeight;
      
      // Add weighted method contribution
      Object.keys(elements).forEach(element => {
        if (methodElements[element]) {
          const contribution = methodElements[element] * combinedFactor;
          elements[element] += contribution;
          totalContribution += contribution;
        }
      });
    });
    
    // If no valid methods were found, return null
    if (!hasValidMethod) {
      return null;
    }
    
    // Normalize element scores if we have contributions
    if (totalContribution > 0) {
      Object.keys(elements).forEach(element => {
        elements[element] = elements[element] / totalContribution;
      });
    }
    
    // Apply any special processing combinations
    this._applySpecialCombinations(elements, methods);
    
    return elements;
  }
  
  /**
   * Apply special effects for specific combinations of processing methods
   */
  _applySpecialCombinations(elements, methods) {
    const normalizedMethods = methods.map(m => 
      m.toLowerCase().trim().replace(/\s+/g, '-')
    );
    
    // Check for specific combinations
    
    // Shade-grown + steamed (Japanese green tea style)
    if (normalizedMethods.includes('shade-grown') && normalizedMethods.includes('steamed')) {
      // Enhance Water and Metal for clarity and depth
      elements.water = (elements.water * 1.2) + 0.1;
      elements.metal = (elements.metal * 1.1) + 0.05;
    }
    
    // Withered + rolled + partial-oxidation (oolong processing)
    if (normalizedMethods.includes('withered') && 
        normalizedMethods.includes('rolled') && 
        (normalizedMethods.includes('partial-oxidation') || 
         normalizedMethods.includes('oxidized') ||
         normalizedMethods.includes('medium-oxidized'))) {
      // Enhance balanced distribution
      elements.earth = (elements.earth * 1.2) + 0.1;
      elements.wood = (elements.wood * 1.1) + 0.05;
    }
    
    // White tea processing
    if ((normalizedMethods.includes('minimally-oxidized') || 
         normalizedMethods.includes('minimal-processing')) && 
        (normalizedMethods.includes('withered') || 
         normalizedMethods.includes('sun-dried'))) {
      // Enhance Wood and Metal for white tea characteristics
      elements.wood = (elements.wood * 1.2) + 0.05;
      elements.metal = (elements.metal * 1.1) + 0.05;
      // Reduce Fire slightly
      elements.fire = Math.max(0, elements.fire * 0.8 - 0.05);
    }
    
    // Fermented + aged (puerh processing)
    if (normalizedMethods.includes('fermented') && normalizedMethods.includes('aged')) {
      // Enhance Water and Earth for depth and stability
      elements.water = (elements.water * 1.3) + 0.1;
      elements.earth = (elements.earth * 1.1) + 0.05;
    }
    
    // Shou Puerh processing (wet-piling/wet-piled + fermented + compressed)
    if ((normalizedMethods.includes('wet-piling') || normalizedMethods.includes('wet-piled')) && 
        normalizedMethods.includes('fermented') && 
        normalizedMethods.includes('compressed')) {
      // Further enhance Earth to ensure dominance, adjust other elements
      elements.earth = (elements.earth * 1.3) + 0.1;
      elements.water = Math.min(elements.earth * 0.5, elements.water);
      elements.metal = Math.max(elements.metal, 0.1); // Ensure some metal presence
    }
    
    // Heavy roasting (reduces Water, increases Fire)
    if (normalizedMethods.includes('heavy-roast') || normalizedMethods.includes('charcoal-roasted')) {
      elements.fire = (elements.fire * 1.3) + 0.1;
      elements.water = Math.max(0, elements.water * 0.8 - 0.05);
    }
    
    // Re-normalize elements
    const total = Object.values(elements).reduce((sum, value) => sum + value, 0);
    if (total > 0) {
      Object.keys(elements).forEach(element => {
        elements[element] = elements[element] / total;
      });
    }
  }
  
  /**
   * Analyzes processing methods in TCM terms
   * 
   * @param {string[]} methods - Array of processing methods
   * @returns {Object} TCM analysis of processing profile
   */
  analyzeProcessingProfile(methods) {
    if (!methods || !Array.isArray(methods) || methods.length === 0) {
      return {
        primaryElement: null,
        elementDistribution: null,
        tcmProfile: null
      };
    }
    
    // Map methods to elements
    const elements = this.mapProcessingMethodsToElements(methods);
    
    // If no elements data could be derived, return null
    if (!elements) {
      return {
        primaryElement: null,
        elementDistribution: null,
        tcmProfile: null
      };
    }
    
    // Find dominant element
    const sortedElements = Object.entries(elements)
      .sort(([, a], [, b]) => b - a);
    
    const dominantElement = sortedElements[0][0];
    const dominantScore = sortedElements[0][1];
    
    // Create processing TCM profile
    const tcmProfile = this._createTcmProcessingProfile(methods, elements);
    
    return {
      primaryElement: dominantElement,
      elementDistribution: elements,
      dominantScore,
      tcmProfile
    };
  }
  
  /**
   * Creates a TCM processing profile analysis
   */
  _createTcmProcessingProfile(methods, elements) {
    // Define processing categories in TCM terms
    const processingCategories = {
      heat: {
        element: 'fire',
        actions: ['Transforms', 'Warms', 'Activates'],
        examples: ['roasted', 'baked', 'pan-fired', 'charcoal']
      },
      oxidation: {
        element: 'fire',
        actions: ['Activates Qi', 'Stimulates circulation'],
        examples: ['oxidized', 'fermented', 'oxidation']
      },
      cooling: {
        element: 'water',
        actions: ['Preserves', 'Calms', 'Nourishes Yin'],
        examples: ['steamed', 'shade-grown', 'minimal-processing', 'minimally-oxidized']
      },
      drying: {
        element: 'metal',
        actions: ['Clarifies', 'Structures', 'Concentrates'],
        examples: ['sun-dried', 'withered', 'dried']
      },
      shaping: {
        element: 'earth',
        actions: ['Stabilizes', 'Concentrates'],
        examples: ['rolled', 'compressed', 'twisted', 'flattened']
      },
      aging: {
        element: 'water',
        actions: ['Deepens', 'Transforms', 'Develops complexity'],
        examples: ['aged', 'post-fermented', 'wet-piled']
      }
    };
    
    // Identify which TCM processing categories are present
    const presentCategories = {};
    
    // Match methods to categories
    methods.forEach(method => {
      const normalizedMethod = method.toLowerCase().trim().replace(/\s+/g, '-');
      
      Object.entries(processingCategories).forEach(([category, info]) => {
        if (info.examples.some(example => 
            normalizedMethod.includes(example) || example.includes(normalizedMethod))) {
          presentCategories[category] = (presentCategories[category] || 0) + 1;
        }
      });
    });
    
    // Sort categories by frequency
    const sortedCategories = Object.entries(presentCategories)
      .sort(([, a], [, b]) => b - a)
      .map(([category]) => category);
    
    // Create TCM processing description
    let processingDescription = "";
    
    if (sortedCategories.length > 0) {
      const primaryCategory = sortedCategories[0];
      const primaryInfo = processingCategories[primaryCategory];
      
      processingDescription = `Primary ${primaryCategory} processing ${primaryInfo.actions.join(', ')} the tea's qualities. `;
      
      if (sortedCategories.length > 1) {
        const secondaryCategory = sortedCategories[1];
        const secondaryInfo = processingCategories[secondaryCategory];
        
        processingDescription += `Secondary ${secondaryCategory} processing ${secondaryInfo.actions[0]} its character.`;
      }
    } else {
      processingDescription = "No distinct TCM processing categories detected.";
    }
    
    // Determine nature modified by processing
    let processingNature = "Neutral";
    
    if (elements.fire > 0.35) {
      processingNature = "Warm to Hot";
    } else if (elements.fire > 0.25) {
      processingNature = "Warm";
    } else if (elements.water > 0.35 || elements.metal > 0.3) {
      processingNature = "Cool";
    } else if (elements.water > 0.45) {
      processingNature = "Cold";
    }
    
    // Get the dominant element
    const dominantElement = Object.entries(elements)
      .sort(([, a], [, b]) => b - a)[0][0];
    
    return {
      primaryCategory: sortedCategories[0] || null,
      secondaryCategory: sortedCategories[1] || null,
      dominantElement,
      processingNature,
      processingDescription
    };
  }
  
  /**
   * Get category weight from config
   */
  _getCategoryWeight(category) {
    // Default weight is 1.0
    if (!category) return 1.0;
    
    // Get weight from config
    const categoryPath = `categoryWeights.${category.toLowerCase()}`;
    const weight = this.config.get(categoryPath);
    
    return weight !== undefined ? weight : 1.0;
  }
  
  /**
   * Calculate diminishing returns for repeated methods in the same category
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
   * Zero-value element distribution
   */
  _getZeroElements() {
    return {
      wood: 0,
      fire: 0,
      earth: 0,
      metal: 0,
      water: 0
    };
  }
}

export default ProcessingElementMapper;