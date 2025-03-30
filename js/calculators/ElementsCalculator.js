// ElementsCalculator.js
// Core calculator that combines all element mappings with appropriate weights

import { elementDefinitions, elementRelationships } from '../data/ElementDefinitions.js';

export class ElementsCalculator {
  constructor(config, flavorMapper, compoundMapper, processingMapper, geographyMapper) {
    this.config = config;
    this.flavorMapper = flavorMapper;
    this.compoundMapper = compoundMapper;
    this.processingMapper = processingMapper;
    this.geographyMapper = geographyMapper;
  }
  
  /**
   * Calculates tea's Five Element distribution based on all attributes
   * 
   * @param {Object} tea - Tea object with all properties
   * @returns {Object} Element scores and analysis
   */
  calculateElements(tea) {
    if (!tea) {
      return {
        elements: this._getDefaultElements(),
        dominantElement: null,
        supportingElement: null,
        analysis: "Insufficient tea data for analysis"
      };
    }
    
    // Get component element scores
    const flavorElements = this._calculateFlavorElements(tea);
    const compoundElements = this._calculateCompoundElements(tea);
    const processingElements = this._calculateProcessingElements(tea);
    const geographyElements = this._calculateGeographyElements(tea);
    
    // Get component weights from config
    const weights = {
      flavor: this.config.get('elementWeights.flavor') || 0.4,     // 40% weight
      compounds: this.config.get('elementWeights.compounds') || 0.3, // 30% weight
      processing: this.config.get('elementWeights.processing') || 0.2, // 20% weight
      geography: this.config.get('elementWeights.geography') || 0.1  // 10% weight
    };
    
    // Ensure weights sum to 1.0
    const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
    Object.keys(weights).forEach(key => {
      weights[key] = weights[key] / totalWeight;
    });
    
    // Combine element scores with proper weighting
    const combinedElements = this._combineElementScores([
      { elements: flavorElements, weight: weights.flavor },
      { elements: compoundElements, weight: weights.compounds },
      { elements: processingElements, weight: weights.processing },
      { elements: geographyElements, weight: weights.geography }
    ]);
    
    // Apply element interactions based on generating and controlling cycles
    const adjustedElements = this._applyElementInteractions(combinedElements);
    
    // Identify dominant and supporting elements
    const sortedElements = Object.entries(adjustedElements)
      .sort(([, a], [, b]) => b - a);
    
    const dominantElement = sortedElements[0][0];
    const supportingElement = sortedElements[1][0];
    
    // Generate element analysis
    const analysis = this._generateElementAnalysis(
      adjustedElements, 
      dominantElement, 
      supportingElement,
      tea
    );
    
    // Calculate component contributions
    const contributions = this._calculateComponentContributions(
      tea, 
      flavorElements, 
      compoundElements, 
      processingElements, 
      geographyElements,
      weights
    );
    
    return {
      elements: adjustedElements,
      rawElements: combinedElements,
      dominantElement,
      supportingElement,
      elementPair: `${dominantElement}+${supportingElement}`,
      analysis,
      contributions,
      componentScores: {
        flavor: flavorElements,
        compounds: compoundElements,
        processing: processingElements,
        geography: geographyElements
      }
    };
  }
  
  /**
   * Default element distribution
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
  
  /**
   * Calculate flavor element scores
   */
  _calculateFlavorElements(tea) {
    if (!tea.flavorProfile || !Array.isArray(tea.flavorProfile) || tea.flavorProfile.length === 0) {
      return this._getDefaultElements();
    }
    
    const elements = this._getDefaultElements();
    let totalWeight = 0;
    
    // Process each flavor and apply diminishing returns for multiple similar flavors
    const flavorCounts = {};
    
    tea.flavorProfile.forEach(flavor => {
      // Track flavor occurrences for diminishing returns
      const flavorKey = flavor.toLowerCase();
      flavorCounts[flavorKey] = (flavorCounts[flavorKey] || 0) + 1;
      
      // Get flavor element mapping
      const flavorElements = this.flavorMapper.mapFlavorToElements(flavorKey);
      if (!flavorElements) return;
      
      // Apply diminishing returns for repeated flavors
      const repetitionFactor = this._calculateDiminishingReturns(flavorCounts[flavorKey]);
      
      // Add weighted flavor contribution
      Object.keys(elements).forEach(element => {
        if (flavorElements[element]) {
          elements[element] += flavorElements[element] * repetitionFactor;
          totalWeight += flavorElements[element] * repetitionFactor;
        }
      });
    });
    
    // Normalize element scores
    if (totalWeight > 0) {
      Object.keys(elements).forEach(element => {
        elements[element] = elements[element] / totalWeight;
      });
    }
    
    return elements;
  }
  
  /**
   * Calculate compound element scores (caffeine, L-theanine)
   */
  _calculateCompoundElements(tea) {
    if (tea.caffeineLevel === undefined || tea.lTheanineLevel === undefined) {
      return this._getDefaultElements();
    }
    
    // Map compounds to elements
    return this.compoundMapper.mapCompoundsToElements(
      tea.caffeineLevel,
      tea.lTheanineLevel
    );
  }
  
