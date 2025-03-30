// EffectsDeriver.js
// Derives TCM effects, benefits, and recommendations from Five Element analysis

import { elementDefinitions } from '../data/ElementDefinitions.js';
import { seasonalAssociations, seasonalGuidance, monthToSeason, seasonTransitions } from '../data/seasonalAssociations.js';
export class EffectsDeriver {
  constructor(config, elementCombinations) {
    this.config = config;
    this.elementCombinations = elementCombinations;
  }
  
  /**
   * Derives complete tea effect profile based on element analysis
   * 
   * @param {Object} elementAnalysis - Object containing element scores and analysis
   * @param {Object} tea - Tea object with all properties
   * @returns {Object} Complete effect profile with TCM analysis
   */
  deriveEffects(elementAnalysis, tea) {
    if (!elementAnalysis || !elementAnalysis.elements) {
      return {
        error: "Insufficient element analysis data"
      };
    }
    
    // Get the dominant element combination
    const dominantElement = elementAnalysis.dominantElement;
    const supportingElement = elementAnalysis.supportingElement;
    const elementPair = `${dominantElement}+${supportingElement}`;
    const reversePair = `${supportingElement}+${dominantElement}`;
    
    // Get combination definition
    const combinationEffect = this.elementCombinations[elementPair] || 
                             this.elementCombinations[reversePair] || 
                             this._generateDefaultCombination(dominantElement, supportingElement);
    
    // Generate specific effects and benefits
    const specificEffects = this._deriveSpecificEffects(elementAnalysis.elements, tea);
    const healthBenefits = this._deriveHealthBenefits(elementAnalysis.elements, tea);
    const bodySystemsAffected = this._deriveBodySystems(elementAnalysis.elements);
    const emotionalEffects = this._deriveEmotionalEffects(elementAnalysis.elements, tea);
    const flavorEffectCorrelation = this._deriveFlavorEffectCorrelation(tea, elementAnalysis);
    
    // Generate personalized recommendations
    const recommendations = this._generateRecommendations(elementAnalysis.elements, tea);
    
    // Calculate element combination signature
    const elementSignature = this._calculateElementSignature(elementAnalysis.elements);
    
    // Calculate seasonal appropriateness
    const seasonality = this._calculateSeasonalAppropriateness(elementAnalysis.elements);
    
    return {
      name: combinationEffect.name,
      description: combinationEffect.description,
      primaryElement: {
        name: dominantElement,
        chineseName: elementDefinitions[dominantElement].chineseName,
        score: elementAnalysis.elements[dominantElement],
        properties: elementDefinitions[dominantElement].teaQualities
      },
      supportingElement: {
        name: supportingElement,
        chineseName: elementDefinitions[supportingElement].chineseName,
        score: elementAnalysis.elements[supportingElement],
        properties: elementDefinitions[supportingElement].teaQualities
      },
      elementSignature,
      specificEffects,
      healthBenefits,
      bodySystemsAffected,
      emotionalEffects,
      flavorEffectCorrelation,
      seasonality,
      recommendations,
      elementContributions: elementAnalysis.contributions,
      tcmTerminology: this._generateTcmTerminology(elementAnalysis.elements, tea)
    };
  }
  
  /**
   * Calculate seasonal appropriateness scores
   * @param {Object} elements - Element distribution
   * @returns {Object} Seasonal appropriateness scores and analysis
   */
  _calculateSeasonalAppropriateness(elements) {
    // Define the five TCM seasons
    const seasons = ["spring", "summer", "lateSummer", "autumn", "winter"];
    const seasonalScores = {};
    
    // Calculate score for each season
    seasons.forEach(season => {
      let score = 0;
      let totalWeightedContribution = 0;
      
      // Calculate weighted score based on element distribution and seasonal associations
      Object.entries(elements).forEach(([element, value]) => {
        if (element in seasonalAssociations) {
          // Get seasonal strength for this element in this season
          const seasonalStrength = seasonalAssociations[element].seasonalStrengths[season] || 0;
          
          // Add to score (weighted by element's presence)
          score += value * seasonalStrength;
          totalWeightedContribution += value;
        }
      });
      
      // Normalize to 0-10 scale
      seasonalScores[season] = totalWeightedContribution > 0 
        ? Math.min(10, Math.round((score / totalWeightedContribution) * 10)) 
        : 0;
    });
    
    // Find current season (based on current date)
    const now = new Date();
    const month = now.getMonth(); // 0-11
    const currentSeason = monthToSeason[month];
    
    // Determine season transition period if applicable
    const seasonTransitionPeriod = this._determineSeasonTransition(month);
    
    // Find next season
    const seasonIndex = seasons.indexOf(currentSeason);
    const nextSeason = seasons[(seasonIndex + 1) % seasons.length];
    
    // Find peak season (season with highest score)
    let peakSeason = seasons[0];
    seasons.forEach(season => {
      if (seasonalScores[season] > seasonalScores[peakSeason]) {
        peakSeason = season;
      }
    });
    
    // Calculate harmony with current season
    let seasonalHarmony = "";
    let seasonalHarmonyScore = 0;
    const currentSeasonScore = seasonalScores[currentSeason];
    
    if (currentSeasonScore >= 8) {
      seasonalHarmony = "Excellent";
      seasonalHarmonyScore = 5;
    } else if (currentSeasonScore >= 6) {
      seasonalHarmony = "Good";
      seasonalHarmonyScore = 4;
    } else if (currentSeasonScore >= 4) {
      seasonalHarmony = "Moderate";
      seasonalHarmonyScore = 3;
    } else if (currentSeasonScore >= 2) {
      seasonalHarmony = "Limited";
      seasonalHarmonyScore = 2;
    } else {
      seasonalHarmony = "Poor";
      seasonalHarmonyScore = 1;
    }
    
    // Get the associated element for the current season
    const seasonElement = this._getSeasonElement(currentSeason);
    
    // Generate seasonal drinking recommendations
    const seasonalRecommendations = this._generateSeasonalDrinkingRecommendations(
      elements, 
      currentSeason, 
      seasonalHarmonyScore
    );
    
    return {
      scores: seasonalScores,
      currentSeason,
      nextSeason,
      peakSeason,
      seasonElement,
      harmony: seasonalHarmony,
      harmonyScore: seasonalHarmonyScore,
      benefits: seasonalGuidance[currentSeason]?.benefits || [],
      cautions: seasonalGuidance[currentSeason]?.cautions || [],
      seasonTransition: seasonTransitionPeriod,
      recommendations: seasonalRecommendations,
      seasonalQualities: this._getSeasonalQualities(elements, currentSeason)
    };
  }
  
