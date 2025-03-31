// CompoundElementMapper.js
// Maps tea compounds (caffeine, L-theanine, etc.) to Five Elements

export class CompoundElementMapper {
  constructor(config = {}) {
    // Default configuration with configurable compound weight
    this.config = {
      compoundWeight: 0.3,   // Default weight for compounds (can be overridden)
      enableTcmCycles: true, // Enable generating/controlling cycle adjustments
      applyThermalAdjustments: true, // Apply thermal adjustments to elements
      shadeGrowthWoodBoost: true,  // Boost Wood element for shade-grown teas
      ...config              // Override with any provided config
    };
  }
  
  /**
   * Maps caffeine and L-theanine levels to Five Elements
   * 
   * @param {number} caffeineLevel - Caffeine level (1-10 scale)
   * @param {number} lTheanineLevel - L-theanine level (1-10 scale)
   * @param {boolean} shadeGrown - Whether the tea is shade-grown
   * @returns {Object} Element scores object with elements as keys and weights (0-1) as values
   */
  mapCompoundsToElements(caffeineLevel, lTheanineLevel, shadeGrown = false) {
    // Normalize inputs to ensure they're valid numbers in range
    const caffeine = Math.max(1, Math.min(10, caffeineLevel || 5));
    const lTheanine = Math.max(1, Math.min(10, lTheanineLevel || 5));
    
    // Calculate elements independently for each compound
    const caffeineElements = this._mapCaffeineToElements(caffeine);
    const lTheanineElements = this._mapLTheanineToElements(lTheanine);
    
    // Store thermal properties for later use in synergies
    const thermalProperties = {
      warmingEffect: caffeineElements.warmingEffect || 0,
      coolingEffect: lTheanineElements.coolingEffect || 0,
      thermalBalance: (caffeine * 0.8) - (lTheanine * 0.7) // Positive = warming, negative = cooling
    };
    
    // Initialize element scores (excluding thermal properties)
    const elements = {
      wood: caffeineElements.wood + lTheanineElements.wood,
      fire: caffeineElements.fire + lTheanineElements.fire,
      earth: caffeineElements.earth + lTheanineElements.earth,
      metal: caffeineElements.metal + lTheanineElements.metal,
      water: caffeineElements.water + lTheanineElements.water
    };
    
    // Apply synergistic effects with thermal considerations
    this._applyCompoundSynergies(elements, caffeine, lTheanine, thermalProperties, shadeGrown);
    
    // Apply thermal adjustments if enabled
    if (this.config.applyThermalAdjustments) {
      this._applyThermalAdjustments(elements, thermalProperties);
    }
    
    // Apply TCM generating/controlling cycle adjustments if enabled
    if (this.config.enableTcmCycles) {
      this._applyTcmCycles(elements);
    }
    
    // Ensure all values are between 0 and 1
    Object.keys(elements).forEach(element => {
      elements[element] = Math.max(0, Math.min(1, elements[element]));
    });
    
    // Normalize to ensure total equals configurable compound weight
    // Note: This 30% weight represents compounds' contribution to the total element profile
    // (with flavor/geography/processing making up the rest)
    this._normalizeElements(elements, this.config.compoundWeight);
    
    // Add metadata to help explain the normalization
    elements._metadata = {
      compoundWeight: this.config.compoundWeight,
      normalizationMessage: `Note: These values represent the compound contribution (${Math.round(this.config.compoundWeight * 100)}% of total element score). Flavor, processing, and geography contribute the remaining ${Math.round((1 - this.config.compoundWeight) * 100)}%.`
    };
    
    return elements;
  }
  
  /**
   * Map L-theanine level to Five Elements based on TCM principles
   * 
   * @param {number} lTheanine - L-theanine level (1-10)
   * @returns {Object} Element distribution for L-theanine
   */
  _mapLTheanineToElements(lTheanine) {
    // Convert to 0-1 scale for calculations
    const level = lTheanine / 10;
    
    // L-theanine mappings (refined based on TCM principles):
    // Primary: Water (Kidney Yin nourishment) - calming, grounding (~65%)
    // Secondary: Fire (Heart Shen stabilization) - mental tranquility (~25%)
    // Minor: Metal (mild Lung Qi refinement) - subtle clarity (~5%)
    // Minor: Wood (Liver calming) - minimal effect (~5%)
    // Minimal: Earth (no significant Spleen effect) (~0%)
    return {
      // Minor calming effect on Liver
      wood: 0.05 * level,
      
      // Heart Shen stabilization (secondary)
      fire: 0.25 * level,
      
      // No significant Spleen effect
      earth: 0.00 * level,
      
      // Minimal Lung Qi refinement
      metal: 0.05 * level,
      
      // Primary Kidney Yin nourishment (increased)
      water: 0.65 * level,
      
      // Thermal property (cooling effect)
      coolingEffect: 0.7 * level  // Scale for later use in synergies
    };
  }
  
