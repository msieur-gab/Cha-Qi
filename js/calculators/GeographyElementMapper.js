// GeographyElementMapper.js
// Maps geographical factors of tea growing to Five Elements
// Optimized for basic geographical data: latitude, longitude, altitude, humidity, temperature, solar radiation

export class GeographyElementMapper {
  constructor(config) {
    this.config = config;
  }
  
  /**
   * Maps tea geography attributes to Five Elements
   * 
   * @param {Object} geography - Object containing geographical attributes
   * @param {number} geography.latitude - Latitude in decimal degrees
   * @param {number} geography.longitude - Longitude in decimal degrees
   * @param {number} geography.altitude - Average altitude in meters
   * @param {number} geography.humidity - Average relative humidity percentage
   * @param {number} geography.temperature - Average temperature in Celsius
   * @param {number} geography.solarRadiation - Average yearly solar radiation in W/m²
   * @returns {Object} Element scores object with elements as keys and weights (0-1) as values
   */
  mapGeographyToElements(geography) {
    if (!geography) return this._getDefaultElements();
    
    // Initialize elements object
    const elements = {
      wood: 0,
      fire: 0,
      earth: 0,
      metal: 0,
      water: 0
    };
    
    // Calculate element contributions from each geographical factor
    const altitudeElements = this._calculateAltitudeElements(geography.altitude);
    const humidityElements = this._calculateHumidityElements(geography.humidity);
    const temperatureElements = this._calculateTemperatureElements(geography.temperature);
    const solarElements = this._calculateSolarElements(geography.solarRadiation);
    const seasonalElements = this._calculateSeasonalElements(geography.latitude);
    
    // Combine element contributions with appropriate weights
    this._combineElementsWithWeights(elements, [
      { elements: altitudeElements, weight: 0.25 },     // Altitude is significant
      { elements: humidityElements, weight: 0.2 },      // Humidity affects growth
      { elements: temperatureElements, weight: 0.2 },   // Temperature determines growth rate
      { elements: solarElements, weight: 0.2 },         // Solar radiation impacts photosynthesis
      { elements: seasonalElements, weight: 0.15 }      // Seasonal factors (derived from latitude)
    ]);
    
    return elements;
  }
  
  /**
   * Combines multiple element mappings with their respective weights
   */
  _combineElementsWithWeights(targetElements, weightedElements) {
    // Reset target elements
    Object.keys(targetElements).forEach(element => {
      targetElements[element] = 0;
    });
    
    // Calculate total weight to ensure normalization
    const totalWeight = weightedElements.reduce((sum, item) => sum + (item.weight || 0), 0);
    
    // Add weighted contributions
    weightedElements.forEach(item => {
      if (!item.elements || !item.weight) return;
      
      const normalizedWeight = item.weight / totalWeight;
      
      Object.keys(item.elements).forEach(element => {
        if (targetElements[element] !== undefined) {
          targetElements[element] += item.elements[element] * normalizedWeight;
        }
      });
    });
    
    // Ensure all values are between 0 and 1
    Object.keys(targetElements).forEach(element => {
      targetElements[element] = Math.max(0, Math.min(1, targetElements[element]));
    });
  }
  
  /**
   * Returns default elements distribution when no geography data is available
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
   * Maps altitude to element contributions
   * Higher altitudes increase Metal and reduce Earth
   */
  _calculateAltitudeElements(altitude) {
    const elements = { wood: 0.2, fire: 0.2, earth: 0.2, metal: 0.2, water: 0.2 };
    
    if (!altitude || typeof altitude !== 'number') return elements;
    
    // Normalize altitude to useful ranges
    // <500m: Low, 500-1000m: Medium-low, 1000-1500m: Medium, 1500-2000m: Medium-high, >2000m: High
    
    if (altitude < 500) {
      // Low altitude: More Earth, less Metal
      elements.earth = 0.4;
      elements.fire = 0.25;
      elements.wood = 0.2;
      elements.water = 0.1;
      elements.metal = 0.05;
    } else if (altitude < 1000) {
      // Medium-low altitude: Balanced with slight Earth emphasis
      elements.earth = 0.3;
      elements.wood = 0.25;
      elements.fire = 0.2;
      elements.metal = 0.15;
      elements.water = 0.1;
    } else if (altitude < 1500) {
      // Medium altitude: Most balanced
      elements.wood = 0.25;
      elements.metal = 0.25;
      elements.earth = 0.2;
      elements.fire = 0.15;
      elements.water = 0.15;
    } else if (altitude < 2000) {
      // Medium-high altitude: More Metal and Wood
      elements.metal = 0.35;
      elements.wood = 0.25;
      elements.water = 0.2;
      elements.earth = 0.1;
      elements.fire = 0.1;
    } else {
      // High altitude: Strong Metal, increased Water
      elements.metal = 0.4;
      elements.water = 0.25;
      elements.wood = 0.2;
      elements.earth = 0.1;
      elements.fire = 0.05;
    }
    
    return elements;
  }
  
