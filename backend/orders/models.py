from django.db import models
from users.models import User
from products.models import Product
from django.core.exceptions import ValidationError

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'В обработке'),
        ('processing', 'Обрабатывается'),
        ('shipped', 'Отправлен'),
        ('delivered', 'Доставлен'),
        ('cancelled', 'Отменен'),
    ]

    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Ожидает оплаты'),
        ('completed', 'Оплачен'),
        ('failed', 'Ошибка оплаты'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    items = models.JSONField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    shipping_address = models.JSONField()
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Заказ #{self.id} от {self.user.username}'

    def confirm_payment(self):
        if self.payment_status == 'completed':
            raise ValidationError('Заказ уже оплачен')
        self.payment_status = 'completed'
        if self.status == 'pending':
            self.status = 'processing'
        self.save()

    def update_status(self, new_status):
        valid_transitions = {
            'pending': ['processing', 'cancelled'],
            'processing': ['shipped', 'cancelled'],
            'shipped': ['delivered', 'cancelled'],
            'delivered': [],
            'cancelled': []
        }

        if new_status not in valid_transitions.get(self.status, []):
            raise ValidationError(f'Недопустимый переход статуса с {self.status} на {new_status}')
        
        self.status = new_status
        self.save()

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'
