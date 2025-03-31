/**
 * TeaElementComparisonTool.js
 * 
 * A utility tool for comparing different element calculation methods against reference values.
 * This helps in fine-tuning the calculation algorithms.
 */

import teaDatabase from './data/TeaDatabase.js';
import { createAnalyzer } from './TeaTcmAnalyzer.js';
import FlavorProfileMapper from './data/FlavorProfileMapper.js';

class TeaElementComparisonTool {
  constructor() {
    // Initialize analyzers with different configurations
    this.flavorOnlyAnalyzer = createAnalyzer({
      elementWeights: {
        flavor: 1.0,      // 100% flavor weight
        compounds: 0,      // Disable compounds
        processing: 0,     // Disable processing 
        geography: 0       // Disable geography
      },
      processing: {
        ignoreProcessingMethods: true  // Ignore processing methods
      },
      elementInteractions: {
        enabled: false     // Disable element interactions
      }
    });
    
    this.flavorProfileMapper = new FlavorProfileMapper();
    
    // Store analysis results
    this.comparisonResults = [];
  }
  
  /**
   * Analyze all teas in the database using different methods
   * @returns {Array} Comparison results
   */
  analyzeAllTeas() {
    this.comparisonResults = [];
    
    teaDatabase.forEach(tea => {
      const result = this.analyzeTea(tea);
      this.comparisonResults.push(result);
    });
    
    return this.comparisonResults;
  }
  
  /**
   * Analyze a single tea using multiple methods
   * @param {Object} tea - Tea object from database
   * @returns {Object} Comparison result
   */
  analyzeTea(tea) {
    // Using TCM Analyzer (flavor-only configuration)
    const tcmAnalysis = this.flavorOnlyAnalyzer.analyzeTea(tea);
    
    // Using Flavor Profile Mapper
    const flavorProfileAnalysis = this.flavorProfileMapper.analyzeFlavorProfile(tea.flavorProfile);
    
    // Get sorted elements for each method
    const tcmSortedElements = this.getSortedElements(tcmAnalysis.elements);
    const flavorProfileSortedElements = this.getSortedElements(flavorProfileAnalysis.elements);
    
    // Calculate accuracy against reference values
    const tcmAccuracy = this.calculateAccuracy(
      tcmSortedElements, 
      tea.tcmElements.dominant.element, 
      tea.tcmElements.supportive.element
    );
    
    const flavorProfileAccuracy = this.calculateAccuracy(
      flavorProfileSortedElements, 
      tea.tcmElements.dominant.element, 
      tea.tcmElements.supportive.element
    );
    
    return {
      teaName: tea.name,
      teaType: tea.type,
      reference: {
        dominant: tea.tcmElements.dominant,
        supportive: tea.tcmElements.supportive
      },
      tcmAnalyzer: {
        dominant: { 
          element: tcmSortedElements[0][0], 
          percent: Math.round(tcmSortedElements[0][1] * 100) 
        },
        supportive: { 
          element: tcmSortedElements[1][0], 
          percent: Math.round(tcmSortedElements[1][1] * 100) 
        },
        allElements: tcmAnalysis.elements,
        accuracy: tcmAccuracy
      },
      flavorProfileMapper: {
        dominant: { 
          element: flavorProfileSortedElements[0][0], 
          percent: Math.round(flavorProfileSortedElements[0][1] * 100) 
        },
        supportive: { 
          element: flavorProfileSortedElements[1][0], 
          percent: Math.round(flavorProfileSortedElements[1][1] * 100) 
        },
        allElements: flavorProfileAnalysis.elements,
        accuracy: flavorProfileAccuracy
      },
      flavorProfile: tea.flavorProfile
    };
  }
  
  /**
   * Get elements sorted by their values (highest first)
   * @param {Object} elements - Element scores object
   * @returns {Array} Sorted array of [element, score] pairs
   */
  getSortedElements(elements) {
    return Object.entries(elements).sort((a, b) => b[1] - a[1]);
  }
  