  /**
   * Map caffeine level to Five Elements based on TCM principles
   * 
   * @param {number} caffeine - Caffeine level (1-10)
   * @returns {Object} Element distribution for caffeine
   */
  _mapCaffeineToElements(caffeine) {
    // Convert to 0-1 scale for calculations
    const level = caffeine / 10;
    
    // Caffeine mappings:
    // Primary: Fire (Heart Yang stimulation) - energizing (~55%)
    // Secondary: Wood (Liver Qi mobilization) - activating, upward movement (~25%)
    // Tertiary: Earth (Spleen function) - digestive stimulation (~10%)
    // Minor: Water (slight Kidney Yang boost in moderation) (~5%)
    // Minimal: Metal (no significant Lung effect) (~5%)
    return {
      // Liver Qi mobilization (secondary)
      wood: 0.25 * level,
      
      // Heart Yang stimulation (primary)
      fire: 0.55 * level,
      
      // Mild Spleen activation (tertiary)
      earth: 0.10 * level,
      
      // No significant Metal/Lung association
      metal: 0.05 * level,
      
      // Minor Kidney Yang effect
      water: 0.05 * level,
      
      // Thermal property (warming effect)
      warmingEffect: 0.8 * level  // Scale for later use in synergies
    };
  }
  
  /**
   * Apply thermal adjustments to elements based on the thermal balance
   * @param {Object} elements - Element scores
   * @param {Object} thermalProperties - Thermal properties
   */
  _applyThermalAdjustments(elements, thermalProperties) {
    const { thermalBalance } = thermalProperties;
    
    // Cooling dominant (negative balance)
    if (thermalBalance <= -1.5) {
      // Cooling reduces Fire (directly proportional to cooling intensity)
      elements.fire *= Math.max(0.7, 1 - (Math.abs(thermalBalance) * 0.05));
      
      // Cooling enhances Water and Metal
      elements.water += Math.abs(thermalBalance) * 0.03;
      elements.metal += Math.abs(thermalBalance) * 0.02;
    }
    // Warming dominant (positive balance)
    else if (thermalBalance >= 1.5) {
      // Warming increases Fire and Wood
      elements.fire += thermalBalance * 0.03;
      elements.wood += thermalBalance * 0.02;
      
      // Warming reduces Water
      elements.water *= Math.max(0.7, 1 - (thermalBalance * 0.04));
    }
    // Near neutral - slight Earth enhancement
    else if (Math.abs(thermalBalance) < 0.5) {
      elements.earth += 0.03; // Neutral thermal profile enhances central Earth
    }
  }
  
