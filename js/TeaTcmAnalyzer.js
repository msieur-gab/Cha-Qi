// TeaTcmAnalyzer.js
// Main class that orchestrates the TCM-based tea analysis system

import TcmSystemConfig from './config/TcmSystemConfig.js';
import {ElementsCalculator} from './calculators/ElementsCalculator.js';
import FlavorElementMapper from './calculators/FlavorElementMapper.js';
import CompoundElementMapper from './calculators/CompoundElementMapper.js';
import ProcessingElementMapper from './calculators/ProcessingElementMapper.js';
import GeographyElementMapper from './calculators/GeographyElementMapper.js';
import EffectsDeriver from './calculators/EffectsDeriver.js';

import {flavorElementMappings} from './data/FlavorElementMappings.js';
import processingElementMappings from './data/ProcessingElementMappings.js';
import elementCombinationEffects from './data/ElementCombinationEffects.js';
import { seasonalAssociations, seasonalGuidance } from './data/seasonalAssociations.js';

export class TeaTcmAnalyzer {
  constructor(configOptions = {}) {
    // Initialize system configuration
    this.config = new TcmSystemConfig(configOptions);
    
    // Initialize component mappers
    this.flavorMapper = new FlavorElementMapper(
      this.config, 
      flavorElementMappings
    );
    
    this.compoundMapper = new CompoundElementMapper(
      this.config
    );
    
    this.processingMapper = new ProcessingElementMapper(
      this.config, 
      processingElementMappings
    );
    
    this.geographyMapper = new GeographyElementMapper(
      this.config
    );
    
    // Initialize core calculators
    this.elementsCalculator = new ElementsCalculator(
      this.config,
      this.flavorMapper,
      this.compoundMapper,
      this.processingMapper,
      this.geographyMapper
    );
    
    this.effectsDeriver = new EffectsDeriver(
      this.config,
      elementCombinationEffects
    );
  }
  
  /**
   * Analyze a tea using the TCM framework
   * 
   * @param {Object} tea - Tea object with properties
   * @param {string} tea.name - Tea name
   * @param {string} tea.type - Tea type (green, black, oolong, etc.)
   * @param {string} tea.origin - Tea origin
   * @param {number} tea.caffeineLevel - Caffeine level (1-10 scale)
   * @param {number} tea.lTheanineLevel - L-theanine level (1-10 scale)
   * @param {string[]} tea.flavorProfile - Array of flavor descriptors
   * @param {string[]} tea.processingMethods - Array of processing methods
   * @param {Object} tea.geography - Geography information
   * @returns {Object} Complete TCM analysis
   */
  analyzeTea(tea) {
    if (!tea) {
      return {
        error: "No tea data provided for analysis"
      };
    }
    
    // Calculate Five Element distribution
    const elementAnalysis = this.elementsCalculator.calculateElements(tea);
    
    // Derive TCM effects based on element analysis
    const effectProfile = this.effectsDeriver.deriveEffects(elementAnalysis, tea);
    
    // Generate component-specific analyses
    const componentAnalyses = this._generateComponentAnalyses(tea);
    
    // Create the complete analysis
    return {
      name: tea.name,
      type: tea.type,
      origin: tea.origin,
      caffeineLevel: tea.caffeineLevel,
      lTheanineLevel: tea.lTheanineLevel,
      flavorProfile: tea.flavorProfile || [],
      processingMethods: tea.processingMethods || [],
      geography: tea.geography,
      
      // Element analysis
      elements: elementAnalysis.elements,
      dominantElement: elementAnalysis.dominantElement,
      supportingElement: elementAnalysis.supportingElement,
      elementSignature: effectProfile.elementSignature,
      elementContributions: elementAnalysis.contributions,
      
      // Effect profile
      effect: {
        name: effectProfile.name,
        description: effectProfile.description,
        primaryElement: effectProfile.primaryElement,
        supportingElement: effectProfile.supportingElement,
        specificEffects: effectProfile.specificEffects,
        healthBenefits: effectProfile.healthBenefits,
        bodySystemsAffected: effectProfile.bodySystemsAffected,
        emotionalEffects: effectProfile.emotionalEffects
      },
      
      // TCM terminology
      tcm: effectProfile.tcmTerminology,
      
      // Seasonal appropriateness
      seasonality: effectProfile.seasonality,
      
      // Component analyses
      components: componentAnalyses,
      
      // Recommendations
      recommendations: effectProfile.recommendations,
      
      // Flavor-effect correlations
      flavorEffectCorrelations: effectProfile.flavorEffectCorrelation,
      
      // Raw data for reference
      rawElementAnalysis: elementAnalysis,
      rawEffectProfile: effectProfile
    };
  }
  /**
   * Generate component-specific analyses
   */
  _generateComponentAnalyses(tea) {
    const analyses = {};
    
    // Flavor analysis
    if (tea.flavorProfile && tea.flavorProfile.length > 0) {
      analyses.flavor = this.flavorMapper.analyzeFlavorProfile(tea.flavorProfile);
    }
    
    // Compound analysis
    if (tea.caffeineLevel !== undefined && tea.lTheanineLevel !== undefined) {
      analyses.compounds = this.compoundMapper.analyzeCompoundBalance(
        tea.caffeineLevel, 
        tea.lTheanineLevel
      );
    }
    
    // Processing analysis
    if (tea.processingMethods && tea.processingMethods.length > 0) {
      analyses.processing = this.processingMapper.analyzeProcessingProfile(tea.processingMethods);
    }
    
    // Geography analysis
    if (tea.geography) {
      analyses.geography = this.geographyMapper.analyzeGeographicalInfluence(tea.geography);
    }
    
    return analyses;
  }
  