  /**
   * Determine if we're in a season transition period
   * @param {number} month - Current month (0-11)
   * @returns {Object|null} Season transition information or null
   */
  _determineSeasonTransition(month) {
    // Check each transition period in seasonalAssociations
    for (const [transition, data] of Object.entries(seasonTransitions)) {
      if (data.months.includes(month)) {
        return {
          transition: transition,
          description: data.description
        };
      }
    }
    return null;
  }
  
  /**
   * Get the corresponding element for a given season
   * @param {string} season - TCM season
   * @returns {string} Element associated with the season
   */
  _getSeasonElement(season) {
    const seasonToElement = {
      "spring": "wood",
      "summer": "fire",
      "lateSummer": "earth",
      "autumn": "metal",
      "winter": "water"
    };
    
    return seasonToElement[season] || "earth"; // Default to earth if unknown
  }
  
  /**
   * Generate recommendations for drinking this tea in the current season
   * @param {Object} elements - Element distribution
   * @param {string} currentSeason - Current TCM season
   * @param {number} harmonyScore - How well the tea matches the season (1-5)
   * @returns {Object} Recommendations
   */
  _generateSeasonalDrinkingRecommendations(elements, currentSeason, harmonyScore) {
    const recommendations = {
      optimal: false,
      bestTimeOfDay: [],
      preparationNotes: [],
      frequencyAdvice: ""
    };
    
    // Set optimal flag
    recommendations.optimal = harmonyScore >= 4;
    
    // Get the current season's element
    const seasonElement = this._getSeasonElement(currentSeason);
    
    // Determine best time of day based on season and tea elements
    switch (currentSeason) {
      case "spring":
        if (elements.wood > 0.3) {
          recommendations.bestTimeOfDay.push("Early morning (5-7 AM, Liver time)");
        } else if (elements.fire > 0.3) {
          recommendations.bestTimeOfDay.push("Late morning (9-11 AM)");
        } else {
          recommendations.bestTimeOfDay.push("Morning (7-9 AM)");
        }
        break;
        
      case "summer":
        if (elements.fire > 0.3) {
          recommendations.bestTimeOfDay.push("Late morning (9-11 AM, Heart time)");
          recommendations.bestTimeOfDay.push("Midday (11 AM-1 PM)");
        } else if (elements.water > 0.3) {
          recommendations.bestTimeOfDay.push("Early morning or evening");
        } else {
          recommendations.bestTimeOfDay.push("Morning or early afternoon");
        }
        break;
        
      case "lateSummer":
        if (elements.earth > 0.3) {
          recommendations.bestTimeOfDay.push("Mid-morning (7-9 AM, Stomach time)");
          recommendations.bestTimeOfDay.push("After meals");
        } else {
          recommendations.bestTimeOfDay.push("Midday (to support digestion)");
        }
        break;
        
      case "autumn":
        if (elements.metal > 0.3) {
          recommendations.bestTimeOfDay.push("Early morning (3-5 AM, Lung time)");
          recommendations.bestTimeOfDay.push("Early evening (5-7 PM)");
        } else if (elements.water > 0.3) {
          recommendations.bestTimeOfDay.push("Evening");
        } else {
          recommendations.bestTimeOfDay.push("Afternoon");
        }
        break;
        
      case "winter":
        if (elements.water > 0.3) {
          recommendations.bestTimeOfDay.push("Evening (5-7 PM, Kidney time)");
          recommendations.bestTimeOfDay.push("Early morning");
        } else if (elements.fire > 0.3) {
          recommendations.bestTimeOfDay.push("Midday (when Yang is strongest)");
        } else {
          recommendations.bestTimeOfDay.push("Late morning to early afternoon");
        }
        break;
    }
    
    // Preparation notes based on seasonal harmony
    if (harmonyScore >= 4) {
      // Good harmony - standard preparation
      recommendations.preparationNotes.push("Standard preparation will enhance seasonal benefits");
    } else if (harmonyScore == 3) {
      // Moderate harmony - some adjustments
      if (currentSeason === "winter" && elements.fire > elements.water) {
        recommendations.preparationNotes.push("Brew at slightly lower temperature to moderate warming effect");
      } else if (currentSeason === "summer" && elements.water > elements.fire) {
        recommendations.preparationNotes.push("Brew at slightly higher temperature to enhance warming effect");
      } else {
        recommendations.preparationNotes.push("Adjust brewing time to moderate the tea's effects");
      }
    } else {
      // Poor harmony - significant adjustments
      if ((currentSeason === "winter" || currentSeason === "autumn") && 
          (elements.wood > 0.3 || elements.fire > 0.3)) {
        recommendations.preparationNotes.push("Brew with lower water temperature to reduce dispersing qualities");
        recommendations.preparationNotes.push("Consider blending with more seasonally appropriate teas");
      } else if ((currentSeason === "spring" || currentSeason === "summer") && 
                (elements.metal > 0.3 || elements.water > 0.3)) {
        recommendations.preparationNotes.push("Brew with hotter water to enhance warming qualities");
        recommendations.preparationNotes.push("Shorter steeping time to preserve uplifting notes");
      }
    }
    
    // Frequency advice based on harmony score
    if (harmonyScore >= 4) {
      recommendations.frequencyAdvice = "Can be enjoyed regularly throughout the season";
    } else if (harmonyScore == 3) {
      recommendations.frequencyAdvice = "Best enjoyed occasionally (1-2 times per week)";
    } else {
      recommendations.frequencyAdvice = "Best reserved for specific occasions when its qualities are needed";
    }
    
    return recommendations;
  }
  