  /**
   * Apply compound synergistic effects
   * Simplified to prioritize the most clinically relevant patterns
   * 
   * @param {Object} elements - Element scores
   * @param {number} caffeine - Caffeine level (1-10)
   * @param {number} lTheanine - L-theanine level (1-10)
   * @param {Object} thermalProperties - Thermal properties from compound mappings
   * @param {boolean} shadeGrown - Whether the tea is shade-grown
   */
  _applyCompoundSynergies(elements, caffeine, lTheanine, thermalProperties, shadeGrown) {
    // Shade-grown pattern: High L-theanine with moderate caffeine
    // Enhanced mental clarity with calm focus and strong Wood element
    if ((shadeGrown || (lTheanine >= 7 && caffeine >= 3 && caffeine <= 6))) {
      elements.water += 0.07;
      elements.metal += 0.03;
      
      // Enhanced Wood element for shade-grown teas (plants growing upward seeking light)
      if (this.config.shadeGrowthWoodBoost) {
        elements.wood += 0.10; // Significant boost to Wood element
      }
      
      elements.earth += 0.02; // Promotes balanced center
    }
    // Strong Yin pattern: High L-theanine with low caffeine
    // Deep Kidney and Heart nourishment
    else if (lTheanine >= 8 && caffeine <= 3) {
      elements.water += 0.12; // Increased water boost
      elements.fire -= 0.05; // Reduces Heart fire
      elements.metal += 0.03; // Enhanced Lung Yin
      
      // Apply cooling effect
      if (thermalProperties.coolingEffect > 0.5) {
        elements.water += 0.03; // Further enhance Yin through cooling
      }
    }
    // Strong Yang pattern: Very high caffeine with low L-theanine
    // Can create Liver-Fire imbalance in TCM terms
    else if (caffeine >= 8 && lTheanine <= 3) {
      elements.fire += 0.12; // Increased fire boost
      elements.wood += 0.08; // Significant increase to Liver activity
      elements.water -= 0.07; // Depletes Kidney Yin more significantly
      
      // Apply warming effect
      if (thermalProperties.warmingEffect > 0.6) {
        elements.fire += 0.03; // Further enhance Yang through warming
      }
    }
    // Balanced pattern: All other cases
    else {
      // Promote Earth element as central balance
      elements.earth += 0.04; // Increased Earth boost for balance
      
      // If warming and cooling effects are close, enhance balance further
      if (Math.abs(thermalProperties.warmingEffect - thermalProperties.coolingEffect) < 0.2) {
        elements.earth += 0.02;
      }
    }
  }
  
  /**
   * Apply TCM cycle adjustments (generating and controlling relationships)
   * Enhanced to more strongly reflect both generating and controlling cycles
   * @param {Object} elements - Element scores
   */
  _applyTcmCycles(elements) {
    // Find dominant element
    const dominantElement = Object.entries(elements)
      .sort(([, a], [, b]) => b - a)[0][0];
    
    // Generating cycle adjustments (boost to generated element)
    // Wood generates Fire
    if (elements.wood > 0.3) elements.fire += elements.wood * 0.2;
    // Fire generates Earth
    if (elements.fire > 0.3) elements.earth += elements.fire * 0.2;
    // Earth generates Metal
    if (elements.earth > 0.3) elements.metal += elements.earth * 0.2;
    // Metal generates Water
    if (elements.metal > 0.3) elements.water += elements.metal * 0.2;
    // Water generates Wood
    if (elements.water > 0.3) elements.wood += elements.water * 0.2;
    
    // Controlling cycle adjustments (reduction to controlled element)
    // Wood controls Earth
    if (elements.wood > 0.3) elements.earth = Math.max(0, elements.earth - elements.wood * 0.15);
    // Fire controls Metal
    if (elements.fire > 0.3) elements.metal = Math.max(0, elements.metal - elements.fire * 0.15);
    // Earth controls Water
    if (elements.earth > 0.3) elements.water = Math.max(0, elements.water - elements.earth * 0.15);
    // Metal controls Wood
    if (elements.metal > 0.3) elements.wood = Math.max(0, elements.wood - elements.metal * 0.15);
    // Water controls Fire
    if (elements.water > 0.3) elements.fire = Math.max(0, elements.fire - elements.water * 0.15);
    
    // Additional adjustments for dominant element
    if (dominantElement) {
      // Enhanced controlling effect for dominant element (stronger control)
      switch (dominantElement) {
        case 'wood':
          elements.earth = Math.max(0, elements.earth - 0.1);
          break;
        case 'fire':
          elements.metal = Math.max(0, elements.metal - 0.1);
          break;
        case 'earth':
          elements.water = Math.max(0, elements.water - 0.1);
          break;
        case 'metal':
          elements.wood = Math.max(0, elements.wood - 0.1);
          break;
        case 'water':
          elements.fire = Math.max(0, elements.fire - 0.1);
          break;
      }
    }
  }
  
