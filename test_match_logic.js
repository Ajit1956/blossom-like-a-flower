import { processFlowerSnapshot } from './src/logic/visionProcessor.js';
import fs from 'fs';

const dbPath = './src/data/test_flowers_database.json';
const database = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

async function test() {
  const uri = 'file:///var/mobile/Containers/Data/Application/CCC48072-AE50-4BCB-9B37-7C7E3475D9FD/Library/Caches/ExponentExperienceData/@anonymous/blossom-like-a-flower-5fb3684d-3bb3-48a8-b2d9-f1f0ab42ae80/Camera/E80AB543-3E7D-4F77-89C8-B8B05CEDB946.jpg';
  const hint = 'Jasmine';
  
  console.log(`Input URI: ${uri}`);
  console.log(`Input Hint: ${hint}`);
  
  const res = await processFlowerSnapshot(uri, database, hint);
  console.log('\nResult:');
  console.log(`Matched Flower Mother's Name: ${res.matchedFlower?.mothers_name}`);
  console.log(`Matched Flower ID:            ${res.matchedFlower?.id}`);
  console.log(`Matched Flower Image Path:    ${res.matchedFlower?.localImagePath}`);
}

test();
