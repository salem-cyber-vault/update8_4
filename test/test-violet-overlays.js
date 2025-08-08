#!/usr/bin/env node

// Simple test to validate violetRoomOverlays.json
const fs = require('fs');
const path = require('path');

console.log('Testing violetRoomOverlays.json...\n');

try {
  // Read and parse the JSON file
  const filePath = path.join(__dirname, '../src/data/violetRoomOverlays.json');
  const rawData = fs.readFileSync(filePath, 'utf8');
  const overlayData = JSON.parse(rawData);
  
  console.log('✓ JSON is valid and parseable');
  
  // Validate structure
  if (!overlayData._meta) {
    throw new Error('Missing _meta section');
  }
  console.log('✓ _meta section present');
  
  if (!overlayData.overlays || !Array.isArray(overlayData.overlays)) {
    throw new Error('Missing or invalid overlays array');
  }
  console.log('✓ overlays array present');
  
  // Validate each overlay
  const ids = new Set();
  overlayData.overlays.forEach((overlay, index) => {
    if (!overlay.id) {
      throw new Error(`Overlay ${index} missing id`);
    }
    if (ids.has(overlay.id)) {
      throw new Error(`Duplicate ID: ${overlay.id}`);
    }
    ids.add(overlay.id);
    
    if (!overlay.text) {
      throw new Error(`Overlay ${overlay.id} missing text`);
    }
    if (!overlay.category) {
      throw new Error(`Overlay ${overlay.id} missing category`);
    }
    if (!overlay.metadata) {
      throw new Error(`Overlay ${overlay.id} missing metadata`);
    }
  });
  
  console.log(`✓ All ${overlayData.overlays.length} overlays have unique IDs and required fields`);
  
  // Display summary
  console.log('\nSummary:');
  console.log(`- Total overlays: ${overlayData.overlays.length}`);
  console.log(`- Categories: ${[...new Set(overlayData.overlays.map(o => o.category))].join(', ')}`);
  console.log(`- Version: ${overlayData._meta.version}`);
  
  console.log('\n✅ All tests passed! violetRoomOverlays.json is valid and well-structured.');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}