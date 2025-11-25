#!/bin/bash

# BeatsChain Content Migration Script
# This script runs the entire content migration process from hardcoded pages to Sanity CMS

echo "🚀 BeatsChain Content Migration"
echo "==============================="

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js and try again."
    exit 1
fi

# Check if required packages are installed
if ! node -e "require('glob')" &> /dev/null; then
    echo "📦 Installing required packages..."
    npm install glob
fi

# Run the migration script
echo "🚀 Starting migration process..."
node scripts/migration/migrate-all-content.js

# Check if the script executed successfully
if [ $? -eq 0 ]; then
    echo "✅ Content migration completed successfully!"
    echo "🔍 You can now check your Sanity Studio to verify the migrated content."
else
    echo "❌ Error during content migration. Check the error messages above."
fi