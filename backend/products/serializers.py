from rest_framework import serializers
from .models import Product, Service, Promotion, UserPromotion

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name', 'description', 'features', 'is_available']

class PromotionSerializer(serializers.ModelSerializer):
    is_activated = serializers.SerializerMethodField()
    is_used = serializers.SerializerMethodField()

    class Meta:
        model = Promotion
        fields = [
            'id', 'name', 'description', 'discount_percent',
            'is_active', 'start_date', 'end_date',
            'is_activated', 'is_used'
        ]

    def get_is_activated(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            return UserPromotion.objects.filter(
                user=user,
                promotion=obj
            ).exists()
        return False

    def get_is_used(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            return UserPromotion.objects.filter(
                user=user,
                promotion=obj,
                used=True
            ).exists()
        return False 