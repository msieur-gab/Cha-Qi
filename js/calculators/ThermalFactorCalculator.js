// ThermalFactorCalculator.js
// Calculates thermal contributions from various tea components and applies thermal adjustments

export class ThermalFactorCalculator {
  constructor(config = {}) {
    // Configuration
    this.config = {
      enableThermalCalculations: true,  // Enable thermal calculations
      thermalAdjustmentStrength: 1.0,   // Multiplier for thermal adjustment strength
      ...config
    };
    
    // Flavor thermal mappings (TCM basis)
    this.flavorThermalMappings = {
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
    };
    
    // Processing thermal mappings
    this.processingThermalMappings = {
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
    };
    
    // Geography thermal mappings
    this.geographyThermalMappings = {
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
    };
    
    // Compound thermal mappings are handled directly in the calculations
  }
  
  /**
   * Calculate thermal contribution from flavor profile
   * 
   * @param {string[]} flavorProfile - Array of flavor descriptors
   * @returns {number} Thermal score (-1 to 1 scale)
   */
  calculateFlavorThermal(flavorProfile) {
    if (!flavorProfile || !Array.isArray(flavorProfile) || flavorProfile.length === 0) {
      return 0; // Neutral if no flavor data
    }
    
    let totalThermal = 0;
    let matchCount = 0;
    
    flavorProfile.forEach(flavor => {
      const normalizedFlavor = flavor.toLowerCase().trim();
      
      // Check for direct match in thermal mappings
      if (this.flavorThermalMappings[normalizedFlavor] !== undefined) {
        totalThermal += this.flavorThermalMappings[normalizedFlavor];
        matchCount++;
      } else {
        // Try to find a category match by checking if flavor includes a category keyword
        for (const [category, thermalValue] of Object.entries(this.flavorThermalMappings)) {
          if (normalizedFlavor.includes(category) || category.includes(normalizedFlavor)) {
            totalThermal += thermalValue;
            matchCount++;
            break;
          }
        }
      }
    });
    
    // Return average thermal value, or 0 if no matches
    return matchCount > 0 ? totalThermal / matchCount : 0;
  }
  
  /**
   * Calculate thermal contribution from processing methods
   * 
   * @param {string[]} processingMethods - Array of processing methods
   * @returns {number} Thermal score (-1 to 1 scale)
   */
  calculateProcessingThermal(processingMethods) {
    if (!processingMethods || !Array.isArray(processingMethods) || processingMethods.length === 0) {
      return 0; // Neutral if no processing data
    }
    
    let totalThermal = 0;
    let matchCount = 0;
    
    processingMethods.forEach(method => {
      const normalizedMethod = method.toLowerCase().trim()
        .replace(/\s+/g, '-'); // Standardize format
      
      // Check for direct match in thermal mappings
      if (this.processingThermalMappings[normalizedMethod] !== undefined) {
        totalThermal += this.processingThermalMappings[normalizedMethod];
        matchCount++;
      } else {
        // Try to find a partial match
        for (const [mappedMethod, thermalValue] of Object.entries(this.processingThermalMappings)) {
          // Check if method contains mapped method or vice versa
          const mappedMethodAlt = mappedMethod.replace(/-/g, ' ');
          const normalizedMethodAlt = normalizedMethod.replace(/-/g, ' ');
          
          if (normalizedMethod.includes(mappedMethod) || 
              mappedMethod.includes(normalizedMethod) ||
              normalizedMethodAlt.includes(mappedMethodAlt) ||
              mappedMethodAlt.includes(normalizedMethodAlt)) {
            totalThermal += thermalValue;
            matchCount++;
            break;
          }
        }
      }
    });
    
    // Return average thermal value, or 0 if no matches
    return matchCount > 0 ? totalThermal / matchCount : 0;
  }
  
