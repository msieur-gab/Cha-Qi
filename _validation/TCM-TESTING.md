# TCM Flavor Mapping Testing Guide

This document provides guidance on how to test and validate the TCM (Traditional Chinese Medicine) flavor-to-element mappings in the FlavorProfileMapper system.

## Key Improvements

1. **Stricter Element-Flavor Associations**
   - Primary elements now receive 95% weight (more aligned with classical TCM)
   - Secondary element associations reduced to 5% for cleaner mappings

2. **Fresh vs. Mature Vegetation Distinction**
   - Added a dedicated `green_vegetal` category for fresh vegetation notes
   - Fresh vegetative notes (grassy, fresh, herbaceous) now correctly map to Wood (sour)
   - Mature/cooked vegetal notes remain mapped to Fire (bitter)

3. **Context-Sensitive Flavor Mapping**
   - "Malty" notes are interpreted differently when they appear with roasted notes
   - Roasted malty notes have Fire (bitter) component in addition to Earth (sweet)
   - Umami in Japanese green teas has elevated Wood element contribution

4. **Aged Tea Refinement**
   - Aged teas now properly emphasize Earth (sweet) due to fermentation's transformative nature
   - This aligns better with TCM's understanding of aging/fermentation processes

5. **Normalization Optimization**
   - Profiles with clear dominant flavors skip normalization to preserve strong TCM associations
   - Particularly important for profiles with pure flavor characteristics

6. **Enhanced Water Element Recognition**
   - Marine and mineral categories strengthened to 95% salty (Water element)
   - Added special detection for predominantly salty/water-oriented profiles
   - "Briny" now mapped directly to salty TCM flavor for stronger Water element association
   - Ensures purely salty profiles correctly produce >95% Water element

7. **Improved Japanese Green Tea Detection**
   - Special handling for umami in green tea context (Gyokuro-like teas)
   - Direct mapping for umami+green profiles to emphasize Wood (75%) and Water (15%)
   - Better alignment with traditional understanding of Japanese green teas

## Testing the Improvements

### Browser-Based Testing

1. Open the `tcm-edge-case-tests.html` file in your browser
2. Review the test cases and their results
3. Green "PASSED" indicators show that the test meets the expected TCM thresholds
4. Review the element distributions to ensure they align with TCM principles

### Real Tea Data Testing

1. Open the `hierarchical-test.html` file in your browser
2. This page tests the mapper against real-world tea profiles
3. Use the filtering options to view results for specific tea types
4. Note the match percentages at the top of the results
5. Review individual tea mappings to verify alignment with reference data

### Critical Test Cases

The edge case tests verify several important TCM principles:

1. **Pure Flavor Profiles**
   - A purely salty profile should produce >95% Water element
   - Direct TCM flavors should map strongly to their primary elements

2. **Flavor Combinations**
   - Citrus + Grassy should emphasize Wood (sour) and have some Fire (bitter)
   - This tests the green_vegetal category's Wood-dominant nature

3. **Context Sensitivity**
   - Malty alone should be primarily Earth (sweet)
   - Malty with roasted notes should have significant Fire (bitter) component
   - Umami in Japanese green tea context should significantly boost Wood element

4. **Vegetal Distinction**
   - Fresh green vegetal notes should emphasize Wood
   - Mature vegetal notes should emphasize Fire

5. **Aged Tea Profiles**
   - Aged tea profiles should now emphasize Earth (sweet)

6. **Water Element Recognition**
   - Profiles containing multiple salty/marine terms should produce >95% Water element
   - The `isSaltyWaterProfile()` method should correctly identify predominantly water-oriented profiles

## Validation Against TCM Sources

The revised mappings better align with these TCM principles:

- **Wood (Sour)**: Fresh, young, green, unprocessed, moving upward energy
- **Fire (Bitter)**: Mature, processed, transformative, upward dispersing
- **Earth (Sweet)**: Nourishing, centering, transformative (fermentation)
- **Metal (Pungent)**: Dispersing, aromatic, moving outward
- **Water (Salty)**: Descending, mineral, deep, substantial

## Expected Outcomes

- **Green Teas**: Should show higher Wood element due to fresh vegetal notes
- **Japanese Green Teas (Gyokuro)**: Should emphasize Wood (65-75%) with supportive Water (15-25%)
- **White Teas**: Should balance between Wood, Earth and slight Metal
- **Black Teas**: Should emphasize Fire (bitter) and Earth (sweet)
- **Oolong Teas**: Should vary based on oxidation level
- **Pu-erh Teas**: Aged versions should emphasize Earth due to fermentation
- **Marine Flavored Teas**: Seaweed, salt, and oceanic flavored teas should show >95% Water element

## Future Improvements

Consider these areas for future refinement:

1. Expand context sensitivity to other flavor notes
2. Further refinement of fermented tea categories
3. Additional test cases for complex flavor profiles
4. Integration with brewing parameters (temperature, time) which affect flavors
5. More granular analysis of salt/umami/savory flavor distinctions 