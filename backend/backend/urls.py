"""
URL configuration for João Macarrão backend project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/', include('apps.api.urls')),
    path('api/auth/', include('apps.core.urls')),
    path('api/accessibility/', include('apps.accessibility.urls')),
    path('api/', include('apps.payments.urls')),
    path('api/', include('apps.contact.urls')),
    path('api/', include('apps.reviews.urls')),
]

# Servir arquivos de media em desenvolvimento
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

