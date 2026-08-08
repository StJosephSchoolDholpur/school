FROM node:20-slim

# Install Chromium, build tools (make, g++, python3 for better-sqlite3), and Linux Headless Browser dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    make \
    g++ \
    gcc \
    chromium \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    NODE_ENV=production

WORKDIR /app

# Copy package files and scripts directory required by npm postinstall
COPY package*.json ./
COPY dashboard/package*.json ./dashboard/
COPY scripts/ ./scripts/

# Install dependencies
RUN npm ci --include=dev
RUN cd dashboard && npm ci

# Copy full application code
COPY . .

# Build API & Dashboard
RUN npm run build:all

EXPOSE 2785 2886

CMD ["node", "dist/main"]
