// TcmSystemConfig.js
// Configuration management for the TCM-based tea effect system

export class TcmSystemConfig {
  constructor(options = {}) {
    // Default configuration parameters
    this.config = {
      // Element weights for different components (must sum to 1.0)
      elementWeights: {
        flavor: 0.4,       // Flavor has highest weight (40%)
        compounds: 0.3,     // Compounds have significant weight (30%)  
        processing: 0.2,    // Processing methods have moderate weight (20%)
        geography: 0.1      // Geography has lowest weight (10%)
      },
      
      // Element interaction parameters
      elementInteractions: {
        generatingStrength: 0.1,    // Strength of generating cycle relationships
        controllingStrength: 0.05,  // Strength of controlling cycle relationships
        antagonisticStrength: 0.03  // Strength of unexpected element conflicts
      },
      
      // Compound balance parameters
      compounds: {
        idealLTheanineCaffeineRatio: 2.0,  // Ideal L-theanine to caffeine ratio
        highCaffeineThreshold: 6.5,        // Threshold for high caffeine (1-10 scale)
        highLTheanineThreshold: 7.0,       // Threshold for high L-theanine (1-10 scale)
        compoundImbalancePenalty: 0.15     // Penalty for extreme compound imbalance
      },
      
      // Diminishing returns formula for repeated factors
      diminishingReturns: {
        formula: 'Math.pow(count, -0.3)'  // Diminishing returns for repeated flavors/processing
      },
      
      // System terminology options
      terminology: {
        system: "TCM Tea Classification",
        elements: "Five Elements (五行 Wǔxíng)",
        effects: "Energetic Effects",
        properties: "TCM Properties"
      },
      
      // Analysis depth options
      analysisDepth: {
        includeChineseTerms: true,     // Include Chinese terminology
        includeBodySystems: true,      // Include body systems in analysis
        includeContraindications: true, // Include contraindications
        maxEffectsToShow: 5,           // Maximum number of effects to display
        maxBenefitsToShow: 4           // Maximum number of benefits to display
      },
      
      // Visualization options
      visualization: {
        woodColor: "#4CAF50",
        fireColor: "#F44336",
        earthColor: "#FFC107",
        metalColor: "#9E9E9E",
        waterColor: "#2196F3",
        minScoreToHighlight: 0.25,     // Minimum element score to highlight in visualization
        radarChartScale: 10,           // Scale for radar chart visualization
        showElementContributions: true  // Show what contributes to each element
      }
    };
    
    // Apply any provided option overrides
    this._applyOverrides(options);
  }
  
  /**
   * Get a configuration value by path
   * @param {string} path - Dot notation path to configuration value (e.g., 'elementWeights.flavor')
   * @returns {*} The configuration value or undefined if not found
   */
  get(path) {
    if (!path) return undefined;
    
    const parts = path.split('.');
    let current = this.config;
    
    for (const part of parts) {
      if (current === undefined || current === null) return undefined;
      current = current[part];
    }
    
    return current;
  }
  
  /**
   * Set a configuration value by path
   * @param {string} path - Dot notation path to configuration value
   * @param {*} value - Value to set
   */
  set(path, value) {
    if (!path) return;
    
    const parts = path.split('.');
    const lastPart = parts.pop();
    let current = this.config;
    
    // Navigate to the parent object
    for (const part of parts) {
      if (current[part] === undefined || current[part] === null) {
        current[part] = {};
      }
      current = current[part];
    }
    
    // Set the value
    current[lastPart] = value;
  }
  
  /**
   * Update configuration with multiple values
   * @param {Object} updates - Object containing updated configuration values
   */
  update(updates) {
    this._deepMerge(this.config, updates);
    
    // Ensure element weights still sum to 1.0 after updates
    this._normalizeElementWeights();
  }
  
  /**
   * Reset configuration to defaults
   */
  reset() {
    this.config = {
      elementWeights: {
        flavor: 0.4,
        compounds: 0.3,
        processing: 0.2,
        geography: 0.1
      },
      elementInteractions: {
        generatingStrength: 0.1,
        controllingStrength: 0.05,
        antagonisticStrength: 0.03
      },
      compounds: {
        idealLTheanineCaffeineRatio: 2.0,
        highCaffeineThreshold: 6.5,
        highLTheanineThreshold: 7.0,
        compoundImbalancePenalty: 0.15
      },
      diminishingReturns: {
        formula: 'Math.pow(count, -0.3)'
      },
      terminology: {
        system: "TCM Tea Classification",
        elements: "Five Elements (五行 Wǔxíng)",
        effects: "Energetic Effects",
        properties: "TCM Properties"
      },
      analysisDepth: {
        includeChineseTerms: true,
        includeBodySystems: true,
        includeContraindications: true,
        maxEffectsToShow: 5,
        maxBenefitsToShow: 4
      },
      visualization: {
        woodColor: "#4CAF50",
        fireColor: "#F44336",
        earthColor: "#FFC107",
        metalColor: "#9E9E9E",
        waterColor: "#2196F3",
        minScoreToHighlight: 0.25,
        radarChartScale: 10,
        showElementContributions: true
      }
    };
  }
  
  /**
   * Apply initial configuration overrides
   * @private
   * @param {Object} overrides - Configuration overrides
   */
  _applyOverrides(overrides) {
    if (!overrides || typeof overrides !== 'object') return;
    
    this._deepMerge(this.config, overrides);
    this._normalizeElementWeights();
  }
  
  /**
   * Deep merge two objects
   * @private
   * @param {Object} target - Target object
   * @param {Object} source - Source object to merge in
   */
  _deepMerge(target, source) {
    if (!source || typeof source !== 'object') return;
    
    Object.keys(source).forEach(key => {
      if (source[key] instanceof Object && key in target && target[key] instanceof Object) {
        this._deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    });
  }
  
  /**
   * Ensure element weights sum to 1.0
   * @private
   */
  _normalizeElementWeights() {
    const weights = this.config.elementWeights;
    if (!weights) return;
    
    const keys = Object.keys(weights);
    const sum = keys.reduce((acc, key) => acc + weights[key], 0);
    
    if (sum === 0) {
      // If all weights are zero, reset to defaults
      keys.forEach(key => {
        if (key === 'flavor') weights[key] = 0.4;
        else if (key === 'compounds') weights[key] = 0.3;
        else if (key === 'processing') weights[key] = 0.2;
        else weights[key] = 0.1;
      });
    } else if (sum !== 1.0) {
      // Normalize weights to sum to 1.0
      keys.forEach(key => {
        weights[key] = weights[key] / sum;
      });
    }
  }
  
  /**
   * Get the current configuration as a plain object
   * @returns {Object} Current configuration
   */
  getAll() {
    return { ...this.config };
  }
  
  /**
   * Export configuration to JSON
   * @returns {string} JSON representation of configuration
   */
  toJSON() {
    return JSON.stringify(this.config, null, 2);
  }
  
  /**
   * Import configuration from JSON
   * @param {string} json - JSON representation of configuration
   */
  fromJSON(json) {
    try {
      const config = JSON.parse(json);
      this.config = config;
      this._normalizeElementWeights();
      return true;
    } catch (e) {
      console.error('Error parsing JSON config:', e);
      return false;
    }
  }
}

export default TcmSystemConfig;