// ElementsCalculator.js
// Core calculator that combines all element mappings with appropriate weights

import { elementDefinitions, elementRelationships } from '../data/ElementDefinitions.js';
import ThermalFactorCalculator from './ThermalFactorCalculator.js';

export class ElementsCalculator {
  constructor(config, flavorMapper, compoundMapper, processingMapper, geographyMapper) {
    this.config = config;
    this.flavorMapper = flavorMapper; // Now uses FlavorProfileMapper from calculators/
    this.compoundMapper = compoundMapper;
    this.processingMapper = processingMapper;
    this.geographyMapper = geographyMapper;
    
    // Initialize thermal factor calculator
    this.thermalCalculator = new ThermalFactorCalculator(this.config);
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
        elements: this._getZeroElements(),
        dominantElement: null,
        supportingElement: null,
        analysis: "Insufficient tea data for analysis"
      };
    }
    
    // Get component weights from config
    const weights = {
      flavor: this.config.get('elementWeights.flavor') || 0.4,     // 40% weight
      compounds: this.config.get('elementWeights.compounds') || 0.3, // 30% weight
      processing: this.config.get('elementWeights.processing') || 0.2, // 20% weight
      geography: this.config.get('elementWeights.geography') || 0.1   // 10% weight
    };
    
    // Get component element scores - will be null if data isn't available
    const flavorElements = this._calculateFlavorElements(tea);
    const compoundElements = this._calculateCompoundElements(tea);
    const processingElements = this._calculateProcessingElements(tea);
    const geographyElements = this._calculateGeographyElements(tea);
    
    // Create an array of component elements with their respective weights,
    // but only include components that actually have data
    const weightedElements = [];
    
    if (flavorElements) {
      weightedElements.push({ elements: flavorElements, weight: weights.flavor });
    }
    
    if (compoundElements) {
      weightedElements.push({ elements: compoundElements, weight: weights.compounds });
    }
    
    if (processingElements) {
      weightedElements.push({ elements: processingElements, weight: weights.processing });
    }
    
    if (geographyElements) {
      weightedElements.push({ elements: geographyElements, weight: weights.geography });
    }
    
    // If no valid components are available, return with insufficient data
    if (weightedElements.length === 0) {
      return {
        elements: this._getZeroElements(),
        dominantElement: null,
        supportingElement: null,
        analysis: "Insufficient tea data for analysis"
      };
    }
    
    // Check if any weights are 1.0, which means we should only use that component
    const hasExclusiveWeight = weightedElements.some(item => item.weight >= 1.0);
    
    // If there's a component with weight 1.0, set others to 0
    if (hasExclusiveWeight) {
      weightedElements.forEach(item => {
        item.weight = item.weight >= 1.0 ? 1.0 : 0.0;
      });
    } else {
      // Ensure weights sum to 1.0 by normalizing only the included components
      const totalWeight = weightedElements.reduce((sum, item) => sum + item.weight, 0);
      if (totalWeight > 0) {
        weightedElements.forEach(item => {
          item.weight = item.weight / totalWeight;
        });
      }
    }
    
    // Combine element scores with proper weighting
    const combinedElements = this._combineElementScores(weightedElements);
    
    // Calculate thermal factors and analysis
    const thermalAnalysis = this.thermalCalculator.calculateTotalThermal(tea);
    
    // Apply thermal adjustments to elements
    const thermalAdjustedElements = this.thermalCalculator.applyThermalAdjustments(
      combinedElements, 
      thermalAnalysis.totalThermal
    );
    
    // Apply element interactions based on generating and controlling cycles
    const adjustedElements = this._applyElementInteractions(thermalAdjustedElements);
    
    // Identify dominant and supporting elements
    const sortedElements = Object.entries(adjustedElements)
      .sort(([, a], [, b]) => b - a);
    
    // If we have valid element scores, identify dominant elements
    let dominantElement = null;
    let supportingElement = null;
    let analysis = "Insufficient tea data for comprehensive analysis";
    
    if (sortedElements.length >= 2 && sortedElements[0][1] > 0) {
      dominantElement = sortedElements[0][0];
      supportingElement = sortedElements[1][0];
      
      // Generate element analysis
      analysis = this._generateElementAnalysis(
        adjustedElements, 
        dominantElement, 
        supportingElement,
        tea
      );
    }
    
    // Calculate component contributions
    const contributions = this._calculateComponentContributions(
      tea, 
      flavorElements || this._getZeroElements(),
      compoundElements || this._getZeroElements(), 
      processingElements || this._getZeroElements(), 
      geographyElements || this._getZeroElements(),
      weights,
      weightedElements
    );
    
    return {
      elements: adjustedElements,
      rawElements: combinedElements,
      thermalAdjustedElements: thermalAdjustedElements,
      dominantElement,
      supportingElement,
      elementPair: dominantElement && supportingElement ? `${dominantElement}+${supportingElement}` : null,
      analysis,
      contributions,
      componentScores: {
        flavor: flavorElements || this._getZeroElements(),
        compounds: compoundElements || this._getZeroElements(),
        processing: processingElements || this._getZeroElements(),
        geography: geographyElements || this._getZeroElements()
      },
      thermalAnalysis: thermalAnalysis  // Add thermal analysis to the result
    };
  }
  
  /**
   * Zero element distribution for when no data is available
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
  
  /**
   * Calculate flavor element scores
   */
  _calculateFlavorElements(tea) {
    if (!tea.flavorProfile || !Array.isArray(tea.flavorProfile) || tea.flavorProfile.length === 0) {
      return null; // Return null to indicate no data available
    }
    
    // Use the direct mapping from flavor mapper
    return this.flavorMapper.mapFlavorProfileToElements(tea.flavorProfile);
  }
  
  /**
   * Calculate compound element scores (caffeine, L-theanine)
   */
  _calculateCompoundElements(tea) {
    if (tea.caffeineLevel === undefined || tea.lTheanineLevel === undefined) {
      return null; // Return null to indicate no data available
    }
    
    // Map compounds to elements
    return this.compoundMapper.mapCompoundsToElements(
      tea.caffeineLevel,
      tea.lTheanineLevel,
      // Check if tea is shade-grown
      tea.processingMethods && tea.processingMethods.includes('shade-grown')
    );
  }
  
  /**
   * Calculate processing method element scores
   */
  _calculateProcessingElements(tea) {
    // Check if processing methods should be ignored based on configuration
    if (this.config.processing && this.config.processing.ignoreProcessingMethods) {
      console.log("[ElementsCalculator] Ignoring processing methods due to configuration");
      return null; // Return null to indicate no data used
    }

    const processingMethods = tea.processingMethods || [];
    
    // If no processing methods defined, return null
    if (!processingMethods.length) {
      return null; // Return null to indicate no data available
    }
    
    // If tea has processing methods, use them
    if (tea.processingMethods && Array.isArray(tea.processingMethods) && tea.processingMethods.length > 0) {
      const elements = this._getZeroElements();
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
        return elements;
      }
    }
    
    return null; // Return null if no valid data processed
  }
  
  /**
   * Calculate geography element scores
   */
  _calculateGeographyElements(tea) {
    if (!tea.geography) {
      return null; // Return null to indicate no data available
    }
    
    return this.geographyMapper.mapGeographyToElements(tea.geography);
  }
  
  /**
   * Combine element scores from multiple sources with weights
   */
  _combineElementScores(weightedElements) {
    // Initialize with zeros
    const combinedElements = this._getZeroElements();
    
    // Filter out items with zero weights or missing elements
    const validElements = weightedElements.filter(item => 
      item.elements && 
      item.weight && 
      item.weight > 0
    );
    
    // If no valid elements, return zero distribution
    if (validElements.length === 0) {
      return this._getZeroElements();
    }
    
    // Calculate total weight to ensure normalization (only for valid items)
    const totalWeight = validElements.reduce((sum, item) => sum + item.weight, 0);
    
    // Add weighted contributions
    validElements.forEach(item => {
      const normalizedWeight = item.weight / totalWeight;
      
      Object.keys(combinedElements).forEach(element => {
        if (item.elements[element] !== undefined) {
          combinedElements[element] += item.elements[element] * normalizedWeight;
        }
      });
    });
    
    // Ensure the combined scores sum to 1.0
    const total = Object.values(combinedElements).reduce((sum, val) => sum + val, 0);
    if (total > 0) {
      Object.keys(combinedElements).forEach(element => {
        combinedElements[element] = combinedElements[element] / total;
      });
    }
    
    return combinedElements;
  }
  
  /**
   * Apply Five Element interactions based on generating and controlling cycles
   */
  _applyElementInteractions(elements) {
    // First check if element interactions are enabled in the config
    const interactionsEnabled = this.config.get('elementInteractions.enabled');
    
    // If interactions are disabled, return the original elements without modification
    if (interactionsEnabled === false) {
      return {...elements};
    }
    
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
    if (total > 0) {
      Object.keys(adjustedElements).forEach(element => {
        adjustedElements[element] = adjustedElements[element] / total;
      });
    }
    
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
      const teaType = tea.type.toLowerCase().trim();
      
      // Handle standard tea types
      if (element === "wood" && ["green", "white"].includes(teaType)) {
        additionalContext = " This aligns well with the minimal processing of this tea type";
      } else if (element === "fire" && ["black"].includes(teaType)) {
        additionalContext = " This is enhanced by the full oxidation of this tea type";
      } else if (element === "earth" && ["oolong", "yellow"].includes(teaType)) {
        additionalContext = " This reflects the balanced processing approach of this tea type";
      } else if (element === "metal" && ["green", "white", "yellow"].includes(teaType)) {
        additionalContext = " This is characteristic of the clarity found in less-oxidized teas";
      } 
      // Handle dark tea family with specific descriptions
      else if (element === "water" && ["dark", "puerh", "pu-erh", "sheng", "shou", "raw puerh", "ripe puerh"].includes(teaType)) {
        if (["sheng", "raw puerh"].includes(teaType)) {
          additionalContext = " This is characteristic of raw pu-erh with its aging potential and subtle depth";
        } else if (["shou", "ripe puerh"].includes(teaType)) {
          additionalContext = " This is prominent in ripe pu-erh with its earthy, smooth character from accelerated fermentation";
        } else {
          additionalContext = " This is typical of aged or fermented dark tea types";
        }
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
  _calculateComponentContributions(tea, flavorElements, compoundElements, processingElements, geographyElements, weights, weightedElements) {
    const dominantElementContributions = {};
    
    // Prepare component data
    const components = [
      { name: "Flavor Profile", elements: flavorElements, weight: weights.flavor },
      { name: "Compound Balance", elements: compoundElements, weight: weights.compounds },
      { name: "Processing Methods", elements: processingElements, weight: weights.processing },
      { name: "Geographical Factors", elements: geographyElements, weight: weights.geography }
    ];
    
    // Filter to only valid components with non-zero weights
    const validComponents = components.filter(component => 
      component.elements && 
      component.weight && 
      component.weight > 0
    );
    
    // Get combined elements (direct reference to avoid recalculating)
    const combinedElements = this._combineElementScores(weightedElements);
    
    // Find dominant element
    const dominantElement = Object.entries(combinedElements)
      .sort(([, a], [, b]) => b - a)[0][0];
    
    // If there are no valid components or dominantElement is invalid, return empty
    if (validComponents.length === 0 || !dominantElement) {
      return {
        dominantElement: null,
        contributions: {}
      };
    }
    
    // Calculate contribution for each component
    validComponents.forEach(component => {
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