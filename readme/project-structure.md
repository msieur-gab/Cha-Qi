# Five Elements Tea Analyzer - Project Structure

This document outlines the structure of the Five Elements Tea Analyzer project, which implements a Traditional Chinese Medicine (TCM) approach to analyzing teas based on the Five Elements theory.

## Main Project Structure

```
five-elements-tea-analyzer/
│
├── index.html                 # Main HTML page for web interface
├── styles.css                 # CSS styles for the web interface
├── app.js                     # Main application logic for the web interface
├── sample-analysis.js         # Example script demonstrating analysis exports
│
└── tea-tcm-system/            # Core TCM tea analysis system
    ├── TeaTcmAnalyzer.js      # Main analyzer class
    │
    ├── config/
    │   └── TcmSystemConfig.js # Configuration management
    │
    ├── calculators/
    │   ├── ElementsCalculator.js        # Combines all element mappings
    │   ├── FlavorElementMapper.js       # Maps flavors to elements
    │   ├── CompoundElementMapper.js     # Maps compounds to elements
    │   ├── ProcessingElementMapper.js   # Maps processing to elements
    │   ├── GeographyElementMapper.js    # Maps geography to elements
    │   └── EffectsDeriver.js            # Derives effects from elements
    │
    └── data/
        ├── ElementDefinitions.js        # Five Elements definitions
        ├── FlavorElementMappings.js     # Maps flavors to elements
        ├── ProcessingElementMappings.js # Maps processing to elements
        └── ElementCombinationEffects.js # Element combination effects
```

## Detailed Component Description

### Web Interface Components

- **index.html**: Main HTML page for the application, providing a form for tea data input and sections for displaying analysis results.
- **styles.css**: CSS styles for the web interface, including element colors, layout, and responsive design.
- **app.js**: Main client-side JavaScript that handles user interactions, form submissions, and displaying analysis results.
- **sample-analysis.js**: Example script demonstrating programmatic use of the analyzer for batch analysis and exports.

### Core System Components

#### Main Classes

- **TeaTcmAnalyzer.js**: The main class that orchestrates the entire analysis process, bringing together all components.
- **TcmSystemConfig.js**: Handles configuration management with customizable parameters for the analysis system.

#### Calculators and Mappers

- **ElementsCalculator.js**: Combines all element mappings with proper weighting (40% flavor, 30% compounds, 20% processing, 10% geography).
- **FlavorElementMapper.js**: Maps tea flavor profiles to Five Elements (wood, fire, earth, metal, water).
- **CompoundElementMapper.js**: Maps caffeine and L-theanine levels to Five Elements, considering their ratio and interactions.
- **ProcessingElementMapper.js**: Maps tea processing methods to Five Elements based on traditional associations.
- **GeographyElementMapper.js**: Maps geographical factors (altitude, humidity, etc.) to Five Elements.
- **EffectsDeriver.js**: Derives TCM effects, benefits, and recommendations from the Five Element analysis.

#### Data Definitions

- **ElementDefinitions.js**: Defines the Five Elements and their properties, relationships, and associations.
- **FlavorElementMappings.js**: Comprehensive mapping of over 100 tea flavors to the Five Elements.
- **ProcessingElementMappings.js**: Mappings of tea processing methods to the Five Elements.
- **ElementCombinationEffects.js**: Defines effects and properties of various Five Element combinations.

## Flow of Analysis

1. User provides tea data through the web interface or programmatically.
2. The tea data is sent to TeaTcmAnalyzer.
3. TeaTcmAnalyzer coordinates component-specific mappings:
   - Flavors → Elements
   - Compounds (caffeine, L-theanine) → Elements
   - Processing methods → Elements
   - Geography → Elements
4. ElementsCalculator combines these mappings with configured weights.
5. Element interactions are applied using TCM principles.
6. EffectsDeriver translates elements into TCM terminology and specific effects.
7. Results are returned and displayed in the web interface.

## Key Features

- **Five Elements Framework**: Implements Traditional Chinese Medicine's Five Elements (Wu Xing) theory for tea analysis.
- **Holistic Analysis**: Considers multiple aspects of tea (flavor, compounds, processing, geography).
- **Weighted Approach**: Prioritizes flavor (40%) and compounds (30%) in analysis, matching TCM principles.
- **Personalization**: Supports personalized recommendations based on user's TCM constitution.
- **Visualization**: Provides radar charts and progress bars for element distribution.
- **Sample Teas**: Includes predefined sample teas for easy demonstration.
- **TCM Terminology**: Incorporates authentic TCM concepts like nature, flavor, and meridians.
- **Tea Comparison**: Supports comparison between different teas based on element similarity.

## Implementation Technologies

- **HTML5/CSS3**: For the user interface structure and styling
- **JavaScript (ES6+)**: For core logic and client-side functionality
- **Chart.js**: For radar chart visualization of Five Element distribution
- **CSS Grid/Flexbox**: For responsive layout
- **ES6 Modules**: For component organization
- **Font Awesome**: For icons

## Future Expansion Possibilities

- **Database Integration**: Add backend database to store tea analyses
- **User Accounts**: Allow users to save their analyses and preferences
- **Advanced Visualization**: Add more visualization options for element interactions
- **Mobile App**: Develop native mobile application
- **API Access**: Provide API endpoints for third-party integration
- **Machine Learning**: Add ML capabilities to improve analysis based on feedback