  /**
   * Normalizes element values to ensure they sum to the specified total
   * @param {Object} elements - Element scores object
   * @param {number} targetTotal - Target sum for all element scores
   */
  _normalizeElements(elements, targetTotal) {
    // Save original values for metadata/display
    const originalValues = { ...elements };
    
    // Skip normalization if keys like _metadata
    const elementKeys = Object.keys(elements).filter(key => !key.startsWith('_'));
    
    // Calculate current sum of all element values
    const currentTotal = elementKeys.reduce((sum, key) => sum + elements[key], 0);
    
    // Skip normalization if sum is already 0 to avoid division by zero
    if (currentTotal === 0) return;
    
    // Apply normalization factor to each element
    const normalizationFactor = targetTotal / currentTotal;
    elementKeys.forEach(element => {
      elements[element] *= normalizationFactor;
    });
    
    // Store original, unnormalized values for reference
    if (!elements._metadata) elements._metadata = {};
    elements._metadata.unnormalizedValues = originalValues;
  }
  
  /**
   * Analyzes the overall compound balance in TCM terms
   * 
   * @param {number} caffeineLevel - Caffeine level (1-10 scale)
   * @param {number} lTheanineLevel - L-theanine level (1-10 scale)
   * @param {boolean} shadeGrown - Whether the tea is shade-grown (optional)
   * @returns {Object} Analysis with TCM terminology
   */
  analyzeCompoundBalance(caffeineLevel, lTheanineLevel, shadeGrown = false) {
    const caffeine = Math.max(1, Math.min(10, caffeineLevel || 5));
    const lTheanine = Math.max(1, Math.min(10, lTheanineLevel || 5));
    const ratio = lTheanine / caffeine;
    
    // Map to Five Elements using independent mapping
    const elements = this.mapCompoundsToElements(caffeine, lTheanine, shadeGrown);
    
    // Determine primary TCM nature (for descriptive purposes only)
    let primaryNature = this._getTcmNature(caffeine, lTheanine);
    
    // Determine thermal qualities
    let thermalQuality = this._getThermalQuality(caffeine, lTheanine);
    
    // Determine secondary characteristics
    let secondaryNature = [];
    
    if (thermalQuality) secondaryNature.push(thermalQuality);
    if (lTheanine >= 7) secondaryNature.push("Calming");
    if (lTheanine <= 3) secondaryNature.push("Light");
    
    // Add specialized descriptive characteristics based on compound levels
    if (shadeGrown || (lTheanine >= 7 && caffeine >= 3 && caffeine <= 6)) {
      secondaryNature.push(shadeGrown ? "Shade-grown character (强Wood, 强Water)" : "Harmonizing (Shade-grown character)");
    } else if (lTheanine >= 6 && caffeine >= 5 && caffeine <= 7) {
      secondaryNature.push("Harmonizing");
    } else if (lTheanine >= 8 && caffeine <= 3) {
      secondaryNature.push("Deeply calming");
    } else if (caffeine >= 8 && lTheanine <= 3) {
      secondaryNature.push("Strongly activating");
    }
    
    // Determine primary element based on compound contributions
    // Use unnormalized values before the compound weight cap is applied
    const unnormalizedElements = elements._metadata?.unnormalizedValues || elements;
    const primaryElement = Object.entries(unnormalizedElements)
      .filter(([key]) => !key.startsWith('_')) // Exclude metadata
      .sort(([, a], [, b]) => b - a)[0][0];
    
    // Generate TCM-aligned effect description
    const effectDescription = this._getEffectDescription(caffeine, lTheanine, shadeGrown);
    
    return {
      elements,
      primaryNature,
      primaryElement,
      thermalQuality,
      secondaryNature: secondaryNature.join(", "),
      effectDescription,
      caffeineLevel: caffeine,
      lTheanineLevel: lTheanine,
      ratio, // Kept for reference only, not used in calculations
      shadeGrown, // Include shade-grown status
      tcmAnalysis: this._getTcmAnalysis(caffeine, lTheanine, primaryElement, shadeGrown)
    };
  }
  
  /**
   * Determine thermal quality based on compound levels
   * @param {number} caffeine - Caffeine level
   * @param {number} lTheanine - L-theanine level
   * @returns {string|null} Thermal quality description
   */
  _getThermalQuality(caffeine, lTheanine) {
    // Calculate the thermal balance
    // Caffeine contributes to warming, L-theanine to cooling
    const thermalBalance = (caffeine * 0.8) - (lTheanine * 0.7);
    
    if (thermalBalance > 3) return "Strongly warming";
    if (thermalBalance > 1.5) return "Warming";
    if (thermalBalance > 0.5) return "Mildly warming";
    if (thermalBalance < -3) return "Strongly cooling";
    if (thermalBalance < -1.5) return "Cooling";
    if (thermalBalance < -0.5) return "Mildly cooling";
    return "Neutral";
  }
  
