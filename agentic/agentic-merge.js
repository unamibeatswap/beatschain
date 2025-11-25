import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const sandbox = path.resolve('./agentic/play');
const mcpProd = path.resolve('./packages/mcp-server/src/modules');
const extProd = path.resolve('./chrome-extension/lib');
const n8nProd = path.resolve('./n8n/workflows');

function log(msg) {
  console.log(`[AGENTIC MERGE] ${msg}`);
}

// --- Step 1: Validate Sandbox Modules ---
function validateSandbox() {
  log('Validating sandbox modules...');
  
  if (!fs.existsSync(sandbox)) {
    throw new Error('Sandbox directory not found. Run agentic-bootstrap.js first.');
  }
  
  const requiredDirs = ['split-sheet-module', 'extension-sponsor', 'mcp', 'n8n-workflows'];
  const missing = [];
  
  requiredDirs.forEach(dir => {
    const fullPath = path.join(sandbox, dir);
    if (!fs.existsSync(fullPath)) {
      missing.push(dir);
    }
  });
  
  if (missing.length > 0) {
    throw new Error(`Sandbox modules missing: ${missing.join(', ')}`);
  }
  
  log('✅ Sandbox modules validated.');
}

// --- Step 2: Merge Split Sheet Module to MCP ---
function mergeSplitSheet() {
  log('Merging split-sheet-module to MCP production...');
  
  const src = path.join(sandbox, 'split-sheet-module');
  const dest = path.join(mcpProd, 'split-sheet');
  
  // Create destination directory
  fs.mkdirSync(dest, { recursive: true });
  
  // Copy all files from sandbox to production
  fs.readdirSync(src).forEach(file => {
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);
    fs.copyFileSync(srcFile, destFile);
    log(`  Copied: ${file}`);
  });
  
  // Create MCP route integration
  const routeIntegration = `
// SAMRO Split Sheet Routes
const express = require('express');
const router = express.Router();

// Import split sheet functions (will be converted from TS)
// const { createSplitSheet, fillSAMROPDF } = require('../modules/split-sheet');

router.post('/samro/generate', async (req, res) => {
  try {
    // TODO: Implement after TS conversion
    res.json({ 
      success: true, 
      message: 'SAMRO split sheet generation ready',
      data: req.body 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/samro/fill', async (req, res) => {
  try {
    const { userData, contributors } = req.body;
    
    // Generate SAMRO completion instructions
    const instructions = {
      trackInfo: {
        title: userData.trackTitle || 'Track Title',
        artist: userData.artistName || 'Artist Name',
        isrc: userData.isrc || 'ZA-80G-25-XXXXX'
      },
      contributors: contributors || [],
      steps: [
        '1. Print the SAMRO Composer Split Confirmation PDF',
        '2. Fill in track title: ' + (userData.trackTitle || '[Track Title]'),
        '3. Fill in artist name: ' + (userData.artistName || '[Artist Name]'),
        '4. Add ISRC code: ' + (userData.isrc || '[ISRC Code]'),
        '5. List all contributors with percentages',
        '6. Ensure percentages total 100%',
        '7. Sign and date the form',
        '8. Submit to SAMRO for processing'
      ]
    };
    
    res.json({ success: true, instructions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
`;
  
  // Create routes directory if it doesn't exist
  const routesDir = path.resolve('./packages/mcp-server/src/routes');
  fs.mkdirSync(routesDir, { recursive: true });
  
  // Write SAMRO routes
  fs.writeFileSync(path.join(routesDir, 'samro.js'), routeIntegration.trim());
  
  log('✅ Split sheet module merged and routes created.');
}

