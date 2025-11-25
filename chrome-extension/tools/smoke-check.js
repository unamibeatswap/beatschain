#!/usr/bin/env node
// Simple smoke-check for common production issues
// - Ensures manifest oauth2.client_id is present
// - Ensures no embedded Pinata keys remain
// - Ensures dev-bypass patterns aren't present unguarded

const fs = require('fs');
const path = require('path');

function readJSON(p) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { return null; }
}

function walk(dir, cb) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (['.git','node_modules','dist'].includes(e.name)) continue;
      walk(full, cb);
    } else if (e.isFile()) {
      cb(full);
    }
  }
}

let issues = [];

const manifest = readJSON(path.join(__dirname, '..', 'manifest.json'));
if (!manifest || !manifest.oauth2 || !manifest.oauth2.client_id) {
  issues.push('Missing oauth2.client_id in manifest.json');
} else {
  console.log('manifest.oauth2.client_id =', manifest.oauth2.client_id);
}

// Scan files
let pinataFound = [];
let orTrueFound = [];
let devFlagTrueFound = [];
walk(path.join(__dirname, '..'), (file) => {
  const rel = path.relative(path.join(__dirname, '..'), file);
  if (file.endsWith('.js') || file.endsWith('.html') || file.endsWith('.json')) {
    // Skip the smoke-check script itself to avoid false positives
    if (rel === 'tools/smoke-check.js') return;
    let txt = fs.readFileSync(file, 'utf8');
    // Only flag files that embed a literal key value (e.g. pinataApiKey = 'abcd')
    if (/pinataApiKey\s*=\s*['\"]\w+['\"]/i.test(txt) || /pinataSecretKey\s*=\s*['\"][^'\"]+['\"]/i.test(txt) || /pinata_secret_api_key['\"]?\s*:\s*['\"][^'\"]+['\"]/i.test(txt)) {
      pinataFound.push(rel);
    }
    if (/\|\|\s*true/.test(txt)) orTrueFound.push(rel);
    if (/__DEV_GUEST_MODE__\s*=\s*true|__DEV_ADMIN__\s*=\s*true/.test(txt)) devFlagTrueFound.push(rel);
  }
});

if (pinataFound.length) {
  issues.push('Found references to Pinata keys in files: ' + pinataFound.slice(0,10).join(', '));
} else {
  console.log('No embedded Pinata keys found.');
}

if (orTrueFound.length) {
  console.warn('Found "|| true" style fallbacks in files (these may mask auth checks):', orTrueFound.slice(0,10).join(', '));
} else {
  console.log('No "|| true" fallback patterns found.');
}

if (devFlagTrueFound.length) {
  issues.push('Found explicit dev flags set to true in: ' + devFlagTrueFound.join(', '));
} else {
  console.log('No explicit dev flags set to true found.');
}

// Check ipfs-asset-manager specifically
try {
  const ipfsPath = path.join(__dirname, '..', 'lib', 'ipfs-asset-manager.js');
  const ipfsTxt = fs.readFileSync(ipfsPath, 'utf8');
  if (/this\.pinataApiKey\s*=\s*null/.test(ipfsTxt)) {
    console.log('ipfs-asset-manager: pinataApiKey is null (good)');
  } else {
    issues.push('ipfs-asset-manager.js may still contain pinataApiKey values');
  }
} catch (e) { issues.push('Unable to read lib/ipfs-asset-manager.js'); }

console.log('\nSummary:');
if (issues.length === 0) {
  console.log('✔️  Smoke check passed (no critical issues found)');
  process.exit(0);
} else {
  console.error('❌ Smoke check found issues:');
  for (const it of issues) console.error(' -', it);
  process.exit(2);
}
