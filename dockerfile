# Grab the node library
FROM node:latest

# Set the working directory in the container
WORKDIR /app/WingSuiteApp

# Copy package.json and package-lock.json
COPY package*.json .

# Install dependencies
RUN npm install --force

# Copy the rest of your app's source code
COPY . .

# Build your Next.js app
RUN npm run build

# Your app runs on port 3000
EXPOSE 3000

# Start the app
CMD ["npm", "start"]