// app.js
// Main application for the Five Elements Tea Analyzer

import { createAnalyzer } from './js/TeaTcmAnalyzer.js';
import teaDatabase from './js/data/TeaDatabase.js';

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
    currentSeason: getCurrentSeason(),
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
}

// Initialize context settings
function initializeContextSettings() {
    // Set dropdown to current season
    currentSeasonSelect.value = contextSettings.currentSeason;
    constitutionSelect.value = contextSettings.constitution;
}

// Get current season based on date
function getCurrentSeason() {
    const date = new Date();
    const month = date.getMonth(); // 0-11
    
    if (month >= 2 && month <= 4) return "spring";       // March-May
    else if (month >= 5 && month <= 6) return "summer";   // June-July
    else if (month >= 7 && month <= 8) return "lateSummer"; // August-September
    else if (month >= 9 && month <= 10) return "autumn";   // October-November
    else return "winter";                                // December-February
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
    // Check if already added
    if (selectedFlavors.includes(flavor)) {
        return;
    }
    
    // Add to selected flavors array
    selectedFlavors.push(flavor);
    
    // Create chip element
    const chip = document.createElement('div');
    chip.className = 'chip removable';
    chip.textContent = flavor;
    chip.addEventListener('click', () => removeFlavor(flavor, chip));
    
    // Add to container
    flavorChips.appendChild(chip);
}

// Remove a flavor from the selected flavors
function removeFlavor(flavor, chipElement) {
    // Remove from array
    selectedFlavors = selectedFlavors.filter(f => f !== flavor);
    
    // Remove chip element
    chipElement.remove();
}

// Toggle a processing method
function toggleProcessingMethod(method, chipElement) {
    // Check if already selected
    const index = selectedProcessingMethods.indexOf(method);
    
    if (index === -1) {
        // Add method
        selectedProcessingMethods.push(method);
        chipElement.classList.add('selected');
        
        // Add to processing chips container
        const chip = document.createElement('div');
        chip.className = 'chip removable';
        chip.dataset.method = method;
        chip.textContent = method;
        chip.addEventListener('click', () => {
            // Remove method when clicked in the container
            toggleProcessingMethod(method, chipElement);
        });
        
        processingChips.appendChild(chip);
    } else {
        // Remove method
        selectedProcessingMethods.splice(index, 1);
        chipElement.classList.remove('selected');
        
        // Remove from processing chips container
        const chip = processingChips.querySelector(`[data-method="${method}"]`);
        if (chip) {
            chip.remove();
        }
    }
}

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const teaData = getTeaFormData();
    
    // Validate form data
    if (!teaData.name || !teaData.type) {
        alert('Please provide at least the tea name and type.');
        return;
    }
    
    // Show loading indicator
    showLoading();
    
    // Perform analysis (with a small delay to show loading animation)
    setTimeout(() => {
        analyzeTea(teaData);
    }, 500);
}

// Get tea data from form inputs
function getTeaFormData() {
    return {
        name: document.getElementById('tea-name').value,
        type: document.getElementById('tea-type').value,
        origin: document.getElementById('tea-origin').value,
        caffeineLevel: parseFloat(caffeineSlider.value),
        lTheanineLevel: parseFloat(theanineSlider.value),
        flavorProfile: [...selectedFlavors],
        processingMethods: [...selectedProcessingMethods],
        geography: getGeographyData()
    };
}

// Get geography data from form inputs
function getGeographyData() {
    const altitude = document.getElementById('geo-altitude').value;
    const humidity = document.getElementById('geo-humidity').value;
    const latitude = document.getElementById('geo-latitude').value;
    const temperature = document.getElementById('geo-temperature').value;
    const solarRadiation = document.getElementById('geo-solar').value;
    
    // Only create geography object if at least one field is filled
    if (altitude || humidity || latitude || temperature || solarRadiation) {
        return {
            altitude: altitude ? parseFloat(altitude) : undefined,
            humidity: humidity ? parseFloat(humidity) : undefined,
            latitude: latitude ? parseFloat(latitude) : undefined,
            temperature: temperature ? parseFloat(temperature) : undefined,
            solarRadiation: solarRadiation ? parseFloat(solarRadiation) : undefined
        };
    }
    
    return undefined;
}

// Show loading indicator and hide other displays
function showLoading() {
    loadingIndicator.classList.remove('hidden');
    analysisResults.classList.add('hidden');
    noResultsDisplay.classList.add('hidden');
}

// Show analysis results and hide other displays
function showResults() {
    loadingIndicator.classList.add('hidden');
    analysisResults.classList.remove('hidden');
    noResultsDisplay.classList.add('hidden');
    
    // Add fade-in animation
    analysisResults.classList.add('fade-in');
}