  /**
   * Get seasonal qualities for the tea in the current season
   * @param {Object} elements - Element distribution
   * @param {string} season - Current season
   * @returns {string[]} Seasonal qualities
   */
  _getSeasonalQualities(elements, season) {
    const qualities = [];
    const seasonElement = this._getSeasonElement(season);
    
    // Add primary quality based on season
    switch (season) {
      case "spring":
        if (elements.wood > 0.3) {
          qualities.push("Supports the season's expanding energy");
        } else if (elements.metal > 0.3) {
          qualities.push("May balance excessive spring activity");
        }
        break;
        
      case "summer":
        if (elements.fire > 0.3) {
          qualities.push("Enhances the season's vibrant energy");
        } else if (elements.water > 0.3) {
          qualities.push("Provides cooling balance to summer heat");
        }
        break;
        
      case "lateSummer":
        if (elements.earth > 0.3) {
          qualities.push("Harmonizes with the season's centering qualities");
        } else if (elements.wood > 0.3) {
          qualities.push("May disrupt the season's digestive focus");
        }
        break;
        
      case "autumn":
        if (elements.metal > 0.3) {
          qualities.push("Enhances the season's clarifying qualities");
        } else if (elements.fire > 0.3) {
          qualities.push("Provides warmth during the cooling season");
        }
        break;
        
      case "winter":
        if (elements.water > 0.3) {
          qualities.push("Supports the season's inward, storing energy");
        } else if (elements.fire > 0.3) {
          qualities.push("Provides warming balance to winter cold");
        }
        break;
    }
    
    // Add qualities based on element relationships to the season
    const dominantElement = Object.entries(elements)
      .sort(([, a], [, b]) => b - a)[0][0];
    
    // Generating relationship (element that produces the season's element)
    const generatingElement = this._getGeneratingElement(seasonElement);
    if (elements[generatingElement] > 0.25) {
      qualities.push(`Supports the ${seasonElement} element through ${generatingElement}'s nourishing effect`);
    }
    
    // Controlling relationship (element that controls the season's element)
    const controllingElement = this._getControllingElement(seasonElement);
    if (elements[controllingElement] > 0.25) {
      qualities.push(`May moderate the season's ${seasonElement} energy through ${controllingElement}'s controlling effect`);
    }
    
    return qualities;
  }
  
  /**
   * Get the element that generates the given element
   * @param {string} element - Element to find generator for
   * @returns {string} Generating element
   */
  _getGeneratingElement(element) {
    const generatingCycle = {
      "wood": "water",
      "fire": "wood",
      "earth": "fire",
      "metal": "earth",
      "water": "metal"
    };
    
    return generatingCycle[element] || "earth";
  }
  
  /**
   * Get the element that controls the given element
   * @param {string} element - Element to find controller for
   * @returns {string} Controlling element
   */
  _getControllingElement(element) {
    const controllingCycle = {
      "wood": "metal",
      "fire": "water",
      "earth": "wood",
      "metal": "fire",
      "water": "earth"
    };
    
    return controllingCycle[element] || "earth";
  }
  
  /**
   * Generates a default element combination when no predefined one exists
   */
  _generateDefaultCombination(primary, supporting) {
    const primaryDef = elementDefinitions[primary];
    const supportingDef = elementDefinitions[supporting];
    
    if (!primaryDef || !supportingDef) {
      return {
        name: "Balanced Blend",
        description: "A harmonious combination of multiple elements creating a balanced effect."
      };
    }
    
    return {
      name: `${primaryDef.name}-${supportingDef.name} Harmony`,
      description: `A tea that combines the ${primaryDef.description} of ${primaryDef.name} element with the ${supportingDef.description} of ${supportingDef.name} element. This creates a unique profile that ${this._getDefaultCombinationEffect(primary, supporting)}.`
    };
  }
  
