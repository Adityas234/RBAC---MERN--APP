# Backend Dockerfile
FROM node:18

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy backend source code
COPY . .

# Expose backend port
EXPOSE 5000

# Start server
CMD ["npm", "run", "start"]
