from django.urls import path
from . import views

urlpatterns = [
    path('enrich/', views.enrich_company, name='enrich'),
]