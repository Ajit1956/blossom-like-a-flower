const fs = require('fs');
const content = fs.readFileSync('src/ui/components/library/AttributeFilterView.js', 'utf8');

console.log('AttributeFilterView.js size:', content.length, 'bytes');
console.log('Contains expo-image import:', content.includes("import { Image } from 'expo-image';"));
console.log('Contains isFilterApplied state:', content.includes('const [isFilterApplied, setIsFilterApplied] = useState(false);'));
console.log('Contains Show Matching Flowers button:', content.includes('Show Matching Flowers'));
