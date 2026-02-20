"""
WSGI config for Render deployment.
This file exists at the same level as manage.py
"""
import os
import sys
from django.core.wsgi import get_wsgi_application

# Add the inner backend folder to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

application = get_wsgi_application()