FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build the application
RUN npm run build

# Install PM2 globally for process management
RUN npm install -g pm2

# Expose port
EXPOSE 3000

# Start the application
CMD ["pm2-runtime", "dist/main.js"]