  /**
   * Calculate accuracy score based on correct element identification
   * @param {Array} sortedElements - Sorted elements from calculation
   * @param {string} refDominant - Reference dominant element
   * @param {string} refSupportive - Reference supportive element
   * @returns {Object} Accuracy scores
   */
  calculateAccuracy(sortedElements, refDominant, refSupportive) {
    const dominantCorrect = sortedElements[0][0] === refDominant.toLowerCase();
    const supportiveCorrect = sortedElements[1][0] === refSupportive.toLowerCase();
    
    let score = 0;
    if (dominantCorrect) score += 70;
    if (supportiveCorrect) score += 30;
    
    return {
      score,
      dominantCorrect,
      supportiveCorrect,
      description: this.getAccuracyDescription(dominantCorrect, supportiveCorrect)
    };
  }
  
  /**
   * Get a text description of the accuracy
   * @param {boolean} dominantCorrect - Whether dominant element is correct
   * @param {boolean} supportiveCorrect - Whether supportive element is correct
   * @returns {string} Description
   */
  getAccuracyDescription(dominantCorrect, supportiveCorrect) {
    if (dominantCorrect && supportiveCorrect) {
      return "Perfect match";
    } else if (dominantCorrect) {
      return "Dominant element correct";
    } else if (supportiveCorrect) {
      return "Supportive element correct";
    } else {
      return "No match";
    }
  }
  
  /**
   * Get overall accuracy statistics for each method
   * @returns {Object} Statistics
   */
  getAccuracyStats() {
    if (this.comparisonResults.length === 0) {
      this.analyzeAllTeas();
    }
    
    const tcmTotal = this.comparisonResults.reduce((sum, result) => 
      sum + result.tcmAnalyzer.accuracy.score, 0);
      
    const flavorProfileTotal = this.comparisonResults.reduce((sum, result) => 
      sum + result.flavorProfileMapper.accuracy.score, 0);
    
    const tcmDominantCorrect = this.comparisonResults.filter(result => 
      result.tcmAnalyzer.accuracy.dominantCorrect).length;
      
    const flavorProfileDominantCorrect = this.comparisonResults.filter(result => 
      result.flavorProfileMapper.accuracy.dominantCorrect).length;
      
    const tcmSupportiveCorrect = this.comparisonResults.filter(result => 
      result.tcmAnalyzer.accuracy.supportiveCorrect).length;
      
    const flavorProfileSupportiveCorrect = this.comparisonResults.filter(result => 
      result.flavorProfileMapper.accuracy.supportiveCorrect).length;
      
    const tcmPerfectMatch = this.comparisonResults.filter(result => 
      result.tcmAnalyzer.accuracy.dominantCorrect && result.tcmAnalyzer.accuracy.supportiveCorrect).length;
      
    const flavorProfilePerfectMatch = this.comparisonResults.filter(result => 
      result.flavorProfileMapper.accuracy.dominantCorrect && result.flavorProfileMapper.accuracy.supportiveCorrect).length;
    
    const totalTeas = this.comparisonResults.length;
    
    return {
      tcmAnalyzer: {
        overallScore: Math.round(tcmTotal / totalTeas),
        dominantCorrectPercent: Math.round((tcmDominantCorrect / totalTeas) * 100),
        supportiveCorrectPercent: Math.round((tcmSupportiveCorrect / totalTeas) * 100),
        perfectMatchPercent: Math.round((tcmPerfectMatch / totalTeas) * 100)
      },
      flavorProfileMapper: {
        overallScore: Math.round(flavorProfileTotal / totalTeas),
        dominantCorrectPercent: Math.round((flavorProfileDominantCorrect / totalTeas) * 100),
        supportiveCorrectPercent: Math.round((flavorProfileSupportiveCorrect / totalTeas) * 100),
        perfectMatchPercent: Math.round((flavorProfilePerfectMatch / totalTeas) * 100)
      }
    };
  }
}

// Export for use in other modules
export default TeaElementComparisonTool; 