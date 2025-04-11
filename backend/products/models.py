from django.db import models

# Create your models here.

class Product(models.Model):
    name = models.CharField(max_length=200, verbose_name="Название")
    description = models.TextField(verbose_name="Описание")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Цена")
    image = models.ImageField(upload_to='products/', verbose_name="Изображение", null=True, blank=True)
    category = models.CharField(max_length=100, verbose_name="Категория")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    available = models.BooleanField(default=True, verbose_name="В наличии")

    class Meta:
        verbose_name = "Товар"
        verbose_name_plural = "Товары"
        ordering = ['-created_at']

    def __str__(self):
        return self.name

class Service(models.Model):
    name = models.CharField(max_length=200, verbose_name="Название услуги")
    description = models.TextField(verbose_name="Описание услуги")
    features = models.JSONField(verbose_name="Особенности услуги", default=list)
    is_available = models.BooleanField(default=True, verbose_name="Доступна")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    class Meta:
        verbose_name = "Услуга"
        verbose_name_plural = "Услуги"
        ordering = ['name']

    def __str__(self):
        return self.name

class Promotion(models.Model):
    name = models.CharField(max_length=200, verbose_name="Название акции")
    description = models.TextField(verbose_name="Описание")
    discount_percent = models.IntegerField(verbose_name="Процент скидки")
    is_active = models.BooleanField(default=True, verbose_name="Активна")
    start_date = models.DateTimeField(verbose_name="Дата начала")
    end_date = models.DateTimeField(verbose_name="Дата окончания")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Акция"
        verbose_name_plural = "Акции"

    def __str__(self):
        return f"{self.name} ({self.discount_percent}%)"

class UserPromotion(models.Model):
    user = models.ForeignKey('users.User', on_delete=models.CASCADE)
    promotion = models.ForeignKey(Promotion, on_delete=models.CASCADE)
    used = models.BooleanField(default=False, verbose_name="Использована")
    activated_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата активации")
    used_at = models.DateTimeField(null=True, blank=True, verbose_name="Дата использования")
    order = models.ForeignKey('orders.Order', null=True, blank=True, on_delete=models.SET_NULL)

    class Meta:
        verbose_name = "Использование акции"
        verbose_name_plural = "Использование акций"
        unique_together = ['user', 'promotion']

    def __str__(self):
        status = "Использована" if self.used else "Активирована"
        return f"{self.user.email} - {self.promotion.name} ({status})"
