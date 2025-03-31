// app.js
// Main application for the Five Elements Tea Analyzer

import { createAnalyzer } from './js/TeaTcmAnalyzer.js';
import teaDatabase from './js/data/TeaDatabase.js';
import { drawElementChart, drawSeasonalityChart } from './js/chartRenderer.js';
import * as ui from './js/teaAnalysisUI.js';

// Initialize the TCM tea analyzer without overriding the config
// This will use the default configuration from TcmSystemConfig.js
const analyzer = createAnalyzer();

// DOM Elements
const form = document.getElementById('tea-analysis-form');
const caffeineSlider = document.getElementById('caffeine-level');
const caffeineValue = document.getElementById('caffeine-value');
const theanineSlider = document.getElementById('theanine-level');
const theanineValue = document.getElementById('theanine-value');
const flavorInput = document.getElementById('flavor-input');
const flavorChips = document.getElementById('flavor-chips');
const processingChips = document.getElementById('processing-chips');
const analyzeButton = document.getElementById('analyze-button');
const clearButton = document.getElementById('clear-button');
const loadingIndicator = document.getElementById('analysis-loading');
const analysisResults = document.getElementById('analysis-results');
const noResultsDisplay = document.getElementById('no-results-display');
const sampleTeasToggle = document.getElementById('sample-teas-toggle');
const sampleTeasDropdown = document.getElementById('sample-teas-dropdown');
const contextSettingsToggle = document.getElementById('context-settings-toggle');
const contextSettingsPanel = document.getElementById('context-settings-panel');
const currentSeasonSelect = document.getElementById('current-season-select');
const constitutionSelect = document.getElementById('constitution-select');
const updateContextButton = document.getElementById('update-context');

// State variables
let selectedFlavors = [];
let selectedProcessingMethods = [];
let currentAnalysis = null;
let contextSettings = {
    currentSeason: ui.getCurrentSeason(),
    constitution: 'balanced'
};

// Initialize the application
function initApp() {
    // Set up event listeners
    setupEventListeners();
    
    // Set up flavor and processing chips
    setupFlavorSelection();
    setupProcessingSelection();
    
    // Initialize context settings
    initializeContextSettings();
}

// Setup all event listeners
function setupEventListeners() {
    // Form submission
    form.addEventListener('submit', handleFormSubmit);
    
    // Range sliders
    caffeineSlider.addEventListener('input', updateCaffeineValue);
    theanineSlider.addEventListener('input', updateTheanineValue);
    
    // Flavor input
    flavorInput.addEventListener('keydown', handleFlavorInputKeydown);
    
    // Clear button
    clearButton.addEventListener('click', clearForm);
    
    // Sample teas
    sampleTeasToggle.addEventListener('click', toggleSampleTeasDropdown);
    
    // Sample tea selection
    document.querySelectorAll('.sample-tea').forEach(item => {
        item.addEventListener('click', () => loadSampleTea(item.dataset.tea));
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.sample-teas-container')) {
            sampleTeasDropdown.classList.add('hidden');
        }
        if (!event.target.closest('.context-settings-container')) {
            contextSettingsPanel.classList.add('hidden');
        }
    });
    
    // Context settings
    contextSettingsToggle.addEventListener('click', toggleContextSettingsPanel);
    updateContextButton.addEventListener('click', updateContext);
    
    // Calculation breakdown toggle
    const calculationToggle = document.getElementById('calculation-toggle');
    const calculationHeader = document.querySelector('.panel-header-collapsible');
    
    if (calculationToggle && calculationHeader) {
        calculationHeader.addEventListener('click', toggleCalculationBreakdown);
    }
}

// Initialize context settings
function initializeContextSettings() {
    // Set dropdown to current season
    currentSeasonSelect.value = contextSettings.currentSeason;
    constitutionSelect.value = contextSettings.constitution;
}

// Toggle context settings panel
function toggleContextSettingsPanel() {
    contextSettingsPanel.classList.toggle('hidden');
}

// Update context settings
function updateContext() {
    contextSettings.currentSeason = currentSeasonSelect.value;
    contextSettings.constitution = constitutionSelect.value;
    
    // Update config
    analyzer.updateConfig({
        customSeason: contextSettings.currentSeason,
        customConstitution: contextSettings.constitution
    });
    
    // Re-run analysis if we have one
    if (currentAnalysis) {
        analyzeTea(currentAnalysis);
    }
    
    // Hide panel
    contextSettingsPanel.classList.add('hidden');
}

// Setup flavor selection functionality
function setupFlavorSelection() {
    // Add click event to flavor chips in categories
    document.querySelectorAll('.flavor-chips .chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const flavor = chip.dataset.flavor;
            addFlavor(flavor);
        });
    });
}

// Setup processing selection functionality
function setupProcessingSelection() {
    // Add click event to processing chips
    document.querySelectorAll('.processing-chips .chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const method = chip.dataset.processing;
            toggleProcessingMethod(method, chip);
        });
    });
}

