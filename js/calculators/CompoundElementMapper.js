// CompoundElementMapper.js
// Maps tea compounds (caffeine, L-theanine, etc.) to Five Elements

export class CompoundElementMapper {
  constructor(config) {
    this.config = config;
  }
  
  /**
   * Maps caffeine and L-theanine levels to Five Elements
   * 
   * @param {number} caffeineLevel - Caffeine level (1-10 scale)
   * @param {number} lTheanineLevel - L-theanine level (1-10 scale)
   * @returns {Object} Element scores object with elements as keys and weights (0-1) as values
   */
  mapCompoundsToElements(caffeineLevel, lTheanineLevel) {
    // Normalize inputs to ensure they're valid numbers in range
    const caffeine = Math.max(1, Math.min(10, caffeineLevel || 5));
    const lTheanine = Math.max(1, Math.min(10, lTheanineLevel || 5));
    
    // Calculate the ratio of L-theanine to caffeine for synergistic effects
    const ratio = lTheanine / caffeine;
    
    // Initialize element scores
    const elements = {
      wood: 0,
      fire: 0,
      earth: 0,
      metal: 0,
      water: 0
    };
    
    // Individual compound mapping - L-theanine
    const lTheanineWeight = 0.15; // Half of total compound weight (0.3)
    elements.wood += this._mapLTheanineToWood(lTheanine) * lTheanineWeight;
    elements.water += this._mapLTheanineToWater(lTheanine) * lTheanineWeight;
    elements.metal += this._mapLTheanineToMetal(lTheanine) * lTheanineWeight;
    elements.earth += this._mapLTheanineToEarth(lTheanine) * lTheanineWeight;
    elements.fire += this._mapLTheanineToFire(lTheanine) * lTheanineWeight;
    
    // Individual compound mapping - Caffeine
    const caffeineWeight = 0.15; // Half of total compound weight (0.3)
    elements.fire += this._mapCaffeineToFire(caffeine) * caffeineWeight;
    elements.wood += this._mapCaffeineToWood(caffeine) * caffeineWeight;
    elements.water += this._mapCaffeineToWater(caffeine) * caffeineWeight;
    elements.earth += this._mapCaffeineToEarth(caffeine) * caffeineWeight;
    elements.metal += this._mapCaffeineToMetal(caffeine) * caffeineWeight;
    
    // Apply synergistic ratio effects
    this._applyRatioAdjustments(elements, ratio);
    
    // Ensure all values are between 0 and 1
    Object.keys(elements).forEach(element => {
      elements[element] = Math.max(0, Math.min(1, elements[element]));
    });
    
    // Normalize to ensure total equals compound weight (0.3)
    this._normalizeElements(elements, 0.3);
    
    return elements;
  }
  
  /**
   * Normalizes element values to ensure they sum to the specified total
   * @param {Object} elements - Element scores object
   * @param {number} targetTotal - Target sum for all element scores
   */
  _normalizeElements(elements, targetTotal) {
    // Calculate current sum of all element values
    const currentTotal = Object.values(elements).reduce((sum, val) => sum + val, 0);
    
    // Skip normalization if sum is already 0 to avoid division by zero
    if (currentTotal === 0) return;
    
    // Apply normalization factor to each element
    const normalizationFactor = targetTotal / currentTotal;
    Object.keys(elements).forEach(element => {
      elements[element] *= normalizationFactor;
    });
  }
  
  // ------------- L-THEANINE ELEMENT MAPPINGS -------------
  
  /**
   * Maps L-theanine level to Wood element (Primary: 60-70%)
   * Supports liver function, promotes calm alertness
   */
  _mapLTheanineToWood(lTheanine) {
    // Primary element for L-theanine (60-70%)
    return 0.60 + (lTheanine / 10) * 0.10; // 0.60 to 0.70 range based on level
  }
  
  /**
   * Maps L-theanine level to Water element (Secondary: 20-30%)
   * Promotes deep calm, supports kidney yin
   */
  _mapLTheanineToWater(lTheanine) {
    // Secondary element for L-theanine (20-30%)
    return 0.20 + (lTheanine / 10) * 0.10; // 0.20 to 0.30 range based on level
  }
  