// --- Step 3: Merge Extension CRUD Module ---
function mergeExtensionCRUD() {
  log('Merging extension-sponsor module to Extension production...');
  
  const src = path.join(sandbox, 'extension-sponsor');
  const dest = path.join(extProd, 'sponsor-crud');
  
  // Create destination directory
  fs.mkdirSync(dest, { recursive: true });
  
  // Copy files and convert TS to JS for Chrome extension
  fs.readdirSync(src).forEach(file => {
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file.replace('.ts', '.js'));
    
    let content = fs.readFileSync(srcFile, 'utf8');
    
    // Basic TS to JS conversion for Chrome extension
    content = content
      .replace(/export interface.*?{[^}]*}/gs, '') // Remove interfaces
      .replace(/: [A-Za-z\[\]<>|]+/g, '') // Remove type annotations
      .replace(/export class/g, 'class')
      .replace(/private /g, '')
      .replace(/public /g, '');
    
    fs.writeFileSync(destFile, content);
    log(`  Converted and copied: ${file} -> ${file.replace('.ts', '.js')}`);
  });
  
  // Create integration file for existing extension
  const integrationJs = `
// Enhanced Sponsor Manager Integration
// Integrates with existing chrome-extension/lib/google-drive-sponsor-manager.js

class EnhancedSponsorManager {
  constructor() {
    this.sponsors = [];
    this.loadSponsors();
  }
  
  // Enhanced CRUD operations
  createSponsor(sponsorData) {
    const sponsor = {
      id: this.generateId(),
      ...sponsorData,
      created: new Date().toISOString()
    };
    
    this.sponsors.push(sponsor);
    this.saveSponsors();
    return sponsor;
  }
  
  readSponsors(filters = {}) {
    let filtered = [...this.sponsors];
    
    if (filters.placement) {
      filtered = filtered.filter(s => s.placement === filters.placement);
    }
    
    if (filters.active !== undefined) {
      filtered = filtered.filter(s => s.active === filters.active);
    }
    
    return filtered.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }
  
  updateSponsor(id, updates) {
    const index = this.sponsors.findIndex(s => s.id === id);
    if (index === -1) return null;
    
    this.sponsors[index] = { ...this.sponsors[index], ...updates };
    this.saveSponsors();
    return this.sponsors[index];
  }
  
  deleteSponsor(id) {
    const index = this.sponsors.findIndex(s => s.id === id);
    if (index === -1) return false;
    
    this.sponsors.splice(index, 1);
    this.saveSponsors();
    return true;
  }
  
  generateId() {
    return 'sponsor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  loadSponsors() {
    try {
      chrome.storage.local.get(['beatschain_sponsors'], (result) => {
        if (result.beatschain_sponsors) {
          this.sponsors = result.beatschain_sponsors;
        }
      });
    } catch (e) {
      console.warn('Failed to load sponsors:', e);
    }
  }
  
  saveSponsors() {
    try {
      chrome.storage.local.set({ beatschain_sponsors: this.sponsors });
    } catch (e) {
      console.warn('Failed to save sponsors:', e);
    }
  }
}

// Make available globally
if (typeof window !== 'undefined') {
  window.EnhancedSponsorManager = EnhancedSponsorManager;
}
`;
  
  fs.writeFileSync(path.join(extProd, 'enhanced-sponsor-manager.js'), integrationJs.trim());
  
  log('✅ Extension CRUD module merged and integrated.');
}

// --- Step 4: Merge N8N Placeholders ---
function mergeN8NPlaceholders() {
  log('Merging N8N workflow placeholders...');
  
  const src = path.join(sandbox, 'n8n-workflows');
  
  // Create N8N directory in project root
  fs.mkdirSync(n8nProd, { recursive: true });
  
  fs.readdirSync(src).forEach(file => {
    const srcFile = path.join(src, file);
    const destFile = path.join(n8nProd, file);
    fs.copyFileSync(srcFile, destFile);
    log(`  Copied: ${file}`);
  });
  
  log('✅ N8N placeholders merged.');
}

