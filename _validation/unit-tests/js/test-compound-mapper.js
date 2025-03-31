// Test script for the CompoundElementMapper
// To run: node js/test-compound-mapper.js

import { CompoundElementMapper } from './calculators/CompoundElementMapper.js';

// Mock config object
const mockConfig = {
  get: (path) => {
    if (path === 'compounds.idealLTheanineCaffeineRatio') return 2.0;
    return null;
  }
};

// Create compound mapper
const compoundMapper = new CompoundElementMapper(mockConfig);

// Test cases
const testCases = [
  { name: "Gyokuro", caffeine: 5, lTheanine: 8, ratio: 1.6 },
  { name: "Black Tea", caffeine: 7, lTheanine: 3, ratio: 0.43 },
  { name: "White Tea", caffeine: 3, lTheanine: 7, ratio: 2.33 },
  { name: "Matcha", caffeine: 6, lTheanine: 9, ratio: 1.5 }
];

// Run tests
console.log("===== COMPOUND ELEMENT MAPPER TEST =====");
console.log("Testing the new implementation with different tea types\n");

testCases.forEach(test => {
  console.log(`Testing ${test.name} (Caffeine: ${test.caffeine}, L-Theanine: ${test.lTheanine}, Ratio: ${test.ratio.toFixed(2)})`);
  
  const elements = compoundMapper.mapCompoundsToElements(test.caffeine, test.lTheanine);
  const analysis = compoundMapper.analyzeCompoundBalance(test.caffeine, test.lTheanine);
  
  console.log("Element Distribution:");
  Object.entries(elements)
    .sort((a, b) => b[1] - a[1])
    .forEach(([element, value]) => {
      console.log(`  ${element.charAt(0).toUpperCase() + element.slice(1)}: ${(value * 100).toFixed(1)}%`);
    });
  
  console.log("TCM Analysis:");
  console.log(`  Primary Nature: ${analysis.primaryNature}`);
  console.log(`  Secondary Nature: ${analysis.secondaryNature}`);
  console.log(`  TCM Description: ${analysis.tcmAnalysis}`);
  console.log(`  Effect: ${analysis.effectDescription}`);
  console.log("\n");
});

console.log("===== TEST COMPLETE ====="); 