  /**
   * Analyze a collection of teas
   * 
   * @param {Object[]} teas - Array of tea objects
   * @returns {Object[]} Array of tea analyses
   */
  analyzeTeas(teas) {
    if (!teas || !Array.isArray(teas)) {
      return {
        error: "Invalid tea collection provided"
      };
    }
    
    return teas.map(tea => this.analyzeTea(tea));
  }
  
  /**
   * Find similar teas based on element profile
   * 
   * @param {Object} targetTea - Target tea to match
   * @param {Object[]} teaCollection - Collection of teas to search
   * @param {number} limit - Maximum number of matches to return
   * @returns {Object[]} Array of similar teas with similarity scores
   */
  findSimilarTeas(targetTea, teaCollection, limit = 5) {
    if (!targetTea || !teaCollection || !Array.isArray(teaCollection)) {
      return {
        error: "Invalid parameters for similarity search"
      };
    }
    
    // Analyze target tea
    const targetAnalysis = this.analyzeTea(targetTea);
    
    // Array to store similarity results
    const similarities = [];
    
    // Calculate similarity for each tea in collection
    teaCollection.forEach(tea => {
      // Skip the target tea itself
      if (tea.name === targetTea.name && tea.type === targetTea.type) {
        return;
      }
      
      // Analyze comparison tea
      const comparisonAnalysis = this.analyzeTea(tea);
      
      // Calculate element similarity score
      const similarityScore = this._calculateElementSimilarity(
        targetAnalysis.elements,
        comparisonAnalysis.elements
      );
      
      // Calculate seasonal similarity
      const seasonalSimilarity = this._calculateSeasonalSimilarity(
        targetAnalysis.seasonality,
        comparisonAnalysis.seasonality
      );
      
      // Add to results
      similarities.push({
        tea: tea,
        analysis: comparisonAnalysis,
        similarity: similarityScore,
        seasonalSimilarity: seasonalSimilarity,
        matchingElements: this._getMatchingElements(targetAnalysis, comparisonAnalysis)
      });
    });
    
    // Sort by similarity score (descending)
    similarities.sort((a, b) => b.similarity - a.similarity);
    
    // Return top matches
    return similarities.slice(0, limit);
  }
  /**
   * Calculate element similarity between two teas
   */
  _calculateElementSimilarity(elements1, elements2) {
    if (!elements1 || !elements2) return 0;
    
    // Use Euclidean distance in five-dimensional element space
    let sumSquaredDifferences = 0;
    
    Object.keys(elements1).forEach(element => {
      const diff = (elements1[element] || 0) - (elements2[element] || 0);
      sumSquaredDifferences += diff * diff;
    });
    
    // Convert distance to similarity (1.0 = identical, 0.0 = completely different)
    // Maximum possible distance in 5D space where each dimension is 0-1 is sqrt(5)
    const distance = Math.sqrt(sumSquaredDifferences);
    const similarity = 1 - (distance / Math.sqrt(5));
    
    return similarity;
  }
  
