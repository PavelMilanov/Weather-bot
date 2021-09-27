from django import urls
from django.urls import path, include
from rest_framework import routers
from .views import SubscribersViewSet
from rest_framework.authtoken import views

router = routers.DefaultRouter()
router.register('subscribers', SubscribersViewSet, basename='subscribers')

urlpatterns = [
    path('', include(router.urls)),
    
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.authtoken')),
    
]