  /**
   * Gets default description of element combination effects
   */
  _getDefaultCombinationEffect(primary, supporting) {
    const combinations = {
      "wood+fire": "promotes dynamic vitality with transformative energy",
      "wood+earth": "balances growth with stability and nourishment",
      "wood+metal": "combines vitality with clarity and precision",
      "wood+water": "integrates active growth with deep introspection",
      "fire+earth": "harmonizes warming transformation with grounding nourishment",
      "fire+metal": "balances stimulation with clarity and refinement",
      "fire+water": "brings together opposites of activation and stillness",
      "earth+metal": "combines nourishing stability with clear precision",
      "earth+water": "integrates centering stability with deep restoration",
      "metal+water": "merges clear refinement with profound depth"
    };
    
    const key = `${primary}+${supporting}`;
    const reverseKey = `${supporting}+${primary}`;
    
    return combinations[key] || combinations[reverseKey] || "creates a harmonious balance of complementary energies";
  }
  
  /**
   * Derives specific effects based on element distribution
   */
  _deriveSpecificEffects(elements, tea) {
    const effects = [];
    
    // Wood element effects (growth, movement, vitality)
    if (elements.wood > 0.25) {
      effects.push("Promotes active energy");
      if (elements.wood > 0.35) effects.push("Supports physical vitality");
      if (elements.wood > 0.3 && elements.fire > 0.2) effects.push("Enhances metabolic function");
      if (elements.wood > 0.3 && elements.metal > 0.2) effects.push("Supports liver function");
    }
    
    // Fire element effects (stimulation, transformation, warmth)
    if (elements.fire > 0.25) {
      effects.push("Provides stimulating energy");
      if (elements.fire > 0.35) effects.push("Creates warming sensation");
      if (elements.fire > 0.3 && elements.earth > 0.2) effects.push("Supports cardiovascular function");
      if (elements.fire > 0.3 && elements.wood > 0.2) effects.push("Enhances circulation");
    }
    
    // Earth element effects (centering, nourishing, grounding)
    if (elements.earth > 0.25) {
      effects.push("Creates grounding effect");
      if (elements.earth > 0.35) effects.push("Provides digestive support");
      if (elements.earth > 0.3 && elements.fire > 0.2) effects.push("Enhances nutrient absorption");
      if (elements.earth > 0.3 && elements.metal > 0.2) effects.push("Promotes centered focus");
    }
    
    // Metal element effects (clarity, precision, refinement)
    if (elements.metal > 0.25) {
      effects.push("Enhances mental clarity");
      if (elements.metal > 0.35) effects.push("Supports respiratory function");
      if (elements.metal > 0.3 && elements.water > 0.2) effects.push("Promotes clear thinking");
      if (elements.metal > 0.3 && elements.earth > 0.2) effects.push("Helps maintain healthy boundaries");
    }
    
    // Water element effects (depth, stillness, introspection)
    if (elements.water > 0.25) {
      effects.push("Supports calm mindstate");
      if (elements.water > 0.35) effects.push("Promotes deep relaxation");
      if (elements.water > 0.3 && elements.metal > 0.2) effects.push("Enhances meditative awareness");
      if (elements.water > 0.3 && elements.wood > 0.2) effects.push("Supports kidney and bladder function");
    }
    
    // Add effects based on tea type
    if (tea && tea.type) {
      const type = tea.type.toLowerCase();
      
      if (type === "green" && elements.wood > 0.2) {
        effects.push("Supports natural detoxification processes");
      } else if (type === "black" && elements.fire > 0.2) {
        effects.push("Provides energizing effect");
      } else if (type === "oolong" && elements.earth > 0.2) {
        effects.push("Balances digestive and metabolic function");
      } else if (type === "white" && elements.metal > 0.2) {
        effects.push("Delivers gentle antioxidant support");
      } else if (type === "puerh" && elements.water > 0.2) {
        effects.push("Assists with digestion of rich foods");
      }
    }
    
    // Add effect based on L-theanine to caffeine ratio if available
    if (tea && tea.lTheanineLevel !== undefined && tea.caffeineLevel !== undefined) {
      const ratio = tea.lTheanineLevel / tea.caffeineLevel;
      
      if (ratio > 2.5) {
        effects.push("Promotes calm alertness with minimal stimulation");
      } else if (ratio > 1.5 && ratio <= 2.5) {
        effects.push("Creates balanced energy without jitters");
      } else if (ratio >= 0.8 && ratio <= 1.5) {
        effects.push("Provides moderate stimulation with focus");
      } else if (ratio < 0.8) {
        effects.push("Delivers pronounced energizing effect");
      }
    }
    
    // Remove duplicates and limit to most relevant effects
    return [...new Set(effects)].slice(0, 7);
  }
  