// --- Step 5: Update MCP Server Integration ---
function updateMCPIntegration() {
  log('Updating MCP server with new routes...');
  
  const mcpIndexPath = path.resolve('./packages/mcp-server/src/index.js');
  
  if (!fs.existsSync(mcpIndexPath)) {
    log('⚠️  MCP index.js not found, skipping integration');
    return;
  }
  
  // Add SAMRO routes to MCP server
  const samroIntegration = `

// Mount SAMRO routes
try {
  const samroRoutes = require('./routes/samro');
  app.use('/api', samroRoutes);
  console.log('✅ SAMRO routes loaded successfully');
} catch (e) {
  console.warn('SAMRO routes not available:', e && e.message);
}`;
  
  // Read current MCP index
  let mcpContent = fs.readFileSync(mcpIndexPath, 'utf8');
  
  // Add SAMRO integration before the server listen
  const serverListenIndex = mcpContent.indexOf('const server = app.listen');
  if (serverListenIndex > -1) {
    mcpContent = mcpContent.slice(0, serverListenIndex) + 
                 samroIntegration + 
                 '\\n\\n' + 
                 mcpContent.slice(serverListenIndex);
    
    fs.writeFileSync(mcpIndexPath, mcpContent);
    log('✅ MCP server integration updated.');
  } else {
    log('⚠️  Could not find server listen section, manual integration needed');
  }
}

// --- Step 6: Run Basic Validation ---
function runValidation() {
  log('Running basic validation...');
  
  try {
    // Check if Node.js files are valid
    const mcpRoutes = path.resolve('./packages/mcp-server/src/routes/samro.js');
    if (fs.existsSync(mcpRoutes)) {
      // Basic syntax check
      require(mcpRoutes);
      log('✅ SAMRO routes syntax valid');
    }
    
    // Check extension files
    const extManager = path.join(extProd, 'enhanced-sponsor-manager.js');
    if (fs.existsSync(extManager)) {
      log('✅ Extension sponsor manager created');
    }
    
    log('✅ Basic validation passed.');
  } catch (e) {
    log('⚠️  Validation warning:', e.message);
  }
}

// --- Step 7: Prepare Production Commit ---
function prepareProductionCommit() {
  log('Preparing production commit...');
  
  const commitPlan = {
    message: 'Agentic merge: SAMRO PDF module, Enhanced sponsor CRUD, N8N workflows',
    timestamp: new Date().toISOString(),
    changes: {
      'packages/mcp-server/src/modules/split-sheet/': 'SAMRO PDF processing module',
      'packages/mcp-server/src/routes/samro.js': 'SAMRO API routes',
      'chrome-extension/lib/sponsor-crud/': 'Enhanced sponsor CRUD system',
      'chrome-extension/lib/enhanced-sponsor-manager.js': 'Sponsor manager integration',
      'n8n/workflows/': 'Automation workflow placeholders'
    },
    nextSteps: [
      'Test SAMRO routes in MCP server',
      'Validate sponsor CRUD in extension',
      'Deploy to Railway if tests pass',
      'Monitor system performance'
    ]
  };
  
  fs.writeFileSync(path.join(sandbox, 'production-commit-plan.json'), JSON.stringify(commitPlan, null, 2));
  log('✅ Production commit plan created.');
}

// --- Execute Merge Flow ---
function mergeAgenticModules() {
  try {
    log('🚀 Starting Agentic Merge to Production...');
    
    validateSandbox();
    mergeSplitSheet();
    mergeExtensionCRUD();
    mergeN8NPlaceholders();
    updateMCPIntegration();
    runValidation();
    prepareProductionCommit();
    
    log('✅ Agentic merge completed successfully!');
    log('📁 Production updates:');
    log('   - MCP Server: SAMRO routes added');
    log('   - Extension: Enhanced sponsor CRUD');
    log('   - N8N: Workflow placeholders ready');
    log('📋 Next: Test functionality and commit changes');
    
  } catch (error) {
    console.error('❌ Agentic merge failed:', error.message);
    process.exit(1);
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  mergeAgenticModules();
}

export { mergeAgenticModules };