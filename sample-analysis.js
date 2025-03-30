// sample-analysis.js
// Example script to demonstrate tea analysis export functionality

import { createAnalyzer } from './tea-tcm-system/TeaTcmAnalyzer.js';

// Create the analyzer
const analyzer = createAnalyzer();

// Example tea definitions
const sampleTeas = [
    {
        "name": "Dragon Well (Longjing)",
        "type": "green",
        "origin": "Hangzhou, China",
        "caffeineLevel": 4,
        "lTheanineLevel": 7,
        "flavorProfile": ["grassy", "nutty", "vegetal", "chestnut"],
        "processingMethods": ["pan-fired", "flattened", "non-oxidized"],
        "geography": {
          "altitude": 650,
          "humidity": 72,
          "latitude": 30.2,
          "temperature": 18,
          "solarRadiation": 4.2
        }
      },
      {
        "name": "White Peony (Bai Mu Dan)",
        "type": "white",
        "origin": "Fujian, China",
        "caffeineLevel": 3,
        "lTheanineLevel": 8,
        "flavorProfile": ["floral", "fruity", "honey", "subtle"],
        "processingMethods": ["withered", "minimally oxidized"],
        "geography": {
          "altitude": 800,
          "humidity": 75,
          "latitude": 27.3,
          "temperature": 17,
          "solarRadiation": 4.5
        }
      },
      {
        "name": "Oolong Da Hong Pao (Big Red Robe)",
        "type": "oolong",
        "origin": "Wuyi Mountains, China",
        "caffeineLevel": 5,
        "lTheanineLevel": 6,
        "flavorProfile": ["roasted", "mineral", "caramel", "woody"],
        "processingMethods": ["withered", "partially oxidized", "charcoal roasted"],
        "geography": {
          "altitude": 700,
          "humidity": 80,
          "latitude": 27.7,
          "temperature": 16,
          "solarRadiation": 3.9
        }
      },
      {
        "name": "Yunnan Gold",
        "type": "black",
        "origin": "Yunnan, China",
        "caffeineLevel": 6,
        "lTheanineLevel": 5,
        "flavorProfile": ["malty", "honey", "peppery", "cocoa"],
        "processingMethods": ["withered", "fully oxidized", "rolled"],
        "geography": {
          "altitude": 1200,
          "humidity": 65,
          "latitude": 23.4,
          "temperature": 20,
          "solarRadiation": 5.0
        }
    },
      {
        "name": "Gyokuro",
        "type": "green",
        "origin": "Japan",
        "caffeineLevel": 5,
        "lTheanineLevel": 9,
        "flavorProfile": ["umami", "marine", "sweet", "grassy"],
        "processingMethods": ["shade-grown", "steamed", "non-oxidized"],
        "geography": {
          "altitude": 400,
          "humidity": 70,
          "latitude": 35.0,
          "temperature": 16,
          "solarRadiation": 3.8
        }
    },
        
    {
        "name": "Silver Needle (Bai Hao Yinzhen)",
        "type": "white",
        "origin": "Fujian, China",
        "caffeineLevel": 2,
        "lTheanineLevel": 8,
        "flavorProfile": ["honey", "melon", "delicate", "hay"],
        "processingMethods": ["withered", "sun-dried", "minimal processing"],
        "geography": {
          "altitude": 900,
          "humidity": 75,
          "latitude": 27.3,
          "temperature": 17,
          "solarRadiation": 4.6
        
        }
      },
      {
        "name": "Buddhist Tea (Fo Cha)",
        "type": "herbal",
        "origin": "Mount Emei, China",
        "caffeineLevel": 0,
        "lTheanineLevel": 0,
        "flavorProfile": ["floral", "woody", "sweet", "earthy"],
        "processingMethods": ["dried", "mixed"],
        "geography": {
          "altitude": 1500,
          "humidity": 80,
          "latitude": 29.5,
          "temperature": 15,
          "solarRadiation": 4.0
        
        }
      },
      {
        "name": "Phoenix Mountain Dancong",
        "type": "oolong",
        "origin": "Guangdong, China",
        "caffeineLevel": 4,
        "lTheanineLevel": 7,
        "flavorProfile": ["orchid", "honey", "tropical fruit", "woodsy"],
        "processingMethods": ["withered", "medium oxidation", "twisted"],
        "geography": {
          "altitude": 1000,
          "humidity": 75,
          "latitude": 23.7,
          "temperature": 21,
          "solarRadiation": 4.7
       
        }
      },
      {
        "name": "Gaba Oolong",
        "type": "oolong",
        "origin": "Taiwan",
        "caffeineLevel": 3,
        "lTheanineLevel": 8,
        "flavorProfile": ["fruity", "nutty", "smooth", "sweet"],
        "processingMethods": ["oxygen-free fermentation", "medium oxidation"],
        "geography": {
          "altitude": 800,
          "humidity": 78,
          "latitude": 23.5,
          "temperature": 19,
          "solarRadiation": 4.3
        
        }
      },
      {
        "name": "Shou Pu-erh",
        "type": "fermented",
        "origin": "Yunnan, China",
        "caffeineLevel": 4,
        "lTheanineLevel": 5,
        "flavorProfile": ["earthy", "woody", "mushroom", "mellow"],
        "processingMethods": ["withered", "oxidized", "pile fermented", "aged"],
        "geography": {
          "altitude": 1100,
          "humidity": 70,
          "latitude": 22.0,
          "temperature": 21,
          "solarRadiation": 4.8
        
        }
      },
    {
        name: "Aged Pu-erh",
        type: "puerh",
        origin: "Yunnan, China",
        caffeineLevel: 4.5,
        lTheanineLevel: 4.5,
        flavorProfile: ["earthy", "woody", "leather", "mineral", "sweet"],
        processingMethods: ["withered", "fermented", "aged", "compressed"],
        geography: {
            altitude: 1200,
            humidity: 78,
            latitude: 22.8,
            temperature: 20,
            solarRadiation: 4.8
        }
    }
];

