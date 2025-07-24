// Run this script with: node csv-to-json.js
// Make sure to run: npm install csv-parse
// It will read uscities.csv and output us-states-cities.json in the same directory

const fs = require('fs');
const path = require('path');
const parse = require('csv-parse/lib/sync');

const csvPath = path.join(__dirname, 'uscities.csv');
const outPath = path.join(__dirname, 'us-states-cities.json');
const stateExclude = new Set(['HI']); // Exclude Hawaii

const csv = fs.readFileSync(csvPath, 'utf8');
const records = parse(csv, {
  columns: true,
  skip_empty_lines: true
});

const mapping = {};
for (const row of records) {
  const state = row['state_id'];
  const city = row['city'];
  if (!state || !city || stateExclude.has(state)) continue;
  if (!mapping[state]) mapping[state] = new Set();
  mapping[state].add(city);
}
// Convert sets to sorted arrays
const out = {};
Object.keys(mapping).forEach(state => {
  out[state] = Array.from(mapping[state]).sort((a, b) => a.localeCompare(b));
});
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log('us-states-cities.json generated successfully!');
