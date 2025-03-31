/**
 * TeaDatabase.js
 * 
 * A comprehensive database of tea profiles for testing and comparing 
 * different TCM element calculation methods.
 * 
 * Note: The tcmElements values are reference values only, meant for
 * evaluating the accuracy of calculation methods, not to be used directly.
 */

const teaDatabase = [
  {
    id: "gyokuro",
    name: "Gyokuro (Jade Dew)",
    type: "green",
    origin: "Uji, Japan",
    caffeineLevel: 5, // High (35–50 mg)
    lTheanineLevel: 8, // Extreme due to 3-week shading
    flavorProfile: ["umami","marine","sweet", "seaweed","grassy", "vegetal"],
    processingMethods: ["shade-grown", "steamed", "rolled"],
    geography: {
      altitude: 100, // meters
      humidity: 70, // percent
      latitude: 34.8, // degrees N
      temperature: 16, // Celsius
      solarRadiation: 3.8 // kWh/m²/day (low due to shading)
    },
    tcmElements: {
      dominant: { element: "wood", percent: 70 }, // Liver-calming (high theanine)
      supportive: { element: "water", percent: 25 } // Kidney support (deep umami)
    }
  },
  {
    id: "shou-puerh",
    name: "Shou Pu-erh",
    type: "puerh",
    origin: "Yunnan, China",
    caffeineLevel: 4, // Moderate (30–40 mg)
    lTheanineLevel: 2,
    flavorProfile: ["earthy", "smooth", "woody"],
    processingMethods: ["wet-piling", "fermented", "compressed", "aged"],
    geography: {
      altitude: 1300, // meters
      humidity: 80, // percent
      latitude: 22, // degrees N
      temperature: 20, // Celsius
      solarRadiation: 4.6 // kWh/m²/day
    },
    tcmElements: {
      dominant: { element: "earth", percent: 80 }, // Post-fermentation → spleen/stomach focus
      supportive: { element: "metal", percent: 15 } // Mild detoxification
    }
  },
  {
    id: "dian-hong",
    name: "Dian Hong (Yunnan Black)",
    type: "black",
    origin: "Yunnan, China",
    caffeineLevel: 6, // High (40–60 mg)
    lTheanineLevel: 3,
    flavorProfile: ["malty", "chocolate", "dried fruit"],
    processingMethods: ["fully-oxidized", "rolling", "baking"],
    geography: {
      altitude: 1500, // meters
      humidity: 65, // percent
      latitude: 23.6, // degrees N
      temperature: 18, // Celsius
      solarRadiation: 4.8 // kWh/m²/day
    },
    tcmElements: {
      dominant: { element: "fire", percent: 70 }, // Full oxidation → strong yang
      supportive: { element: "earth", percent: 25 } // Spleen/stomach support
    }
  },
  {
    id: "tieguanyin",
    name: "Tieguanyin (Iron Goddess)",
    type: "oolong",
    origin: "Anxi, Fujian, China",
    caffeineLevel: 5, // Moderate-high (35–50 mg)
    lTheanineLevel: 4,
    flavorProfile: ["orchid", "creamy", "mineral"],
    processingMethods: ["partial-oxidation", "roasted", "rolling"],
    geography: {
      altitude: 700, // meters
      humidity: 75, // percent
      latitude: 25, // degrees N
      temperature: 19, // Celsius
      solarRadiation: 4.5 // kWh/m²/day
    },
    tcmElements: {
      dominant: { element: "fire", percent: 50 }, // Oxidation → warmth
      supportive: { element: "earth", percent: 40 } // Roasting aids digestion
    }
  },
  {
    id: "dragonwell",
    name: "Dragonwell (Longjing)",
    type: "green",
    origin: "Zhejiang, China",
    caffeineLevel: 4, // Moderate (25–30 mg)
    lTheanineLevel: 5,
    flavorProfile: ["chestnut", "vegetal", "buttery"],
    processingMethods: ["pan-fired", "flat-pressed", "non-oxidized"],
    geography: {
      altitude: 300, // meters
      humidity: 68, // percent
      latitude: 30.2, // degrees N
      temperature: 18, // Celsius
      solarRadiation: 4.2 // kWh/m²/day
    },
    tcmElements: {
      dominant: { element: "wood", percent: 55 }, // Liver/gallbladder support
      supportive: { element: "metal", percent: 35 } // Mild cooling
    }
  },
  {
    id: "white-peony",
    name: "White Peony (Bai Mu Dan)",
    type: "white",
    origin: "Fujian, China",
    caffeineLevel: 3, // Low-moderate (15–20 mg per cup)
    lTheanineLevel: 6, // High due to slow withering
    flavorProfile: ["fruity", "floral", "honey"],
    processingMethods: ["withered", "sun-dried", "minimal-processing"],
    geography: {
      altitude: 900, // meters
      humidity: 72, // percent
      latitude: 27.4, // degrees N
      temperature: 18, // Celsius
      solarRadiation: 4.4 // kWh/m²/day
    },
    tcmElements: {
      dominant: { element: "metal", percent: 60 }, // Cooling, lung/large intestine affinity
      supportive: { element: "wood", percent: 30 } // Gentle detoxification
    }
  },
  {
    id: "mi-lan-xiang",
    name: "Mi Lan Xiang (Honey Orchid Phoenix Oolong)",
    type: "oolong",
    origin: "Fenghuang Mountain, Guangdong, China",
    caffeineLevel: 5, // Moderate-high (35–50 mg)
    lTheanineLevel: 4,
    flavorProfile: ["honey", "orchid", "stone fruit", "roasted nut"],
    processingMethods: ["partial-oxidation", "high-fire", "rolling"],
    geography: {
      altitude: 1000, // meters
      humidity: 78, // percent
      latitude: 23.9, // degrees N
      temperature: 20, // Celsius
      solarRadiation: 4.7 // kWh/m²/day
    },
    tcmElements: {
      dominant: { element: "fire", percent: 55 }, // Roasting + oxidation → yang energy
      supportive: { element: "earth", percent: 35 } // Digestive warmth
    }
  },
  {
    id: "ya-shi-xiang",
    name: "Ya Shi Xiang (Duck Shit Dancong)",
    type: "oolong",
    origin: "Fenghuang Mountain, Guangdong, China",
    caffeineLevel: 6, // High (45–60 mg)
    lTheanineLevel: 3,
    flavorProfile: ["almond", "mineral", "orchid", "charcoal", "spice"],
    processingMethods: ["partial-oxidation", "heavy-roasting", "twisting"],
    geography: {
      altitude: 950, // meters
      humidity: 75, // percent
      latitude: 23.9, // degrees N
      temperature: 21, // Celsius
      solarRadiation: 4.6 // kWh/m²/day
    },
    tcmElements: {
      dominant: { element: "fire", percent: 65 }, // Intense roasting amplifies yang
      supportive: { element: "metal", percent: 25 } // Cooling aftertaste balances heat
    }
  },
  {
    id: "junshan-yinzhen",
    name: "Junshan Yinzhen",
    type: "yellow",
    origin: "Junshan Island, Hunan, China",
    caffeineLevel: 3, // Low (15–20 mg)
    lTheanineLevel: 5,
    flavorProfile: ["mellow", "sweet", "pine", "hay"],
    processingMethods: ["kill-green", "smothered", "slow-dried"],
    geography: {
      altitude: 200, // meters
      humidity: 70, // percent
      latitude: 29.3, // degrees N
      temperature: 19, // Celsius
      solarRadiation: 4.3 // kWh/m²/day
    },
    tcmElements: {
      dominant: { element: "earth", percent: 70 }, // Smothering → spleen/stomach affinity
      supportive: { element: "metal", percent: 25 } // Gentle detoxification
    }
  },
  {
    id: "shou-mei",
    name: "Shou Mei",
    type: "white",
    origin: "Fujian, China",
    caffeineLevel: 4, // Moderate (20–25 mg)
    lTheanineLevel: 5,
    flavorProfile: ["dried fruit", "herbal", "honey", "oak"],
    processingMethods: ["withered", "air-dried", "light-oxidation"],
    geography: {
      altitude: 600, // meters
      humidity: 70, // percent
      latitude: 27.4, // degrees N
      temperature: 18, // Celsius
      solarRadiation: 4.4 // kWh/m²/day
    },
    tcmElements: {
      dominant: { element: "metal", percent: 50 }, // Cooling, lung support
      supportive: { element: "earth", percent: 40 } // Mild aging → grounding
    }
  },
  {
    id: "moonlight-white",
    name: "Moonlight White",
    type: "white",
    origin: "Yunnan, China",
    caffeineLevel: 5, // Moderate (25–35 mg)
    lTheanineLevel: 4,
    flavorProfile: ["apricot", "malt", "spice", "moonflower"],
    processingMethods: ["moonlight-withering", "sun-dried", "slight-oxidation"],
    geography: {
      altitude: 1600, // meters
      humidity: 65, // percent
      latitude: 22.5, // degrees N
      temperature: 17, // Celsius
      solarRadiation: 4.8 // kWh/m²/day
    },
    tcmElements: {
      dominant: { element: "metal", percent: 55 }, // Night withering preserves yin
      supportive: { element: "fire", percent: 30 } // Solar drying adds subtle warmth
    }
  }
];

// Export for use in other modules
export default teaDatabase; 