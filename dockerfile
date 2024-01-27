# Use the latest Node.js (LTS) image as builder image.
FROM node:lts as builder

# Set up the working directory.
WORKDIR /app

# Copy package.json and package-lock.json to the working directory.
COPY package.json .
COPY package-lock.json .

# Install the dependencies.
# This step is done before copying the source code to make use of Docker's caching mechanism.
RUN npm install --no-audit

# Copy configuration files.
COPY .eslintrc .
COPY .eslintignore .
COPY .prettierrc .

# Copy the source code to the working directory.
COPY angular.json .
COPY tsconfig.json .
COPY tsconfig.app.json .
COPY tsconfig.spec.json .
COPY tailwind.config.js .
COPY src/ ./src

# Enable Node.js production mode.
# This step should be done after installing the dependencies.
ENV NODE_ENV=production

# Build the source code.
RUN npm run build

# Use the latest Nginx image as production image.
FROM nginx:latest

# Expose the port that the server is running on.
EXPOSE 80

# Copy the Nginx configuration file to Nginx's default config directory.
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the built source code to the Nginx's default directory.
COPY --from=builder /app/dist/airsense-web-console/browser /usr/share/nginx/html/