  /**
   * Maps humidity to element contributions
   * Higher humidity increases Water and Wood, lower increases Fire
   */
  _calculateHumidityElements(humidity) {
    const elements = { wood: 0.2, fire: 0.2, earth: 0.2, metal: 0.2, water: 0.2 };
    
    if (!humidity || typeof humidity !== 'number') return elements;
    
    // Normalize humidity ranges
    // <40%: Very dry, 40-60%: Dry, 60-75%: Moderate, 75-85%: Humid, >85%: Very humid
    
    if (humidity < 40) {
      // Very dry: Strong Fire, low Water
      elements.fire = 0.4;
      elements.metal = 0.25;
      elements.earth = 0.2;
      elements.wood = 0.1;
      elements.water = 0.05;
    } else if (humidity < 60) {
      // Dry: Moderate Fire, low Water
      elements.fire = 0.3;
      elements.metal = 0.25;
      elements.earth = 0.2;
      elements.wood = 0.15;
      elements.water = 0.1;
    } else if (humidity < 75) {
      // Moderate: Balanced distribution
      elements.wood = 0.25;
      elements.earth = 0.25;
      elements.water = 0.2;
      elements.fire = 0.15;
      elements.metal = 0.15;
    } else if (humidity < 85) {
      // Humid: High Wood and Water
      elements.wood = 0.3;
      elements.water = 0.3;
      elements.earth = 0.2;
      elements.metal = 0.1;
      elements.fire = 0.1;
    } else {
      // Very humid: Dominant Water and Wood
      elements.water = 0.4;
      elements.wood = 0.3;
      elements.earth = 0.15;
      elements.metal = 0.1;
      elements.fire = 0.05;
    }
    
    return elements;
  }
  
  /**
   * Maps temperature to element contributions
   * Higher temperatures increase Fire, lower increase Water
   */
  _calculateTemperatureElements(temperature) {
    const elements = { wood: 0.2, fire: 0.2, earth: 0.2, metal: 0.2, water: 0.2 };
    
    if (!temperature || typeof temperature !== 'number') return elements;
    
    // Normalize temperature ranges for tea growing regions
    // <15°C: Cool, 15-20°C: Mild, 20-25°C: Moderate, 25-30°C: Warm, >30°C: Hot
    
    if (temperature < 15) {
      // Cool: High Water, low Fire
      elements.water = 0.4;
      elements.metal = 0.25;
      elements.earth = 0.15;
      elements.wood = 0.15;
      elements.fire = 0.05;
    } else if (temperature < 20) {
      // Mild: Balanced with Water emphasis
      elements.water = 0.3;
      elements.metal = 0.25;
      elements.wood = 0.2;
      elements.earth = 0.15;
      elements.fire = 0.1;
    } else if (temperature < 25) {
      // Moderate: Optimal balanced growing temperatures
      elements.wood = 0.25;
      elements.earth = 0.25;
      elements.water = 0.2;
      elements.fire = 0.15;
      elements.metal = 0.15;
    } else if (temperature < 30) {
      // Warm: Fire and Wood emphasis
      elements.fire = 0.3;
      elements.wood = 0.25;
      elements.earth = 0.2;
      elements.water = 0.15;
      elements.metal = 0.1;
    } else {
      // Hot: Strong Fire, low Water
      elements.fire = 0.4;
      elements.wood = 0.25;
      elements.earth = 0.2;
      elements.metal = 0.1;
      elements.water = 0.05;
    }
    
    return elements;
  }
  
