from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Product, Service, Promotion, UserPromotion
from .serializers import ProductSerializer, ServiceSerializer, PromotionSerializer
from rest_framework.permissions import IsAuthenticated

# Create your views here.

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.filter(is_available=True)
    serializer_class = ServiceSerializer

class PromotionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Promotion.objects.filter(is_active=True)
    serializer_class = PromotionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Promotion.objects.filter(is_active=True)

    @action(detail=True, methods=['POST'])
    def apply(self, request, pk=None):
        try:
            promotion = self.get_object()
            user = request.user

            # Проверяем, не активировал ли пользователь уже эту акцию
            if UserPromotion.objects.filter(user=user, promotion=promotion).exists():
                return Response(
                    {'error': 'Вы уже активировали эту акцию'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Проверяем, активна ли акция
            now = timezone.now()
            if not promotion.is_active or not (promotion.start_date <= now <= promotion.end_date):
                return Response(
                    {'error': 'Акция неактивна или срок её действия истёк'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Создаем запись об активации акции
            UserPromotion.objects.create(
                user=user,
                promotion=promotion,
                used=False,
                activated_at=now
            )

            return Response({
                'message': 'Акция успешно активирована и будет доступна при следующем заказе'
            })

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['GET'])
    def available(self, request):
        """Получить список доступных для использования акций"""
        user = request.user
        now = timezone.now()
        
        # Получаем активные акции, которые пользователь активировал, но еще не использовал
        available_promotions = Promotion.objects.filter(
            userpromotion__user=user,
            userpromotion__used=False,
            is_active=True,
            start_date__lte=now,
            end_date__gte=now
        )
        
        serializer = self.get_serializer(available_promotions, many=True)
        return Response(serializer.data)