// Update caffeine value display
function updateCaffeineValue() {
    caffeineValue.textContent = caffeineSlider.value;
}

// Update theanine value display
function updateTheanineValue() {
    theanineValue.textContent = theanineSlider.value;
}

// Handle flavor input keydown (add flavors with Enter key)
function handleFlavorInputKeydown(event) {
    if (event.key === 'Enter' && flavorInput.value.trim() !== '') {
        event.preventDefault();
        addFlavor(flavorInput.value.trim());
        flavorInput.value = '';
    }
}

// Add a flavor to the selected flavors
function addFlavor(flavor) {
    selectedFlavors = ui.addFlavor(flavor, selectedFlavors, flavorChips, removeFlavor);
}

// Remove a flavor from the selected flavors
function removeFlavor(flavor, chipElement) {
    selectedFlavors = ui.removeFlavor(flavor, chipElement, selectedFlavors);
}

// Toggle a processing method
function toggleProcessingMethod(method, chipElement) {
    selectedProcessingMethods = ui.toggleProcessingMethod(
        method, 
        chipElement, 
        selectedProcessingMethods, 
        processingChips
    );
}

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const teaData = ui.getTeaFormData(caffeineSlider, selectedFlavors, selectedProcessingMethods);
    
    // Validate form data
    if (!teaData.name || !teaData.type) {
        alert('Please provide at least the tea name and type.');
        return;
    }
    
    // Show loading indicator
    ui.showLoading(loadingIndicator, analysisResults, noResultsDisplay);
    
    // Perform analysis (with a small delay to show loading animation)
    setTimeout(() => {
        analyzeTea(teaData);
    }, 500);
}

// Analyze tea and display results
function analyzeTea(teaData) {
    // Show loading indicator
    loadingIndicator.classList.remove('hidden');
    analysisResults.classList.add('hidden');
    noResultsDisplay.classList.add('hidden');
    
    console.log('Analyzing tea data:', teaData);
    
    // Check if we have enough data
    if (!teaData.name || !teaData.type) {
        loadingIndicator.classList.add('hidden');
        noResultsDisplay.classList.remove('hidden');
        return;
    }
    
    try {
        // Store tea data
        currentAnalysis = teaData;
        
        // Perform analysis
        const analysis = analyzer.analyzeTea(teaData);
        
        console.log('Analysis completed successfully. Analysis data:', analysis);
        
        // Debug the component scores
        const componentScores = analysis.rawElementAnalysis?.componentScores || {};
        console.log('Component Scores for Element Distributions:');
        console.log('- Flavor:', componentScores.flavor);
        console.log('- Compounds:', componentScores.compounds);
        console.log('- Processing:', componentScores.processing);
        console.log('- Geography:', componentScores.geography);
        
        // Check if all component scores are empty or missing
        const hasAnyComponentData = Object.values(componentScores).some(
            component => component && Object.values(component).some(value => value > 0)
        );
        
        if (!hasAnyComponentData) {
            console.warn('No component element data available. Check element weights in configuration.');
        }
        
        // Display results
        ui.displayAnalysisResults(analysis, drawElementChart, drawSeasonalityChart);
        
        // Display calculation breakdown
        console.log('About to display calculation breakdown with:', analysis);
        ui.displayCalculationBreakdown(analysis);
        
        // Show results section
        ui.showResults(loadingIndicator, analysisResults, noResultsDisplay);
    } catch (error) {
        // Hide loading
        loadingIndicator.classList.add('hidden');
        noResultsDisplay.classList.remove('hidden');
        
        // Show error
        console.error('Analysis error:', error);
        alert(`Error analyzing tea: ${error.message || 'Unknown error'}`);
    }
}

// Toggle sample teas dropdown
function toggleSampleTeasDropdown() {
    sampleTeasDropdown.classList.toggle('hidden');
}

// Function to load a sample tea
function loadSampleTea(teaId) {
    // Hide dropdown
    sampleTeasDropdown.classList.add('hidden');
    
    // Get tea data
    const teaData = getSampleTeaData(teaId);
    
    if (!teaData) {
        alert(`Sample tea "${teaId}" not found`);
        return;
    }
    
    console.log(`Loading ${teaData.name}`);
    
    // Only update context-specific settings if needed
    // No need to override the core configuration that's defined in TcmSystemConfig
    
    // Fill form with tea data
    fillFormWithTeaData(teaData);
    
    // Scroll to form
    document.querySelector('.tea-form-container').scrollIntoView({ behavior: 'smooth' });
}

// Fill form with tea data
function fillFormWithTeaData(teaData) {
    ui.fillFormWithTeaData(
        teaData, 
        clearForm, 
        addFlavor, 
        toggleProcessingMethod, 
        updateCaffeineValue, 
        updateTheanineValue
    );
}