// Analyze tea and display results
function analyzeTea(teaData) {
    try {
        // Store tea data
        currentAnalysis = teaData;
        
        // Perform analysis
        const analysis = analyzer.analyzeTea(teaData);
        
        // Display results
        displayAnalysisResults(analysis);
        
        // Show results section
        showResults();
    } catch (error) {
        // Hide loading
        loadingIndicator.classList.add('hidden');
        noResultsDisplay.classList.remove('hidden');
        
        // Show error
        console.error('Analysis error:', error);
        alert(`Error analyzing tea: ${error.message || 'Unknown error'}`);
    }
}

// Display analysis results in the UI
function displayAnalysisResults(analysis) {
    // Set tea information
    document.getElementById('results-tea-name').textContent = analysis.name;
    const teaTypeBadge = document.getElementById('results-tea-type');
    teaTypeBadge.textContent = capitalizeFirstLetter(analysis.type) + ' Tea';
    
    // Set dominant and supporting elements
    setElementDisplay('dominant-element', analysis.dominantElement);
    setElementDisplay('supporting-element', analysis.supportingElement);
    
    // Set element bars
    setElementBars(analysis.elements);
    
    // Draw element chart
    drawElementChart(analysis.elements);
    
    // Draw seasonality chart if available
    if (analysis.seasonality) {
        drawSeasonalityChart(analysis.seasonality);
        displaySeasonalityInfo(analysis.seasonality, analysis.dominantElement);
    }
    
    // Set effect information
    document.getElementById('effect-name').textContent = analysis.effect.name;
    document.getElementById('effect-description').textContent = analysis.effect.description;
    
    // Set effects list
    setListItems('specific-effects-list', analysis.effect.specificEffects || []);
    
    // Set TCM terminology
    if (analysis.tcm) {
        document.getElementById('tcm-nature').textContent = analysis.tcm.nature || 'Not specified';
        document.getElementById('tcm-flavor').textContent = analysis.tcm.flavor || 'Not specified';
        document.getElementById('tcm-meridians').textContent = analysis.tcm.meridians ? analysis.tcm.meridians.join(', ') : 'Not specified';
        document.getElementById('tcm-balance').textContent = analysis.tcm.balance || 'Not specified';
        
        // Set TCM qualities list
        setListItems('tcm-qualities-list', analysis.tcm.qualities || []);
    }
    
    // Set recommendations
    if (analysis.recommendations) {
        setListItems('best-time-list', analysis.recommendations.bestTimeToEnjoy || []);
        setListItems('food-pairings-list', analysis.recommendations.pairingFoods || []);
        setListItems('preparation-tips-list', analysis.recommendations.preparationTips || []);
        setListItems('activities-list', analysis.recommendations.complementaryActivities || []);
    }
    
    // Set component contributions
    setComponentContributions(analysis);
}

// Display seasonality information
function displaySeasonalityInfo(seasonality, dominantElement) {
    // Set current season with proper class
    const currentSeasonElem = document.getElementById('current-season');
    currentSeasonElem.textContent = formatSeasonName(seasonality.currentSeason);
    currentSeasonElem.className = ''; // Clear existing classes
    currentSeasonElem.classList.add(`season-${seasonality.currentSeason}`);
    
    // Set dominant element with proper class
    const seasonElementElem = document.getElementById('current-season-element');
    seasonElementElem.textContent = capitalizeFirstLetter(dominantElement);
    seasonElementElem.className = ''; // Clear existing classes
    seasonElementElem.classList.add(`element-${dominantElement}`);
    
    // Set seasonal harmony
    document.getElementById('seasonal-harmony').textContent = seasonality.harmony;
    
    // Set seasonal qualities
    setListItems('seasonal-qualities-list', seasonality.seasonalQualities || []);
    
    // Set seasonal timing recommendations
    if (seasonality.recommendations) {
        document.getElementById('seasonal-time').textContent = 
            seasonality.recommendations.bestTimeOfDay?.join(', ') || 'Any time';
        document.getElementById('seasonal-frequency').textContent = 
            seasonality.recommendations.frequencyAdvice || 'As desired';
    }
    
    // Set seasonal benefits
    setListItems('seasonal-benefits-list', seasonality.benefits || []);
    
    // Set seasonal cautions
    setListItems('seasonal-cautions-list', seasonality.cautions || []);
}

// Format season name for display
function formatSeasonName(season) {
    if (season === 'lateSummer') return 'Late Summer';
    return capitalizeFirstLetter(season);
}

