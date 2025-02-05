FROM node:18-alpine

WORKDIR /app

# Install necessary dependencies for Prisma
RUN apk add --no-cache openssl libc6-compat

# Copy package files and prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Set environment variable for production build
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Build the application
RUN npm run build

# Make start script executable
COPY start.sh .
RUN chmod +x start.sh

# Expose the port
EXPOSE 3000

# Start the application using the startup script
CMD ["./start.sh"] 