// Clear the form
function clearForm() {
    // Reset form fields
    form.reset();
    
    // Reset sliders
    caffeineSlider.value = 5;
    theanineSlider.value = 5;
    updateCaffeineValue();
    updateTheanineValue();
    
    // Clear flavors
    selectedFlavors = [];
    flavorChips.innerHTML = '';
    
    // Clear processing methods
    selectedProcessingMethods = [];
    processingChips.innerHTML = '';
    document.querySelectorAll('.processing-chips .chip.selected').forEach(chip => {
        chip.classList.remove('selected');
    });
}

// Sample tea data
function getSampleTeaData(teaId) {
    // Get tea data from tea database
    const tea = teaDatabase.find(tea => tea.id === teaId);
    
    // If tea is found in database, return it
    if (tea) {
        return tea;
    }
    
    // Fallback to original sample teas if not found in database
    const samples = {
        dragonwell: {
            name: "Dragon Well (Longjing)",
            type: "green",
            origin: "Hangzhou, China",
            caffeineLevel: 4,
            lTheanineLevel: 7,
            flavorProfile: ["grassy", "nutty", "vegetal", "chestnut"],
            processingMethods: ["pan-fired", "flattened", "non-oxidized"],
            geography: {
                altitude: 650,
                humidity: 72,
                latitude: 30.2,
                temperature: 18,
                solarRadiation: 4.2
            }
        },
        darjeeling: {
            name: "Darjeeling First Flush",
            type: "black",
            origin: "Darjeeling, India",
            caffeineLevel: 6,
            lTheanineLevel: 4,
            flavorProfile: ["floral", "muscatel", "fruity", "light"],
            processingMethods: ["withered", "oxidized", "rolled"],
            geography: {
                altitude: 2000,
                humidity: 65,
                latitude: 27.3,
                temperature: 15,
                solarRadiation: 5.0
            }
        },
        puerh: {
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
        },
        gyokuro: {
            name: "Gyokuro",
            type: "green",
            origin: "Uji, Japan",
            caffeineLevel: 4.5,
            lTheanineLevel: 9,
            flavorProfile: ["umami", "marine", "sweet", "grassy"],
            processingMethods: ["shade-grown", "steamed", "minimal-processing"],
            geography: {
                altitude: 300,
                humidity: 80,
                latitude: 34.9,
                temperature: 17,
                solarRadiation: 3.9
            }
        },
        tieguanyin: {
            name: "Tie Guan Yin Oolong",
            type: "oolong",
            origin: "Fujian, China",
            caffeineLevel: 4.5,
            lTheanineLevel: 6,
            flavorProfile: ["floral", "orchid", "nutty", "creamy", "mineral"],
            processingMethods: ["withered", "partial-oxidation", "rolled", "roasted"],
            geography: {
                altitude: 800,
                humidity: 75,
                latitude: 24.5,
                temperature: 19,
                solarRadiation: 4.5
            }
        },
        assam: {
            name: "Assam Black Tea",
            type: "black",
            origin: "Assam, India",
            caffeineLevel: 7,
            lTheanineLevel: 3.5,
            flavorProfile: ["malty", "robust", "honey", "spicy"],
            processingMethods: ["withered", "fully-oxidized", "rolled"],
            geography: {
                altitude: 150,
                humidity: 85,
                latitude: 26.7,
                temperature: 24,
                solarRadiation: 4.9
            }
        },
        whitePeony: {
            name: "White Peony (Bai Mu Dan)",
            type: "white",
            origin: "Fujian, China",
            caffeineLevel: 3,
            lTheanineLevel: 6,
            flavorProfile: ["fruity", "floral", "honey"],
            processingMethods: ["withered", "sun-dried", "minimal-processing"],
            geography: {
                altitude: 900,
                humidity: 72,
                latitude: 27.4,
                temperature: 18,
                solarRadiation: 4.4
            }
        }
    };
    
    return samples[teaId];
}

// Export analyzed tea as report
function exportTeaAnalysis() {
    if (!currentAnalysis) {
        alert('Please analyze a tea first before exporting.');
        return;
    }

    // Get the analysis
    const analysis = analyzer.analyzeTea(currentAnalysis);
    
    // Generate report
    const report = analyzer.exportAnalysisReport(analysis, 'text');
    
    // Create download link
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${analysis.name.replace(/\s+/g, '_')}_TCM_Analysis.txt`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

// Add this new function for toggling the calculation breakdown
function toggleCalculationBreakdown() {
    const content = document.getElementById('calculation-content');
    const toggleButton = document.getElementById('calculation-toggle');
    
    if (content && toggleButton) {
        // Toggle visibility class
        content.classList.toggle('visible');
        
        // Remove the hidden class when making visible
        if (content.classList.contains('visible')) {
            content.classList.remove('hidden');
        } else {
            // Add hidden class when not visible
            setTimeout(() => {
                content.classList.add('hidden');
            }, 500); // Wait for transition to finish
        }
        
        toggleButton.classList.toggle('active');
        
        // Update aria attributes for accessibility
        const isExpanded = content.classList.contains('visible');
        toggleButton.setAttribute('aria-expanded', isExpanded);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);