  /**
   * Derives health benefits based on element distribution
   */
  _deriveHealthBenefits(elements, tea) {
    const benefits = [];
    
    // Wood element benefits
    if (elements.wood > 0.25) {
      benefits.push("Supports liver function");
      if (elements.wood > 0.35) benefits.push("Assists with detoxification");
      if (elements.wood > 0.3 && elements.fire > 0.2) benefits.push("Helps maintain joint flexibility");
    }
    
    // Fire element benefits
    if (elements.fire > 0.25) {
      benefits.push("Promotes healthy circulation");
      if (elements.fire > 0.35) benefits.push("Supports metabolic function");
      if (elements.fire > 0.3 && elements.earth > 0.2) benefits.push("Aids cardiovascular health");
    }
    
    // Earth element benefits
    if (elements.earth > 0.25) {
      benefits.push("Supports digestive comfort");
      if (elements.earth > 0.35) benefits.push("Helps maintain stable energy");
      if (elements.earth > 0.3 && elements.metal > 0.2) benefits.push("Promotes healthy appetite regulation");
    }
    
    // Metal element benefits
    if (elements.metal > 0.25) {
      benefits.push("Supports respiratory health");
      if (elements.metal > 0.35) benefits.push("Helps maintain clear airways");
      if (elements.metal > 0.3 && elements.water > 0.2) benefits.push("Promotes healthy skin function");
    }
    
    // Water element benefits
    if (elements.water > 0.25) {
      benefits.push("Supports kidney function");
      if (elements.water > 0.35) benefits.push("Promotes deep relaxation");
      if (elements.water > 0.3 && elements.earth > 0.2) benefits.push("Helps maintain healthy fluid balance");
    }
    
    // Add benefits based on tea type and compounds
    if (tea) {
      // Based on tea type
      if (tea.type) {
        const type = tea.type.toLowerCase();
        
        if (type === "green") {
          benefits.push("Provides antioxidant support");
        } else if (type === "black") {
          benefits.push("Supports cardiovascular health");
        } else if (type === "oolong") {
          benefits.push("Assists with metabolism");
        } else if (type === "white") {
          benefits.push("Offers gentle free-radical protection");
        } else if (type === "puerh") {
          benefits.push("Supports healthy lipid metabolism");
        }
      }
      
      // Based on processing methods
      if (tea.processingMethods && tea.processingMethods.length > 0) {
        if (tea.processingMethods.some(m => m.toLowerCase().includes("ferment"))) {
          benefits.push("Provides probiotic-like support for gut health");
        }
        if (tea.processingMethods.some(m => m.toLowerCase().includes("shade-grown"))) {
          benefits.push("Rich in L-theanine for stress support");
        }
      }
    }
    
    // Remove duplicates and limit
    return [...new Set(benefits)].slice(0, 5);
  }
  
  /**
   * Derives body systems affected based on element distribution
   */
  _deriveBodySystems(elements) {
    const systems = [];
    const elementThreshold = 0.2; // Minimum element score to consider
    
    // Map elements to body systems
    if (elements.wood > elementThreshold) {
      systems.push("Liver", "Gallbladder");
      if (elements.wood > 0.3) systems.push("Tendons");
    }
    
    if (elements.fire > elementThreshold) {
      systems.push("Heart", "Small Intestine");
      if (elements.fire > 0.3) systems.push("Blood vessels");
    }
    
    if (elements.earth > elementThreshold) {
      systems.push("Spleen", "Stomach");
      if (elements.earth > 0.3) systems.push("Muscles");
    }
    
    if (elements.metal > elementThreshold) {
      systems.push("Lungs", "Large Intestine");
      if (elements.metal > 0.3) systems.push("Skin");
    }
    
    if (elements.water > elementThreshold) {
      systems.push("Kidneys", "Bladder");
      if (elements.water > 0.3) systems.push("Bones");
    }
    
    return [...new Set(systems)].sort();
  }
  
  /**
   * Derives emotional effects based on element distribution
   */
  _deriveEmotionalEffects(elements, tea) {
    const effects = [];
    
    // Get the balanced emotional qualities for each significant element
    Object.entries(elements).forEach(([element, score]) => {
      if (score > 0.2 && elementDefinitions[element] && elementDefinitions[element].emotions) {
        const emotions = elementDefinitions[element].emotions.balanced;
        
        // Add 1-2 balanced emotions depending on element strength
        if (score > 0.3) {
          effects.push(...emotions.slice(0, 2));
        } else {
          effects.push(emotions[0]);
        }
      }
    });
    
    // Add effects based on compound balance
    if (tea && tea.lTheanineLevel !== undefined && tea.caffeineLevel !== undefined) {
      const ratio = tea.lTheanineLevel / tea.caffeineLevel;
      
      if (ratio > 2.0) {
        effects.push("Calm focus");
      } else if (ratio > 1.0) {
        effects.push("Balanced alertness");
      } else {
        effects.push("Energetic clarity");
      }
    }
    
    // Remove duplicates and limit
    return [...new Set(effects)].slice(0, 4);
  }
  