  /**
   * Maps L-theanine level to Metal element (Minor: 5-10%)
   * Cooling, clarifying effects
   */
  _mapLTheanineToMetal(lTheanine) {
    // Minor element for L-theanine (5-10%)
    return 0.05 + (lTheanine / 20) * 0.05; // 0.05 to 0.10 range based on level
  }
  
  /**
   * Maps L-theanine level to Earth element (Minimal: 3-5%)
   * Mild grounding effect
   */
  _mapLTheanineToEarth(lTheanine) {
    // Minimal element for L-theanine (3-5%)
    return 0.03 + (lTheanine / 50) * 0.02; // 0.03 to 0.05 range based on level
  }
  
  /**
   * Maps L-theanine level to Fire element (Minimal: 1-2%)
   * Very minimal influence
   */
  _mapLTheanineToFire(lTheanine) {
    // Minimal element for L-theanine (1-2%)
    return 0.01 + (lTheanine / 100) * 0.01; // 0.01 to 0.02 range based on level
  }
  
  // ------------- CAFFEINE ELEMENT MAPPINGS -------------
  
  /**
   * Maps caffeine level to Fire element (Primary: 60-70%)
   * Warming, stimulating, yang energy
   */
  _mapCaffeineToFire(caffeine) {
    // Primary element for caffeine (60-70%)
    return 0.60 + (caffeine / 10) * 0.10; // 0.60 to 0.70 range based on level
  }
  
  /**
   * Maps caffeine level to Wood element (Secondary: 15-20%)
   * Supports upward movement of qi
   */
  _mapCaffeineToWood(caffeine) {
    // Secondary element for caffeine (15-20%)
    return 0.15 + (caffeine / 20) * 0.05; // 0.15 to 0.20 range based on level
  }
  
  /**
   * Maps caffeine level to Water element (Minor: 5-10%)
   * Supports kidney yang in moderation
   */
  _mapCaffeineToWater(caffeine) {
    // Minor element for caffeine (5-10%)
    return 0.05 + (caffeine / 20) * 0.05; // 0.05 to 0.10 range based on level
  }
  
  /**
   * Maps caffeine level to Earth element (Minor: 5-8%)
   * Metabolic support
   */
  _mapCaffeineToEarth(caffeine) {
    // Minor element for caffeine (5-8%)
    return 0.05 + (caffeine / 33) * 0.03; // 0.05 to 0.08 range based on level
  }
  
  /**
   * Maps caffeine level to Metal element (Minimal: 2-3%)
   * Minimal influence
   */
  _mapCaffeineToMetal(caffeine) {
    // Minimal element for caffeine (2-3%)
    return 0.02 + (caffeine / 100) * 0.01; // 0.02 to 0.03 range based on level
  }
  
  /**
   * Apply adjustments based on L-theanine to caffeine ratio
   * Handles synergistic effects between compounds
   */
  _applyRatioAdjustments(elements, ratio) {
    if (ratio > 2) {
      // High Ratio (>2:1) - Boost Wood and Water, Reduce Fire, Slight boost to Metal
      elements.wood += 0.15;
      elements.water += 0.15;
      elements.fire -= 0.15;
      elements.metal += 0.05;
    } else if (ratio >= 1.5 && ratio <= 2) {
      // Shade-grown Japanese tea ratio (1.5-2:1) - Higher Wood boost, Balanced Water/Fire adjustment
      elements.wood += 0.18;  // Stronger boost to Wood for shade-grown teas
      elements.water += 0.10;
      elements.fire -= 0.08;
      elements.earth += 0.03;
    } else if (ratio >= 1 && ratio < 1.5) {
      // Moderate Ratio (1:1 to 1.5:1) - Moderate Wood boost, Slight Earth boost
      elements.wood += 0.08;
      elements.fire -= 0.03;
      elements.earth += 0.05;
    } else {
      // Low Ratio (<1:1) - Boost Fire, Reduce Water, Slight reduction in Metal
      elements.fire += 0.15;
      elements.water -= 0.10;
      elements.metal -= 0.05;
    }
  }
  
