# Stage 1: Build the React app
FROM node:22-alpine as build
WORKDIR /app
# Install dependencies
COPY package*.json ./
RUN npm install
# Copy the source code and build the app
COPY . .

# allow Docker Compose to override this at build time:
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

RUN npm run build

# Stage 2: Run the production build
FROM node:22-alpine
WORKDIR /app
# Copy only the build output from the previous stage
COPY --from=build /app/build ./build
# Install serve globally to serve static files
RUN npm install -g serve
EXPOSE 3000
# Serve the build folder on port 3000
CMD ["serve", "-s", "build", "-l", "3000"]