  /**
   * Correlates flavor profile with effects
   */
  _deriveFlavorEffectCorrelation(tea, elementAnalysis) {
    if (!tea || !tea.flavorProfile || tea.flavorProfile.length === 0) {
      return [];
    }
    
    const correlations = [];
    const dominantElement = elementAnalysis.dominantElement;
    
    // Map key flavors to their effects
    const flavorEffects = {
      // Sweet flavors
      "sweet": "promotes Spleen Qi and nourishes Earth element",
      "honey": "strengthens Spleen and provides gentle warmth",
      "caramel": "warms middle Jiao and supports Earth element",
      "malty": "nourishes Spleen Qi and provides sustaining energy",
      "chocolate": "warms and supports Heart and Spleen",
      
      // Sour flavors
      "sour": "supports Liver function and strengthens Wood element",
      "tart": "stimulates Liver Qi and aids detoxification",
      "citrus": "moves stagnant Qi and brightens Shen (Spirit)",
      
      // Bitter flavors
      "bitter": "clears Heat and strengthens Heart function",
      "roasted": "warms the middle Jiao and supports digestion",
      "char": "strongly disperses cold and moves Qi downward",
      
      // Pungent/spicy flavors
      "spicy": "disperses stagnation and supports Lung function",
      "peppery": "warms the body and enhances circulation",
      "ginger": "warms the Stomach and dispels cold",
      
      // Salty flavors
      "mineral": "supports Kidney function and deepens effects",
      "marine": "nourishes Kidney Yin and provides minerals",
      "umami": "strengthens Stomach and Spleen function",
      
      // Other key flavors
      "floral": "uplifts Shen (Spirit) and harmonizes Liver",
      "vegetal": "cools internal heat and supports Liver",
      "woody": "grounds Qi and strengthens Kidney function",
      "earthy": "stabilizes and centers, supporting Earth element",
      "nutty": "nourishes Spleen and provides sustained energy"
    };
    
    // Find correlation between primary flavors and dominant element
    tea.flavorProfile.forEach(flavor => {
      const flavorKey = flavor.toLowerCase();
      
      if (flavorEffects[flavorKey]) {
        correlations.push({
          flavor: flavor,
          effect: flavorEffects[flavorKey]
        });
      }
    });
    
    // Limit to 3 most relevant correlations
    return correlations.slice(0, 3);
  }
  /* 
   * Generate personalized recommendations based on element profile
   */
  _generateRecommendations(elements, tea) {
    const recommendations = {
      bestTimeToEnjoy: this._determineBestTime(elements),
      pairingFoods: this._determineFoodPairings(elements, tea),
      preparationTips: this._determinePreparationTips(elements, tea),
      complementaryActivities: this._determineActivities(elements)
    };
    
    return recommendations;
  }
  
  /**
   * Determine the best time to enjoy the tea
   */
  _determineBestTime(elements) {
    const times = [];
    
    // Add times based on dominant elements
    if (elements.wood > 0.3) {
      times.push("Morning (7-9 AM, peak Stomach time)");
      times.push("Early afternoon (1-3 PM, peak Small Intestine time)");
    }
    
    if (elements.fire > 0.3) {
      times.push("Late morning (9-11 AM, peak Heart time)");
      times.push("Midday (11 AM-1 PM, peak Heart time)");
    }
    
    if (elements.earth > 0.3) {
      times.push("Late morning (9-11 AM, peak Spleen time)");
      times.push("After meals to support digestion");
    }
    
    if (elements.metal > 0.3) {
      times.push("Early evening (5-7 PM, peak Lung time)");
      times.push("Afternoon (3-5 PM, peak Lung time)");
    }
    
    if (elements.water > 0.3) {
      times.push("Evening (7-9 PM, peak Kidney time)");
      times.push("Early evening relaxation sessions");
    }
    
    // If no strong elements, provide balanced recommendation
    if (times.length === 0) {
      return ["Midday when digestion is strong", "When transitioning between activities"];
    }
    
    // Return top 2 recommendations
    return times.slice(0, 2);
  }
  
  /**
   * Determine food pairings based on element profile
   */
  _determineFoodPairings(elements, tea) {
    const pairings = [];
    
    // Wood element pairings
    if (elements.wood > 0.25) {
      pairings.push("Mildly sour foods like berries or citrus");
      if (elements.wood > 0.3) pairings.push("Light green vegetables");
    }
    
    // Fire element pairings
    if (elements.fire > 0.25) {
      pairings.push("Warm, flavorful cuisines");
      if (elements.fire > 0.3) pairings.push("Red fruits like strawberries or cherries");
    }
    
    // Earth element pairings
    if (elements.earth > 0.25) {
      pairings.push("Mildly sweet foods like root vegetables");
      if (elements.earth > 0.3) pairings.push("Whole grains and legumes");
    }
    
    // Metal element pairings
    if (elements.metal > 0.25) {
      pairings.push("Mildly spiced foods");
      if (elements.metal > 0.3) pairings.push("White foods like rice or mild cheese");
    }
    
    // Water element pairings
    if (elements.water > 0.25) {
      pairings.push("Foods with depth like mushrooms or aged ingredients");
      if (elements.water > 0.3) pairings.push("Black/blue foods like blackberries or black rice");
    }
    
    // Add specific tea pairings
    if (tea && tea.type) {
      const type = tea.type.toLowerCase();
      
      if (type === "green") {
        pairings.push("Light vegetable dishes");
      } else if (type === "black") {
        pairings.push("Pastries or breakfast foods");
      } else if (type === "oolong") {
        pairings.push("Seafood or poultry dishes");
      } else if (type === "white") {
        pairings.push("Delicate fruits or mild sweets");
      } else if (type === "puerh") {
        pairings.push("Rich or fatty foods that benefit from digestive support");
      }
    }
    
    // Return top 3 pairings
    return [...new Set(pairings)].slice(0, 3);
  }
  
