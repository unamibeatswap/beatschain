/**
 * Transform extracted content to Sanity format
 * 
 * This script takes the extracted content from pages and transforms it
 * into a format that can be imported into Sanity CMS.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, '../../sanity-content');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Find all extracted content files
const extractedFiles = glob.sync(path.join(__dirname, '../../extracted-content/*.json'));

console.log(`🔄 Transforming ${extractedFiles.length} content files to Sanity format...`);

// Process each extracted file
const sanityDocuments = extractedFiles.map(file => {
  const fileName = path.basename(file);
  const pageName = path.basename(file, '.json');
  
  console.log(`Processing: ${pageName}`);
  
  // Load extracted content
  const extractedData = JSON.parse(fs.readFileSync(file, 'utf8'));
  
  // Transform to Sanity document
  return {
    _type: 'page',
    title: extractedData.title,
    slug: { 
      _type: 'slug', 
      current: pageName 
    },
    content: transformToPortableText(extractedData.content, pageName),
    seo: {
      metaTitle: extractedData.title,
      metaDescription: extractedData.description || `BeatsChain - ${extractedData.title}`
    }
  };
});

// Save the transformed documents
const outputPath = path.join(outputDir, 'pages.json');
fs.writeFileSync(outputPath, JSON.stringify(sanityDocuments, null, 2));

console.log(`✅ Transformed content saved to: ${outputPath}`);
console.log('🎉 Transformation complete!');

/**
 * Transform HTML content to Portable Text format
 * This is a simplified version - a real implementation would use a proper HTML parser
 */
function transformToPortableText(content, pageName) {
  // For this simplified version, we'll create a basic block of text
  // A real implementation would parse HTML and convert to proper Portable Text
  
  if (!content) {
    return [
      {
        _type: 'block',
        _key: `${pageName}-placeholder`,
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: `${pageName}-placeholder-span`,
            text: `Content for ${pageName} page`,
            marks: []
          }
        ]
      }
    ];
  }
  
  // Very basic transformation - just wrapping the content in a block
  return [
    {
      _type: 'block',
      _key: `${pageName}-content`,
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: `${pageName}-content-span`,
          text: content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(),
          marks: []
        }
      ]
    }
  ];
}