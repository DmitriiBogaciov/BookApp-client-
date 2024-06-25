# syntax=docker/dockerfile:1

ARG NODE_VERSION=18.19.0

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine AS base

# Set working directory for all build stages.
WORKDIR /usr/src/app

################################################################################
# Create a stage for installing production dependencies.
FROM base AS deps

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage bind mounts to package.json and package-lock.json to avoid having to copy them
# into this layer.
COPY package.json package-lock.json ./
RUN npm ci --unsafe-perm

################################################################################
# Create a stage for building the application.
FROM deps AS build

# Download additional development dependencies before building, as some projects require
# "devDependencies" to be installed to build. If you don't need this, remove this step.
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the source files into the image.
COPY . .
COPY .env.local .

# Run the build script.
RUN npm run build

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
# where the necessary files are copied from the build stage.
FROM base AS final

# Use production node environment by default.
ENV NODE_ENV=production

# Copy package.json so that package manager commands can be used.

# Copy the production dependencies from the deps stage and also
# the built application from the build stage into the image.
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/.next ./.next
COPY --from=build /usr/src/app/.env.local ./.env.local
COPY --from=build /usr/src/app/package.json ./package.json

# Expose the port that the application listens on.
EXPOSE 3000

# Change user to 'node' for running the application
USER node

# Run the application.
CMD ["npm", "run", "dev"]
