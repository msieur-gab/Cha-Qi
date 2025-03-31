// Test script for the ElementsCalculator with the updated CompoundElementMapper
// To run: node validation/unit-tests/test-elements-calculator.js

import { ElementsCalculator } from '../../js/calculators/ElementsCalculator.js';
import { CompoundElementMapper } from '../../js/calculators/CompoundElementMapper.js';

// Mock configuration and mappers
const mockConfig = {
  get: (path) => {
    if (path === 'elementWeights.compounds') return 1.0; // Use only compound scores
    if (path === 'compounds.idealLTheanineCaffeineRatio') return 2.0;
    return 0;
  }
};

// Create a minimal calculator with only compound mapper
const compoundMapper = new CompoundElementMapper(mockConfig);
const calculator = new ElementsCalculator(
  mockConfig, 
  null, // No flavor mapper
  compoundMapper, 
  null, // No processing mapper
  null  // No geography mapper
);

// Test cases
const testCases = [
  { 
    name: "Gyokuro", 
    tea: {
      name: "Gyokuro",
      caffeineLevel: 5,
      lTheanineLevel: 8
    }
  },
  { 
    name: "Black Tea", 
    tea: {
      name: "Black Tea",
      caffeineLevel: 7,
      lTheanineLevel: 3
    }
  },
  { 
    name: "White Tea", 
    tea: {
      name: "White Tea",
      caffeineLevel: 3,
      lTheanineLevel: 7
    }
  }
];

console.log("===== ELEMENTS CALCULATOR INTEGRATION TEST =====");
console.log("Testing with updated CompoundElementMapper\n");

testCases.forEach(test => {
  console.log(`Testing ${test.name} with ElementsCalculator`);
  
  const results = calculator.calculateElements(test.tea);
  
  console.log("Element Distribution:");
  Object.entries(results.elements)
    .sort(([, a], [, b]) => b - a)
    .forEach(([element, value]) => {
      console.log(`  ${element.charAt(0).toUpperCase() + element.slice(1)}: ${(value * 100).toFixed(1)}%`);
    });
  
  console.log("Dominant Elements:");
  console.log(`  Primary: ${results.dominantElement}`);
  console.log(`  Supporting: ${results.supportingElement}`);
  
  console.log("Component Contribution:");
  const compoundPercentage = results.contributions?.compounds ?
    (results.contributions.compounds * 100).toFixed(1) + "%" : "N/A";
  console.log(`  Compounds: ${compoundPercentage}`);
  
  console.log("\n");
});

console.log("===== TEST COMPLETE ====="); 