  /**
   * Maps solar radiation to element contributions
   * Higher solar radiation increases Fire and Wood
   */
  _calculateSolarElements(solarRadiation) {
    const elements = { wood: 0.2, fire: 0.2, earth: 0.2, metal: 0.2, water: 0.2 };
    
    if (!solarRadiation || typeof solarRadiation !== 'number') return elements;
    
    // Normalize solar radiation ranges (W/m²)
    // <3.0: Low, 3.0-4.0: Moderate-low, 4.0-5.0: Moderate, 5.0-6.0: Moderate-high, >6.0: High
    
    if (solarRadiation < 3.0) {
      // Low solar radiation: More Water and Metal
      elements.water = 0.3;
      elements.metal = 0.3;
      elements.earth = 0.2;
      elements.wood = 0.15;
      elements.fire = 0.05;
    } else if (solarRadiation < 4.0) {
      // Moderate-low: Balanced with Metal emphasis
      elements.metal = 0.3;
      elements.water = 0.25;
      elements.wood = 0.2;
      elements.earth = 0.15;
      elements.fire = 0.1;
    } else if (solarRadiation < 5.0) {
      // Moderate: Balanced with Wood emphasis
      elements.wood = 0.3;
      elements.earth = 0.25;
      elements.metal = 0.2;
      elements.fire = 0.15;
      elements.water = 0.1;
    } else if (solarRadiation < 6.0) {
      // Moderate-high: Wood and Fire emphasis
      elements.wood = 0.3;
      elements.fire = 0.3;
      elements.earth = 0.2;
      elements.metal = 0.1;
      elements.water = 0.1;
    } else {
      // High solar radiation: Strong Fire and Wood
      elements.fire = 0.35;
      elements.wood = 0.35;
      elements.earth = 0.15;
      elements.metal = 0.1;
      elements.water = 0.05;
    }
    
    return elements;
  }
  
  /**
   * Derives seasonal influence based on latitude
   * This approximates growing season characteristics
   */
  _calculateSeasonalElements(latitude) {
    const elements = { wood: 0.2, fire: 0.2, earth: 0.2, metal: 0.2, water: 0.2 };
    
    if (latitude === undefined || latitude === null) return elements;
    
    // Normalize latitude to avoid negative values
    const absLatitude = Math.abs(latitude);
    
    // Different latitude ranges represent different climate patterns
    if (absLatitude < 10) {
      // Equatorial: year-round growth, balanced but Fire-dominant
      elements.fire = 0.3;
      elements.wood = 0.25;
      elements.earth = 0.2;
      elements.water = 0.15;
      elements.metal = 0.1;
    } else if (absLatitude < 20) {
      // Tropical: strong growing conditions, Wood-dominant
      elements.wood = 0.35;
      elements.fire = 0.25;
      elements.earth = 0.2;
      elements.water = 0.1;
      elements.metal = 0.1;
    } else if (absLatitude < 30) {
      // Subtropical: classic tea growing regions, balanced
      elements.wood = 0.25;
      elements.earth = 0.25;
      elements.fire = 0.2;
      elements.metal = 0.15;
      elements.water = 0.15;
    } else if (absLatitude < 40) {
      // Temperate: distinct seasons, Metal-dominant
      elements.metal = 0.3;
      elements.earth = 0.25;
      elements.water = 0.2;
      elements.wood = 0.15;
      elements.fire = 0.1;
    } else {
      // Northern regions: shorter growing seasons, Water-dominant
      elements.water = 0.35;
      elements.metal = 0.25;
      elements.earth = 0.2;
      elements.wood = 0.1;
      elements.fire = 0.1;
    }
    
    return elements;
  }
  
  /**
   * Provides TCM-based analysis of geography's influence on tea
   * 
   * @param {Object} geography - Geography data
   * @returns {Object} TCM analysis of geographical influences
   */
  analyzeGeographicalInfluence(geography) {
    if (!geography) {
      return {
        primary: "Unknown",
        description: "Insufficient geographical data available for TCM analysis."
      };
    }
    
    // Map geography to elements
    const elements = this.mapGeographyToElements(geography);
    
    // Find primary and secondary elements
    const sortedElements = Object.entries(elements)
      .sort(([, a], [, b]) => b - a);
    
    const primaryElement = sortedElements[0][0];
    const secondaryElement = sortedElements[1][0];
    
    // Generate TCM description of this terroir
    let description = this._getTerrainTcmDescription(
      primaryElement, 
      secondaryElement,
      geography
    );
    
    // Determine overall terrain character
    let terrainCharacter = this._getDominantTerrainCharacter(elements, geography);
    
    return {
      elements,
      primaryElement,
      secondaryElement,
      terrainCharacter,
      description
    };
  }
  
