// test-tcm-edge-cases.js
// Tests for edge cases in the improved FlavorProfileMapper

// Browser compatibility check
if (typeof window === 'undefined') {
  console.log("NOTE: This test is designed for Node.js with ES modules.");
  console.log("For browser testing, please use tcm-edge-case-tests.html instead.");
  console.log("If you're seeing this in a browser, something went wrong with the import.");
}

import FlavorProfileMapper from '../../../js/data/FlavorProfileMapper.js';

// Initialize mapper
const mapper = new FlavorProfileMapper();

console.log("===== TCM FLAVOR MAPPING EDGE CASES =====");

// CASE 1: Test direct flavor-to-element mappings
console.log("\n1. Direct TCM Flavor-to-Element Mappings:");
const tcmFlavors = ["sour", "bitter", "sweet", "pungent", "salty"];
tcmFlavors.forEach(flavor => {
  const elements = mapper.mapFlavorToElements(flavor);
  console.log(`${flavor}:`, elements);
});

// CASE 2: Test purely salty profile
console.log("\n2. Purely Salty Profile (should be >95% Water):");
const saltyProfile = ["salty", "briny", "seaweed"];
const saltyResults = mapper.mapFlavorProfileToElements(saltyProfile);
console.log(`Profile: ${saltyProfile.join(", ")}`);
console.log("Element Distribution:", saltyResults);
console.log(`Water percentage: ${(saltyResults.water * 100).toFixed(2)}%`);

// CASE 3: Citrus + Grassy should emphasize Wood (sour) and Fire (bitter)
console.log("\n3. Citrus + Grassy Profile (should emphasize Wood and Fire):");
const citrusGrassyProfile = ["citrus", "grassy", "lemon", "fresh"];
const citrusGrassyResults = mapper.mapFlavorProfileToElements(citrusGrassyProfile);
console.log(`Profile: ${citrusGrassyProfile.join(", ")}`);
console.log("Element Distribution:", citrusGrassyResults);
console.log(`Wood percentage: ${(citrusGrassyResults.wood * 100).toFixed(2)}%`);
console.log(`Fire percentage: ${(citrusGrassyResults.fire * 100).toFixed(2)}%`);

// CASE 4: Test the malty context-dependent mapping
console.log("\n4. Malty in different contexts:");
const maltyAlone = mapper.mapFlavorToElements("malty");
const maltyWithRoasted = mapper.mapFlavorToElements("malty", ["roasted", "toast"]);
console.log("Malty alone:", maltyAlone);
console.log("Malty with roasted notes:", maltyWithRoasted);

// CASE 5: Test the aged category revision (now Earth/sweet dominant)
console.log("\n5. Aged Tea Profile (revised to Earth/sweet dominant):");
const agedProfile = ["aged", "vintage", "fermented", "complex"];
const agedResults = mapper.mapFlavorProfileToElements(agedProfile);
console.log(`Profile: ${agedProfile.join(", ")}`);
console.log("Element Distribution:", agedResults);
console.log(`Earth percentage: ${(agedResults.earth * 100).toFixed(2)}%`);

// CASE 6: Test green_vegetal vs vegetal category distinction
console.log("\n6. Green Vegetal vs Vegetal Distinction:");
const greenVegetalProfile = ["fresh", "grassy", "green", "herbaceous"];
const matureVegetalProfile = ["vegetal", "spinach", "cooked greens", "artichoke"];

const greenResults = mapper.mapFlavorProfileToElements(greenVegetalProfile);
const matureResults = mapper.mapFlavorProfileToElements(matureVegetalProfile);

console.log(`Green Profile: ${greenVegetalProfile.join(", ")}`);
console.log("Element Distribution:", greenResults);
console.log(`Wood percentage: ${(greenResults.wood * 100).toFixed(2)}%`);

console.log(`\nMature Profile: ${matureVegetalProfile.join(", ")}`);
console.log("Element Distribution:", matureResults);
console.log(`Fire percentage: ${(matureResults.fire * 100).toFixed(2)}%`);

// CASE 7: Test normalization change - dominant flavor profiles
console.log("\n7. Dominant Flavor Profile (should preserve strong associations):");
const dominantProfile = ["salty", "salty", "salty", "briny", "oceanic"];
const dominantResults = mapper.mapFlavorProfileToElements(dominantProfile);
console.log(`Profile: ${dominantProfile.join(", ")}`);
console.log("Element Distribution:", dominantResults);
console.log(`Water percentage: ${(dominantResults.water * 100).toFixed(2)}%`);

console.log("\nTCM Edge Case Tests Completed!"); 