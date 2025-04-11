from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from users.models import User
from .models import Order

class OrderTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        # Создаем тестового пользователя
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        self.client.force_authenticate(user=self.user)
        
        # Создаем тестовый заказ
        self.order = Order.objects.create(
            user=self.user,
            items=[{
                'product_name': 'Test Product',
                'quantity': 1,
                'price': '100.00'
            }],
            total_amount='100.00',
            shipping_address={
                'address': 'Test Address',
                'city': 'Test City',
                'postal_code': '123456'
            },
            status='pending',
            payment_status='pending'
        )

    def test_order_creation(self):
        """Тест создания заказа"""
        self.assertEqual(self.order.status, 'pending')
        self.assertEqual(self.order.payment_status, 'pending')

    def test_order_payment_confirmation(self):
        """Тест подтверждения оплаты заказа"""
        self.order.confirm_payment()
        self.assertEqual(self.order.payment_status, 'completed')
        self.assertEqual(self.order.status, 'processing')

    def test_order_status_update(self):
        """Тест обновления статуса заказа"""
        self.order.update_status('processing')
        self.assertEqual(self.order.status, 'processing')

    def test_invalid_status_transition(self):
        """Тест на недопустимый переход статуса"""
        from django.core.exceptions import ValidationError
        with self.assertRaises(ValidationError):
            self.order.update_status('delivered')  # Нельзя перейти сразу к доставлено

class OrderAdminTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        # Создаем админа
        self.admin_user = User.objects.create_superuser(
            email='admin@example.com',
            password='adminpass123'
        )
        self.client.force_authenticate(user=self.admin_user)
        
        # Создаем тестовый заказ
        self.order = Order.objects.create(
            user=self.admin_user,
            items=[{'product_name': 'Test Product', 'quantity': 1, 'price': '100.00'}],
            total_amount='100.00',
            shipping_address={'address': 'Test'},
            status='pending',
            payment_status='pending'
        )

    def test_admin_confirm_payment(self):
        """Тест подтверждения оплаты администратором"""
        url = reverse('admin:order-confirm-payment', args=[self.order.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        
        # Проверяем, что статус заказа обновился
        self.order.refresh_from_db()
        self.assertEqual(self.order.payment_status, 'completed')
