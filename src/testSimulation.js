import { processFlowerSnapshot } from './logic/visionProcessor.js';
import fs from 'fs';

console.log('🌸 --- BLOSSOM LIKE A FLOWER: END-TO-END PIPELINE SIMULATION --- 🌸\n');

async function runSimulation() {
  const databasePath = './src/data/test_flowers_database.json';
  const database = JSON.parse(fs.readFileSync(databasePath, 'utf8'));
  
  // 1. Simulate snapping a photo of a Plumeria
  const mockImageUri = 'c:/Users/Ajit Reddy/Desktop/photos/my_plumeria_shrub.jpg';
  console.log(`[USER EVENT] Snapping photo: "${mockImageUri}"`);
  console.log('[PIPELINE] Invoking Vision AI processor...');

  // 2. Run the processing pipeline
  try {
    const result = await processFlowerSnapshot(mockImageUri, database);

    console.log('\n[VISION RESULT] Classification Complete:');
    console.log(`  - Genus Detected:  "${result.query.genus}"`);
    console.log(`  - Color Extracted: "${result.query.color}"`);

    // 3. Output UI states
    console.log('\n[CONFIRMATION MODAL] Verifying match with user...');
    if (result.matchedFlower) {
      const flower = result.matchedFlower;
      console.log('  - Dialog Prompt: "Does your snapped flower match this variety?"');
      console.log(`  - Ref Botanical: "${flower.botanical_name}"`);
      console.log(`  - Ref Commons:   "${flower.common_name}"`);
      
      console.log('\n[REVEAL CARD] User Confirmed! Rendering FlowerDetailCard...');
      console.log('  ------------------------------------------------------------');
      console.log(`  | HERO TITLE:   ${flower.mothers_name.toUpperCase()}`);
      console.log(`  | BOTANICAL:    ${flower.botanical_name}`);
      console.log(`  | SIGNIFICANCE: "${flower.significance}"`);
      console.log(`  | COMMON NAME:  ${flower.common_name}`);
      console.log(`  | FORM SHAPE:   ${flower.criteria_form_shape}`);
      console.log(`  | LEAF SHAPE:   ${flower.criteria_leaf_shape}`);
      console.log('  ------------------------------------------------------------');
    } else {
      console.warn('  - [WARNING] No matching flower found in the local database for this combination.');
    }
  } catch (error) {
    console.error('[FAIL] Simulation failed with error:', error);
  }
}

runSimulation();