  /**
   * Determine preparation tips based on element profile
   */
  _determinePreparationTips(elements, tea) {
    const tips = [];
    
    // Generate general preparation tips based on elements
    if (elements.wood > 0.25) {
      tips.push("Use fresh, lively water just below full boil");
    }
    
    if (elements.fire > 0.3) {
      tips.push("Use slightly hotter water to fully activate warming properties");
    } else if (elements.water > 0.3) {
      tips.push("Use slightly cooler water to preserve calming compounds");
    }
    
    if (elements.metal > 0.25) {
      tips.push("Use clean, filtered water for maximum clarity");
    }
    
    if (elements.earth > 0.25) {
      tips.push("Brew with consistent timing to develop balanced character");
    }
    
    // Add specific tips based on tea type
    if (tea && tea.type) {
      const type = tea.type.toLowerCase();
      
      switch (type) {
        case "green":
          tips.push(`Brew at lower temperatures (160-180°F / 70-80°C) to preserve delicate compounds`);
          break;
        case "white":
          tips.push(`Use gentle brewing methods with lower temperature water (170-185°F / 75-85°C)`);
          break;
        case "oolong":
          tips.push(`Multiple short infusions reveal the complex character of this tea`);
          break;
        case "black":
          tips.push(`Full boiling water (212°F / 100°C) helps extract robust character`);
          break;
        case "puerh":
          tips.push(`Rinse briefly before first infusion to "awaken" the tea`);
          break;
      }
    }
    
    // Add tips based on flavor profile if available
    if (tea && tea.flavorProfile && tea.flavorProfile.length > 0) {
      if (tea.flavorProfile.some(f => ["floral", "delicate", "subtle"].includes(f.toLowerCase()))) {
        tips.push("Brew in porcelain or glass to preserve delicate aromas");
      }
      
      if (tea.flavorProfile.some(f => ["rich", "robust", "earthy"].includes(f.toLowerCase()))) {
        tips.push("Try brewing in clay or ceramic to enhance body");
      }
    }
    
    // Return top 3 tips
    return [...new Set(tips)].slice(0, 3);
  }
  
  /**
   * Determine complementary activities based on element profile
   */
  _determineActivities(elements) {
    const activities = [];
    
    // Generate activity recommendations based on element balance
    if (elements.wood > 0.3) {
      activities.push("Morning stretching or gentle movement");
      activities.push("Creative projects requiring fresh energy");
    }
    
    if (elements.fire > 0.3) {
      activities.push("Active socializing or engaging conversations");
      activities.push("Heart-opening practices like gratitude journaling");
    }
    
    if (elements.earth > 0.3) {
      activities.push("Grounding practices like gardening or cooking");
      activities.push("Nurturing connections with close friends or family");
    }
    
    if (elements.metal > 0.3) {
      activities.push("Focused work requiring clear thinking");
      activities.push("Organizing or simplifying spaces");
    }
    
    if (elements.water > 0.3) {
      activities.push("Meditation or contemplative practices");
      activities.push("Gentle flowing movement like tai chi or qigong");
    }
    
    // If no strong elements, provide balanced recommendations
    if (activities.length === 0) {
      return ["Mindful transitions between activities", "Balanced work-rest cycles"];
    }
    
    // Return top 2 activities
    return activities.slice(0, 2);
  }
  
  /**
   * Calculate Five Element signature - a normalized representation of element balance
   */
  _calculateElementSignature(elements) {
    // Sort elements by score
    const sortedElements = Object.entries(elements)
      .sort(([, a], [, b]) => b - a);
    
    // Calculate score differentials
    const signature = {
      pattern: "",
      primary: sortedElements[0][0],
      secondary: sortedElements[1][0],
      tertiary: sortedElements[2][0],
      dominant: false,
      balanced: false
    };
    
    // Determine if there's a dominant element
    const primaryScore = sortedElements[0][1];
    const secondaryScore = sortedElements[1][1];
    
    signature.dominant = (primaryScore / secondaryScore) > 1.5;
    
    // Determine if it's a balanced distribution
    const lowestScore = sortedElements[4][1];
    signature.balanced = (primaryScore / lowestScore) < 2.5;
    
    // Create element pattern abbreviation
    signature.pattern = sortedElements.slice(0, 3)
      .map(([element]) => element.charAt(0).toUpperCase())
      .join("");
    
    return signature;
  }
  
