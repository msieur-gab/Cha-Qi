// Test script for the updated FlavorProfileMapper
// To run: node validation/unit-tests/test-flavor-mapper.js

import { FlavorProfileMapper } from '../../js/data/FlavorProfileMapper.js';

// Create instance of the mapper
const mapper = new FlavorProfileMapper();

// Test cases for various tea flavor profiles
const testCases = [
  {
    name: "Gyokuro",
    flavors: ["umami", "vegetal", "marine", "sweet", "green", "fresh"]
  },
  {
    name: "Sencha",
    flavors: ["grassy", "vegetal", "fresh", "green bean", "slightly astringent"]
  },
  {
    name: "Matcha",
    flavors: ["umami", "vegetal", "sweet", "marine", "bamboo", "rich"]
  },
  {
    name: "Assam Black Tea",
    flavors: ["malty", "robust", "brisk", "caramel", "honey"]
  },
  {
    name: "Roasted Oolong",
    flavors: ["roasted", "toasted", "woody", "sweet", "caramel", "mineral"]
  },
  {
    name: "Silver Needle White",
    flavors: ["honey", "melon", "cucumber", "fresh", "delicate", "hay"]
  }
];

console.log("===== FLAVOR MAPPER TEST WITH TCM FLAVOR WHEEL IMPROVEMENTS =====\n");

// Helper function to format percentages
const formatPercent = (value) => (value * 100).toFixed(1) + "%";

// Test individual special flavor combinations
console.log("TESTING SPECIAL FLAVOR COMBINATIONS:\n");

// Test umami+vegetal combination
const umamiVegetalCombo = mapper.getElementAffinityForCombination(["umami", "vegetal", "green"]);
console.log("Umami + Vegetal Combination:");
if (umamiVegetalCombo) {
  Object.entries(umamiVegetalCombo)
    .sort(([, a], [, b]) => b - a)
    .forEach(([element, value]) => {
      console.log(`  ${element.charAt(0).toUpperCase() + element.slice(1)}: ${formatPercent(value)}`);
    });
} else {
  console.log("  No special combination detected");
}
console.log();

// Test marine+vegetal combination
const marineVegetalCombo = mapper.getElementAffinityForCombination(["marine", "seaweed", "vegetal", "green"]);
console.log("Marine + Vegetal Combination:");
if (marineVegetalCombo) {
  Object.entries(marineVegetalCombo)
    .sort(([, a], [, b]) => b - a)
    .forEach(([element, value]) => {
      console.log(`  ${element.charAt(0).toUpperCase() + element.slice(1)}: ${formatPercent(value)}`);
    });
} else {
  console.log("  No special combination detected");
}
console.log();

// Test each tea profile
console.log("TESTING COMPLETE TEA PROFILES:\n");

testCases.forEach(tea => {
  console.log(`${tea.name} (${tea.flavors.join(', ')})`);
  
  // Map flavor profile to elements
  const elements = mapper.mapFlavorProfileToElements(tea.flavors);
  
  // Get detailed analysis
  const analysis = mapper.analyzeFlavorProfile(tea.flavors);
  
  // Display element distribution
  console.log("Element Distribution:");
  Object.entries(elements)
    .sort(([, a], [, b]) => b - a)
    .forEach(([element, value]) => {
      console.log(`  ${element.charAt(0).toUpperCase() + element.slice(1)}: ${formatPercent(value)}`);
    });
  
  // Display TCM flavor counts
  console.log("TCM Flavors:");
  Object.entries(analysis.tcmFlavors)
    .sort(([, a], [, b]) => b - a)
    .filter(([, value]) => value > 0)
    .forEach(([flavor, count]) => {
      console.log(`  ${flavor.charAt(0).toUpperCase() + flavor.slice(1)}: ${count.toFixed(1)}`);
    });
  
  console.log(`Dominant Element: ${analysis.dominantElement}`);
  console.log(`Dominant TCM Flavor: ${analysis.dominantTcmFlavor}`);
  console.log("\n");
});

// Test individual umami mapping
console.log("TESTING INDIVIDUAL FLAVOR MAPPINGS:\n");

console.log("Umami (without context):");
const umamiNoContext = mapper.mapFlavorToElements("umami");
if (umamiNoContext) {
  Object.entries(umamiNoContext)
    .sort(([, a], [, b]) => b - a)
    .forEach(([element, value]) => {
      console.log(`  ${element.charAt(0).toUpperCase() + element.slice(1)}: ${formatPercent(value)}`);
    });
}
console.log();

console.log("Umami (with Japanese green tea context):");
const umamiWithContext = mapper.mapFlavorToElements("umami", ["green", "japanese", "fresh", "vegetal"]);
if (umamiWithContext) {
  Object.entries(umamiWithContext)
    .sort(([, a], [, b]) => b - a)
    .forEach(([element, value]) => {
      console.log(`  ${element.charAt(0).toUpperCase() + element.slice(1)}: ${formatPercent(value)}`);
    });
}
console.log();

console.log("Vegetal (fresh green tea note):");
const vegetal = mapper.mapFlavorToElements("vegetal");
if (vegetal) {
  Object.entries(vegetal)
    .sort(([, a], [, b]) => b - a)
    .forEach(([element, value]) => {
      console.log(`  ${element.charAt(0).toUpperCase() + element.slice(1)}: ${formatPercent(value)}`);
    });
}
console.log();

console.log("===== TEST COMPLETE ====="); 