  /**
   * Determine TCM nature based on compound levels
   * @param {number} caffeine - Caffeine level
   * @param {number} lTheanine - L-theanine level
   * @returns {string} TCM nature description
   */
  _getTcmNature(caffeine, lTheanine) {
    if (lTheanine >= 8 && caffeine <= 3) {
      return "Yin dominant";
    } else if (caffeine >= 8 && lTheanine <= 3) {
      return "Yang dominant";
    } else if (lTheanine > caffeine + 2) {
      return "Yin leaning";
    } else if (caffeine > lTheanine + 2) {
      return "Yang leaning";
    } else {
      return "Balanced";
    }
  }
  
  /**
   * Get effect description based on compound levels
   * @param {number} caffeine - Caffeine level
   * @param {number} lTheanine - L-theanine level
   * @param {boolean} shadeGrown - Whether the tea is shade-grown
   * @returns {string} Effect description
   */
  _getEffectDescription(caffeine, lTheanine, shadeGrown) {
    if (shadeGrown || (lTheanine >= 8 && caffeine >= 3 && caffeine <= 6)) {
      return "Creates focused calm with heightened sensory awareness and uplifting clarity";
    } else if (lTheanine >= 8 && caffeine <= 3) {
      return "Promotes tranquility and introspection with minimal stimulation";
    } else if (lTheanine >= 7 && caffeine >= 3 && caffeine <= 5) {
      return "Creates calm alertness with focus and minimal excitation";
    } else if (lTheanine >= 6 && lTheanine <= 8 && caffeine >= 4 && caffeine <= 6) {
      return "Provides balanced energy with rich umami character and focused alertness";
    } else if (caffeine >= 6 && caffeine <= 8 && lTheanine >= 3 && lTheanine <= 5) {
      return "Energizing with more stimulation than calming effect";
    } else if (caffeine >= 8 && lTheanine <= 3) {
      return "Highly stimulating with minimal calming influence";
    } else {
      return "Balanced energetic effect with moderate stimulation and calming properties";
    }
  }
  
  /**
   * Provides traditional TCM terminology for the compound balance
   * @param {number} caffeine - Caffeine level
   * @param {number} lTheanine - L-theanine level
   * @param {string} primaryElement - Primary element
   * @param {boolean} shadeGrown - Whether the tea is shade-grown
   * @returns {string} TCM analysis description
   */
  _getTcmAnalysis(caffeine, lTheanine, primaryElement, shadeGrown) {
    if (shadeGrown || (lTheanine >= 7 && caffeine >= 3 && caffeine <= 6 && primaryElement === 'water')) {
      return "Shade-grown character: strengthens Wood (seeking light) while nourishing Water (Yin preservation)";
    } else if (lTheanine >= 8 && caffeine <= 3) {
      return "Strong Yin character, nourishes Kidney and Heart";
    } else if (lTheanine >= 7 && caffeine <= 4) {
      return "Yin dominant, calms Shen (Spirit) and clears Heart Fire";
    } else if (lTheanine >= 6 && lTheanine <= 8 && caffeine >= 4 && caffeine <= 6) {
      if (lTheanine >= 6 && lTheanine <= 7 && caffeine >= 4 && caffeine <= 5) {
        return "Harmonized Yin-Yang with refined Yin influence, nurtures Liver and supports Shen";
      } else {
        return "Harmonized Yin-Yang with slight Yin emphasis, balances Qi";
      }
    } else if (caffeine >= 5 && caffeine <= 7 && lTheanine >= 4 && lTheanine <= 6) {
      return "Perfect Yin-Yang balance, harmonizes Qi and supports Spleen";
    } else if (caffeine >= 6 && caffeine <= 8 && lTheanine >= 3 && lTheanine <= 5) {
      return "Harmonized Yin-Yang with slight Yang emphasis, moves Qi";
    } else if (caffeine >= 8 && lTheanine <= 3) {
      return "Strong Yang character, may create Liver Fire";
    } else {
      return "Yang dominant, activates Qi and dispels stagnation";
    }
  }
}

export default CompoundElementMapper;