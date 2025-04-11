from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, UserCreateSerializer

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['register', 'login']:
            return [permissions.AllowAny()]
        return super().get_permissions()

    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer
    
    @action(detail=False, methods=['get'])
    def avatar(self, request):
        """Получить текущий аватар пользователя."""
        user = request.user
        if user.avatar:
            return Response({'avatar': user.avatar.url})
        return Response({'avatar': None}, status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['post'])
    def avatar_upload(self, request):
        """Загрузить новый аватар пользователя."""
        user = request.user
        avatar = request.FILES.get('avatar')

        if not avatar:
            return Response({'error': 'Файл не загружен'}, status=status.HTTP_400_BAD_REQUEST)

        # Удаление старого аватара, если он был
        if user.avatar:
            default_storage.delete(user.avatar.path)

        user.avatar.save(avatar.name, ContentFile(avatar.read()))
        user.save()
        return Response({'avatar': user.avatar.url}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['delete'])
    def avatar_delete(self, request):
        """Удалить аватар пользователя."""
        user = request.user
        if user.avatar:
            default_storage.delete(user.avatar.path)
            user.avatar = None
            user.save()
            return Response({'message': 'Аватар удален'}, status=status.HTTP_200_OK)
        return Response({'error': 'Аватар отсутствует'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        try:
            user = User.objects.get(username=username)
            if user.check_password(password):
                refresh = RefreshToken.for_user(user)
                return Response({
                    'user': UserSerializer(user).data,
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                })
            return Response({'error': 'Неверный пароль'}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({'error': 'Пользователь не найден'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()  # Здесь происходит сохранение в БД
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
