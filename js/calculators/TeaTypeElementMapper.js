// TeaTypeElementMapper.js
// Mapper for tea types to Five Elements

import { teaTypeElementMappings, defaultElementDistribution } from '../data/TeaTypeElementMappings.js';

export class TeaTypeElementMapper {
  constructor(config, mappingsOverride) {
    this.config = config;
    this.teaTypeElementMappings = mappingsOverride?.teaTypeElementMappings || teaTypeElementMappings;
    this.defaultElementDistribution = mappingsOverride?.defaultElementDistribution || defaultElementDistribution;
  }
  
  /**
   * Maps a tea type to Five Elements when processing methods aren't known
   * 
   * @param {string} teaType - Tea type to map
   * @returns {Object} Element scores object with elements as keys and weights (0-1) as values
   */
  mapTeaTypeToElements(teaType) {
    if (!teaType || typeof teaType !== 'string') {
      return this._getDefaultElements();
    }
    
    const normalizedType = teaType.toLowerCase().trim();
    
    // Handle special cases for dark tea family with nested structures
    if (normalizedType === 'dark') {
      // Return the generic dark tea profile
      if (this.teaTypeElementMappings.dark?.generic) {
        return { ...this.teaTypeElementMappings.dark.generic };
      }
    } 
    else if (normalizedType === 'puerh' || normalizedType === 'pu-erh' || normalizedType === 'pu erh') {
      // Default to generic dark tea if specific puerh mapping isn't available
      if (this.teaTypeElementMappings.dark?.puerh) {
        // If no specific type (raw/ripe) is provided, prefer raw as the default
        return { ...this.teaTypeElementMappings.dark.puerh.raw };
      } else if (this.teaTypeElementMappings.dark?.generic) {
        return { ...this.teaTypeElementMappings.dark.generic };
      }
    }
    else if (normalizedType === 'sheng' || normalizedType === 'raw puerh' || normalizedType === 'raw pu-erh') {
      // Return raw puerh mapping
      if (this.teaTypeElementMappings.dark?.puerh?.raw) {
        return { ...this.teaTypeElementMappings.dark.puerh.raw };
      }
    }
    else if (normalizedType === 'shou' || normalizedType === 'ripe puerh' || normalizedType === 'ripe pu-erh') {
      // Return ripe puerh mapping
      if (this.teaTypeElementMappings.dark?.puerh?.ripe) {
        return { ...this.teaTypeElementMappings.dark.puerh.ripe };
      }
    }
    // Check for direct matches in standard categories
    else if (this.teaTypeElementMappings[normalizedType]) {
      return { ...this.teaTypeElementMappings[normalizedType] };
    }
    
    // If no match found, return a default mapping
    return this._getDefaultElements();
  }

  /**
   * Get default element distribution for fallback
   * @returns {Object} Default element distribution
   */
  _getDefaultElements() {
    return { ...this.defaultElementDistribution };
  }
}

export default TeaTypeElementMapper; 