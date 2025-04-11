from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'category', 'available', 'created_at')
    list_filter = ('category', 'available')
    search_fields = ('name', 'description')
    list_editable = ('price', 'available') 