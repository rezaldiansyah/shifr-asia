
# ===========================================
# Shifr Asia - Root Dockerfile (API)
# ===========================================
# This Dockerfile is placed in the root to allow building the API 
# from the root context (like docker-compose).
#
# NOTE: This builds the API (apps/api). 
# For Web Apps, use apps/web-bizup/Dockerfile or apps/web-shifr/Dockerfile

# Stage 1: Build dependencies
FROM composer:2.8 AS composer

WORKDIR /app

# Copy composer files from apps/api
COPY apps/api/composer.json apps/api/composer.lock ./

# Install dependencies (no dev)
RUN composer install \
    --no-dev \
    --no-scripts \
    --no-autoloader \
    --prefer-dist \
    --ignore-platform-reqs

# Copy full api app
COPY apps/api .

# Generate autoloader
RUN composer dump-autoload --optimize --no-dev --no-scripts

# Stage 2: Production image
FROM php:8.4-fpm-alpine

# Install dependencies
RUN apk add --no-cache \
    nginx \
    supervisor \
    libpq-dev \
    libzip-dev \
    zip \
    unzip \
    curl \
    && docker-php-ext-install \
    pdo \
    pdo_pgsql \
    pgsql \
    zip \
    opcache \
    bcmath \
    && rm -rf /var/cache/apk/*

# Install Redis extension
RUN apk add --no-cache --virtual .build-deps \
    $PHPIZE_DEPS \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del .build-deps

# Copy PHP configuration (adjusting paths to point to apps/api source if needed, but here we copied to root of container)
# We need to be careful. The original Dockerfile imitated the structure. 
# We will copy the config files from the source we have.

# Copy configurations from the apps/api directory (which is now in the build context)
COPY apps/api/docker/php.ini /usr/local/etc/php/conf.d/custom.ini
COPY apps/api/docker/opcache.ini /usr/local/etc/php/conf.d/opcache.ini
COPY apps/api/docker/nginx.conf /etc/nginx/nginx.conf
COPY apps/api/docker/supervisord.conf /etc/supervisord.conf

# Set working directory
WORKDIR /var/www/html

# Copy application from composer stage
COPY --from=composer /app /var/www/html

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Create directories
RUN mkdir -p /var/www/html/storage/logs \
    && mkdir -p /var/www/html/storage/framework/cache \
    && mkdir -p /var/www/html/storage/framework/sessions \
    && mkdir -p /var/www/html/storage/framework/views \
    && mkdir -p /var/www/html/bootstrap/cache \
    && chown -R www-data:www-data /var/www/html/storage \
    && chown -R www-data:www-data /var/www/html/bootstrap/cache

# Copy entrypoint script
COPY apps/api/docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/api/health || exit 1

# Run entrypoint script
ENTRYPOINT ["/entrypoint.sh"]
