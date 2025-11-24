#!/bin/sh

# Activate maintenance mode
php artisan down

# Update the source code
git pull

# Install/Update PHP dependencies (without dev packages)
composer install --no-interaction --no-dev --prefer-dist

# Re-run React/Vite build process
npm install
npm run build

# Clear and cache configurations
php artisan optimize:clear
php artisan config:cache
php artisan route:cache

# Run database migrations (only applies new changes)
php artisan migrate --force

# Deactivate maintenance mode
php artisan up