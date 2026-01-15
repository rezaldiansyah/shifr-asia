#!/bin/sh
set -e

# Run Laravel optimizations
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations (with --force for production)
php artisan migrate --force

# Seed database if templates table is empty (safe to run multiple times)
php artisan db:seed --class=TemplateSeeder --force 2>/dev/null || echo "Templates already seeded or seeder skipped"

# Start supervisor (nginx + php-fpm)
exec /usr/bin/supervisord -c /etc/supervisord.conf