  /**
   * Calculate thermal contribution from compounds (caffeine, L-theanine)
   * 
   * @param {number} caffeineLevel - Caffeine level (1-10 scale)
   * @param {number} lTheanineLevel - L-theanine level (1-10 scale)
   * @returns {number} Thermal score (-1 to 1 scale)
   */
  calculateCompoundThermal(caffeineLevel, lTheanineLevel) {
    if (caffeineLevel === undefined || lTheanineLevel === undefined) {
      return 0; // Neutral if no compound data
    }
    
    // Normalize inputs to ensure they're valid numbers in range
    const caffeine = Math.max(1, Math.min(10, caffeineLevel || 5));
    const lTheanine = Math.max(1, Math.min(10, lTheanineLevel || 5));
    
    // Caffeine is warming, L-theanine is cooling
    // Formula similar to the existing compound element mapper
    return (caffeine * 0.1) - (lTheanine * 0.15);
  }
  
  /**
   * Calculate thermal contribution from geography
   * 
   * @param {Object} geography - Geography information
   * @returns {number} Thermal score (-1 to 1 scale)
   */
  calculateGeographyThermal(geography) {
    if (!geography) {
      return 0; // Neutral if no geography data
    }
    
    let totalThermal = 0;
    let matchCount = 0;
    
    // Extract relevant geography properties
    const properties = [
      geography.climate,
      geography.region,
      geography.altitude,
      geography.country,
      geography.terrain
    ].filter(prop => prop); // Filter out undefined properties
    
    // Try to match each property to thermal mappings
    properties.forEach(prop => {
      if (typeof prop !== 'string') return;
      
      const normalizedProp = prop.toLowerCase().trim()
        .replace(/\s+/g, '-'); // Standardize format
      
      // Check for direct match
      if (this.geographyThermalMappings[normalizedProp] !== undefined) {
        totalThermal += this.geographyThermalMappings[normalizedProp];
        matchCount++;
      } else {
        // Try to find a partial match
        for (const [mappedProp, thermalValue] of Object.entries(this.geographyThermalMappings)) {
          if (normalizedProp.includes(mappedProp) || mappedProp.includes(normalizedProp)) {
            totalThermal += thermalValue;
            matchCount++;
            break;
          }
        }
      }
    });
    
    // Return average thermal value, or 0 if no matches
    return matchCount > 0 ? totalThermal / matchCount : 0;
  }
  
  /**
   * Calculate total thermal property from all components
   * 
   * @param {Object} tea - Complete tea object
   * @returns {Object} Thermal analysis with total score and component contributions
   */
  calculateTotalThermal(tea) {
    if (!tea) {
      return {
        totalThermal: 0,
        thermalProperty: "Neutral",
        components: {}
      };
    }
    
    // Calculate component thermal contributions
    const flavorThermal = tea.flavorProfile ? 
      this.calculateFlavorThermal(tea.flavorProfile) : 0;
    
    const processingThermal = tea.processingMethods ? 
      this.calculateProcessingThermal(tea.processingMethods) : 0;
    
    const compoundThermal = (tea.caffeineLevel !== undefined && tea.lTheanineLevel !== undefined) ? 
      this.calculateCompoundThermal(tea.caffeineLevel, tea.lTheanineLevel) : 0;
    
    const geographyThermal = tea.geography ? 
      this.calculateGeographyThermal(tea.geography) : 0;
    
    // Calculate total thermal value (weighted average)
    // Weights can be adjusted based on TCM importance
    const weights = {
      flavor: 0.35,       // 35% - Important in TCM
      processing: 0.25,   // 25% - Significant impact
      compound: 0.25,     // 25% - Significant impact
      geography: 0.15     // 15% - Less significant
    };
    
    // Count components with data
    const componentFactors = {
      flavor: flavorThermal !== 0 ? weights.flavor : 0,
      processing: processingThermal !== 0 ? weights.processing : 0,
      compound: compoundThermal !== 0 ? weights.compound : 0,
      geography: geographyThermal !== 0 ? weights.geography : 0
    };
    
    // Calculate total weight of available components
    const totalWeight = Object.values(componentFactors).reduce((sum, weight) => sum + weight, 0);
    
    // Calculate normalized weights (sum to 1.0)
    const normalizedFactors = { ...componentFactors };
    if (totalWeight > 0) {
      Object.keys(normalizedFactors).forEach(key => {
        normalizedFactors[key] = normalizedFactors[key] / totalWeight;
      });
    }
    
    // Calculate weighted total thermal value
    const totalThermal = 
      (flavorThermal * normalizedFactors.flavor) +
      (processingThermal * normalizedFactors.processing) +
      (compoundThermal * normalizedFactors.compound) +
      (geographyThermal * normalizedFactors.geography);
    
    // Determine thermal property based on total value
    const thermalProperty = this._getThermalProperty(totalThermal);
    
    // Return thermal analysis
    return {
      totalThermal,
      thermalProperty,
      components: {
        flavor: {
          value: flavorThermal,
          weight: normalizedFactors.flavor,
          contribution: flavorThermal * normalizedFactors.flavor
        },
        processing: {
          value: processingThermal,
          weight: normalizedFactors.processing,
          contribution: processingThermal * normalizedFactors.processing
        },
        compound: {
          value: compoundThermal,
          weight: normalizedFactors.compound,
          contribution: compoundThermal * normalizedFactors.compound
        },
        geography: {
          value: geographyThermal,
          weight: normalizedFactors.geography,
          contribution: geographyThermal * normalizedFactors.geography
        }
      }
    };
  }
  
