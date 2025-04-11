from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Order
from .serializers import OrderSerializer, OrderCreateSerializer
from products.models import UserPromotion
from django.utils import timezone

# Create your views here.

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def process_payment(self, request, pk=None):
        order = self.get_object()
        if order.payment_status == 'completed':
            return Response(
                {'error': 'Заказ уже оплачен'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Здесь можно добавить интеграцию с платежной системой
        
        # Обновляем статус заказа
        order.payment_status = 'completed'
        order.status = 'processing'  # Меняем статус заказа на "в обработке"
        order.save()
        
        return Response({
            'message': 'Оплата прошла успешно',
            'order': OrderSerializer(order).data
        })

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        promotion_id = data.pop('promotion_id', None)
        
        # Создаем заказ
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save(user=request.user)

        # Если указана скидка, применяем её
        if promotion_id:
            try:
                user_promotion = UserPromotion.objects.get(
                    user=request.user,
                    promotion_id=promotion_id,
                    used=False
                )
                # Отмечаем скидку как использованную
                user_promotion.used = True
                user_promotion.used_at = timezone.now()
                user_promotion.order = order
                user_promotion.save()
            except UserPromotion.DoesNotExist:
                pass

        return Response(serializer.data, status=status.HTTP_201_CREATED)
