from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def root_view(request):
    return JsonResponse({"status": "Backend is running", "api_endpoints": ["/api/enrich/"]})

urlpatterns = [
    path('', root_view),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]