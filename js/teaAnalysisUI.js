// teaAnalysisUI.js
// Handles UI-specific functionality for the tea analysis application

// Helper functions
/**
 * Capitalize first letter of a string
 * @param {string} string - String to capitalize
 * @returns {string} Capitalized string
 */
export function capitalizeFirstLetter(string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Format season name for display (e.g., convert lateSummer to Late Summer)
 * @param {string} season - Season name
 * @returns {string} Formatted season name
 */
export function formatSeasonName(season) {
  if (season === 'lateSummer') return 'Late Summer';
  return capitalizeFirstLetter(season);
}

// UI display functions
/**
 * Show loading indicator and hide other displays
 * @param {HTMLElement} loadingIndicator - Loading indicator element
 * @param {HTMLElement} analysisResults - Analysis results container
 * @param {HTMLElement} noResultsDisplay - No results display element
 */
export function showLoading(loadingIndicator, analysisResults, noResultsDisplay) {
  loadingIndicator.classList.remove('hidden');
  analysisResults.classList.add('hidden');
  noResultsDisplay.classList.add('hidden');
}

/**
 * Show analysis results and hide other displays
 * @param {HTMLElement} loadingIndicator - Loading indicator element
 * @param {HTMLElement} analysisResults - Analysis results container
 * @param {HTMLElement} noResultsDisplay - No results display element
 */
export function showResults(loadingIndicator, analysisResults, noResultsDisplay) {
  loadingIndicator.classList.add('hidden');
  analysisResults.classList.remove('hidden');
  noResultsDisplay.classList.add('hidden');
  
  // Add fade-in animation
  analysisResults.classList.add('fade-in');
}

/**
 * Set element display (icon and name)
 * @param {string} elementId - Base ID for the element
 * @param {string} elementName - Element name
 */
export function setElementDisplay(elementId, elementName) {
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

/**
 * Set element bars with percentages
 * @param {Object} elements - Element distribution object
 */
export function setElementBars(elements) {
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

/**
 * Set items in a list element
 * @param {string} listId - ID of the list element
 * @param {string[]} items - Array of items to add to the list
 */
export function setListItems(listId, items) {
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

/**
 * Display analysis results in the UI
 * @param {Object} analysis - Tea analysis result
 * @param {Function} drawElementChart - Function to draw element chart
 * @param {Function} drawSeasonalityChart - Function to draw seasonality chart
 */
export function displayAnalysisResults(analysis, drawElementChart, drawSeasonalityChart) {
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

/**
 * Display seasonality information in the UI
 * @param {Object} seasonality - Seasonality data
 * @param {string} dominantElement - Dominant element
 */
export function displaySeasonalityInfo(seasonality, dominantElement) {
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

/**
 * Display thermal properties in the UI
 * @param {Object} thermalData - Thermal properties data
 */
export function displayThermalProperties(thermalData) {
  if (!thermalData) return;
  
  // Get the thermal properties container
  const thermalContainer = document.getElementById('thermal-properties');
  
  // If container doesn't exist, log error and return
  if (!thermalContainer) {
    console.error('Thermal properties container not found');
    return;
  }
  
  // Set thermal property
  document.getElementById('thermal-property').textContent = thermalData.thermalProperty || 'Neutral';
  
  // Set thermal value
  const thermalValue = document.getElementById('thermal-value');
  if (thermalValue) {
    const formattedValue = thermalData.totalThermal.toFixed(2);
    thermalValue.textContent = formattedValue;
    
    // Add class based on thermal value
    thermalValue.className = '';
    if (thermalData.totalThermal > 0.2) {
      thermalValue.classList.add('warm-thermal');
    } else if (thermalData.totalThermal < -0.2) {
      thermalValue.classList.add('cool-thermal');
    } else {
      thermalValue.classList.add('neutral-thermal');
    }
  }
  
  // Set thermal effects
  const effectsList = document.getElementById('thermal-effects-list');
  if (effectsList) {
    // Clear existing items
    effectsList.innerHTML = '';
    
    if (thermalData.effects && thermalData.effects.length > 0) {
      thermalData.effects.forEach(effect => {
        const li = document.createElement('li');
        li.textContent = effect;
        effectsList.appendChild(li);
      });
    } else {
      // Generate default effects based on thermal property
      const defaultEffects = [];
      
      if (thermalData.totalThermal < -0.2) {
        // Cooling effects
        defaultEffects.push('Cools the body');
        defaultEffects.push('Helps reduce heat and inflammation');
        defaultEffects.push('Good for hot weather or heat conditions');
      } else if (thermalData.totalThermal > 0.2) {
        // Warming effects
        defaultEffects.push('Warms the body');
        defaultEffects.push('Helps improve circulation');
        defaultEffects.push('Good for cold weather or cold conditions');
      } else {
        // Neutral effects
        defaultEffects.push('Balanced thermal effect on the body');
        defaultEffects.push('Good for general consumption in any weather');
      }
      
      defaultEffects.forEach(effect => {
        const li = document.createElement('li');
        li.textContent = effect;
        effectsList.appendChild(li);
      });
    }
  }

  // Display the thermal container
  thermalContainer.classList.remove('hidden');
}

/**
 * Set component contributions in the UI
 * @param {Object} analysis - Tea analysis result
 */
export function setComponentContributions(analysis) {
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
  
  // Thermal contribution (NEW)
  if (analysis.thermal) {
    const thermalCard = createContributionCard(
      'Thermal Properties',
      `This tea has a ${analysis.thermal.thermalProperty.toLowerCase()} thermal nature that influences its effects on the body.`,
      [
        `Thermal Property: ${analysis.thermal.thermalProperty}`,
        `Flavor Contribution: ${analysis.thermal.componentContributions?.flavor?.contribution !== undefined ? 
          (analysis.thermal.componentContributions.flavor.contribution * 100).toFixed(1) + '%' : 'Not analyzed'}`,
        `Processing Contribution: ${analysis.thermal.componentContributions?.processing?.contribution !== undefined ? 
          (analysis.thermal.componentContributions.processing.contribution * 100).toFixed(1) + '%' : 'Not analyzed'}`,
        `Compound Contribution: ${analysis.thermal.componentContributions?.compound?.contribution !== undefined ? 
          (analysis.thermal.componentContributions.compound.contribution * 100).toFixed(1) + '%' : 'Not analyzed'}`,
        `Geography Contribution: ${analysis.thermal.componentContributions?.geography?.contribution !== undefined ? 
          (analysis.thermal.componentContributions.geography.contribution * 100).toFixed(1) + '%' : 'Not analyzed'}`
      ],
      'fas fa-thermometer-half'
    );
    container.appendChild(thermalCard);
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

// Helper function to format percentage values
function formatPercentage(value) {
  return `${Math.round(value)}%`;
}

/**
 * Create a contribution card for the analysis results
 * @param {string} title - Card title
 * @param {string} description - Card description
 * @param {string[]} items - List items to display
 * @param {string} iconClass - Font Awesome icon class
 * @returns {HTMLElement} Contribution card element
 */
export function createContributionCard(title, description, items, iconClass) {
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

// Form handling functions
/**
 * Get current season based on date
 * @returns {string} Current season name
 */
export function getCurrentSeason() {
  const date = new Date();
  const month = date.getMonth(); // 0-11
  
  if (month >= 2 && month <= 4) return "spring";       // March-May
  else if (month >= 5 && month <= 6) return "summer";   // June-July
  else if (month >= 7 && month <= 8) return "lateSummer"; // August-September
  else if (month >= 9 && month <= 10) return "autumn";   // October-November
  else return "winter";                                // December-February
}

/**
 * Add a flavor to the selected flavors
 * @param {string} flavor - Flavor to add
 * @param {string[]} selectedFlavors - Array of selected flavors
 * @param {HTMLElement} flavorChips - Container for flavor chips
 * @param {Function} removeFlavor - Function to remove flavor
 * @returns {string[]} Updated selected flavors array
 */
export function addFlavor(flavor, selectedFlavors, flavorChips, removeFlavor) {
  // Check if already added
  if (selectedFlavors.includes(flavor)) {
    return selectedFlavors;
  }
  
  // Add to selected flavors array
  const updatedFlavors = [...selectedFlavors, flavor];
  
  // Create chip element
  const chip = document.createElement('div');
  chip.className = 'chip removable';
  chip.textContent = flavor;
  chip.addEventListener('click', () => removeFlavor(flavor, chip, updatedFlavors));
  
  // Add to container
  flavorChips.appendChild(chip);
  
  return updatedFlavors;
}

/**
 * Remove a flavor from the selected flavors
 * @param {string} flavor - Flavor to remove
 * @param {HTMLElement} chipElement - Chip element to remove
 * @param {string[]} selectedFlavors - Array of selected flavors
 * @returns {string[]} Updated selected flavors array
 */
export function removeFlavor(flavor, chipElement, selectedFlavors) {
  // Remove from array
  const updatedFlavors = selectedFlavors.filter(f => f !== flavor);
  
  // Remove chip element
  chipElement.remove();
  
  return updatedFlavors;
}

/**
 * Toggle a processing method
 * @param {string} method - Processing method to toggle
 * @param {HTMLElement} chipElement - Chip element in the selection panel
 * @param {string[]} selectedProcessingMethods - Array of selected processing methods
 * @param {HTMLElement} processingChips - Container for processing method chips
 * @returns {string[]} Updated selected processing methods array
 */
export function toggleProcessingMethod(method, chipElement, selectedProcessingMethods, processingChips) {
  // Check if already selected
  const index = selectedProcessingMethods.indexOf(method);
  let updatedMethods = [...selectedProcessingMethods];
  
  if (index === -1) {
    // Add method
    updatedMethods.push(method);
    chipElement.classList.add('selected');
    
    // Add to processing chips container
    const chip = document.createElement('div');
    chip.className = 'chip removable';
    chip.dataset.method = method;
    chip.textContent = method;
    chip.addEventListener('click', () => {
      // Remove method when clicked in the container
      return toggleProcessingMethod(method, chipElement, updatedMethods, processingChips);
    });
    
    processingChips.appendChild(chip);
  } else {
    // Remove method
    updatedMethods.splice(index, 1);
    chipElement.classList.remove('selected');
    
    // Remove from processing chips container
    const chip = processingChips.querySelector(`[data-method="${method}"]`);
    if (chip) {
      chip.remove();
    }
  }
  
  return updatedMethods;
}

/**
 * Fill form with tea data
 * @param {Object} teaData - Tea data object
 * @param {Function} clearForm - Function to clear the form
 * @param {Function} addFlavor - Function to add a flavor
 * @param {Function} toggleProcessingMethod - Function to toggle processing method
 * @param {Function} updateCaffeineValue - Function to update caffeine value display
 * @param {Function} updateTheanineValue - Function to update theanine value display
 */
export function fillFormWithTeaData(teaData, clearForm, addFlavor, toggleProcessingMethod, 
                              updateCaffeineValue, updateTheanineValue) {
  // Reset form first
  clearForm();
  
  // Set basic fields
  document.getElementById('tea-name').value = teaData.name;
  document.getElementById('tea-type').value = teaData.type;
  document.getElementById('tea-origin').value = teaData.origin || '';
  
  // Set sliders
  const caffeineSlider = document.getElementById('caffeine-level');
  const theanineSlider = document.getElementById('theanine-level');
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

/**
 * Get tea data from form inputs
 * @param {HTMLElement} caffeineSlider - Caffeine slider element
 * @param {string[]} selectedFlavors - Array of selected flavors
 * @param {string[]} selectedProcessingMethods - Array of selected processing methods
 * @returns {Object} Tea data object
 */
export function getTeaFormData(caffeineSlider, selectedFlavors, selectedProcessingMethods) {
  return {
    name: document.getElementById('tea-name').value,
    type: document.getElementById('tea-type').value,
    origin: document.getElementById('tea-origin').value,
    caffeineLevel: parseFloat(caffeineSlider.value),
    lTheanineLevel: parseFloat(document.getElementById('theanine-level').value),
    flavorProfile: [...selectedFlavors],
    processingMethods: [...selectedProcessingMethods],
    geography: getGeographyData()
  };
}

/**
 * Get geography data from form inputs
 * @returns {Object|undefined} Geography data object or undefined if no data
 */
export function getGeographyData() {
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

/**
 * Display calculation breakdown in the UI
 * @param {Object} analysis - Tea analysis result
 */
export function displayCalculationBreakdown(analysis) {
  if (!analysis) {
    console.error('Analysis data not provided to displayCalculationBreakdown');
    return;
  }
  
  console.log('Starting calculation breakdown display...');
  
  // Get calculation breakdown container
  const breakdownContainer = document.querySelector('.calculation-breakdown-panel');
  if (!breakdownContainer) {
    console.error('Calculation breakdown container not found');
    return;
  }
  
  // Clear existing content in calculation-details
  const detailsContainer = document.querySelector('.calculation-details');
  if (!detailsContainer) {
    console.error('Calculation details container not found');
    return;
  }
  detailsContainer.innerHTML = '';
  
  // Get calculation formula container
  const formulaContainer = document.getElementById('calculation-formula');
  if (!formulaContainer) {
    console.error('Calculation formula container not found');
    return;
  }
  formulaContainer.innerHTML = '';
  
  // Get component element breakdown container
  const componentBreakdownContainer = document.getElementById('component-element-breakdown');
  if (!componentBreakdownContainer) {
    console.error('Component element breakdown container not found');
    return;
  }
  componentBreakdownContainer.innerHTML = '';
  
  console.log('All containers found, proceeding with content display...');
  
  // Get weights from analysis
  const weights = analysis.elementContributions?.componentWeights || {
    flavor: 0.4,
    compounds: 0.3,
    processing: 0.2,
    geography: 0.1
  };
  
  // Get component element distributions
  const componentScores = analysis.rawElementAnalysis?.componentScores || {};
  
  console.log('Component scores:', componentScores);
  
  // Display component weights
  displayComponentWeights(weights);
  console.log('Component weights displayed');
  
  // Display component distributions table
  displayElementContributionTable(
    componentScores, 
    weights, 
    analysis.elements
  );
  console.log('Element contribution table displayed');
  
  // Display formula for final element calculation
  const flavorWeight = Math.round(weights.flavor * 100);
  const compoundsWeight = Math.round(weights.compounds * 100);
  const processingWeight = Math.round(weights.processing * 100);
  const geographyWeight = Math.round(weights.geography * 100);
  
  const formula = `
    <div class="formula-explanation">
      <h4>Calculation Formula</h4>
      <p>The five elements distribution is calculated by combining weighted contributions from each component:</p>
      <div class="formula">
        <span class="formula-component flavor-component">(Flavor Profile × ${flavorWeight}%)</span>
        <span class="formula-operator">+</span>
        <span class="formula-component compounds-component">(Compound Balance × ${compoundsWeight}%)</span>
        <span class="formula-operator">+</span>
        <span class="formula-component processing-component">(Processing Methods × ${processingWeight}%)</span>
        <span class="formula-operator">+</span>
        <span class="formula-component geography-component">(Geography × ${geographyWeight}%)</span>
      </div>
      <p>This results in a dominant <strong class="element-${analysis.dominantElement}">${capitalizeFirstLetter(analysis.dominantElement)}</strong> element supported by <strong class="element-${analysis.supportingElement}">${capitalizeFirstLetter(analysis.supportingElement)}</strong>.</p>
      <p><em>Note: The Five Elements system also considers generating and controlling cycles between elements for final adjustments.</em></p>
    </div>
  `;
  formulaContainer.innerHTML = formula;
  console.log('Formula displayed');
  
  // Display component distributions for each component type
  displayComponentElementDistributions(componentScores, analysis);
  console.log('Component element distributions displayed');
  
  // Display thermal calculation breakdown (NEW)
  displayThermalCalculationBreakdown(analysis);
  console.log('Thermal calculation breakdown displayed');
  
  // Make the content visible if it's not already
  const contentSection = document.getElementById('calculation-content');
  if (contentSection) {
    contentSection.classList.remove('hidden');
    contentSection.classList.add('visible');
    
    // Also make the toggle active
    const toggleButton = document.getElementById('calculation-toggle');
    if (toggleButton) {
      toggleButton.classList.add('active');
      toggleButton.setAttribute('aria-expanded', 'true');
    }
  } else {
    console.error('Calculation content section not found');
  }
  
  console.log('Calculation breakdown display complete');
}

/**
 * Display thermal calculation breakdown in the UI
 * @param {Object} analysis - Tea analysis result
 */
export function displayThermalCalculationBreakdown(analysis) {
  if (!analysis.thermal) return;
  
  const detailsContainer = document.querySelector('.calculation-details');
  if (!detailsContainer) {
    console.error('Calculation details container not found for thermal breakdown');
    return;
  }
  
  // Create thermal section
  const thermalSection = document.createElement('div');
  thermalSection.className = 'calculation-section';
  
  // Create section header
  const thermalHeader = document.createElement('h4');
  thermalHeader.innerHTML = '<i class="fas fa-thermometer-half"></i> Thermal Properties Analysis';
  thermalSection.appendChild(thermalHeader);
  
  // Create description
  const thermalDesc = document.createElement('p');
  thermalDesc.innerHTML = `This tea has a <span class="thermal-quality">${analysis.thermal.thermalProperty}</span> thermal nature 
    with a thermal value of <strong>${analysis.thermal.totalThermal.toFixed(2)}</strong> (range: -1 to +1).
    Thermal properties emerge from all tea components and affect the Five Element distribution.`;
  thermalSection.appendChild(thermalDesc);
  
  // Create thermal component breakdown
  const thermalTable = document.createElement('table');
  thermalTable.className = 'thermal-breakdown-table';
  
  // Create table header
  const headerRow = document.createElement('tr');
  ['Component', 'Thermal Value', 'Weight', 'Contribution'].forEach(text => {
    const th = document.createElement('th');
    th.textContent = text;
    headerRow.appendChild(th);
  });
  thermalTable.appendChild(headerRow);
  
  // Add component rows
  const components = analysis.thermal.components;
  Object.entries(components).forEach(([component, data]) => {
    if (data.value !== 0) {
      const row = document.createElement('tr');
      
      // Component name
      const nameCell = document.createElement('td');
      nameCell.textContent = capitalizeFirstLetter(component);
      row.appendChild(nameCell);
      
      // Thermal value
      const valueCell = document.createElement('td');
      valueCell.textContent = data.value.toFixed(2);
      valueCell.className = data.value > 0 ? 'positive-thermal' : data.value < 0 ? 'negative-thermal' : '';
      row.appendChild(valueCell);
      
      // Weight
      const weightCell = document.createElement('td');
      weightCell.textContent = (data.weight * 100).toFixed(0) + '%';
      row.appendChild(weightCell);
      
      // Contribution
      const contribCell = document.createElement('td');
      contribCell.textContent = data.contribution.toFixed(2);
      contribCell.className = data.contribution > 0 ? 'positive-thermal' : data.contribution < 0 ? 'negative-thermal' : '';
      row.appendChild(contribCell);
      
      thermalTable.appendChild(row);
    }
  });
  
  // Add total row
  const totalRow = document.createElement('tr');
  totalRow.className = 'total-row';
  
  // Total label
  const totalLabel = document.createElement('td');
  totalLabel.textContent = 'Total Thermal';
  totalRow.appendChild(totalLabel);
  
  // Total value
  const totalValue = document.createElement('td');
  totalValue.colSpan = 3;
  totalValue.textContent = analysis.thermal.totalThermal.toFixed(2);
  totalValue.className = analysis.thermal.totalThermal > 0 ? 'positive-thermal' : analysis.thermal.totalThermal < 0 ? 'negative-thermal' : '';
  totalRow.appendChild(totalValue);
  
  thermalTable.appendChild(totalRow);
  thermalSection.appendChild(thermalTable);
  
  // Create thermal effect explanation
  const effectDesc = document.createElement('div');
  effectDesc.className = 'thermal-explanation';
  effectDesc.innerHTML = `<h5>Element Adjustments from Thermal Properties</h5>
    <p>This tea's ${analysis.thermal.thermalProperty.toLowerCase()} thermal nature affects its element distribution:</p>`;
  
  // Add element adjustment list
  const thermalEffectsList = document.createElement('ul');
  
  if (analysis.thermal.totalThermal < -0.2) {
    // Cooling effects
    thermalEffectsList.innerHTML = `
      <li>Reduced <span class="element-fire">Fire</span> element (cooling effect)</li>
      <li>Enhanced <span class="element-water">Water</span> element (yin nourishment)</li>
      <li>Slightly enhanced <span class="element-metal">Metal</span> element (purifying quality)</li>
    `;
  } else if (analysis.thermal.totalThermal > 0.2) {
    // Warming effects
    thermalEffectsList.innerHTML = `
      <li>Enhanced <span class="element-fire">Fire</span> element (warming effect)</li>
      <li>Enhanced <span class="element-earth">Earth</span> element (nourishing quality)</li>
      <li>Reduced <span class="element-water">Water</span> element (drying effect)</li>
    `;
  } else {
    // Neutral effects
    thermalEffectsList.innerHTML = `
      <li>Slightly enhanced <span class="element-earth">Earth</span> element (balanced/neutral quality)</li>
      <li>Minimal thermal adjustments to other elements</li>
    `;
  }
  
  effectDesc.appendChild(thermalEffectsList);
  thermalSection.appendChild(effectDesc);
  
  // Add section to details container
  detailsContainer.appendChild(thermalSection);
}

/**
 * Display component weights in the UI
 * @param {Object} weights - Component weights
 */
function displayComponentWeights(weights) {
  // Update weight bars and values
  updateComponentWeight('flavor', weights.flavor);
  updateComponentWeight('compounds', weights.compounds);
  updateComponentWeight('processing', weights.processing);
  updateComponentWeight('geography', weights.geography);
}

/**
 * Update a component weight display
 * @param {string} component - Component name
 * @param {number} weight - Component weight (0-1)
 */
function updateComponentWeight(component, weight) {
  const percentage = Math.round(weight * 100);
  const bar = document.getElementById(`${component}-weight-bar`);
  const value = document.getElementById(`${component}-weight-value`);
  
  if (bar && value) {
    bar.style.width = `${percentage}%`;
    value.textContent = `${percentage}%`;
  }
}

/**
 * Display element contribution table
 * @param {Object} componentScores - Component scores for each element
 * @param {Object} weights - Component weights
 * @param {Object} finalElements - Final element scores
 */
function displayElementContributionTable(componentScores, weights, finalElements) {
  const tbody = document.getElementById('element-contribution-tbody');
  
  // Clear existing content
  tbody.innerHTML = '';
  
  // Add rows for each component
  const components = [
    { key: 'flavor', name: 'Flavor Profile' },
    { key: 'compounds', name: 'Compounds' },
    { key: 'processing', name: 'Processing' },
    { key: 'geography', name: 'Geography' }
  ];
  
  // Elements in order
  const elements = ['wood', 'fire', 'earth', 'metal', 'water'];
  
  // Add a row for each component that has data
  components.forEach(component => {
    const scores = componentScores[component.key];
    
    // Skip if no scores for this component
    if (!scores) return;
    
    const weight = weights[component.key] || 0;
    
    // Create row
    const row = document.createElement('tr');
    
    // Add component name cell
    const nameCell = document.createElement('td');
    nameCell.textContent = `${component.name} (${Math.round(weight * 100)}%)`;
    row.appendChild(nameCell);
    
    // Check for metadata to explain normalization
    let hasMetadata = false;
    if (component.key === 'compounds' && scores._metadata) {
      hasMetadata = true;
    }
    
    // Add cells for each element
    elements.forEach(element => {
      const score = scores[element] || 0;
      const rawValue = score * weight;
      const percentage = Math.round(rawValue * 100);
      
      const cell = document.createElement('td');
      
      // If unnormalized values exist for compounds, show both normalized and original values
      if (hasMetadata && scores._metadata.unnormalizedValues) {
        const originalValue = scores._metadata.unnormalizedValues[element] || 0;
        const originalPercentage = Math.round(originalValue * 100);
        
        // Only show original if different from normalized
        if (Math.abs(originalPercentage - percentage / weight) > 1) {
          cell.innerHTML = `${percentage}%<span class="original-value" title="Before normalization to ${Math.round(scores._metadata.compoundWeight * 100)}% component weight">(${originalPercentage}%)</span>`;
        } else {
          cell.textContent = `${percentage}%`;
        }
      } else {
        cell.textContent = `${percentage}%`;
      }
      
      // Highlight the cell if it has a significant contribution
      if (percentage >= 5) {
        cell.style.fontWeight = 'bold';
        cell.style.backgroundColor = `rgba(${getElementColor(element)}, 0.1)`;
      }
      
      row.appendChild(cell);
    });
    
    tbody.appendChild(row);
    
    // If we have metadata for compounds, add a note below
    if (hasMetadata && scores._metadata.normalizationMessage) {
      const noteRow = document.createElement('tr');
      noteRow.className = 'metadata-note';
      
      const noteCell = document.createElement('td');
      noteCell.colSpan = 6; // Span all columns
      noteCell.className = 'normalization-note';
      noteCell.innerHTML = scores._metadata.normalizationMessage;
      
      noteRow.appendChild(noteCell);
      tbody.appendChild(noteRow);
    }
  });
  
  // Update the final row values
  elements.forEach(element => {
    const finalScore = finalElements[element] || 0;
    const finalPercentage = Math.round(finalScore * 100);
    const cell = document.getElementById(`${element}-final`);
    
    if (cell) {
      cell.textContent = `${finalPercentage}%`;
      cell.style.fontWeight = 'bold';
      cell.style.color = getElementTextColor(element);
    }
  });
}

/**
 * Get element color in RGB format
 * @param {string} element - Element name
 * @returns {string} RGB color values
 */
function getElementColor(element) {
  switch (element) {
    case 'wood': return '76, 175, 80'; // Green
    case 'fire': return '244, 67, 54'; // Red
    case 'earth': return '255, 193, 7'; // Yellow
    case 'metal': return '158, 158, 158'; // Grey
    case 'water': return '33, 150, 243'; // Blue
    default: return '0, 0, 0';
  }
}

/**
 * Get element text color
 * @param {string} element - Element name
 * @returns {string} CSS color
 */
function getElementTextColor(element) {
  switch (element) {
    case 'wood': return '#4CAF50';
    case 'fire': return '#F44336';
    case 'earth': return '#FFC107';
    case 'metal': return '#9E9E9E';
    case 'water': return '#2196F3';
    default: return '#000000';
  }
}

/**
 * Display component element distributions
 * @param {Object} componentScores - Component scores for each element
 * @param {Object} analysis - Complete tea analysis
 */
function displayComponentElementDistributions(componentScores, analysis) {
  const container = document.getElementById('component-element-breakdown');
  
  // Clear existing content
  container.innerHTML = '';
  
  // Add cards for each component
  const components = [
    { 
      key: 'flavor', 
      name: 'Flavor Profile',
      getFactors: () => getFlavorFactors(analysis)
    },
    { 
      key: 'compounds', 
      name: 'Compounds',
      getFactors: () => getCompoundFactors(analysis)
    },
    { 
      key: 'processing', 
      name: 'Processing',
      getFactors: () => getProcessingFactors(analysis)
    },
    { 
      key: 'geography', 
      name: 'Geography',
      getFactors: () => getGeographyFactors(analysis)
    }
  ];
  
  // Create a card for each component that has data
  components.forEach(component => {
    const elementScores = componentScores[component.key];
    
    // Skip if no scores for this component
    if (!elementScores) return;
    
    // Create card
    const card = document.createElement('div');
    card.className = 'component-element-card';
    
    // Add title
    const title = document.createElement('h5');
    title.textContent = component.name;
    card.appendChild(title);
    
    // Add specific factors that influence this component
    const factorsDiv = document.createElement('div');
    factorsDiv.className = 'component-factors';
    
    const factorsList = component.getFactors();
    if (factorsList && factorsList.length > 0) {
      const factorsIntro = document.createElement('p');
      factorsIntro.className = 'factors-intro';
      factorsIntro.textContent = 'Influencing factors:';
      factorsDiv.appendChild(factorsIntro);
      
      const ul = document.createElement('ul');
      ul.className = 'factors-list';
      
      factorsList.forEach(factor => {
        const li = document.createElement('li');
        li.innerHTML = factor;
        ul.appendChild(li);
      });
      
      factorsDiv.appendChild(ul);
    } else {
      const noFactors = document.createElement('p');
      noFactors.textContent = 'No specific factors identified.';
      noFactors.style.fontStyle = 'italic';
      factorsDiv.appendChild(noFactors);
    }
    
    card.appendChild(factorsDiv);
    
    // Add element bars
    const elements = ['wood', 'fire', 'earth', 'metal', 'water'];
    
    // Create element distribution header
    const distributionHeader = document.createElement('p');
    distributionHeader.className = 'distribution-header';
    distributionHeader.textContent = 'Element distribution:';
    card.appendChild(distributionHeader);
    
    elements.forEach(element => {
      const score = elementScores[element] || 0;
      const percentage = Math.round(score * 100);
      
      const barContainer = document.createElement('div');
      barContainer.className = 'element-bar-container';
      
      const label = document.createElement('span');
      label.className = 'element-label';
      label.textContent = capitalizeFirstLetter(element);
      
      const progressBar = document.createElement('div');
      progressBar.className = 'progress-bar';
      
      const bar = document.createElement('div');
      bar.className = `progress ${element}-bar`;
      bar.style.width = `${percentage}%`;
      
      const value = document.createElement('span');
      value.className = 'element-value';
      value.textContent = `${percentage}%`;
      
      progressBar.appendChild(bar);
      barContainer.appendChild(label);
      barContainer.appendChild(progressBar);
      barContainer.appendChild(value);
      
      card.appendChild(barContainer);
    });
    
    container.appendChild(card);
  });
  
  // If no components were added, show a message
  if (container.children.length === 0) {
    const message = document.createElement('p');
    message.textContent = 'No component data available for this tea.';
    message.style.fontStyle = 'italic';
    container.appendChild(message);
  }
}

/**
 * Get flavor factors that influence the elements
 * @param {Object} analysis - Tea analysis
 * @returns {string[]} Array of factor descriptions
 */
function getFlavorFactors(analysis) {
  const factors = [];
  
  if (analysis.flavorProfile && analysis.flavorProfile.length > 0) {
    // Get up to 3 dominant flavors
    const dominantFlavors = analysis.flavorProfile.slice(0, 3);
    
    // Get TCM flavor if available
    if (analysis.tcm && analysis.tcm.flavor) {
      factors.push(`TCM flavor classification: <strong>${analysis.tcm.flavor}</strong>`);
    }
    
    factors.push(`Primary flavors: <strong>${dominantFlavors.join(', ')}</strong>`);
    
    // Add flavor-element mapping explanation
    factors.push(`<span class="compound-element-mapping">
      <strong>Flavor-Element Mapping:</strong><br>
      • <span class="element-wood">Sour, Acidic</span>: Associated with <strong class="element-wood">Wood</strong> element<br>
      • <span class="element-fire">Bitter, Spicy</span>: Associated with <strong class="element-fire">Fire</strong> element<br>
      • <span class="element-earth">Sweet, Mellow</span>: Associated with <strong class="element-earth">Earth</strong> element<br>
      • <span class="element-metal">Pungent, Aromatic</span>: Associated with <strong class="element-metal">Metal</strong> element<br>
      • <span class="element-water">Salty, Umami</span>: Associated with <strong class="element-water">Water</strong> element
    </span>`);
    
    // Add dominant flavor note
    if (analysis.components?.flavor?.primaryElement) {
      const primaryEl = analysis.components.flavor.primaryElement;
      factors.push(`The flavor profile is predominantly <strong class="element-${primaryEl}">${capitalizeFirstLetter(primaryEl)}</strong>`);
    }
  }
  
  return factors;
}

/**
 * Get compound factors that influence the elements
 * @param {Object} analysis - Tea analysis
 * @returns {string[]} Array of factor descriptions
 */
function getCompoundFactors(analysis) {
  const factors = [];
  
  // Check if tea is explicitly shade-grown based on processing methods
  const isShadeGrown = analysis.processingMethods && 
                      analysis.processingMethods.some(method => 
                        method.toLowerCase() === 'shade-grown');
  
  // Add caffeine and theanine levels
  if (analysis.caffeineLevel) {
    factors.push(`Caffeine level: <strong>${analysis.caffeineLevel}/10</strong>`);
  }
  
  if (analysis.lTheanineLevel) {
    factors.push(`L-Theanine level: <strong>${analysis.lTheanineLevel}/10</strong> ${isShadeGrown ? '<span class="shade-grown-indicator">Shade-Grown Tea</span>' : ''}`);
  }
  
  // Explain independent compound-element mappings (TCM aligned)
  factors.push(`<span class="compound-element-mapping">
    <strong>Independent Compound-Element Mappings (TCM Aligned):</strong><br>
    <div class="compound-mapping">
      <strong class="compound-name">Caffeine:</strong>
      <ul class="compound-elements">
        <li><span class="element-fire">Fire (55%)</span>: Heart Yang stimulation, energizing</li>
        <li><span class="element-wood">Wood (25%)</span>: Liver Qi mobilization, upward movement</li>
        <li><span class="element-earth">Earth (10%)</span>: Spleen metabolic support</li>
        <li><span class="element-water">Water (5%)</span>: Minor Kidney Yang stimulation</li>
        <li><span class="element-metal">Metal (5%)</span>: Minimal Lung relationship</li>
      </ul>
    </div>
    <div class="compound-mapping">
      <strong class="compound-name">L-Theanine:</strong>
      <ul class="compound-elements">
        <li><span class="element-water">Water (65%)</span>: Kidney Yin nourishment, calming</li>
        <li><span class="element-fire">Fire (25%)</span>: Heart Shen stabilization, mental tranquility</li>
        <li><span class="element-metal">Metal (5%)</span>: Lung Qi refinement, mental clarity</li>
        <li><span class="element-wood">Wood (5%)</span>: Minor Liver calming effect</li>
        <li><span class="element-earth">Earth (0%)</span>: No significant Spleen effect</li>
      </ul>
    </div>
  </span>`);
  
  // Special note for shade-grown teas
  if (isShadeGrown) {
    factors.push(`<span class="compound-element-mapping shade-grown">
      <strong>Shade-Grown Tea Characteristics:</strong><br>
      <p>Shade-grown cultivation significantly increases <span class="element-water">L-theanine</span> and forces the tea plant to seek light, strengthening <span class="element-wood">Wood</span> element characteristics.</p>
      <ul>
        <li><strong>Enhanced Wood (Seeking Growth):</strong> Plants elongate to find sunlight, embodying upward Wood energy</li>
        <li><strong>Rich Water (Yin Preservation):</strong> Shade preserves moisture and cooling properties</li>
        <li><strong>Increased Chlorophyll:</strong> Deeper green color and richer umami flavor</li>
        <li><strong>TCM Effects:</strong> <span class="tcm-term" title="Brain and consciousness">Shen</span> calming with uplifting clarity</li>
      </ul>
    </span>`);
  }
  
  // Thermal properties
  if (analysis.components?.compounds?.thermalQuality) {
    factors.push(`<span class="compound-element-mapping thermal-property">
      <strong>Thermal Property:</strong> <span class="thermal-quality">${analysis.components.compounds.thermalQuality}</span>
      <div class="thermal-explanation">
        <p>Thermal properties emerge from the balance between warming caffeine and cooling L-theanine effects. This directly influences element distribution:</p>
        <ul>
          <li><strong>Cooling properties</strong> reduce Fire and enhance Water/Metal elements</li>
          <li><strong>Warming properties</strong> enhance Fire/Wood and reduce Water element</li>
          <li><strong>Neutral balance</strong> promotes Earth element (central balance)</li>
        </ul>
      </div>
    </span>`);
  }
  
  // Add information about specific compound synergies
  factors.push(`<span class="compound-element-mapping synergies">
    <strong>Compound Synergies (Beyond Simple Ratios):</strong><br>
    • <strong>Shade-grown synergy:</strong> High L-theanine (≥7) with moderate caffeine (3-6) enhances Water and Wood elements<br>
    • <strong>High-caffeine synergy:</strong> Very high caffeine (≥8) with low L-theanine (≤3) increases Fire and Wood elements<br>
    • <strong>Balanced synergy:</strong> Moderate levels of both compounds enhances Earth element (central balance)<br>
    • <strong>Yin-nourishing synergy:</strong> Very high L-theanine (≥8) with low caffeine (≤3) significantly boosts Water element
  </span>`);
  
  // Add TCM cycles information with clearer visualization
  factors.push(`<span class="compound-element-mapping tcm-cycles">
    <strong>TCM Element Interactions:</strong><br>
    <div class="tcm-cycle-explanation">
      <p>The Five Elements interact through two primary cycles that are applied in our model:</p>
      
      <p><strong>1. Generating Cycle</strong> (<span class="tcm-term" title="Nourishing cycle">Sheng Cycle</span>):</p>
      <ul class="tcm-cycles-list">
        <li><span class="element-wood">Wood</span> generates <span class="element-fire">Fire</span> (trees fuel flames)</li>
        <li><span class="element-fire">Fire</span> generates <span class="element-earth">Earth</span> (ash nourishes soil)</li>
        <li><span class="element-earth">Earth</span> generates <span class="element-metal">Metal</span> (earth forms minerals)</li>
        <li><span class="element-metal">Metal</span> generates <span class="element-water">Water</span> (metal attracts condensation)</li>
        <li><span class="element-water">Water</span> generates <span class="element-wood">Wood</span> (water nourishes trees)</li>
      </ul>
      
      <p><strong>2. Controlling Cycle</strong> (<span class="tcm-term" title="Restraining cycle">Ke Cycle</span>):</p>
      <ul class="tcm-cycles-list">
        <li><span class="element-wood">Wood</span> controls <span class="element-earth">Earth</span> (roots break soil)</li>
        <li><span class="element-fire">Fire</span> controls <span class="element-metal">Metal</span> (fire melts metal)</li>
        <li><span class="element-earth">Earth</span> controls <span class="element-water">Water</span> (earth contains water)</li>
        <li><span class="element-metal">Metal</span> controls <span class="element-wood">Wood</span> (axe cuts trees)</li>
        <li><span class="element-water">Water</span> controls <span class="element-fire">Fire</span> (water extinguishes fire)</li>
      </ul>
      
      <p>Our model adjusts element scores to respect these natural relationships, creating a more authentic TCM analysis.</p>
    </div>
  </span>`);
  
  // Add compound balance information
  if (analysis.components?.compounds) {
    const compounds = analysis.components.compounds;
    
    if (compounds.ratio) {
      const ratio = compounds.ratio.toFixed(2);
      factors.push(`L-Theanine to Caffeine ratio: <strong>${ratio}</strong> ${getCompoundRatioExplanation(ratio)}`);
    }
    
    if (compounds.thermalQuality) {
      factors.push(`Thermal quality: <strong>${compounds.thermalQuality}</strong>`);
    }
    
    if (compounds.primaryNature) {
      factors.push(`Compound nature: <strong>${compounds.primaryNature}</strong>`);
    }
    
    if (compounds.primaryElement) {
      const primaryEl = compounds.primaryElement;
      factors.push(`Compounds primarily influence <strong class="element-${primaryEl}">${capitalizeFirstLetter(primaryEl)}</strong> element`);
    }
    
    // Add TCM analysis if available
    if (compounds.tcmAnalysis) {
      factors.push(`TCM analysis: <strong>${compounds.tcmAnalysis}</strong>`);
    }
  }
  
  return factors;
}

/**
 * Get explanation of what a specific L-Theanine to Caffeine ratio means
 * @param {number} ratio - L-Theanine to Caffeine ratio
 * @returns {string} Explanation of the ratio significance
 */
function getCompoundRatioExplanation(ratio) {
  const ratioNum = parseFloat(ratio);
  
  if (ratioNum >= 2.5) {
    return `<span class="ratio-explanation">(High ratio: strongly <span class="element-water">Water</span> dominant, very calming)</span>`;
  } else if (ratioNum >= 1.8) {
    return `<span class="ratio-explanation">(Balanced but <span class="element-water">Water</span> leaning, calming with focus)</span>`;
  } else if (ratioNum >= 1.0) {
    return `<span class="ratio-explanation">(Balanced, good focus with moderate energy)</span>`;
  } else if (ratioNum >= 0.5) {
    return `<span class="ratio-explanation">(Balanced but <span class="element-fire">Fire</span> leaning, energizing with some calm)</span>`;
  } else {
    return `<span class="ratio-explanation">(Low ratio: strongly <span class="element-fire">Fire</span> dominant, very stimulating)</span>`;
  }
}

/**
 * Get processing factors that influence the elements
 * @param {Object} analysis - Tea analysis
 * @returns {string[]} Array of factor descriptions
 */
function getProcessingFactors(analysis) {
  const factors = [];
  
  if (analysis.processingMethods && analysis.processingMethods.length > 0) {
    factors.push(`Key processing methods: <strong>${analysis.processingMethods.join(', ')}</strong>`);
    
    // Add processing-element mapping explanation
    factors.push(`<span class="compound-element-mapping">
      <strong>Processing-Element Mapping:</strong><br>
      • <span class="element-wood">Non-oxidized, Fresh</span>: Associated with <strong class="element-wood">Wood</strong> element<br>
      • <span class="element-fire">High heat, Roasted</span>: Associated with <strong class="element-fire">Fire</strong> element<br>
      • <span class="element-earth">Moderate oxidation</span>: Associated with <strong class="element-earth">Earth</strong> element<br>
      • <span class="element-metal">Full oxidation, Dried</span>: Associated with <strong class="element-metal">Metal</strong> element<br>
      • <span class="element-water">Fermented, Aged</span>: Associated with <strong class="element-water">Water</strong> element
    </span>`);
    
    if (analysis.components?.processing?.primaryElement) {
      const primaryEl = analysis.components.processing.primaryElement;
      factors.push(`Processing primarily influences <strong class="element-${primaryEl}">${capitalizeFirstLetter(primaryEl)}</strong>`);
    }
    
    // Add oxidation level if available
    if (analysis.oxidationLevel) {
      factors.push(`Oxidation level: <strong>${analysis.oxidationLevel}/10</strong>`);
    }
  }
  
  return factors;
}

/**
 * Get geography factors that influence the elements
 * @param {Object} analysis - Tea analysis
 * @returns {string[]} Array of factor descriptions
 */
function getGeographyFactors(analysis) {
  const factors = [];
  
  if (analysis.origin) {
    factors.push(`Origin: <strong>${analysis.origin}</strong>`);
  }
  
  if (analysis.geography) {
    const geo = analysis.geography;
    
    if (geo.altitude) {
      factors.push(`Altitude: <strong>${geo.altitude} meters</strong>`);
    }
    
    if (geo.humidity) {
      factors.push(`Humidity: <strong>${geo.humidity}%</strong>`);
    }
    
    if (geo.temperature) {
      factors.push(`Average temperature: <strong>${geo.temperature}°C</strong>`);
    }
  }
  
  // Add geography-element mapping explanation
  factors.push(`<span class="compound-element-mapping">
    <strong>Geography-Element Mapping:</strong><br>
    • <span class="element-wood">High rainfall, Lush</span>: Associated with <strong class="element-wood">Wood</strong> element<br>
    • <span class="element-fire">Hot climate, High solar</span>: Associated with <strong class="element-fire">Fire</strong> element<br>
    • <span class="element-earth">Moderate elevation, Balanced</span>: Associated with <strong class="element-earth">Earth</strong> element<br>
    • <span class="element-metal">High altitude, Dry climate</span>: Associated with <strong class="element-metal">Metal</strong> element<br>
    • <span class="element-water">Cool climate, High humidity</span>: Associated with <strong class="element-water">Water</strong> element
  </span>`);
  
  // Add terrain character if available
  if (analysis.components?.geography?.terrainCharacter) {
    factors.push(`Terrain character: <strong>${analysis.components.geography.terrainCharacter}</strong>`);
  }
  
  // Add primary element influenced by geography
  if (analysis.components?.geography?.primaryElement) {
    const primaryEl = analysis.components.geography.primaryElement;
    factors.push(`Geography primarily influences <strong class="element-${primaryEl}">${capitalizeFirstLetter(primaryEl)}</strong>`);
  }
  
  return factors;
} 