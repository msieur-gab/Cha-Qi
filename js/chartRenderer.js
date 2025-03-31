// chartRenderer.js
// Handles rendering of charts for tea analysis visualization

/**
 * Draw radar chart for element distribution
 * @param {Object} elements - Element distribution object with values for each element (wood, fire, earth, metal, water)
 */
export function drawElementChart(elements) {
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

/**
 * Draw seasonality radar chart
 * @param {Object} seasonality - Seasonality data object with scores for each season
 */
export function drawSeasonalityChart(seasonality) {
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