// Draw seasonality chart
function drawSeasonalityChart(seasonality) {
    const ctx = document.getElementById('seasonality-chart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.seasonalityChart) {
        window.seasonalityChart.destroy();
    }
    
    // Create new chart using the five TCM seasons
    window.seasonalityChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Spring', 'Summer', 'Late Summer', 'Autumn', 'Winter'],
            datasets: [{
                label: 'Seasonal Appropriateness',
                data: [
                    seasonality.scores.spring,
                    seasonality.scores.summer,
                    seasonality.scores.lateSummer,
                    seasonality.scores.autumn,
                    seasonality.scores.winter
                ],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                pointBackgroundColor: [
                    '#4CAF50', // Spring (Green)
                    '#F44336', // Summer (Red)
                    '#FFC107', // Late Summer (Yellow)
                    '#9E9E9E', // Autumn (Metal/Gray)
                    '#2196F3'  // Winter (Blue)
                ],
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(75, 192, 192, 1)'
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: 10,
                    ticks: {
                        stepSize: 2
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}/10`;
                        }
                    }
                }
            }
        }
    });
}

// Set element display (icon and name)
function setElementDisplay(elementId, elementName) {
    const iconElement = document.getElementById(`${elementId}-icon`);
    const nameElement = document.getElementById(`${elementId}-name`);
    
    // Clear existing classes
    iconElement.className = 'element-icon';
    
    // Set icon class based on element
    iconElement.classList.add(`${elementName}-icon`);
    
    // Add icon
    iconElement.innerHTML = `<i class="fas"></i>`;
    
    // Set name with capitalization
    nameElement.textContent = capitalizeFirstLetter(elementName);
}

// Set element bars with percentages
function setElementBars(elements) {
    // For each element, set the bar width and value text
    Object.entries(elements).forEach(([element, value]) => {
        const percentage = Math.round(value * 100);
        const bar = document.getElementById(`${element}-bar`);
        const valueText = document.getElementById(`${element}-value`);
        
        if (bar && valueText) {
            bar.style.width = `${percentage}%`;
            valueText.textContent = `${percentage}%`;
        }
    });
}

// Draw radar chart for element distribution
// Draw radar chart for element distribution
function drawElementChart(elements) {
    const ctx = document.getElementById('elements-chart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.elementsChart) {
      window.elementsChart.destroy();
    }
    
    // Original percentage values (0-100)
    const rawData = [
      Math.round(elements.wood * 100),
      Math.round(elements.fire * 100),
      Math.round(elements.earth * 100),
      Math.round(elements.metal * 100),
      Math.round(elements.water * 100)
    ];
    
    // Apply logarithmic scaling for visual emphasis
    // You can adjust the scaling factor (50) to control the visual contrast
    const visualData = rawData.map(value => {
      // Add 1 to avoid log(0) issues, then scale for visibility
      return Math.log10(value + 1) * 50;
    });
    
    // Calculate max value for chart scale
    const maxVisualValue = Math.max(...visualData) * 1.1; // Add 10% padding
    
    // Create new chart with the visually enhanced data
    window.elementsChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Wood', 'Fire', 'Earth', 'Metal', 'Water'],
        datasets: [{
          label: 'Five Elements Distribution',
          data: visualData,
          backgroundColor: 'rgba(63, 81, 181, 0.2)',
          borderColor: 'rgba(63, 81, 181, 0.8)',
          pointBackgroundColor: [
            '#4CAF50', // Wood
            '#F44336', // Fire
            '#FFC107', // Earth
            '#9E9E9E', // Metal
            '#2196F3'  // Water
          ],
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(63, 81, 181, 1)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            min: 0,
            max: maxVisualValue, // Dynamic max based on data
            beginAtZero: true,
            angleLines: {
              display: true
            },
            ticks: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                // Display the original percentage in the tooltip, not the scaled value
                const elementIndex = context.dataIndex;
                return `${context.label}: ${rawData[elementIndex]}%`;
              }
            }
          }
        }
      }
    });
  }

// Set items in a list element
function setListItems(listId, items) {
    const list = document.getElementById(listId);
    
    // Clear existing items
    list.innerHTML = '';
    
    // Add items
    if (items && items.length > 0) {
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            list.appendChild(li);
        });
    } else {
        // Add placeholder if no items
        const li = document.createElement('li');
        li.textContent = 'Not available';
        li.style.fontStyle = 'italic';
        li.style.opacity = '0.7';
        list.appendChild(li);
    }
}

// Set component contributions
function setComponentContributions(analysis) {
    const container = document.getElementById('contributions-container');
    
    // Clear existing content
    container.innerHTML = '';
    
    // Create cards for each component type
    
    // Flavor contribution
    if (analysis.components?.flavor) {
        const flavorCard = createContributionCard(
            'Flavor Profile',
            `The dominant ${analysis.components.flavor.primaryElement} element in the flavor profile contributes to this tea's character.`,
            analysis.flavorProfile,
            'fas fa-wine-glass'
        );
        container.appendChild(flavorCard);
    }
    
    // Compound contribution
    if (analysis.components?.compounds) {
        const compoundCard = createContributionCard(
            'Caffeine & L-Theanine Balance',
            `This tea's ${analysis.components.compounds.primaryNature} compound balance influences its effects.`,
            [`Caffeine Level: ${analysis.caffeineLevel}/10`, 
             `L-Theanine Level: ${analysis.lTheanineLevel}/10`,
             `Ratio: ${analysis.components.compounds.ratio.toFixed(2)}`],
            'fas fa-flask'
        );
        container.appendChild(compoundCard);
    }
    
    // Processing contribution
    if (analysis.processingMethods && analysis.processingMethods.length > 0) {
        const processingCard = createContributionCard(
            'Processing Methods',
            `The tea's processing influences its character and energetic profile.`,
            analysis.processingMethods,
            'fas fa-cogs'
        );
        container.appendChild(processingCard);
    }
    
    // Geography contribution
    if (analysis.components?.geography) {
        const geographyCard = createContributionCard(
            'Geographical Influence',
            `This tea's terroir character is ${analysis.components.geography.terrainCharacter}.`,
            [
                `Altitude: ${analysis.geography?.altitude || 'Unknown'} meters`,
                `Humidity: ${analysis.geography?.humidity || 'Unknown'}%`,
                `Region: ${analysis.origin || 'Unknown'}`
            ],
            'fas fa-mountain'
        );
        container.appendChild(geographyCard);
    }
    
    // Seasonal contribution
    if (analysis.seasonality) {
        const seasonalCard = createContributionCard(
            'Seasonal Influences',
            `This tea has its strongest affinity with ${formatSeasonName(analysis.seasonality.peakSeason)}.`,
            [
                `Current season harmony: ${analysis.seasonality.harmony}`,
                `Peak season: ${formatSeasonName(analysis.seasonality.peakSeason)}`,
                `Seasonal element: ${capitalizeFirstLetter(analysis.seasonality.seasonElement)}`
            ],
            'fas fa-calendar-alt'
        );
        container.appendChild(seasonalCard);
    }
}

