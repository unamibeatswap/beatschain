#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🧪 Testing deployment build...');

try {
  // Clean cache
  console.log('🧹 Cleaning cache...');
  execSync('rm -rf .next', { stdio: 'inherit' });
  
  // Set memory limit
  process.env.NODE_OPTIONS = '--max-old-space-size=4096';
  
  // Test build
  console.log('🔨 Building...');
  execSync('npx next build --no-lint', { 
    stdio: 'inherit',
    env: { 
      ...process.env,
      NODE_ENV: 'production',
      NEXT_TELEMETRY_DISABLED: '1'
    }
  });
  
  console.log('✅ Build successful - Ready for deployment!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}