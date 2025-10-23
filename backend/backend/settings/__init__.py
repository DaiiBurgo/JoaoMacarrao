"""
Django settings module selector
Automatically loads the correct settings based on DJANGO_ENV variable
"""
import os

# Determine which settings to use
environment = os.environ.get('DJANGO_ENV', 'development')

if environment == 'production':
    from .production import *
else:
    from .development import *

print(f"🍝 João Macarrão - Running in {environment.upper()} mode")

