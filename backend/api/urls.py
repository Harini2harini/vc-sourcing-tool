from django.urls import path
from django.http import JsonResponse
from . import views

def health_check(request):
    return JsonResponse({"status": "ok", "message": "API is reachable"})

urlpatterns = [
    path('health/', health_check, name='health'),
    path('enrich/', views.enrich_company, name='enrich'),
]