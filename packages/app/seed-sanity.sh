#!/bin/bash

# Auto-seed Sanity data script
echo "🌱 BeatsChain Sanity Auto-Seeding"
echo "--------------------------------"

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js and try again."
    exit 1
fi

# Run the seeding script
echo "🚀 Running auto-seeding script..."
node scripts/seed-sanity-auto.js

# Check if the script executed successfully
if [ $? -eq 0 ]; then
    echo "✅ Sanity data seeded successfully!"
    echo "🔍 You can now check your Sanity Studio to verify the data."
else
    echo "❌ Error seeding Sanity data. Check the error messages above."
fi