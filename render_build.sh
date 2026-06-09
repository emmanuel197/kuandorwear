#!/usr/bin/env bash
# Render build script. Exit on any error.
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Collect static files (served by WhiteNoise)
python manage.py collectstatic --no-input

# Apply database migrations
python manage.py migrate

# Create a superuser if SUPERUSER_EMAIL / SUPERUSER_PASSWORD are set.
# Safe to re-run: the script no-ops if the user already exists.
python superuser.py || true