  /**
   * Apply thermal adjustments to element distribution
   * 
   * @param {Object} elements - Five element distribution
   * @param {number} totalThermal - Total thermal value (-1 to 1 scale)
   * @returns {Object} Adjusted element distribution
   */
  applyThermalAdjustments(elements, totalThermal) {
    if (!elements || !this.config.enableThermalCalculations) {
      return elements; // Return unchanged if no elements or calculations disabled
    }
    
    // Make a copy of elements to avoid modifying the original
    const adjustedElements = { ...elements };
    
    // Scale adjustments based on configuration
    const adjustmentFactor = this.config.thermalAdjustmentStrength;
    
    // Cooling effects (negative thermal value)
    if (totalThermal < -0.5) {
      // Strongly cooling
      adjustedElements.fire = Math.max(0, adjustedElements.fire * (1 - (Math.abs(totalThermal) * 0.3 * adjustmentFactor)));
      adjustedElements.water += Math.abs(totalThermal) * 0.1 * adjustmentFactor;
      adjustedElements.metal += Math.abs(totalThermal) * 0.05 * adjustmentFactor;
    } 
    else if (totalThermal < -0.2) {
      // Moderately cooling
      adjustedElements.fire = Math.max(0, adjustedElements.fire * (1 - (Math.abs(totalThermal) * 0.2 * adjustmentFactor)));
      adjustedElements.water += Math.abs(totalThermal) * 0.07 * adjustmentFactor;
      adjustedElements.metal += Math.abs(totalThermal) * 0.03 * adjustmentFactor;
    }
    
    // Warming effects (positive thermal value)
    if (totalThermal > 0.5) {
      // Strongly warming
      adjustedElements.fire += totalThermal * 0.1 * adjustmentFactor;
      adjustedElements.earth += totalThermal * 0.05 * adjustmentFactor;
      adjustedElements.water = Math.max(0, adjustedElements.water * (1 - (totalThermal * 0.3 * adjustmentFactor)));
    }
    else if (totalThermal > 0.2) {
      // Moderately warming
      adjustedElements.fire += totalThermal * 0.07 * adjustmentFactor;
      adjustedElements.earth += totalThermal * 0.03 * adjustmentFactor;
      adjustedElements.water = Math.max(0, adjustedElements.water * (1 - (totalThermal * 0.2 * adjustmentFactor)));
    }
    
    // Neutral thermal (minimal adjustments)
    if (Math.abs(totalThermal) <= 0.2) {
      adjustedElements.earth += 0.03 * adjustmentFactor; // Slightly enhance Earth for neutral teas
    }
    
    return adjustedElements;
  }
  
  /**
   * Determine thermal property description based on total thermal value
   * 
   * @param {number} thermalValue - Total thermal value (-1 to 1 scale)
   * @returns {string} Thermal property description
   */
  _getThermalProperty(thermalValue) {
    if (thermalValue > 0.6) return "Strongly warming";
    if (thermalValue > 0.3) return "Warming";
    if (thermalValue > 0.1) return "Mildly warming";
    if (thermalValue < -0.6) return "Strongly cooling";
    if (thermalValue < -0.3) return "Cooling";
    if (thermalValue < -0.1) return "Mildly cooling";
    return "Neutral";
  }
}

export default ThermalFactorCalculator; 