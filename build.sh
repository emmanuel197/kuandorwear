#!/bin/bash

# Build the project
echo "Building the project..."
python3.9 -m pip install -r requirements.txt

echo "Make Migration..."
python3.9 manage.py makemigrations --noinput
python3.9 manage.py migrate --noinput

# echo "Create superuser"
# python3.9 manage.py collectstatic --noinput --clear
python3.9 manage.py createsuperuser python manage.py createsuperuser --email eamokuandoh@gmail.com --username kuandor --firstname Emmanuel --lastname Amokuandoh  

