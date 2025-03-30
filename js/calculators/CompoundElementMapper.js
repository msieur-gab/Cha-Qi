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
    
    // Calculate the ratio of L-theanine to caffeine (important for balance)
    const ratio = lTheanine / caffeine;
    
    // Initialize element scores
    const elements = {
      wood: 0,
      fire: 0,
      earth: 0,
      metal: 0,
      water: 0
    };
    
    // Caffeine primarily contributes to Fire (stimulation) and secondarily to Wood (activity)
    elements.fire += this._mapCaffeineToFire(caffeine);
    elements.wood += this._mapCaffeineToWood(caffeine);
    
    // L-theanine primarily contributes to Water (calmness) and secondarily to Metal (clarity)
    elements.water += this._mapLTheanineToWater(lTheanine);
    elements.metal += this._mapLTheanineToMetal(lTheanine);
    
    // The balance/ratio contributes to Earth (harmony)
    elements.earth += this._mapRatioToEarth(ratio);
    
    // Ensure all values are between 0 and 1
    Object.keys(elements).forEach(element => {
      elements[element] = Math.max(0, Math.min(1, elements[element]));
    });
    
    return elements;
  }
  
  /**
   * Maps caffeine level to Fire element
   * Higher caffeine = higher Fire score
   */
  _mapCaffeineToFire(caffeine) {
    // Non-linear mapping that accelerates as caffeine increases
    // 1-3: Low contribution
    // 4-7: Moderate contribution
    // 8-10: High contribution
    if (caffeine <= 3) {
      return 0.1 + (caffeine - 1) * 0.1; // 0.1 to 0.3
    } else if (caffeine <= 7) {
      return 0.3 + (caffeine - 3) * 0.125; // 0.3 to 0.8
    } else {
      return 0.8 + (caffeine - 7) * 0.067; // 0.8 to 1.0
    }
  }
  
  /**
   * Maps caffeine level to Wood element
   * Moderate caffeine = optimal Wood score
   */
  _mapCaffeineToWood(caffeine) {
    // Bell curve distribution - peaks at caffeine level 5-6
    // Represents that moderate caffeine supports proper activity and flexibility
    if (caffeine <= 5) {
      return 0.1 + (caffeine - 1) * 0.12; // 0.1 to 0.58
    } else {
      return 0.58 - (caffeine - 5) * 0.08; // 0.58 down to 0.18
    }
  }
  
  /**
   * Maps L-theanine level to Water element
   * Higher L-theanine = higher Water score
   */
  _mapLTheanineToWater(lTheanine) {
    // Relatively linear mapping with some acceleration at higher levels
    if (lTheanine <= 5) {
      return 0.1 + (lTheanine - 1) * 0.08; // 0.1 to 0.42
    } else {
      return 0.42 + (lTheanine - 5) * 0.116; // 0.42 to 1.0
    }
  }
  
  /**
   * Maps L-theanine level to Metal element
   * Moderate-high L-theanine = optimal Metal score
   */
  _mapLTheanineToMetal(lTheanine) {
    // Rises to a plateau - Metal element relates to the clarity L-theanine provides
    // but reaches diminishing returns
    if (lTheanine <= 6) {
      return 0.1 + (lTheanine - 1) * 0.12; // 0.1 to 0.7
    } else {
      return 0.7; // Plateaus at 0.7
    }
  }
  
  /**
   * Maps L-theanine/caffeine ratio to Earth element
   * Balanced ratio (around 2:1) = highest Earth score
   */
  _mapRatioToEarth(ratio) {
    // Bell curve centered around ideal ratio of ~2
    // TCM philosophy values balance - Earth represents harmony
    
    const idealRatio = this.config.get('compounds.idealLTheanineCaffeineRatio') || 2.0;
    const deviation = Math.abs(ratio - idealRatio);
    
    if (deviation <= 0.5) {
      return 0.8 - deviation * 0.2; // 0.8 to 0.7
    } else if (deviation <= 1.5) {
      return 0.7 - (deviation - 0.5) * 0.3; // 0.7 to 0.4
    } else {
      return Math.max(0.1, 0.4 - (deviation - 1.5) * 0.1); // 0.4 down to 0.1
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
    
    if (ratio >= 1.8 && ratio <= 2.2) secondaryNature.push("Harmonizing");
    if (ratio > 3) secondaryNature.push("Deeply calming");
    if (ratio < 0.8) secondaryNature.push("Strongly activating");
    
    // Overall effect description
    let effectDescription;
    if (ratio > 3) {
      effectDescription = "Promotes tranquility and introspection with minimal stimulation";
    } else if (ratio > 2 && ratio <= 3) {
      effectDescription = "Creates calm alertness with focus and minimal excitation";
    } else if (ratio >= 1.5 && ratio <= 2) {
      effectDescription = "Provides balanced energy with equal parts clarity and vitality";
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
    } else if (ratio > 1.8 && ratio <= 2.5) {
      return "Harmonized Yin-Yang with slight Yin emphasis, balances Qi";
    } else if (ratio >= 1.3 && ratio <= 1.8) {
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