  /**
   * Calculate seasonal similarity between two teas
   */
  _calculateSeasonalSimilarity(seasonality1, seasonality2) {
    if (!seasonality1 || !seasonality2 || 
        !seasonality1.scores || !seasonality2.scores) {
      return 0;
    }
    
    // Compare seasonal appropriateness scores
    const seasons = ['spring', 'summer', 'lateSummer', 'autumn', 'winter'];
    let sumSquaredDifferences = 0;
    
    seasons.forEach(season => {
      const score1 = seasonality1.scores[season] || 0;
      const score2 = seasonality2.scores[season] || 0;
      
      // Normalize scores to 0-1 range
      const normalizedScore1 = score1 / 10;
      const normalizedScore2 = score2 / 10;
      
      const diff = normalizedScore1 - normalizedScore2;
      sumSquaredDifferences += diff * diff;
    });
    
    // Convert distance to similarity (1.0 = identical, 0.0 = completely different)
    // Maximum possible distance in 5D space where each dimension is 0-1 is sqrt(5)
    const distance = Math.sqrt(sumSquaredDifferences);
    const similarity = 1 - (distance / Math.sqrt(5));
    
    return similarity;
  }
  
  /**
   * Get matching elements between two tea analyses
   */
  _getMatchingElements(analysis1, analysis2) {
    const matches = [];
    
    // Check for matching dominant elements
    if (analysis1.dominantElement === analysis2.dominantElement) {
      matches.push({
        element: analysis1.dominantElement,
        role: "dominant",
        strength: "strong"
      });
    } else if (analysis1.dominantElement === analysis2.supportingElement) {
      matches.push({
        element: analysis1.dominantElement,
        role: "cross-match",
        strength: "moderate"
      });
    }
    
    // Check for matching supporting elements
    if (analysis1.supportingElement === analysis2.supportingElement && 
        analysis1.supportingElement !== analysis1.dominantElement) {
      matches.push({
        element: analysis1.supportingElement,
        role: "supporting",
        strength: "moderate"
      });
    } else if (analysis1.supportingElement === analysis2.dominantElement && 
              analysis1.supportingElement !== analysis1.dominantElement) {
      matches.push({
        element: analysis1.supportingElement,
        role: "cross-match",
        strength: "moderate"
      });
    }
    
    // Check for seasonal matches
    if (analysis1.seasonality && analysis2.seasonality) {
      const season1 = analysis1.seasonality.peakSeason;
      const season2 = analysis2.seasonality.peakSeason;
      
      if (season1 === season2) {
        matches.push({
          season: season1,
          role: "seasonal-match",
          strength: "strong"
        });
      }
    }
    
    return matches;
  }
  /**
   * Get personalized tea recommendations based on TCM constitution
   * 
   * @param {Object} constitution - TCM constitution profile
   * @param {Object[]} teaCollection - Collection of teas to search
   * @param {number} limit - Maximum number of recommendations
   * @returns {Object[]} Array of recommended teas with rationale
   */
  getPersonalizedRecommendations(constitution, teaCollection, limit = 5) {
    if (!constitution || !teaCollection || !Array.isArray(teaCollection)) {
      return {
        error: "Invalid parameters for personalized recommendations"
      };
    }
    
    // Array to store recommendation results
    const recommendations = [];
    
    // Analyze each tea and calculate match score
    teaCollection.forEach(tea => {
      const analysis = this.analyzeTea(tea);
      
      // Calculate how well this tea matches the constitution
      const matchScore = this._calculateConstitutionMatch(constitution, analysis);
      
      // Generate personalized rationale
      const rationale = this._generatePersonalizedRationale(constitution, analysis);
      
      // Add to recommendations
      recommendations.push({
        tea: tea,
        analysis: analysis,
        matchScore: matchScore,
        rationale: rationale
      });
    });
    
    // Sort by match score (descending)
    recommendations.sort((a, b) => b.matchScore - a.matchScore);
    
    // Return top recommendations
    return recommendations.slice(0, limit);
  }
  
