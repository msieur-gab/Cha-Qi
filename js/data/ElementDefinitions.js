// ElementDefinitions.js
// Core definitions of the Five Elements in TCM and their relationships to tea

export const elementDefinitions = {
  wood: {
    name: "Wood",
    chineseName: "木 (Mù)",
    description: "Represents growth, expansion, vitality, and flexibility",
    season: "Spring",
    direction: "East",
    color: {
      primary: "#4CAF50",
      secondary: "#8BC34A",
      gradient: ["#4CAF50", "#8BC34A"]
    },
    flavor: "Sour",
    bodyAffinity: ["Liver", "Gallbladder", "Eyes", "Tendons"],
    emotions: {
      balanced: ["Creativity", "Flexibility", "Growth", "Decision-making"],
      excess: ["Irritability", "Frustration", "Impatience"],
      deficient: ["Indecisiveness", "Lack of direction", "Stagnation"]
    },
    teaQualities: {
      flavor: ["Sour", "Vegetal", "Grassy", "Fresh", "Astringent"],
      energy: ["Uplifting", "Refreshing", "Invigorating", "Cleansing"],
      effects: ["Supports physical activity", "Aids digestion", "Promotes cleansing", "Enhances creativity"]
    },
    teaAttributes: {
      primary: ["Young", "Fresh", "Spring-harvested", "Green", "Vegetal"],
      secondary: ["Clean-tasting", "Bright", "Sharp", "Zesty"]
    }
  },
  
  fire: {
    name: "Fire",
    chineseName: "火 (Huǒ)",
    description: "Represents transformation, warmth, energy, and passion",
    season: "Summer",
    direction: "South",
    color: {
      primary: "#F44336",
      secondary: "#FF9800",
      gradient: ["#F44336", "#FF9800"]
    },
    flavor: "Bitter",
    bodyAffinity: ["Heart", "Small Intestine", "Blood vessels", "Tongue"],
    emotions: {
      balanced: ["Joy", "Enthusiasm", "Passion", "Connection"],
      excess: ["Overexcitement", "Anxiety", "Impulsiveness"],
      deficient: ["Depression", "Lack of enthusiasm", "Emotional coldness"]
    },
    teaQualities: {
      flavor: ["Bitter", "Spicy", "Warming", "Bold", "Robust"],
      energy: ["Stimulating", "Warming", "Energizing", "Invigorating"],
      effects: ["Increases circulation", "Boosts energy", "Enhances mental clarity", "Supports cardiovascular function"]
    },
    teaAttributes: {
      primary: ["Roasted", "Oxidized", "Stimulating", "Fully-fermented", "Strong"],
      secondary: ["Warming", "Invigorating", "Bright", "Active"]
    }
  },
  
  earth: {
    name: "Earth",
    chineseName: "土 (Tǔ)",
    description: "Represents stability, nourishment, centering, and balance",
    season: "Late Summer",
    direction: "Center",
    color: {
      primary: "#FFC107",
      secondary: "#FFEB3B",
      gradient: ["#FFC107", "#FFEB3B"]
    },
    flavor: "Sweet",
    bodyAffinity: ["Stomach", "Spleen", "Muscles", "Mouth"],
    emotions: {
      balanced: ["Contentment", "Groundedness", "Stability", "Nurturing"],
      excess: ["Worry", "Overthinking", "Overly cautious"],
      deficient: ["Insecurity", "Lack of focus", "Neediness"]
    },
    teaQualities: {
      flavor: ["Sweet", "Mellow", "Honey", "Malty", "Smooth"],
      energy: ["Centering", "Nourishing", "Stabilizing", "Balancing"],
      effects: ["Aids digestion", "Soothes the stomach", "Promotes focus", "Supports healthy metabolism"]
    },
    teaAttributes: {
      primary: ["Balanced", "Sweet", "Rounded", "Medium-bodied", "Nourishing"],
      secondary: ["Grounding", "Satisfying", "Comforting", "Gentle"]
    }
  },
  
  metal: {
    name: "Metal",
    chineseName: "金 (Jīn)",
    description: "Represents clarity, refinement, precision, and letting go",
    season: "Autumn",
    direction: "West",
    color: {
      primary: "#9E9E9E",
      secondary: "#BDBDBD",
      gradient: ["#9E9E9E", "#BDBDBD"]
    },
    flavor: "Spicy/Pungent",
    bodyAffinity: ["Lungs", "Large Intestine", "Skin", "Nose"],
    emotions: {
      balanced: ["Clarity", "Precision", "Integrity", "Inspiration"],
      excess: ["Rigidity", "Perfectionism", "Excessive sadness"],
      deficient: ["Difficulty letting go", "Disorganization", "Lack of boundaries"]
    },
    teaQualities: {
      flavor: ["Mineral", "Crisp", "Clean", "Floral", "Aromatic"],
      energy: ["Clarifying", "Focusing", "Purifying", "Refining"],
      effects: ["Supports respiratory function", "Enhances mental clarity", "Aids detoxification", "Improves skin health"]
    },
    teaAttributes: {
      primary: ["Clear", "Pure", "Precise", "Refined", "High-mountain"],
      secondary: ["Structured", "Aromatic", "Elegant", "Focused"]
    }
  },
  
  water: {
    name: "Water",
    chineseName: "水 (Shuǐ)",
    description: "Represents depth, stillness, introspection, and wisdom",
    season: "Winter",
    direction: "North",
    color: {
      primary: "#2196F3",
      secondary: "#03A9F4",
      gradient: ["#2196F3", "#03A9F4"]
    },
    flavor: "Salty",
    bodyAffinity: ["Kidneys", "Bladder", "Bones", "Ears"],
    emotions: {
      balanced: ["Calmness", "Introspection", "Wisdom", "Adaptability"],
      excess: ["Fear", "Paranoia", "Isolation"],
      deficient: ["Restlessness", "Shallow thinking", "Insecurity"]
    },
    teaQualities: {
      flavor: ["Deep", "Rich", "Earthy", "Complex", "Aged"],
      energy: ["Calming", "Cooling", "Grounding", "Centering"],
      effects: ["Supports deep relaxation", "Aids stress reduction", "Enhances meditation", "Promotes restful sleep"]
    },
    teaAttributes: {
      primary: ["Aged", "Mature", "Deep", "Complex", "Dark"],
      secondary: ["Mysterious", "Calming", "Woody", "Profound"]
    }
  }
};

export const elementRelationships = {
  // Generating/Nourishing cycle (母子關係)
  generating: {
    wood: "fire",   // Wood generates Fire
    fire: "earth",  // Fire generates Earth
    earth: "metal", // Earth generates Metal
    metal: "water", // Metal generates Water
    water: "wood"   // Water generates Wood
  },
  
  // Controlling/Restraining cycle (剋制關係)
  controlling: {
    wood: "earth",  // Wood controls Earth
    earth: "water", // Earth controls Water
    water: "fire",  // Water controls Fire
    fire: "metal",  // Fire controls Metal
    metal: "wood"   // Metal controls Wood
  }
};

export const elementSeasons = {
  spring: "wood",
  summer: "fire",
  "late summer": "earth",
  autumn: "metal",
  winter: "water"
};

export const flavorElementAssociations = {
  sour: "wood",
  bitter: "fire",
  sweet: "earth",
  pungent: "metal", // Also referred to as "spicy" or "acrid"
  salty: "water"
};

export default {
  elementDefinitions,
  elementRelationships,
  elementSeasons,
  flavorElementAssociations
};
