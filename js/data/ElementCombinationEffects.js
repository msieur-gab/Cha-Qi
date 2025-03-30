// ElementCombinationEffects.js
// Defines the effects of various combinations of Five Elements

export const elementCombinationEffects = {
  // Wood + Other Elements
  "wood+fire": {
    name: "Dynamic Vitality",
    chineseName: "动态活力 (Dòngtài Huólì)",
    description: "A powerful combination that promotes active transformation. This tea provides uplifting energy with clear direction, supporting both physical vitality and mental activation. Excellent for morning use or when creative inspiration is needed.",
    benefits: [
      "Stimulates metabolic functions",
      "Supports healthy circulation",
      "Enhances creative thinking",
      "Promotes decisive action"
    ],
    tcmActions: [
      "Spreads Liver Qi",
      "Warms Yang",
      "Invigorates Blood circulation",
      "Supports upward and outward movement"
    ],
    bodySystemsAffected: ["Liver", "Heart", "Gallbladder", "Small Intestine"],
    contraindications: "May be overstimulating for those with excess Heat conditions or agitation."
  },
  
  "wood+earth": {
    name: "Grounded Growth",
    chineseName: "稳健生长 (Wěnjiàn Shēngzhǎng)",
    description: "A harmonious blend that balances expansive energy with nourishing stability. This tea provides sustained vitality while keeping you centered. Ideal for productive focused work that requires both creativity and endurance.",
    benefits: [
      "Balances upward energy with centering stability",
      "Supports steady, sustainable activity",
      "Promotes measured growth in endeavors",
      "Aids digestion while providing energy"
    ],
    tcmActions: [
      "Harmonizes Liver and Spleen",
      "Regulates Qi to prevent stagnation",
      "Nourishes while promoting movement",
      "Balances ascending and centering functions"
    ],
    bodySystemsAffected: ["Liver", "Spleen", "Gallbladder", "Stomach"],
    contraindications: "Generally balanced and widely suitable."
  },
  
  "wood+metal": {
    name: "Precise Vitality",
    chineseName: "精准活力 (Jīngzhǔn Huólì)",
    description: "A focused combination that brings clarity to active energy. This tea provides stimulation with precision, helping to direct energy effectively without scatter. Perfect for tasks requiring both creativity and analytical thinking.",
    benefits: [
      "Enhances clear thinking while energizing",
      "Supports liver and lung function",
      "Promotes clear communication",
      "Helps define boundaries while staying flexible"
    ],
    tcmActions: [
      "Smooths Liver Qi while clearing Lung",
      "Balances expansion with structure",
      "Promotes clear Qi circulation",
      "Harmonizes Wood's ascent with Metal's descent"
    ],
    bodySystemsAffected: ["Liver", "Lungs", "Gallbladder", "Large Intestine"],
    contraindications: "May create some tension if Liver is already stagnant or Lungs weak."
  },
  
  "wood+water": {
    name: "Deep Vitality",
    chineseName: "深层活力 (Shēncéng Huólì)",
    description: "A profound combination that connects surface activity with inner depth. This tea activates while maintaining reserves, providing sustainable energy that doesn't deplete. Excellent for creative projects requiring both innovation and reflection.",
    benefits: [
      "Balances activity with restoration",
      "Supports both growth and renewal",
      "Connects vision with intuition",
      "Promotes flexibility with deep strength"
    ],
    tcmActions: [
      "Nourishes Liver Blood from Kidney essence",
      "Harmonizes upward movement with downward storage",
      "Supports the Wood-Water generating cycle",
      "Balances action with wisdom"
    ],
    bodySystemsAffected: ["Liver", "Kidney", "Gallbladder", "Bladder"],
    contraindications: "May intensify emotional processing."
  },
  
  // Fire + Other Elements
  "fire+earth": {
    name: "Nourishing Warmth",
    chineseName: "滋养温暖 (Zīyǎng Wēnnuǎn)",
    description: "A supportive combination that brings warming transformation to the center. This tea stimulates while providing substance, creating sustained energy with a sense of contentment. Ideal for social gatherings or heart-opening practices.",
    benefits: [
      "Supports digestion with gentle warmth",
      "Promotes heart-centered connection",
      "Balances joy with stability",
      "Provides nourishing energy"
    ],
    tcmActions: [
      "Warms Middle Jiao",
      "Harmonizes Heart and Spleen",
      "Tonifies Spleen while supporting Heart fire",
      "Promotes transformation of nutrients into Qi"
    ],
    bodySystemsAffected: ["Heart", "Spleen", "Small Intestine", "Stomach"],
    contraindications: "May be too warming for those with excess Heat conditions."
  },
  
  "fire+metal": {
    name: "Bright Clarity",
    chineseName: "明亮清晰 (Míngliàng Qīngxī)",
    description: "A stimulating combination that balances warming energy with cool precision. This tea energizes while maintaining mental clarity, avoiding the scattered feeling that can come with stimulation. Perfect for focused work requiring enthusiasm and clear thinking.",
    benefits: [
      "Promotes mental alertness with focus",
      "Supports both heart and respiratory function",
      "Balances enthusiasm with discernment",
      "Enhances communication with clarity"
    ],
    tcmActions: [
      "Harmonizes Heart and Lung",
      "Clears Heat while maintaining Yang",
      "Opens channels of communication",
      "Balances expansion with refinement"
    ],
    bodySystemsAffected: ["Heart", "Lungs", "Small Intestine", "Large Intestine"],
    contraindications: "May create some internal tension if either element is already excessive."
  },
  
  "fire+water": {
    name: "Balanced Activation",
    chineseName: "平衡激活 (Pínghéng Jīhuó)",
    description: "A harmonizing combination that balances seemingly opposite qualities. This tea provides stimulation with underlying calm, creating an experience of energized tranquility. Excellent for creative flow states and heart-opening meditation.",
    benefits: [
      "Balances stimulation with depth",
      "Supports Heart-Kidney axis harmony",
      "Promotes awareness with calm",
      "Reconciles passion with wisdom"
    ],
    tcmActions: [
      "Harmonizes Heart and Kidney",
      "Balances Fire and Water",
      "Supports communication between upper and lower Jiao",
      "Prevents Heat from consuming Yin"
    ],
    bodySystemsAffected: ["Heart", "Kidney", "Small Intestine", "Bladder"],
    contraindications: "Requires careful balance; may highlight tension between these elements if either is excessive."
  },
  
  // Earth + Other Elements
  "earth+metal": {
    name: "Structured Nourishment",
    chineseName: "结构滋养 (Jiégòu Zīyǎng)",
    description: "A grounding combination that brings clarity to nourishing energy. This tea provides centered stability with defined boundaries, helping to organize thoughts while maintaining substance. Ideal for study, planning, or organized creative work.",
    benefits: [
      "Promotes digestive clarity",
      "Supports structured thinking",
      "Balances nourishment with discernment",
      "Helps establish healthy routines"
    ],
    tcmActions: [
      "Strengthens Spleen-Lung network",
      "Clears Dampness through Metal's drying quality",
      "Supports Middle Jiao's central role",
      "Enhances transformation and transportation"
    ],
    bodySystemsAffected: ["Spleen", "Lungs", "Stomach", "Large Intestine"],
    contraindications: "May be too dry if there's already Dryness or Fluid deficiency."
  },
  
  "earth+water": {
    name: "Deep Nourishment",
    chineseName: "深层滋养 (Shēncéng Zīyǎng)",
    description: "A profoundly supportive combination that connects nourishing energy with regenerative depth. This tea provides both immediate sustenance and long-term support, creating a deeply nurturing experience. Perfect for recovery, deep relaxation, or rebuilding energy reserves.",
    benefits: [
      "Supports deep nourishment and restoration",
      "Balances immediate and long-term needs",
      "Connects digestive function with fundamental energy reserves",
      "Promotes stability with adaptability"
    ],
    tcmActions: [
      "Reinforces Earth-Water relationship",
      "Nourishes Yin while supporting Spleen",
      "Harmonizes Middle and Lower Jiao",
      "Supports transformation and storage"
    ],
    bodySystemsAffected: ["Spleen", "Kidney", "Stomach", "Bladder"],
    contraindications: "May promote too much downward movement in cases of prolapse or weakness."
  },
  
  // Metal + Water
  "metal+water": {
    name: "Profound Clarity",
    chineseName: "深邃清晰 (Shēnsuì Qīngxī)",
    description: "A deeply clarifying combination that brings precision to introspective depth. This tea promotes sharp awareness with profound calm, creating exceptional mental clarity without tension. Excellent for meditation, focused study, or deep contemplation.",
    benefits: [
      "Enhances mental clarity with depth",
      "Supports respiratory and kidney function",
      "Promotes introspection with precision",
      "Balances containment with flow"
    ],
    tcmActions: [
      "Harmonizes Lung and Kidney",
      "Supports Metal-Water generating cycle",
      "Promotes clear downward movement",
      "Balances purification and storage"
    ],
    bodySystemsAffected: ["Lungs", "Kidney", "Large Intestine", "Bladder"],
    contraindications: "May be too cooling for those with Cold patterns."
  },
  
  // Special Triple Element Combinations
  "wood+fire+earth": {
    name: "Vibrant Harmony",
    chineseName: "活力和谐 (Huólì Héxié)",
    description: "A dynamic yet balanced combination that promotes active growth with centering stability. This tea provides energetic momentum with enough substance to sustain it. Ideal for productive creativity and balanced action.",
    benefits: [
      "Balances stimulation with nourishment",
      "Supports decisive action with staying power",
      "Promotes enthusiasm with practicality",
      "Enhances sustainable productivity"
    ],
    tcmActions: [
      "Harmonizes three Jiao",
      "Balances ascent, transformation, and containment",
      "Supports smooth Qi and Blood circulation",
      "Promotes Yang transformation with substance"
    ]
  },
  
  "metal+water+wood": {
    name: "Renewing Clarity",
    chineseName: "更新清晰 (Gēngxīn Qīngxī)",
    description: "A refreshing combination that promotes clear growth from deep resources. This tea creates a sense of fresh clarity with underlying vitality. Perfect for new beginnings, fresh perspectives, or cleansing practices.",
    benefits: [
      "Supports clear new growth",
      "Balances precision with flexibility",
      "Promotes purification with renewal",
      "Enhances mental clarity with regenerative energy"
    ],
    tcmActions: [
      "Supports full generating cycle from Water to Wood through Metal",
      "Balances descending and ascending Qi",
      "Promotes clear boundaries with flexible expansion",
      "Harmonizes purification, storage, and growth"
    ]
  },
  
  "earth+metal+water": {
    name: "Centered Depth",
    chineseName: "中心深度 (Zhōngxīn Shēndù)",
    description: "A profoundly stabilizing combination that anchors clarity in nourishing depth. This tea creates a sense of secure presence with both substance and space. Excellent for grounding practices that also require mental clarity.",
    benefits: [
      "Promotes centered awareness",
      "Supports digestive, respiratory, and kidney function",
      "Balances nourishment with space",
      "Enhances stable, clear perception"
    ],
    tcmActions: [
      "Strengthens central axis",
      "Harmonizes Middle and Lower Jiao",
      "Supports transformation, descent, and storage",
      "Promotes clear boundaries with deep reserves"
    ]
  },
  
  "fire+earth+metal": {
    name: "Bright Structure",
    chineseName: "明亮结构 (Míngliàng Jiégòu)",
    description: "A clarifying yet substantive combination that brings warmth and definition to centered stability. This tea creates energized focus with strong boundaries. Ideal for structured creative work or organized social activities.",
    benefits: [
      "Balances enthusiasm with organization",
      "Supports heart-centered clarity",
      "Promotes warm, clear communication",
      "Enhances joyful discipline"
    ],
    tcmActions: [
      "Harmonizes Upper and Middle Jiao",
      "Balances ascending fire with descending metal",
      "Supports transformation of emotions into clear expression",
      "Promotes warm containment"
    ]
  },
  
  "water+wood+fire": {
    name: "Deep Transformation",
    chineseName: "深层转化 (Shēncéng Zhuǎnhuà)",
    description: "A profoundly generative combination that moves from depth through growth to transformation. This tea creates a full cycle of energy from stillness to vibrant expression. Perfect for creative processes requiring both intuition and expressive power.",
    benefits: [
      "Supports complete energy cycle",
      "Balances intuition with expression",
      "Promotes sustainable vitality",
      "Enhances transformation from potential to manifestation"
    ],
    tcmActions: [
      "Strengthens generating cycle from Water to Fire through Wood",
      "Harmonizes Lower, Middle, and Upper Jiao",
      "Supports Kidney-Liver-Heart axis",
      "Promotes movement of essence to Qi to Spirit"
    ]
  }
};

export default elementCombinationEffects;