// Create a contribution card
function createContributionCard(title, description, items, iconClass) {
    const card = document.createElement('div');
    card.className = 'contribution-card';
    
    const header = document.createElement('h4');
    header.innerHTML = `<i class="${iconClass}"></i> ${title}`;
    
    const desc = document.createElement('p');
    desc.textContent = description;
    
    card.appendChild(header);
    card.appendChild(desc);
    
    if (items && items.length > 0) {
        const list = document.createElement('ul');
        list.className = 'contribution-list';
        
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            list.appendChild(li);
        });
        
        card.appendChild(list);
    }
    
    return card;
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
    // Reset form first
    clearForm();
    
    // Set basic fields
    document.getElementById('tea-name').value = teaData.name;
    document.getElementById('tea-type').value = teaData.type;
    document.getElementById('tea-origin').value = teaData.origin || '';
    
    // Set sliders
    caffeineSlider.value = teaData.caffeineLevel;
    theanineSlider.value = teaData.lTheanineLevel;
    updateCaffeineValue();
    updateTheanineValue();
    
    // Set flavors
    if (teaData.flavorProfile && teaData.flavorProfile.length > 0) {
        teaData.flavorProfile.forEach(flavor => addFlavor(flavor));
    }
    
    // Set processing methods
    if (teaData.processingMethods && teaData.processingMethods.length > 0) {
        teaData.processingMethods.forEach(method => {
            const chipElement = document.querySelector(`.processing-chips .chip[data-processing="${method}"]`);
            if (chipElement) {
                toggleProcessingMethod(method, chipElement);
            }
        });
    }
    
    // Set geography data
    if (teaData.geography) {
        document.getElementById('geo-altitude').value = teaData.geography.altitude || '';
        document.getElementById('geo-humidity').value = teaData.geography.humidity || '';
        document.getElementById('geo-latitude').value = teaData.geography.latitude || '';
        document.getElementById('geo-temperature').value = teaData.geography.temperature || '';
        document.getElementById('geo-solar').value = teaData.geography.solarRadiation || '';
    }
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

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);