  /**
   * Generates a TCM-based description of how geography influences the tea
   */
  _getTerrainTcmDescription(primary, secondary, geography) {
    const descriptions = {
      wood: {
        wood: "Strong Wood terrain supports vibrant growth and promotes upward, expansive Qi movement. Teas from this region typically have fresh, vibrant qualities.",
        fire: "Wood-Fire terrain creates dynamic energy with strong upward movement. Teas tend to have bright, refreshing qualities with underlying warmth.",
        earth: "Wood-Earth terrain balances growth with stability. Teas often express fresh qualities with underlying sweetness and substance.",
        metal: "Wood-Metal terrain combines growth with refinement. Teas typically feature clean, precise vegetal notes with excellent structure.",
        water: "Wood-Water terrain brings flexibility with depth. Teas often show complexity with fresh top notes and deeper undertones."
      },
      fire: {
        wood: "Fire-Wood terrain creates dynamic vitality. Teas typically express warming qualities with vibrant aromatics.",
        fire: "Strong Fire terrain produces potent Yang energy. Teas tend to be highly stimulating with pronounced warming qualities.",
        earth: "Fire-Earth terrain transforms and nourishes. Teas often have pronounced sweet notes with warming qualities.",
        metal: "Fire-Metal terrain tempers intensity with precision. Teas typically show bright clarity with underlying warmth.",
        water: "Fire-Water terrain balances opposing forces. Teas often express complex character with both stimulating and calming attributes."
      },
      earth: {
        wood: "Earth-Wood terrain grounds expansive energy. Teas typically have substantive body with fresh qualities.",
        fire: "Earth-Fire terrain provides warming stability. Teas often express sweet notes with underlying warmth.",
        earth: "Strong Earth terrain creates centering, nourishing qualities. Teas tend to have pronounced sweetness and full body.",
        metal: "Earth-Metal terrain combines nourishment with refinement. Teas typically show structured sweetness and clarity.",
        water: "Earth-Water terrain balances stability with depth. Teas often have substantial body with underlying complexity."
      },
      metal: {
        wood: "Metal-Wood terrain refines growth energy. Teas typically have clean, precise vegetal notes.",
        fire: "Metal-Fire terrain tempers heat with clarity. Teas often express bright, clear qualities with subtle warmth.",
        earth: "Metal-Earth terrain grounds refinement. Teas typically show structured sweetness with excellent clarity.",
        metal: "Strong Metal terrain creates exceptional refinement and clarity. Teas tend to have precise, well-defined qualities.",
        water: "Metal-Water terrain combines clarity with depth. Teas often express bright notes with underlying complexity."
      },
      water: {
        wood: "Water-Wood terrain provides nurturing flexibility. Teas typically have complex character with fresh overtones.",
        fire: "Water-Fire terrain balances depth with activation. Teas often express complex stimulating qualities.",
        earth: "Water-Earth terrain grounds depth with stability. Teas typically show substantive body with deeper complexity.",
        metal: "Water-Metal terrain refines depth with clarity. Teas often have clear, bright qualities with underlying complexity.",
        water: "Strong Water terrain creates profound depth and stillness. Teas tend to have complex, multidimensional character."
      }
    };
    
    // Get the basic description
    let description = descriptions[primary][secondary];
    
    // Add altitude-specific information if available
    if (geography.altitude) {
      if (geography.altitude > 1500) {
        description += " The high elevation contributes significant Metal element influence, enhancing clarity and refinement.";
      } else if (geography.altitude < 500) {
        description += " The lower elevation contributes Earth element influence, providing stability and substance.";
      }
    }
    
    return description;
  }
  
  /**
   * Determines the dominant TCM terrain character based on element distribution
   */
  _getDominantTerrainCharacter(elements, geography) {
    // Special case terrain types based on geography
    if (geography.altitude > 1800) {
      return "High Mountain (高山)";
    }
    
    if (geography.humidity > 85 && geography.temperature > 25) {
      return "Tropical Rainforest (热带雨林)";
    }
    
    if (geography.humidity < 40) {
      return "Arid (干旱)";
    }
    
    // Standard element-based terrain characters
    const maxElement = Object.entries(elements).sort(([, a], [, b]) => b - a)[0][0];
    
    const terrainTypes = {
      wood: "Verdant Forest (翠绿森林)",
      fire: "Sunny Slopes (阳光山坡)",
      earth: "Fertile Valley (肥沃山谷)",
      metal: "Clear Mountain (清澈高山)",
      water: "Mist Shrouded (云雾缭绕)"
    };
    
    return terrainTypes[maxElement];
  }
}

export default GeographyElementMapper;