FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src/ ./src/

# Create uploads directory
RUN mkdir -p uploads

# Verify ethers installation
RUN node -e "console.log('Ethers version:', require('ethers').version)"

# Use Railway's PORT
EXPOSE $PORT

# Start server
CMD ["node", "src/index.js"]