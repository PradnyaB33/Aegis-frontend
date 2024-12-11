# Use the official Node.js image from Docker Hub
FROM node:18-slim 

# Set the working directory inside the container
WORKDIR /app

# Set Node.js memory limit (4GB in this case)
ENV NODE_OPTIONS=--max-old-space-size=4096

# Copy package.json and package-lock.json (if they exist)
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 3000 to the outside world
EXPOSE 3000

# Define the command to run your app
CMD ["npm", "start"]