from rest_framework import serializers
from .models import Order
from users.serializers import UserSerializer
from products.serializers import ProductSerializer

class OrderSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

class OrderCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ('items', 'total_amount', 'shipping_address') 