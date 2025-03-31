# Changelog

## Code Cleanup and Consolidation - FlavorProfileMapper (2024)

- **Consolidated Flavor Mapping to a Single Implementation**
  - Renamed HierarchicalFlavorMapper to FlavorProfileMapper
  - Removed the redundant FlavorElementMapper implementation
  - Removed FlavorElementMappings.js as data is now self-contained in the mapper
  - Eliminated duplication in the codebase
  - Fixed calculation discrepancies by using a single consistent mapping approach

- **Improved Japanese Green Tea Calculations**
  - Added special case detection for umami in green tea context
  - Enhanced Wood element representation in Gyokuro-like teas
  - Added direct mapping for umami+green profiles to emphasize Wood (75%) and Water (15%)
  - Modified umami category distribution to better reflect traditional understanding

- **Code Structure Improvements**
  - Updated imports throughout the codebase
  - Removed deprecated test files
  - Made all mapper interfaces consistent
  - Updated documentation to reflect the new structure

## HierarchicalFlavorMapper Improvements - TCM Alignment Update

### Latest Updates - Water Element Enhancement (2024)

- **Strengthened Water Element Associations**
  - Adjusted marine and mineral categories to have 95% salty (Water) association
  - Added special handling for predominantly salty profiles
  - Changed "briny" from marine category to direct salty TCM flavor
  - Added detection for water-oriented flavor profiles
  - Fixed the "Purely Salty Profile" edge case test

### Core Element-Flavor Mapping Changes

- **Refined TCM Element Distributions**
  - Adjusted element weights to follow stricter classical TCM associations
  - Primary elements now receive 95% weight (up from 80%)
  - Secondary elements reduced to 5% (down from 10-20%)
  - Removed smaller cross-element contributions for cleaner mapping

- **Fresh vs. Mature Vegetative Note Distinction**
  - Created new `green_vegetal` category specifically for fresh vegetation
  - Green/fresh/grassy notes now correctly map to Wood (sour) element
  - Mature/cooked vegetal notes continue to map to Fire (bitter)
  - Reallocated notes between these categories based on TCM principles

- **Aged Tea Flavor Refinement**
  - Revised aged tea category to emphasize Earth (sweet) element
  - Previous mapping incorrectly emphasized Fire (bitter)
  - New mapping better reflects the transformative nature of fermentation in TCM

- **Context-Sensitive Flavor Processing**
  - Added specific handling for "malty" when it appears with roasted notes
  - Malty alone → Earth (sweet)
  - Malty with roasted notes → 60% Earth, 40% Fire
  - Laid groundwork for more context-sensitive flavor processing

- **Normalization Logic Optimization**
  - Modified normalization to preserve strong TCM associations
  - Profiles with dominant flavors now skip normalization
  - Ensures pure flavor profiles (e.g., purely salty) maintain their strong primary element association

### Category Distribution Adjustments

- Marine: Strengthened salty (Water) to 95% (from 80%)
- Mineral: Increased salty (Water) to 95% (from 70%)
- Citrus: Strengthened sour (Wood) association to 90% (from 80%)
- Spicy: Increased pungent (Metal) association to 95% (from 90%)
- Woody: Refined to 70% bitter / 30% sour (removed pungent component)
- Earthy: Adjusted to 70% sweet / 30% salty (better Earth emphasis)
- Roasted: Adjusted to 70% bitter / 30% sweet
- Caramel: Strengthened sweet (Earth) to 90% (from 80%)
- Tobacco: Adjusted to 70% bitter / 30% pungent
- Umami: Refined to 70% salty / 20% sweet / 10% bitter

### Code Structure Improvements

- Added `isSaltyWaterProfile()` method to detect predominantly salty profiles
- Added `profileContainsAny()` helper method to check for specific notes
- Added `hasDominantFlavor()` method to identify strongly dominant flavors
- Added test methods for edge case validation
- Improved code comments and documentation

### Testing & Validation

- Created comprehensive browser-based test page for TCM edge cases
- Added validation thresholds for critical TCM principles
- Documented expected outcomes and validation criteria
- Ensured compatibility with existing tea database testing

### Documentation

- Added TCM-TESTING.md with guidance on testing the improved mappings
- Created CHANGELOG.md to track modifications
- Updated HTML test pages with explanations of improvements
- Added clear links between different test resources 