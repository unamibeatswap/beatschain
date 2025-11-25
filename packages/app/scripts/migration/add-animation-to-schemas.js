/**
 * Add animation options to enterprise block schemas
 * 
 * This script updates the enterpriseBlocks.ts file to add animation options
 * to all block types.
 */

const fs = require('fs');
const path = require('path');

// Path to the enterpriseBlocks.ts file
const schemaPath = path.join(__dirname, '../../sanity/schemas/enterpriseBlocks.ts');

// Read the file
console.log('Reading schema file...');
const schemaContent = fs.readFileSync(schemaPath, 'utf8');

// Animation fields to add
const animationFields = `defineField({
      name: 'animation',
      title: 'Animation',
      type: 'object',
      fields: [
        defineField({
          name: 'type',
          title: 'Animation Type',
          type: 'string',
          options: {
            list: [
              { title: 'None', value: 'none' },
              { title: 'Fade In', value: 'fadeIn' },
              { title: 'Slide Up', value: 'slideUp' },
              { title: 'Slide In', value: 'slideIn' },
              { title: 'Zoom In', value: 'zoomIn' },
              { title: 'Bounce', value: 'bounce' }
            ]
          },
          initialValue: 'none'
        }),
        defineField({
          name: 'delay',
          title: 'Delay (ms)',
          type: 'number',
          initialValue: 0
        }),
        defineField({
          name: 'duration',
          title: 'Duration (ms)',
          type: 'number',
          initialValue: 500
        })
      ]
    })`;

// Block types to update
const blockTypes = [
  'tabsBlock',
  'accordionBlock',
  'featureCardsBlock',
  'stepsBlock',
  'testimonialsBlock',
  'pricingTableBlock'
];

// Update each block type
let updatedContent = schemaContent;

blockTypes.forEach(blockType => {
  // Find the end of the fields array for this block type
  const fieldsEndRegex = new RegExp(`(name: '${blockType}'[\\s\\S]*?fields: \\[[\\s\\S]*?)(\\s*\\])`, 'g');
  
  // Check if animation field already exists
  if (!updatedContent.includes(`name: 'animation'`) || !updatedContent.match(fieldsEndRegex)) {
    // Add animation field before the end of the fields array
    updatedContent = updatedContent.replace(
      fieldsEndRegex,
      (match, p1, p2) => {
        // Check if there are existing fields
        if (p1.trim().endsWith(',')) {
          return `${p1}\n    ${animationFields}${p2}`;
        } else {
          return `${p1}\n    ${animationFields},${p2}`;
        }
      }
    );
  }
});

// Write the updated content back to the file
console.log('Writing updated schema file...');
fs.writeFileSync(schemaPath, updatedContent, 'utf8');

console.log('✅ Animation options added to all block types!');