  /**
   * Generate TCM terminology for the tea
   */
  _generateTcmTerminology(elements, tea) {
    // Sort elements by score
    const sortedElements = Object.entries(elements)
      .sort(([, a], [, b]) => b - a);
    
    const primaryElement = sortedElements[0][0];
    const secondaryElement = sortedElements[1][0];
    
    // Basic TCM properties
    let nature = "";
    let flavor = "";
    let meridians = [];
    let qualities = [];
    
    // Determine nature (temperature property)
    if (elements.fire > 0.3) {
      nature = "Warm to Hot";
    } else if (elements.fire > 0.2 || elements.wood > 0.3) {
      nature = "Warm";
    } else if (elements.water > 0.3 || elements.metal > 0.3) {
      nature = "Cool";
    } else if (elements.water > 0.4) {
      nature = "Cold";
    } else {
      nature = "Neutral";
    }
    
    // Modify nature based on processing if available
    if (tea && tea.processingMethods) {
      const methods = tea.processingMethods.map(m => m.toLowerCase());
      
      if (methods.some(m => m.includes("roast") || m.includes("baked") || m.includes("fired"))) {
        // Shift nature one step warmer
        if (nature === "Cold") nature = "Cool";
        else if (nature === "Cool") nature = "Neutral";
        else if (nature === "Neutral") nature = "Warm";
        else if (nature === "Warm") nature = "Warm to Hot";
      }
      
      if (methods.some(m => m.includes("green") || m.includes("steamed"))) {
        // Shift nature one step cooler
        if (nature === "Warm to Hot") nature = "Warm";
        else if (nature === "Warm") nature = "Neutral";
        else if (nature === "Neutral") nature = "Cool";
      }
    }
    
    // Determine dominant flavor based on elements
    if (primaryElement === "wood") flavor = "Sour";
    else if (primaryElement === "fire") flavor = "Bitter";
    else if (primaryElement === "earth") flavor = "Sweet";
    else if (primaryElement === "metal") flavor = "Pungent";
    else if (primaryElement === "water") flavor = "Salty";
    
    // Add secondary flavor
    let secondaryFlavor = "";
    if (secondaryElement === "wood") secondaryFlavor = "Sour";
    else if (secondaryElement === "fire") secondaryFlavor = "Bitter";
    else if (secondaryElement === "earth") secondaryFlavor = "Sweet";
    else if (secondaryElement === "metal") secondaryFlavor = "Pungent";
    else if (secondaryElement === "water") secondaryFlavor = "Salty";
    
    if (secondaryFlavor && secondaryFlavor !== flavor) {
      flavor += ` with ${secondaryFlavor}`;
    }
    
    // Determine meridians (channels)
    if (elements.wood > 0.2) meridians.push("Liver", "Gallbladder");
    if (elements.fire > 0.2) meridians.push("Heart", "Small Intestine");
    if (elements.earth > 0.2) meridians.push("Spleen", "Stomach");
    if (elements.metal > 0.2) meridians.push("Lung", "Large Intestine");
    if (elements.water > 0.2) meridians.push("Kidney", "Bladder");
    
    // Keep only the top 3 meridians
    meridians = meridians.slice(0, 3);
    
    // Determine TCM qualities and actions
    if (elements.wood > 0.25) qualities.push("Spreads Liver Qi");
    if (elements.fire > 0.25) qualities.push("Invigorates Blood");
    if (elements.earth > 0.25) qualities.push("Strengthens Spleen");
    if (elements.metal > 0.25) qualities.push("Clears Lung Heat");
    if (elements.water > 0.25) qualities.push("Nourishes Kidney Yin");
    
    if (elements.wood > 0.3 && elements.fire > 0.2) qualities.push("Moves Stagnation");
    if (elements.fire > 0.3 && elements.earth > 0.2) qualities.push("Tonifies Yang");
    if (elements.earth > 0.3 && elements.metal > 0.2) qualities.push("Harmonizes Middle Jiao");
    if (elements.metal > 0.3 && elements.water > 0.2) qualities.push("Clears and Calms");
    if (elements.water > 0.3 && elements.wood > 0.2) qualities.push("Nourishes Yin and Blood");
    
    // Create full TCM terminology object
    return {
      nature,
      flavor,
      meridians,
      qualities: qualities.slice(0, 4),
      balance: this._determineYinYangBalance(elements, tea)
    };
  }
  
  /**
   * Determine Yin-Yang balance based on element distribution and tea properties
   */
  _determineYinYangBalance(elements, tea) {
    // Initialize score (positive = more Yang, negative = more Yin)
    let balance = 0;
    
    // Elements contribution
    balance += (elements.fire * 2) + (elements.wood * 1);     // Yang elements
    balance -= (elements.water * 2) + (elements.metal * 0.5); // Yin elements
    
    // Tea properties modification
    if (tea) {
      // Processing methods
      if (tea.processingMethods) {
        const methods = tea.processingMethods.map(m => m.toLowerCase());
        
        // Yang increasing processes
        if (methods.some(m => m.includes("roast") || m.includes("bake"))) balance += 1;
        if (methods.some(m => m.includes("heavy") && m.includes("roast"))) balance += 0.5;
        if (methods.some(m => m.includes("full") && m.includes("oxidation"))) balance += 1;
        
        // Yin preserving/increasing processes
        if (methods.some(m => m.includes("shade") && m.includes("grown"))) balance -= 1;
        if (methods.some(m => m.includes("minimal") && m.includes("process"))) balance -= 0.5;
        if (methods.some(m => m.includes("steamed"))) balance -= 0.5;
      }
      
      // Adjust based on caffeine and L-theanine ratio if available
      if (tea.caffeineLevel !== undefined && tea.lTheanineLevel !== undefined) {
        const ratio = tea.lTheanineLevel / tea.caffeineLevel;
        
        if (ratio > 2.0) balance -= 1; // More Yin
        else if (ratio < 0.8) balance += 1; // More Yang
      }
    }
    
    // Determine balance category
    if (balance > 2) return "Strong Yang";
    if (balance > 1) return "Moderate Yang";
    if (balance > 0.3) return "Slight Yang";
    if (balance < -2) return "Strong Yin";
    if (balance < -1) return "Moderate Yin";
    if (balance < -0.3) return "Slight Yin";
    
    return "Balanced";
  }
}

export default EffectsDeriver;