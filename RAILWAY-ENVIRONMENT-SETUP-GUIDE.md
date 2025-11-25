# Railway Environment Setup Guide - MCP Server

## 🔍 **SENIOR DEVELOPER AUDIT COMPLETE**

After reviewing the entire configuration, here are the **REQUIRED** environment variables for Railway:

## 📋 **CRITICAL VARIABLES TO ADD IN RAILWAY DASHBOARD**

### **1. Core Infrastructure**
```env
PORT=${{RAILWAY_PORT}}
NODE_ENV=production
```

### **2. Database (REQUIRED)**
```env
SUPABASE_URL=https://zgdxpsenxjwyiwbbealf.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnZHhwc2VueGp3eWl3YmJlYWxmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjg4Njg5OSwiZXhwIjoyMDc4NDYyODk5fQ.Kx0VThgOXJFN6vryD5mHuoH28xadvdasmNyKIe6VMas
```

### **3. IPFS Storage (REQUIRED - Extension uses this)**
```env
PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzNjdmNzc1YS0zZjg4LTQ5MzctYWE0Zi0yYTViMDE2MDU0NDgiLCJlbWFpbCI6InVuYW1pYmVhdHN3YXBAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImZlMDI3NzJkNzA5NzgxMmI0YjllIiwic2NvcGVkS2V5U2VjcmV0IjoiYmZiOTEzNWUzYTIxYTcxYWUxN2QyMjJiZjQzYzY2N2EyNDVmMWZiZjE5NTgwYTU5ZTlhNDNkYzQxNDY2MDc0MyIsImV4cCI6MTc4MjczMjExOX0.4m0JHIE6BRTbKIQA_TThcdvwJQOaXASIk8WkE08Em_I
WEB3STORAGE_TOKEN=YOUR_WEB3STORAGE_TOKEN_HERE
```

### **4. Video/Audio Processing (REQUIRED - Extension uses livepeerUpload)**
```env
LIVEPEER_API_KEY=663a61a0-8277-4633-9012-5576cb9d0afb
LIVEPEER_API_HOST=https://livepeer.studio/api
```

### **5. Gasless Minting (REQUIRED - Extension uses gaslessMint)**
```env
THIRDWEB_CLIENT_ID=53c6d7d26b476a57e09e7706265a60bb
THIRDWEB_SECRET_KEY=PcKBR2HRtTeWhqzi-9p1_8YWb-xAWIbFaYtX-YZEKDrrdH2J6zH-B4eeWC7CIL4Gp4m5QOnnE6v47H9V6C-Dhg
```

### **6. Authentication (REQUIRED - Extension uses OAuth)**
```env
GOOGLE_CLIENT_ID=239753403483-re3akggqub93apgm4t5nnabbbrcp0q1p.apps.googleusercontent.com
GOOGLE_API_KEY=AIzaSyD6_CzA-jtpWKAz6YK9RA7oQ82SEQO7sW0
```

### **7. Additional Required Variables**
```env
CORS_ORIGIN=https://beats-app.vercel.app
SUPER_ADMIN_WALLET=0xc84799A904EeB5C57aBBBc40176E7dB8be202C10
RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
NEXT_PUBLIC_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NETWORK_ID=11155111
```

## ⚠️ **WHY THESE ARE REQUIRED (NOT OPTIONAL)**

### **Extension Dependencies**
1. **MCPClient.livepeerUpload()** → Needs LIVEPEER_API_KEY
2. **MCPClient.gaslessMint()** → Needs THIRDWEB_SECRET_KEY  
3. **MCPClient.pinContent()** → Needs PINATA_JWT
4. **OAuth authentication** → Needs GOOGLE_CLIENT_ID/API_KEY
5. **Database operations** → Needs SUPABASE credentials

### **Code Evidence**
- `livepeerAdapter.js` fails without LIVEPEER_API_KEY
- `mcp-client.js` calls all these endpoints
- Extension manifest includes MCP server URL

## 🚀 **ACTION REQUIRED**

**Go to Railway Dashboard → Variables Tab → Add these variables:**

1. Copy each variable name and value exactly
2. Set all variables in Railway dashboard
3. Redeploy MCP server
4. Test Chrome extension functionality

**Status**: ❌ **CRITICAL - MCP server will not function properly without these variables**