  /**
   * Calculate how well a tea matches a TCM constitution
   */
  _calculateConstitutionMatch(constitution, analysis) {
    // Default implementation - customize based on TCM principles
    let matchScore = 0.5; // Start with neutral score
    
    // Check primary constitution type
    if (constitution.primaryType) {
      const type = constitution.primaryType.toLowerCase();
      
      // Match tea elements to constitution type
      if (type === 'wood' && analysis.dominantElement === 'wood') {
        matchScore += 0.2; // Supporting similar constitution
      } else if (type === 'fire' && analysis.dominantElement === 'fire') {
        matchScore += 0.2;
      } else if (type === 'earth' && analysis.dominantElement === 'earth') {
        matchScore += 0.2;
      } else if (type === 'metal' && analysis.dominantElement === 'metal') {
        matchScore += 0.2;
      } else if (type === 'water' && analysis.dominantElement === 'water') {
        matchScore += 0.2;
      }
      
      // Check for beneficial element relationships
      if (type === 'wood' && analysis.dominantElement === 'water') {
        matchScore += 0.3; // Water nourishes Wood in generating cycle
      } else if (type === 'fire' && analysis.dominantElement === 'wood') {
        matchScore += 0.3; // Wood feeds Fire
      } else if (type === 'earth' && analysis.dominantElement === 'fire') {
        matchScore += 0.3; // Fire creates Earth
      } else if (type === 'metal' && analysis.dominantElement === 'earth') {
        matchScore += 0.3; // Earth produces Metal
      } else if (type === 'water' && analysis.dominantElement === 'metal') {
        matchScore += 0.3; // Metal produces Water
      }
      
      // Check for controlling relationships (can be beneficial for excess conditions)
      if (constitution.excess) {
        const excess = constitution.excess.toLowerCase();
        
        if (excess === 'wood' && analysis.dominantElement === 'metal') {
          matchScore += 0.4; // Metal controls excess Wood
        } else if (excess === 'fire' && analysis.dominantElement === 'water') {
          matchScore += 0.4; // Water controls excess Fire
        } else if (excess === 'earth' && analysis.dominantElement === 'wood') {
          matchScore += 0.4; // Wood controls excess Earth
        } else if (excess === 'metal' && analysis.dominantElement === 'fire') {
          matchScore += 0.4; // Fire controls excess Metal
        } else if (excess === 'water' && analysis.dominantElement === 'earth') {
          matchScore += 0.4; // Earth controls excess Water
        }
      }
      
      // Check for deficiency patterns
      if (constitution.deficiency) {
        const deficiency = constitution.deficiency.toLowerCase();
        
        // For deficiency, the generating element is most beneficial
        if (deficiency === 'wood' && analysis.dominantElement === 'water') {
          matchScore += 0.4; // Water nourishes deficient Wood
        } else if (deficiency === 'fire' && analysis.dominantElement === 'wood') {
          matchScore += 0.4; // Wood nourishes deficient Fire
        } else if (deficiency === 'earth' && analysis.dominantElement === 'fire') {
          matchScore += 0.4; // Fire nourishes deficient Earth
        } else if (deficiency === 'metal' && analysis.dominantElement === 'earth') {
          matchScore += 0.4; // Earth nourishes deficient Metal
        } else if (deficiency === 'water' && analysis.dominantElement === 'metal') {
          matchScore += 0.4; // Metal nourishes deficient Water
        }
        
        // The same element can also support
        if (deficiency === analysis.dominantElement) {
          matchScore += 0.2;
        }
      }
    }
    // Consider seasonal appropriateness if present
    if (analysis.seasonality) {
      const currentSeason = analysis.seasonality.currentSeason;
      const harmonyScore = analysis.seasonality.harmonyScore;
      
      // Adjust based on seasonal harmony
      if (harmonyScore >= 4) {
        matchScore += 0.2; // Good seasonal harmony
      } else if (harmonyScore <= 2) {
        matchScore -= 0.1; // Poor seasonal harmony
      }
    }
    
    // Consider temperature characteristics (hot/cold)
    if (constitution.temperature && analysis.tcm && analysis.tcm.nature) {
      const constitutionTemp = constitution.temperature.toLowerCase();
      const teaNature = analysis.tcm.nature.toLowerCase();
      
      // Balance hot/cold patterns
      if (constitutionTemp.includes('hot') || constitutionTemp.includes('heat')) {
        if (teaNature.includes('cool') || teaNature.includes('cold')) {
          matchScore += 0.3; // Cooling tea balances hot constitution
        } else if (teaNature.includes('warm') || teaNature.includes('hot')) {
          matchScore -= 0.3; // Warming tea may aggravate hot constitution
        }
      } else if (constitutionTemp.includes('cold')) {
        if (teaNature.includes('warm') || teaNature.includes('hot')) {
          matchScore += 0.3; // Warming tea balances cold constitution
        } else if (teaNature.includes('cool') || teaNature.includes('cold')) {
          matchScore -= 0.3; // Cooling tea may aggravate cold constitution
        }
      }
    }
    
    // Prevent negative scores and cap at 1.0
    return Math.max(0, Math.min(1, matchScore));
  }
  
