const localFlowerData = require('../assets/data/flower_data.json');

console.log('Total items in localFlowerData:', localFlowerData.length);

let withUrl = 0;
let withoutUrl = 0;

localFlowerData.forEach(f => {
  if (f.image_url && typeof f.image_url === 'string' && f.image_url.trim().length > 0) {
    withUrl++;
  } else {
    withoutUrl++;
  }
});

console.log('Items WITH image_url:', withUrl);
console.log('Items WITHOUT image_url:', withoutUrl);
