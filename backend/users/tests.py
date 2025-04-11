from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import User

# Create your tests here.

class UserTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')
        self.valid_user_data = {
            'email': 'test@example.com',
            'password': 'testpass123',
            'first_name': 'Test',
            'last_name': 'User'
        }

    def test_valid_user_registration(self):
        """Тест успешной регистрации пользователя"""
        response = self.client.post(self.register_url, self.valid_user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email='test@example.com').exists())

    def test_invalid_email_registration(self):
        """Тест регистрации с неверным email"""
        invalid_user = self.valid_user_data.copy()
        invalid_user['email'] = 'invalid-email'
        response = self.client.post(self.register_url, invalid_user, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class ProductTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.products_url = reverse('product-list')

    def test_get_products_list(self):
        """Тест получения списка товаров"""
        response = self.client.get(self.products_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