  /**
   * Calculate processing method element scores
   */
  _calculateProcessingElements(tea) {
    if (!tea.processingMethods || !Array.isArray(tea.processingMethods) || tea.processingMethods.length === 0) {
      // Fall back to tea type if specific processing methods aren't available
      if (tea.type) {
        return this.processingMapper.mapTeaTypeToElements(tea.type);
      }
      return this._getDefaultElements();
    }
    
    const elements = this._getDefaultElements();
    let totalWeight = 0;
    
    // Process each method
    tea.processingMethods.forEach(method => {
      const methodElements = this.processingMapper.mapProcessingToElements(method);
      if (!methodElements) return;
      
      // Add weighted method contribution
      Object.keys(elements).forEach(element => {
        if (methodElements[element]) {
          elements[element] += methodElements[element];
          totalWeight += methodElements[element];
        }
      });
    });
    
    // Normalize element scores
    if (totalWeight > 0) {
      Object.keys(elements).forEach(element => {
        elements[element] = elements[element] / totalWeight;
      });
    }
    
    return elements;
  }
  
  /**
   * Calculate geography element scores
   */
  _calculateGeographyElements(tea) {
    if (!tea.geography) {
      return this._getDefaultElements();
    }
    
    return this.geographyMapper.mapGeographyToElements(tea.geography);
  }
  
  /**
   * Combine element scores from multiple sources with weights
   */
  _combineElementScores(weightedElements) {
    const combinedElements = this._getDefaultElements();
    
    // Reset values
    Object.keys(combinedElements).forEach(element => {
      combinedElements[element] = 0;
    });
    
    // Calculate total weight to ensure normalization
    const totalWeight = weightedElements.reduce((sum, item) => sum + (item.weight || 0), 0);
    
    // Add weighted contributions
    weightedElements.forEach(item => {
      if (!item.elements || !item.weight) return;
      
      const normalizedWeight = item.weight / totalWeight;
      
      Object.keys(item.elements).forEach(element => {
        if (combinedElements[element] !== undefined) {
          combinedElements[element] += item.elements[element] * normalizedWeight;
        }
      });
    });
    
    return combinedElements;
  }
  
  /**
   * Apply Five Element interactions based on generating and controlling cycles
   */
  _applyElementInteractions(elements) {
    const adjustedElements = {...elements};
    
    // Get interaction strengths from config
    const generatingStrength = this.config.get('elementInteractions.generatingStrength') || 0.05;
    const controllingStrength = this.config.get('elementInteractions.controllingStrength') || 0.03;
    
    // Apply generating cycle (enhances the generated element)
    Object.keys(elementRelationships.generating).forEach(generator => {
      const generated = elementRelationships.generating[generator];
      const interactionStrength = elements[generator] * generatingStrength;
      adjustedElements[generated] += interactionStrength;
    });
    
    // Apply controlling cycle (reduces the controlled element)
    Object.keys(elementRelationships.controlling).forEach(controller => {
      const controlled = elementRelationships.controlling[controller];
      const interactionStrength = elements[controller] * controllingStrength;
      adjustedElements[controlled] = Math.max(0, adjustedElements[controlled] - interactionStrength);
    });
    
    // Re-normalize to ensure all elements sum to 1.0
    const total = Object.values(adjustedElements).reduce((sum, val) => sum + val, 0);
    Object.keys(adjustedElements).forEach(element => {
      adjustedElements[element] = adjustedElements[element] / total;
    });
    
    return adjustedElements;
  }
  
  /**
   * Calculate diminishing returns for repeated factors
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
   * Generate analysis of element distribution
   */
  _generateElementAnalysis(elements, dominant, supporting, tea) {
    // Get element definitions
    const dominantDef = elementDefinitions[dominant];
    const supportingDef = elementDefinitions[supporting];
    
    if (!dominantDef || !supportingDef) {
      return "Unable to generate element analysis due to missing element definitions.";
    }
    
    // Calculate element distribution characteristics
    const elementStrengths = this._analyzeElementDistribution(elements);
    
    // Generate basic TCM analysis
    let analysis = `This tea demonstrates a ${dominant}-${supporting} character, combining the ${dominantDef.name} (${dominantDef.chineseName}) and ${supportingDef.name} (${supportingDef.chineseName}) elements. `;
    
    // Add dominant element description
    analysis += `The dominant ${dominantDef.name} element (${(elements[dominant] * 100).toFixed(1)}%) indicates ${this._getDominantElementDescription(dominant, tea)}. `;
    
    // Add supporting element description
    analysis += `This is complemented by the ${supportingDef.name} element (${(elements[supporting] * 100).toFixed(1)}%), which adds ${this._getSupportingElementDescription(supporting, dominant, tea)}.`;
    
    // Add balance analysis
    if (elementStrengths.balanced) {
      analysis += ` The tea shows good elemental balance, suggesting versatility and harmonious effects.`;
    } else if (elementStrengths.dominant) {
      analysis += ` The ${dominantDef.name} element strongly dominates this tea's character, making its effects particularly pronounced.`;
    }
    
    // Add seasonal analysis
    analysis += ` According to TCM principles, this tea would be particularly beneficial during ${dominantDef.season} and ${supportingDef.season}.`;
    
    return analysis;
  }
  
