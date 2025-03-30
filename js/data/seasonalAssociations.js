// seasonalAssociations.js
// Definitions of seasonal relationships in the Five Elements TCM system

export const seasonalAssociations = {
  wood: {
    primarySeason: "spring",
    seasonalStrengths: {
      spring: 1.0,      // Wood element is strongest in spring
      summer: 0.6,      // Feeds fire in summer
      lateSummer: 0.4,  // Transitions to earth
      autumn: 0.3,      // Controlled by metal
      winter: 0.5       // Begins to grow, fed by water
    },
    seasonalQualities: {
      spring: "Time of active growth and renewal",
      summer: "Supports transformation and active expression",
      lateSummer: "May create excess movement in earth's stability",
      autumn: "Restrained and condensed by metal",
      winter: "Storing potential and being nourished by water"
    }
  },
  fire: {
    primarySeason: "summer",
    seasonalStrengths: {
      spring: 0.5,      // Beginning to expand
      summer: 1.0,      // Fire element is strongest in summer
      lateSummer: 0.7,  // Creates earth through transformation
      autumn: 0.4,      // Tempered by metal
      winter: 0.2       // Most dormant in winter
    },
    seasonalQualities: {
      spring: "Building energy and warmth",
      summer: "Peak expression, maximal activity and joy",
      lateSummer: "Transforming into earth element qualities",
      autumn: "Diminishing but providing residual warmth",
      winter: "Dormant, protected deep within"
    }
  },
  earth: {
    primarySeason: "lateSummer",
    seasonalStrengths: {
      spring: 0.6,      // Stabilizes wood's growth
      summer: 0.7,      // Being created by fire
      lateSummer: 1.0,  // Earth element is strongest in late summer
      autumn: 0.7,      // Produces metal
      winter: 0.5       // Provides stability
    },
    seasonalQualities: {
      spring: "Supporting growth with stability",
      summer: "Being formed by fire's transformation",
      lateSummer: "Peak nourishment, ripeness and centrality",
      autumn: "Providing foundation for metal's clarity",
      winter: "Offering deep stability and sustenance"
    }
  },
  metal: {
    primarySeason: "autumn",
    seasonalStrengths: {
      spring: 0.3,      // Controlled by wood
      summer: 0.2,      // Weakened by fire
      lateSummer: 0.5,  // Produced by earth
      autumn: 1.0,      // Metal element is strongest in autumn
      winter: 0.7       // Produces water
    },
    seasonalQualities: {
      spring: "Providing resistance for healthy growth",
      summer: "Refined by fire's heat",
      lateSummer: "Taking shape from earth's influence",
      autumn: "Peak precision, clarity and refinement",
      winter: "Creating water through condensation"
    }
  },
  water: {
    primarySeason: "winter",
    seasonalStrengths: {
      spring: 0.6,      // Nourishes wood
      summer: 0.2,      // Controlled by fire
      lateSummer: 0.3,  // Restrained by earth
      autumn: 0.5,      // Produced by metal
      winter: 1.0       // Water element is strongest in winter
    },
    seasonalQualities: {
      spring: "Rising to nourish new growth",
      summer: "Potentially depleted by heat",
      lateSummer: "Contained and directed by earth",
      autumn: "Gathering and increasing as metal condenses",
      winter: "Peak depth, stillness and essential storage"
    }
  }
};

// Seasonal guidance including benefits and cautions
export const seasonalGuidance = {
  spring: {
    element: "wood",
    organs: ["Liver", "Gallbladder"],
    energy: "Upward and outward expansion",
    benefits: [
      "Supports liver function and detoxification",
      "Encourages natural cleansing processes",
      "Enhances mental clarity and vision",
      "Supports new beginnings and growth"
    ],
    cautions: [
      "May be too cooling for those prone to cold",
      "Could over-stimulate those prone to liver qi stagnation",
      "Can promote too much upward energy for headache sufferers",
      "Excessive for those with irritability or anger issues"
    ],
    idealQualities: ["Fresh", "Vibrant", "Slightly sour", "Detoxifying"]
  },
  summer: {
    element: "fire",
    organs: ["Heart", "Small Intestine"],
    energy: "Maximum expansion and activity",
    benefits: [
      "Supports heart function and circulation",
      "Promotes joy and social connection",
      "Enhances active metabolism",
      "Can help regulate cooling processes"
    ],
    cautions: [
      "May overstimulate those with anxiety",
      "Could be too warming for those with heat conditions",
      "May deplete fluids if consumed excessively",
      "Not ideal for those with agitation or insomnia"
    ],
    idealQualities: ["Bright", "Stimulating", "Slightly bitter", "Cooling"]
  },
  lateSummer: {
    element: "earth",
    organs: ["Spleen", "Stomach"],
    energy: "Centrality and transformation",
    benefits: [
      "Supports digestive function and nutrient absorption",
      "Promotes centered awareness and stability",
      "Helps harmonize and balance other elements",
      "Nourishes muscles and provides sustained energy"
    ],
    cautions: [
      "May produce dampness in those with weak digestion",
      "Could increase lethargy in those prone to stagnation",
      "Not ideal for those with excessive pensiveness",
      "May worsen bloating or heaviness"
    ],
    idealQualities: ["Nourishing", "Centered", "Slightly sweet", "Harmonizing"]
  },
  autumn: {
    element: "metal",
    organs: ["Lungs", "Large Intestine"],
    energy: "Condensing and refining",
    benefits: [
      "Supports lung function and immunity",
      "Helps maintain clear boundaries",
      "Enhances focus and precision",
      "Supports letting go of what's not needed"
    ],
    cautions: [
      "May increase dryness in those prone to dry conditions",
      "Could create constraint in those with depression",
      "May feel too contracting for some constitutions",
      "Not ideal for those with grief or respiratory weakness"
    ],
    idealQualities: ["Clear", "Crisp", "Slightly pungent", "Refining"]
  },
  winter: {
    element: "water",
    organs: ["Kidney", "Bladder"],
    energy: "Maximum conservation and storage",
    benefits: [
      "Supports kidney function and vitality reserves",
      "Encourages deep rest and restoration",
      "Nourishes the body's foundation",
      "Supports introspection and wisdom"
    ],
    cautions: [
      "May be too cooling for those with cold patterns",
      "Could slow metabolism in those with sluggish digestion",
      "May be too inward-focusing for those with depression",
      "Not ideal for those with fear-based conditions"
    ],
    idealQualities: ["Deep", "Calming", "Slightly salty", "Nourishing"]
  }
};

// Mapping for current month to TCM season
export const monthToSeason = {
  0: "winter",      // January
  1: "winter",      // February
  2: "spring",      // March
  3: "spring",      // April
  4: "spring",      // May
  5: "summer",      // June
  6: "summer",      // July
  7: "lateSummer",  // August
  8: "lateSummer",  // September
  9: "autumn",      // October
  10: "autumn",     // November
  11: "winter"      // December
};

// Season transition periods (when we're between seasons)
export const seasonTransitions = {
  "winter-spring": { months: [1, 2], description: "Winter giving way to Spring" },
  "spring-summer": { months: [4, 5], description: "Spring giving way to Summer" },
  "summer-lateSummer": { months: [6, 7], description: "Summer giving way to Late Summer" },
  "lateSummer-autumn": { months: [8, 9], description: "Late Summer giving way to Autumn" },
  "autumn-winter": { months: [10, 11], description: "Autumn giving way to Winter" }
};

export default {
  seasonalAssociations,
  seasonalGuidance,
  monthToSeason,
  seasonTransitions
};