
FROM node:20.19.6-alpine


WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Security: Run as non-root user
RUN addgroup -g 1001 appgroup && \
    adduser -u 1001 -G appgroup -g 'appuser' -s /bin/sh -D appuser && \
    chown -R appuser:appgroup /app

USER appuser

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost:3001/health || exit 1

EXPOSE 3001
CMD ["node", "server.js"]