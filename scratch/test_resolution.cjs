const f1 = require('../assets/data/english_common_names_index.json');
const f2 = require('../assets/data/english_common_names_500_ids.json');
const f3 = require('../assets/data/english_common_names_500.json');

console.log('english_common_names_index.json loaded successfully. Total names:', f1.names ? f1.names.length : 'N/A');
console.log('english_common_names_500_ids.json loaded successfully. Total distinct names:', f2.total_distinct_names);
console.log('english_common_names_500.json loaded successfully. Length:', f3.length);
