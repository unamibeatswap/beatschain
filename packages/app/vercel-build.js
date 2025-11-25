// This script is used by Vercel to optimize the build process
const { execSync } = require('child_process');

console.log('🚀 Starting optimized Vercel build...');

// Clean cache if it exists
try {
  console.log('🧹 Cleaning Next.js cache...');
  execSync('rm -rf .next/cache', { stdio: 'inherit' });
} catch (e) {
  console.log('No cache to clean');
}

// Run the build with memory optimization
console.log('🔧 Building with increased memory limit...');
execSync('next build', {
  env: {
    ...process.env,
    NODE_OPTIONS: '--max-old-space-size=4096'
  },
  stdio: 'inherit'
});

console.log('✅ Build completed successfully!');