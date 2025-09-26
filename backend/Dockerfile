FROM php:8.3-cli-alpine

# Install system dependencies
RUN apk add --no-cache \
    zip unzip curl git \
    $PHPIZE_DEPS \
    && docker-php-ext-install pdo pdo_mysql

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Create necessary directories with proper permissions
RUN mkdir -p storage/logs storage/framework/sessions storage/framework/views storage/framework/cache bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Expose port 8000 for artisan serve
EXPOSE 8000