  /**
   * Generate personalized rationale for tea recommendation
   */
  _generatePersonalizedRationale(constitution, analysis) {
    let rationale = "";
    
    // Base rationale on dominant element
    if (constitution.primaryType && analysis.dominantElement) {
      const type = constitution.primaryType.toLowerCase();
      const element = analysis.dominantElement;
      
      // Generate relationship rationale
      if (type === element) {
        rationale += `This tea's ${element} element quality harmonizes with your ${type} constitution. `;
      } else if (this._isGeneratingElement(element, type)) {
        rationale += `This tea's ${element} element nourishes your ${type} constitution through the generating cycle. `;
      } else if (this._isControllingElement(element, type)) {
        rationale += `This tea's ${element} element helps regulate your ${type} constitution through the controlling cycle. `;
      }
      
      // Add specific condition rationale
      if (constitution.excess && constitution.excess.toLowerCase() === type) {
        if (this._isControllingElement(element, type)) {
          rationale += `It helps balance excess ${type} conditions through gentle regulation. `;
        }
      }
      
      if (constitution.deficiency && constitution.deficiency.toLowerCase() === type) {
        if (this._isGeneratingElement(element, type) || type === element) {
          rationale += `It supports your ${type} deficiency by providing nourishing energy. `;
        }
      }
    }
    
    // Add seasonal considerations if available
    if (analysis.seasonality) {
      const currentSeason = analysis.seasonality.currentSeason;
      const harmony = analysis.seasonality.harmony;
      
      if (harmony === "Excellent" || harmony === "Good") {
        rationale += `This tea is particularly well-suited for the current ${currentSeason} season. `;
      } else if (harmony === "Limited" || harmony === "Poor") {
        rationale += `Although not optimally matched to the current ${currentSeason} season, its qualities may still be beneficial for your constitution. `;
      }
    }
    
    // Add temperature/nature considerations
    if (constitution.temperature && analysis.tcm && analysis.tcm.nature) {
      const constitutionTemp = constitution.temperature.toLowerCase();
      const teaNature = analysis.tcm.nature.toLowerCase();
      
      if (constitutionTemp.includes('hot') && (teaNature.includes('cool') || teaNature.includes('cold'))) {
        rationale += `Its ${analysis.tcm.nature} nature helps cool and balance your heat pattern. `;
      } else if (constitutionTemp.includes('cold') && (teaNature.includes('warm') || teaNature.includes('hot'))) {
        rationale += `Its ${analysis.tcm.nature} nature helps warm and balance your cold pattern. `;
      }
    }
    // Add meridian affinities
    if (constitution.focusAreas && analysis.tcm && analysis.tcm.meridians) {
      const areas = constitution.focusAreas.map(a => a.toLowerCase());
      const meridians = analysis.tcm.meridians.map(m => m.toLowerCase());
      
      const matchingAreas = areas.filter(area => 
        meridians.some(meridian => meridian.includes(area) || area.includes(meridian))
      );
      
      if (matchingAreas.length > 0) {
        rationale += `This tea supports your focus areas of ${matchingAreas.join(', ')} through its meridian affinities. `;
      }
    }
    
    // If no specific rationale was generated, add a general one
    if (!rationale) {
      rationale = `This tea offers a ${analysis.effect.name} quality that may complement your constitution. `;
    }
    
    return rationale;
  }
  
