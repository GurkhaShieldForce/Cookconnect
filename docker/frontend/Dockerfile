# Build stage
FROM node:20.9.0-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Make sure environment variables are available during build
ARG VITE_API_URL=http://localhost:30081
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Production stage
FROM nginx:1.29.5-alpine3.23
# Create required directories and set permissions
RUN mkdir -p /var/run/nginx \
    && mkdir -p /var/cache/nginx \
    && mkdir -p /var/log/nginx \
    && mkdir -p /tmp/nginx \
    && touch /var/run/nginx/nginx.pid

# Create main nginx.conf with pid directive
RUN echo 'pid /var/run/nginx/nginx.pid;' > /etc/nginx/nginx.conf \
    && echo 'include /etc/nginx/conf.d/*.conf;' >> /etc/nginx/nginx.conf

# Copy custom nginx config and static files
COPY kubernetes/config/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

# Set proper permissions
RUN chown -R nginx:nginx /var/run/nginx \
    && chown -R nginx:nginx /var/cache/nginx \
    && chown -R nginx:nginx /var/log/nginx \
    && chown -R nginx:nginx /tmp/nginx \
    && chown -R nginx:nginx /usr/share/nginx/html \
    && chown -R nginx:nginx /etc/nginx \
    && chmod -R 755 /var/run/nginx \
    && chmod -R 755 /var/cache/nginx \
    && chmod -R 755 /var/log/nginx \
    && chmod -R 755 /tmp/nginx \
    && chmod -R 755 /usr/share/nginx/html \
    && chmod 644 /var/run/nginx/nginx.pid

USER nginx

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]