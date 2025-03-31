// Test script for the combined FlavorProfileMapper and CompoundElementMapper improvements
// To run: node validation/unit-tests/test-combined-mappers.js

import { ElementsCalculator } from '../../js/calculators/ElementsCalculator.js';
import { CompoundElementMapper } from '../../js/calculators/CompoundElementMapper.js';
import { FlavorProfileMapper } from '../../js/data/FlavorProfileMapper.js';

// Mock configuration
const mockConfig = {
  get: (path) => {
    if (path === 'compounds.idealLTheanineCaffeineRatio') return 2.0;
    if (path === 'elementWeights.flavor') return 0.4;
    if (path === 'elementWeights.compounds') return 0.3; 
    if (path === 'elementWeights.processing') return 0.2;
    if (path === 'elementWeights.geography') return 0.1;
    return null;
  }
};

// Create the mappers and calculator
const flavorMapper = new FlavorProfileMapper();
const compoundMapper = new CompoundElementMapper(mockConfig);
const calculator = new ElementsCalculator(
  mockConfig, 
  flavorMapper,
  compoundMapper, 
  null, // No processing mapper for this test
  null  // No geography mapper for this test
);

// Test cases focusing on Japanese green teas
const testCases = [
  { 
    name: "Gyokuro",
    tea: {
      name: "Gyokuro",
      flavorProfile: ["umami", "vegetal", "marine", "sweet", "green", "fresh"],
      caffeineLevel: 5,
      lTheanineLevel: 8
    }
  },
  { 
    name: "Sencha",
    tea: {
      name: "Sencha",
      flavorProfile: ["grassy", "vegetal", "fresh", "green bean", "slightly astringent"],
      caffeineLevel: 6,
      lTheanineLevel: 6
    }
  },
  { 
    name: "Matcha",
    tea: {
      name: "Matcha",
      flavorProfile: ["umami", "vegetal", "sweet", "marine", "bamboo", "rich"],
      caffeineLevel: 6,
      lTheanineLevel: 9
    }
  },
  { 
    name: "Assam Black Tea",
    tea: {
      name: "Assam Black Tea",
      flavorProfile: ["malty", "robust", "brisk", "caramel", "honey"],
      caffeineLevel: 7,
      lTheanineLevel: 3
    }
  }
];

console.log("===== COMBINED MAPPERS INTEGRATION TEST =====");
console.log("Testing with both updated FlavorProfileMapper and CompoundElementMapper\n");

// Helper function to format percentages
const formatPercent = (value) => (value * 100).toFixed(1) + "%";

testCases.forEach(test => {
  console.log(`Testing ${test.name} with ElementsCalculator`);
  
  const results = calculator.calculateElements(test.tea);
  
  console.log("Element Distribution:");
  Object.entries(results.elements)
    .sort(([, a], [, b]) => b - a)
    .forEach(([element, value]) => {
      console.log(`  ${element.charAt(0).toUpperCase() + element.slice(1)}: ${formatPercent(value)}`);
    });
  
  console.log("Dominant Elements:");
  console.log(`  Primary: ${results.dominantElement}`);
  console.log(`  Supporting: ${results.supportingElement}`);
  
  console.log("Component Contributions:");
  if (results.contributions) {
    if (results.contributions.flavor) {
      console.log(`  Flavor: ${formatPercent(results.contributions.flavor)}`);
    }
    if (results.contributions.compounds) {
      console.log(`  Compounds: ${formatPercent(results.contributions.compounds)}`);
    }
  }
  
  console.log("Component Scores:");
  console.log("Flavor Component:")
  Object.entries(results.componentScores.flavor)
    .sort(([, a], [, b]) => b - a)
    .forEach(([element, value]) => {
      console.log(`    ${element.charAt(0).toUpperCase() + element.slice(1)}: ${formatPercent(value)}`);
    });
    
  console.log("Compound Component:")
  Object.entries(results.componentScores.compounds)
    .sort(([, a], [, b]) => b - a)
    .forEach(([element, value]) => {
      console.log(`    ${element.charAt(0).toUpperCase() + element.slice(1)}: ${formatPercent(value)}`);
    });
  
  console.log("\n");
});

console.log("===== TEST COMPLETE ====="); 