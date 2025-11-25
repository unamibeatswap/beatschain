#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 Starting Firebase deployment...')

try {
  // Deploy Firestore rules
  console.log('📋 Deploying Firestore rules...')
  execSync('firebase deploy --only firestore:rules', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  })
  
  // Deploy Storage rules
  console.log('📁 Deploying Storage rules...')
  execSync('firebase deploy --only storage', {
    stdio: 'inherit', 
    cwd: path.join(__dirname, '..')
  })
  
  console.log('✅ Firebase deployment completed!')
  
} catch (error) {
  console.error('❌ Firebase deployment failed:', error.message)
  process.exit(1)
}