  /**
   * Analyze element distribution characteristics
   */
  _analyzeElementDistribution(elements) {
    // Sort elements by score
    const sortedElements = Object.entries(elements)
      .sort(([, a], [, b]) => b - a);
    
    const dominantScore = sortedElements[0][1];
    const supportingScore = sortedElements[1][1];
    const weakestScore = sortedElements[4][1];
    
    // Calculate metrics
    const dominantRatio = dominantScore / supportingScore;
    const rangeRatio = dominantScore / weakestScore;
    
    return {
      balanced: rangeRatio < 3.0,
      dominant: dominantRatio > 1.8,
      evenDistribution: Math.max(...Object.values(elements)) < 0.3
    };
  }
  
  /**
   * Get description for dominant element
   */
  _getDominantElementDescription(element, tea) {
    const descriptions = {
      wood: "active vitality, upward energy, and growth-oriented properties",
      fire: "warming, stimulating, and transformative qualities",
      earth: "centering, nourishing, and grounding characteristics",
      metal: "clarity, refinement, and precision in its effects",
      water: "depth, introspection, and restorative properties"
    };
    
    // Add specific details based on tea type or processing
    let additionalContext = "";
    
    if (tea.type) {
      if (element === "wood" && ["green", "white"].includes(tea.type.toLowerCase())) {
        additionalContext = " This aligns well with the minimal processing of this tea type";
      } else if (element === "fire" && ["black", "dark"].includes(tea.type.toLowerCase())) {
        additionalContext = " This is enhanced by the full oxidation of this tea type";
      } else if (element === "earth" && ["oolong", "yellow"].includes(tea.type.toLowerCase())) {
        additionalContext = " This reflects the balanced processing approach of this tea type";
      } else if (element === "metal" && ["green", "white", "yellow"].includes(tea.type.toLowerCase())) {
        additionalContext = " This is characteristic of the clarity found in less-oxidized teas";
      } else if (element === "water" && ["puerh", "dark"].includes(tea.type.toLowerCase())) {
        additionalContext = " This is typical of aged or fermented tea types";
      }
    }
    
    return descriptions[element] + additionalContext;
  }
  
  /**
   * Get description for supporting element
   */
  _getSupportingElementDescription(element, dominantElement, tea) {
    const supportDescriptions = {
      wood: {
        fire: "dynamic vitality and fresh energy",
        earth: "vibrant qualities balanced with stability",
        metal: "active movement tempered with clarity",
        water: "flexible growth with underlying depth"
      },
      fire: {
        wood: "warming transformation with active energy",
        earth: "stimulating qualities with centering balance",
        metal: "bright intensity with refined precision",
        water: "warming activation balanced with depth"
      },
      earth: {
        wood: "grounding stability with active vitality",
        fire: "nourishing balance with warming qualities",
        metal: "centered harmony with refined clarity",
        water: "stable foundation with deep complexity"
      },
      metal: {
        wood: "precise clarity with vibrant freshness",
        fire: "refined definition with stimulating qualities",
        earth: "structured precision with nourishing stability",
        water: "clear definition with underlying depth"
      },
      water: {
        wood: "deep complexity with flexible vitality",
        fire: "introspective depth with activating warmth",
        earth: "profound restoration with grounding stability",
        metal: "deep complexity with clarifying precision"
      }
    };
    
    return supportDescriptions[element][dominantElement] || "complementary qualities";
  }
  
  /**
   * Calculate component contributions to overall element profile
   */
  _calculateComponentContributions(tea, flavorElements, compoundElements, processingElements, geographyElements, weights) {
    const dominantElementContributions = {};
    
    // Get combined elements
    const combinedElements = this._combineElementScores([
      { elements: flavorElements, weight: weights.flavor },
      { elements: compoundElements, weight: weights.compounds },
      { elements: processingElements, weight: weights.processing },
      { elements: geographyElements, weight: weights.geography }
    ]);
    
    // Find dominant element
    const dominantElement = Object.entries(combinedElements)
      .sort(([, a], [, b]) => b - a)[0][0];
    
    // Calculate each component's contribution to the dominant element
    const components = [
      { name: "Flavor Profile", elements: flavorElements, weight: weights.flavor },
      { name: "Compound Balance", elements: compoundElements, weight: weights.compounds },
      { name: "Processing Methods", elements: processingElements, weight: weights.processing },
      { name: "Geographical Factors", elements: geographyElements, weight: weights.geography }
    ];
    
    // Calculate contribution for each component
    components.forEach(component => {
      const rawContribution = component.elements[dominantElement] * component.weight;
      const percentageOfTotal = rawContribution / combinedElements[dominantElement];
      
      dominantElementContributions[component.name] = {
        elementValue: component.elements[dominantElement],
        weight: component.weight,
        rawContribution,
        percentageOfTotal
      };
    });
    
    return {
      dominantElement,
      contributions: dominantElementContributions
    };
  }
}