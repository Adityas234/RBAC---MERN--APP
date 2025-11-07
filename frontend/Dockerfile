# Frontend Dockerfile
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build frontend
RUN npm run build

# Expose Vite preview port
EXPOSE 5173

# Start frontend preview server
CMD ["npm", "run", "preview", "--", "--host"]
