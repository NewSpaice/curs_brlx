"""
URL configuration for jewelry_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import UserViewSet
from products.views import ProductViewSet, ServiceViewSet, PromotionViewSet
from orders.views import OrderViewSet
from .views import ReactAppView

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'products', ProductViewSet)
router.register(r'services', ServiceViewSet)
router.register(r'promotions', PromotionViewSet, basename='promotion')
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', ReactAppView.as_view(), name='react-app'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
