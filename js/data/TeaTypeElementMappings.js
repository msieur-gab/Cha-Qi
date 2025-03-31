// TeaTypeElementMappings.js
// Mapping of tea types to Five Elements when processing methods aren't available

export const teaTypeElementMappings = {
  // Standard Categories
  "green": { wood: 0.65, metal: 0.25, water: 0.10 },
  "white": { wood: 0.50, metal: 0.30, water: 0.20 },
  "yellow": { wood: 0.40, earth: 0.40, fire: 0.15, metal: 0.05 },
  "oolong": { fire: 0.40, earth: 0.30, wood: 0.20, metal: 0.10 },
  "black": { fire: 0.70, earth: 0.20, metal: 0.10 },
  
  // Dark Tea Family (now includes pu-erh as subcategory)
  "dark": {
    generic: { water: 0.55, earth: 0.35, fire: 0.10 }, // Base template
    puerh: {
      raw: { wood: 0.50, water: 0.30, earth: 0.20 },   // Sheng
      ripe: { water: 0.60, earth: 0.35, fire: 0.05 }    // Shou
    }
  }
};

// Default balanced element distribution for fallback
export const defaultElementDistribution = {
  wood: 0.2,
  fire: 0.2,
  earth: 0.2,
  metal: 0.2,
  water: 0.2
};

export default {
  teaTypeElementMappings,
  defaultElementDistribution
}; 