  /**
   * Check if one element generates another in the Five Element cycle
   */
  _isGeneratingElement(generator, generated) {
    const generatingCycle = {
      water: 'wood',
      wood: 'fire',
      fire: 'earth',
      earth: 'metal',
      metal: 'water'
    };
    
    return generatingCycle[generator] === generated;
  }
  
  /**
   * Check if one element controls another in the Five Element cycle
   */
  _isControllingElement(controller, controlled) {
    const controllingCycle = {
      wood: 'earth',
      earth: 'water',
      water: 'fire',
      fire: 'metal',
      metal: 'wood'
    };
    
    return controllingCycle[controller] === controlled;
  }
  
  /**
   * Get TCM constitution types and their descriptions
   */
  getConstitutionTypes() {
    return {
      wood: {
        name: "Wood",
        chineseName: "木 (Mù)",
        description: "Characterized by activity, growth, and flexibility. Wood constitutions tend to be decisive, creative, and enjoy planning and organizing.",
        strengths: ["Creativity", "Vision", "Leadership", "Initiative"],
        challenges: ["Frustration", "Irritability", "Impatience"],
        balancingElements: {
          support: "Water",
          regulate: "Metal"
        }
      },
      fire: {
        name: "Fire",
        chineseName: "火 (Huǒ)",
        description: "Characterized by warmth, enthusiasm, and expressiveness. Fire constitutions tend to be passionate, charismatic, and socially engaging.",
        strengths: ["Joy", "Enthusiasm", "Connection", "Expressiveness"],
        challenges: ["Anxiety", "Overexcitement", "Scattered energy"],
        balancingElements: {
          support: "Wood",
          regulate: "Water"
        }
      },
      earth: {
        name: "Earth",
        chineseName: "土 (Tǔ)",
        description: "Characterized by stability, nourishment, and centeredness. Earth constitutions tend to be nurturing, reliable, and community-oriented.",
        strengths: ["Stability", "Nurturing", "Reliability", "Harmony"],
        challenges: ["Worry", "Overthinking", "Stagnation"],
        balancingElements: {
          support: "Fire",
          regulate: "Wood"
        }
      },
      metal: {
        name: "Metal",
        chineseName: "金 (Jīn)",
        description: "Characterized by precision, structure, and clarity. Metal constitutions tend to be orderly, detail-oriented, and principled.",
        strengths: ["Precision", "Discipline", "Structure", "Clarity"],
        challenges: ["Rigidity", "Perfectionism", "Detachment"],
        balancingElements: {
          support: "Earth",
          regulate: "Fire"
        }
      },
      water: {
        name: "Water",
        chineseName: "水 (Shuǐ)",
        description: "Characterized by depth, adaptability, and introspection. Water constitutions tend to be reflective, philosophical, and adaptable.",
        strengths: ["Wisdom", "Adaptability", "Resourcefulness", "Depth"],
        challenges: ["Fear", "Isolation", "Insecurity"],
        balancingElements: {
          support: "Metal",
          regulate: "Earth"
        }
      }
    };
  }
  
  /**
   * Get default seasonal recommendations
   */
  getSeasonalRecommendations() {
    return seasonalGuidance;
  }
  
  /**
   * Update system configuration
   */
  updateConfig(configUpdates) {
    this.config.update(configUpdates);
  }
  
  /**
   * Get current system configuration
   */
  getConfig() {
    return this.config.getAll();
  }
  
