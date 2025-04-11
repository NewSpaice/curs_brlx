from django.contrib import admin
from django.http import HttpResponse
from .models import Product, Service, Promotion, UserPromotion
import csv
from datetime import datetime
from django.utils.html import strip_tags

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'category', 'available', 'created_at')
    list_filter = ('category', 'available')
    search_fields = ('name', 'description')
    list_editable = ('price', 'available')
    actions = ['export_as_csv']

    def export_as_csv(self, request, queryset):
        meta = self.model._meta
        field_names = [field.name for field in meta.fields]

        response = HttpResponse(content_type='text/csv; charset=utf-8')
        response['Content-Disposition'] = f'attachment; filename=services-{datetime.now().strftime("%Y%m%d")}.csv'

        # Добавляем BOM для корректного отображения в Excel
        response.write('\ufeff')

        writer = csv.writer(response)
        
        # Записываем заголовки
        writer.writerow([field.verbose_name for field in meta.fields])

        # Записываем данные
        for obj in queryset:
            row = []
            for field in field_names:
                value = getattr(obj, field)
                if isinstance(value, datetime):
                    value = value.strftime("%Y-%m-%d %H:%M:%S")
                elif field == 'features':  # Для поля JSON
                    value = ', '.join(value) if isinstance(value, list) else str(value)
                elif field == 'description':  # Убираем HTML-теги
                    value = strip_tags(str(value))
                row.append(value)
            writer.writerow(row)

        return response

    export_as_csv.short_description = "Экспорт выбранных товаров в CSV"

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_available', 'created_at', 'updated_at')
    list_filter = ('is_available',)
    search_fields = ('name', 'description')
    list_editable = ('is_available',)
    actions = ['export_as_csv']

    def export_as_csv(self, request, queryset):
        meta = self.model._meta
        field_names = [field.name for field in meta.fields]

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename=services-{datetime.now().strftime("%Y%m%d")}.csv'
        writer = csv.writer(response)

        # Записываем заголовки с русскими названиями
        headers = []
        for field in meta.fields:
            headers.append(field.verbose_name)
        writer.writerow(headers)
        
        # Записываем данные
        for obj in queryset:
            row = []
            for field in field_names:
                value = getattr(obj, field)
                if isinstance(value, datetime):
                    value = value.strftime("%Y-%m-%d %H:%M:%S")
                elif field == 'features':  # Для поля JSON
                    value = ', '.join(value) if isinstance(value, list) else str(value)
                row.append(value)
            writer.writerow(row)

        return response

    export_as_csv.short_description = "Экспорт выбранных услуг в CSV"

@admin.register(Promotion)
class PromotionAdmin(admin.ModelAdmin):
    list_display = ('name', 'discount_percent', 'is_active', 'start_date', 'end_date')
    list_filter = ('is_active',)
    search_fields = ('name', 'description')

@admin.register(UserPromotion)
class UserPromotionAdmin(admin.ModelAdmin):
    list_display = ('user', 'promotion', 'used', 'used_at')
    list_filter = ('used',)
    search_fields = ('user__email', 'promotion__name')
