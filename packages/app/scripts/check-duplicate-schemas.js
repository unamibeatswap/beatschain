/**
 * Check for duplicate Sanity schemas
 * 
 * This script scans the Sanity schemas directory for duplicate schema types
 * and reports any conflicts.
 */

const fs = require('fs');
const path = require('path');

// Path to the schemas directory
const schemasDir = path.join(__dirname, '../sanity/schemas');

// Function to extract schema names from a file
function extractSchemaNames(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Look for defineType({ name: 'schemaName' }) patterns
    const defineTypeRegex = /defineType\(\s*{\s*name:\s*['"]([^'"]+)['"]/g;
    const matches = [...content.matchAll(defineTypeRegex)];
    
    return matches.map(match => ({
      name: match[1],
      file: path.basename(filePath)
    }));
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return [];
  }
}

// Function to scan directory for schema files
function scanDirectory(dir) {
  const schemaFiles = [];
  
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Recursively scan subdirectories
      schemaFiles.push(...scanDirectory(filePath));
    } else if (file.endsWith('.ts') || file.endsWith('.js')) {
      schemaFiles.push(filePath);
    }
  }
  
  return schemaFiles;
}

// Main function
function checkDuplicateSchemas() {
  console.log('Checking for duplicate Sanity schemas...');
  
  // Get all schema files
  const schemaFiles = scanDirectory(schemasDir);
  console.log(`Found ${schemaFiles.length} schema files`);
  
  // Extract schema names from each file
  const schemas = [];
  for (const file of schemaFiles) {
    schemas.push(...extractSchemaNames(file));
  }
  console.log(`Found ${schemas.length} schema definitions`);
  
  // Check for duplicates
  const schemaMap = {};
  const duplicates = [];
  
  for (const schema of schemas) {
    if (schemaMap[schema.name]) {
      duplicates.push({
        name: schema.name,
        files: [schemaMap[schema.name].file, schema.file]
      });
    } else {
      schemaMap[schema.name] = schema;
    }
  }
  
  // Report results
  if (duplicates.length > 0) {
    console.log('\n⚠️ Found duplicate schemas:');
    for (const dup of duplicates) {
      console.log(`  - "${dup.name}" defined in: ${dup.files.join(', ')}`);
    }
    console.log('\nDuplicate schemas can cause conflicts. Please resolve these issues.');
  } else {
    console.log('\n✅ No duplicate schemas found!');
  }
}

// Run the check
checkDuplicateSchemas();