  /**
   * Export analysis to a formatted text report
   */
  exportAnalysisReport(analysis, format = 'text') {
    if (!analysis) {
      return "No analysis data to export";
    }
    
    if (format === 'json') {
      return JSON.stringify(analysis, null, 2);
    }
    
    // Generate text report
    let report = `TCM TEA ANALYSIS REPORT\n`;
    report += `======================\n\n`;
    
    // Tea info
    report += `Tea: ${analysis.name || 'Unknown'}\n`;
    report += `Type: ${analysis.type || 'Unknown'}\n`;
    report += `Origin: ${analysis.origin || 'Unknown'}\n\n`;
    
    // Element profile
    report += `FIVE ELEMENT PROFILE\n`;
    report += `-------------------\n`;
    report += `Dominant Element: ${analysis.dominantElement}\n`;
    report += `Supporting Element: ${analysis.supportingElement}\n\n`;
    
    // Format element scores
    report += `Element Distribution:\n`;
    for (const [element, score] of Object.entries(analysis.elements)) {
      report += `  - ${element.charAt(0).toUpperCase() + element.slice(1)}: ${(score * 100).toFixed(1)}%\n`;
    }
    report += `\n`;
    
    // Effect profile
    report += `EFFECT PROFILE\n`;
    report += `--------------\n`;
    report += `Name: ${analysis.effect.name}\n`;
    report += `Description: ${analysis.effect.description}\n\n`;
    
    // Specific effects
    if (analysis.effect.specificEffects && analysis.effect.specificEffects.length > 0) {
      report += `Key Effects:\n`;
      analysis.effect.specificEffects.forEach(effect => {
        report += `  - ${effect}\n`;
      });
      report += `\n`;
    }
    // TCM terminology
    if (analysis.tcm) {
      report += `TCM TERMINOLOGY\n`;
      report += `--------------\n`;
      report += `Nature: ${analysis.tcm.nature || 'Unknown'}\n`;
      report += `Flavor: ${analysis.tcm.flavor || 'Unknown'}\n`;
      
      if (analysis.tcm.meridians && analysis.tcm.meridians.length > 0) {
        report += `Meridians: ${analysis.tcm.meridians.join(', ')}\n`;
      }
      
      if (analysis.tcm.qualities && analysis.tcm.qualities.length > 0) {
        report += `Qualities: ${analysis.tcm.qualities.join(', ')}\n`;
      }
      
      report += `Yin-Yang Balance: ${analysis.tcm.balance}\n\n`;
    }
    
    // Seasonal Information
    if (analysis.seasonality) {
      report += `SEASONAL APPROPRIATENESS\n`;
      report += `----------------------\n`;
      report += `Current Season: ${analysis.seasonality.currentSeason}\n`;
      report += `Seasonal Harmony: ${analysis.seasonality.harmony}\n`;
      report += `Peak Season: ${analysis.seasonality.peakSeason}\n\n`;
      
      report += `Seasonal Scores:\n`;
      for (const [season, score] of Object.entries(analysis.seasonality.scores)) {
        report += `  - ${season.charAt(0).toUpperCase() + season.slice(1)}: ${score}/10\n`;
      }
      report += `\n`;
      
      if (analysis.seasonality.benefits && analysis.seasonality.benefits.length > 0) {
        report += `Seasonal Benefits:\n`;
        analysis.seasonality.benefits.forEach(benefit => {
          report += `  - ${benefit}\n`;
        });
        report += `\n`;
      }
    }
    
    // Recommendations
    if (analysis.recommendations) {
      report += `RECOMMENDATIONS\n`;
      report += `---------------\n`;
      
      if (analysis.recommendations.bestTimeToEnjoy) {
        report += `Best Time: ${analysis.recommendations.bestTimeToEnjoy.join(', ')}\n`;
      }
      
      if (analysis.recommendations.pairingFoods) {
        report += `Food Pairings: ${analysis.recommendations.pairingFoods.join(', ')}\n`;
      }
      
      if (analysis.recommendations.preparationTips) {
        report += `Preparation Tips: ${analysis.recommendations.preparationTips.join(', ')}\n`;
      }
      
      if (analysis.recommendations.complementaryActivities) {
        report += `Complementary Activities: ${analysis.recommendations.complementaryActivities.join(', ')}\n`;
      }
      
      report += `\n`;
    }
    
    return report;
  }
}

// Factory function to create analyzer with default configuration
export function createAnalyzer(configOptions = {}) {
  return new TeaTcmAnalyzer(configOptions);
}

export default TeaTcmAnalyzer;