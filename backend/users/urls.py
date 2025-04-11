from django.urls import path
from .views import get_user_profile  # Импортируйте ваше представление

user_profile = UserViewSet.as_view({'post': 'avatar_upload'})  # Только POST
urlpatterns = [
    path('api/user/profile/', me, name='me'),
    path('api/user/avatar_upload/', upload_avatar, name='upload_avatar'),  # Нормальный маршрут
]