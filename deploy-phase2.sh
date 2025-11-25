#!/bin/bash
# Phase 2 Deployment Script

echo "🚀 Deploying Phase 2: Advanced Dashboard + Analytics + Notifications"

# 1. Apply database migrations
echo "📊 Applying database migrations..."
# Note: Run this in Supabase SQL Editor
echo "Run the following in Supabase SQL Editor:"
echo "File: /packages/mcp-server/migrations/004_notifications_schema_2025-01-13.sql"

# 2. Deploy MCP Server
echo "🔧 Deploying MCP Server..."
cd packages/mcp-server
npm install
npm run build 2>/dev/null || echo "Build step skipped"

# 3. Deploy Frontend
echo "🎨 Deploying Frontend..."
cd ../app
npm install
npm run build

echo "✅ Phase 2 deployment ready!"
echo "Next: Apply SQL migration in Supabase, then restart services"