  /**
   * Analyzes the overall compound balance in TCM terms
   * 
   * @param {number} caffeineLevel - Caffeine level (1-10 scale)
   * @param {number} lTheanineLevel - L-theanine level (1-10 scale)
   * @returns {Object} Analysis with TCM terminology
   */
  analyzeCompoundBalance(caffeineLevel, lTheanineLevel) {
    const caffeine = Math.max(1, Math.min(10, caffeineLevel || 5));
    const lTheanine = Math.max(1, Math.min(10, lTheanineLevel || 5));
    const ratio = lTheanine / caffeine;
    
    // Map to Five Elements
    const elements = this.mapCompoundsToElements(caffeine, lTheanine);
    
    // Determine primary compound character
    let primaryNature;
    if (ratio > 2.5) {
      primaryNature = "Yin dominant";
    } else if (ratio < 1.0) {
      primaryNature = "Yang dominant";
    } else {
      primaryNature = "Balanced";
    }
    
    // Determine secondary characteristics
    let secondaryNature = [];
    
    if (caffeine >= 7) secondaryNature.push("Warming");
    if (caffeine <= 3) secondaryNature.push("Mild");
    if (lTheanine >= 7) secondaryNature.push("Calming");
    if (lTheanine <= 3) secondaryNature.push("Light");
    
    // Add specialized descriptions for shade-grown teas with specific ratio ranges
    if (ratio >= 1.5 && ratio <= 2.0) {
      secondaryNature.push("Harmonizing (Shade-grown character)");
    } else if (ratio >= 1.8 && ratio <= 2.2) {
      secondaryNature.push("Harmonizing");
    } else if (ratio > 3) {
      secondaryNature.push("Deeply calming");
    } else if (ratio < 0.8) {
      secondaryNature.push("Strongly activating");
    }
    
    // Overall effect description
    let effectDescription;
    if (ratio > 3) {
      effectDescription = "Promotes tranquility and introspection with minimal stimulation";
    } else if (ratio > 2 && ratio <= 3) {
      effectDescription = "Creates calm alertness with focus and minimal excitation";
    } else if (ratio >= 1.5 && ratio <= 2) {
      effectDescription = "Provides balanced energy with rich umami character and focused alertness";
    } else if (ratio >= 0.8 && ratio < 1.5) {
      effectDescription = "Energizing with more stimulation than calming effect";
    } else {
      effectDescription = "Highly stimulating with minimal calming influence";
    }
    
    return {
      elements,
      primaryNature,
      secondaryNature: secondaryNature.join(", "),
      effectDescription,
      caffeineLevel: caffeine,
      lTheanineLevel: lTheanine,
      ratio,
      tcmAnalysis: this._getTcmAnalysis(ratio, caffeine, lTheanine)
    };
  }
  
  /**
   * Provides traditional TCM terminology for the compound balance
   */
  _getTcmAnalysis(ratio, caffeine, lTheanine) {
    if (ratio > 3 && lTheanine > 7) {
      return "Strong Yin character, nourishes Kidney and Heart";
    } else if (ratio > 2.5) {
      return "Yin dominant, calms Shen (Spirit) and clears Heart Fire";
    } else if (ratio >= 1.5 && ratio <= 2.5) {
      if (ratio >= 1.5 && ratio <= 2.0 && lTheanine >= 7) {
        return "Harmonized Yin-Yang with refined Yin influence, nurtures Liver and supports Shen";
      } else {
        return "Harmonized Yin-Yang with slight Yin emphasis, balances Qi";
      }
    } else if (ratio >= 1.3 && ratio < 1.5) {
      return "Perfect Yin-Yang balance, harmonizes Qi and supports Spleen";
    } else if (ratio >= 0.8 && ratio < 1.3) {
      return "Harmonized Yin-Yang with slight Yang emphasis, moves Qi";
    } else if (ratio < 0.8 && caffeine > 7) {
      return "Strong Yang character, may create Liver Fire";
    } else {
      return "Yang dominant, activates Qi and dispels stagnation";
    }
  }
}

export default CompoundElementMapper;