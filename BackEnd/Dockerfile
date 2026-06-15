# Use Node.js 20 alpine for a lightweight image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the backend source code
COPY . .

# Expose the port your backend uses (based on your documentation, likely 5000)
EXPOSE 5000

# Start the server
CMD ["npm", "start"]