// ThermalFactorCalculator.js
// Calculates thermal contributions from various tea components and applies thermal adjustments

import { ThermalMappings } from '../data/ThermalMappings.js';

export class ThermalFactorCalculator {
  constructor(config = {}) {
    // Configuration
    this.config = {
      enableThermalCalculations: true,  // Enable thermal calculations
      thermalAdjustmentStrength: 1.0,   // Multiplier for thermal adjustment strength
      ...config
    };
    
    // Initialize thermal mappings from imported data
    this.flavorThermalMappings = ThermalMappings.flavor;
    this.processingThermalMappings = ThermalMappings.processing;
    this.geographyThermalMappings = ThermalMappings.geography;
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
    // Formula based on TCM principles
    return (caffeine * 0.1) - (lTheanine * 0.07);
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
    
    // Altitude contribution (higher = cooler)
    if (geography.altitude !== undefined) {
      // Convert altitude to thermal score
      if (geography.altitude > 1500) {
        totalThermal += -0.3; // High altitude: cooling
        matchCount++;
      } else if (geography.altitude > 800) {
        totalThermal += -0.1; // Medium-high altitude: slightly cooling
        matchCount++;
      } else if (geography.altitude > 300) {
        totalThermal += 0; // Medium altitude: neutral
        matchCount++;
      } else {
        totalThermal += 0.1; // Low altitude: slightly warming
        matchCount++;
      }
    }
    
    // Temperature contribution
    if (geography.temperature !== undefined) {
      if (geography.temperature > 25) {
        totalThermal += 0.3; // Hot: warming
        matchCount++;
      } else if (geography.temperature > 18) {
        totalThermal += 0.1; // Warm: slightly warming
        matchCount++;
      } else if (geography.temperature > 12) {
        totalThermal += 0; // Moderate: neutral
        matchCount++;
      } else {
        totalThermal += -0.2; // Cool: cooling
        matchCount++;
      }
    }
    
    // Humidity contribution
    if (geography.humidity !== undefined) {
      if (geography.humidity > 80) {
        totalThermal += -0.2; // Very humid: cooling
        matchCount++;
      } else if (geography.humidity > 60) {
        totalThermal += -0.1; // Humid: slightly cooling
        matchCount++;
      } else if (geography.humidity > 40) {
        totalThermal += 0; // Moderate: neutral
        matchCount++;
      } else {
        totalThermal += 0.2; // Dry: warming
        matchCount++;
      }
    }
    
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
    let totalThermal = 0;
    const components = {
      flavor: {
        value: flavorThermal,
        weight: normalizedFactors.flavor || 0,
        contribution: flavorThermal * (normalizedFactors.flavor || 0)
      },
      processing: {
        value: processingThermal,
        weight: normalizedFactors.processing || 0,
        contribution: processingThermal * (normalizedFactors.processing || 0)
      },
      compound: {
        value: compoundThermal,
        weight: normalizedFactors.compound || 0,
        contribution: compoundThermal * (normalizedFactors.compound || 0)
      },
      geography: {
        value: geographyThermal,
        weight: normalizedFactors.geography || 0,
        contribution: geographyThermal * (normalizedFactors.geography || 0)
      }
    };
    
    // Sum all component contributions
    totalThermal = Object.values(components).reduce(
      (sum, component) => sum + component.contribution, 0
    );
    
    // Get thermal property description
    const thermalProperty = this._getThermalProperty(totalThermal);
    
    // Create thermal effects based on property
    const effects = this._generateThermalEffects(thermalProperty, totalThermal);
    
    // Create component contributions - this is needed for the UI display
    const componentContributions = {
      flavor: {
        value: flavorThermal,
        weight: normalizedFactors.flavor || 0,
        contribution: flavorThermal * (normalizedFactors.flavor || 0)
      },
      processing: {
        value: processingThermal,
        weight: normalizedFactors.processing || 0,
        contribution: processingThermal * (normalizedFactors.processing || 0)
      },
      compound: {
        value: compoundThermal,
        weight: normalizedFactors.compound || 0,
        contribution: compoundThermal * (normalizedFactors.compound || 0)
      },
      geography: {
        value: geographyThermal,
        weight: normalizedFactors.geography || 0,
        contribution: geographyThermal * (normalizedFactors.geography || 0)
      }
    };
    
    // Return comprehensive thermal analysis
    return {
      totalThermal,
      thermalProperty,
      effects,
      components,
      componentContributions
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
    
    // Normalize the elements to ensure they sum to 1.0
    const total = Object.values(adjustedElements).reduce((sum, val) => sum + val, 0);
    if (total > 0) {
      Object.keys(adjustedElements).forEach(element => {
        adjustedElements[element] = adjustedElements[element] / total;
      });
    }
    
    return adjustedElements;
  }
  
  /**
   * Generate thermal effects based on the thermal property
   * 
   * @param {string} thermalProperty - The thermal property description
   * @param {number} thermalValue - The thermal value
   * @returns {string[]} Array of thermal effects
   */
  _generateThermalEffects(thermalProperty, thermalValue) {
    const effects = [];
    
    if (thermalValue < -0.5) {
      // Strongly cooling
      effects.push('Cools the body and clears heat');
      effects.push('Helps reduce inflammation and fever');
      effects.push('Particularly beneficial in hot weather');
      effects.push('Good for people with heat conditions');
    } else if (thermalValue < -0.2) {
      // Mildly cooling
      effects.push('Gently cools the body');
      effects.push('Helps moderate excess heat');
      effects.push('Good for warm weather hydration');
    } else if (thermalValue > 0.5) {
      // Strongly warming
      effects.push('Warms the body from the core');
      effects.push('Promotes circulation and dispels cold');
      effects.push('Particularly beneficial in cold weather');
      effects.push('Good for people with cold conditions');
    } else if (thermalValue > 0.2) {
      // Mildly warming
      effects.push('Gently warms the body');
      effects.push('Supports digestion and metabolism');
      effects.push('Good for cool weather consumption');
    } else {
      // Neutral
      effects.push('Balanced thermal effect on the body');
      effects.push('Suitable for most constitutions');
      effects.push('Good for regular consumption in any season');
    }
    
    return effects;
  }
  
  /**
   * Get thermal property description based on thermal value
   * 
   * @param {number} thermalValue - Thermal value (-1 to 1 scale)
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