// Function to analyze and export a tea
function analyzeAndExportTea(tea) {
    console.log(`Analyzing ${tea.name}...`);
    
    // Perform analysis
    const analysis = analyzer.analyzeTea(tea);
    
    // Export as text report
    const textReport = analyzer.exportAnalysisReport(analysis, 'text');
    console.log("\nTEXT REPORT:");
    console.log(textReport);
    
    // Export as JSON
    const jsonReport = analyzer.exportAnalysisReport(analysis, 'json');
    console.log("\nJSON REPORT (snippet):");
    console.log(jsonReport.substring(0, 200) + "...");
    
    return analysis;
}

// Analyze all sample teas
function analyzeAllTeas() {
    const analyses = [];
    
    sampleTeas.forEach(tea => {
        const analysis = analyzeAndExportTea(tea);
        analyses.push(analysis);
    });
    
    // Compare teas
    if (analyses.length > 1) {
        console.log("\nCOMPARING TEAS:");
        
        for (let i = 0; i < analyses.length - 1; i++) {
            for (let j = i + 1; j < analyses.length; j++) {
                const tea1 = sampleTeas[i];
                const tea2 = sampleTeas[j];
                
                console.log(`\nSimilarity between ${tea1.name} and ${tea2.name}:`);
                
                // Compare element distributions
                const similarity = calculateElementSimilarity(
                    analyses[i].elements,
                    analyses[j].elements
                );
                
                console.log(`Element similarity score: ${(similarity * 100).toFixed(1)}%`);
            }
        }
    }
}

// Calculate element similarity (simplified version of the function in TeaTcmAnalyzer)
function calculateElementSimilarity(elements1, elements2) {
    if (!elements1 || !elements2) return 0;
    
    // Use Euclidean distance in five-dimensional element space
    let sumSquaredDifferences = 0;
    
    Object.keys(elements1).forEach(element => {
        const diff = (elements1[element] || 0) - (elements2[element] || 0);
        sumSquaredDifferences += diff * diff;
    });
    
    // Convert distance to similarity (1.0 = identical, 0.0 = completely different)
    // Maximum possible distance in 5D space where each dimension is 0-1 is sqrt(5)
    const distance = Math.sqrt(sumSquaredDifferences);
    const similarity = 1 - (distance / Math.sqrt(5));
    
    return similarity;
}

// Demonstrate TCM constitution recommendation
function demonstrateConstitutionRecommendation() {
    console.log("\nPERSONALIZED RECOMMENDATIONS EXAMPLE:");
    
    // Example constitution profile
    const constitution = {
        primaryType: "fire",
        excess: null,
        deficiency: "water",
        temperature: "hot",
        focusAreas: ["Heart", "Kidney", "Blood"]
    };
    
    console.log(`Constitution: ${constitution.primaryType} type with ${constitution.deficiency} deficiency`);
    
    // Get personalized recommendations
    const recommendations = analyzer.getPersonalizedRecommendations(
        constitution, 
        sampleTeas,
        3
    );
    
    // Display recommendations
    recommendations.forEach((rec, index) => {
        console.log(`\nRecommendation #${index + 1}: ${rec.tea.name}`);
        console.log(`Match score: ${(rec.matchScore * 100).toFixed(1)}%`);
        console.log(`Rationale: ${rec.rationale}`);
    });
}

// Execute the demonstration
console.log("===== FIVE ELEMENTS TEA ANALYZER DEMONSTRATION =====\n");
analyzeAllTeas();
demonstrateConstitutionRecommendation();
console.log("\n===== END OF DEMONSTRATION =====");
