from django.contrib import admin
from django.utils.html import format_html
from .models import Order

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'total_amount', 'status', 'payment_status', 'created_at', 'actions_buttons')
    list_filter = ('status', 'payment_status')
    search_fields = ('user__email', 'id')
    readonly_fields = ('created_at',)
    
    def actions_buttons(self, obj):
        buttons = []
        
        # Кнопка подтверждения оплаты
        if obj.payment_status == 'pending':
            buttons.append(
                f'<a class="button" href="/admin/orders/order/{obj.id}/confirm-payment/" '
                f'style="background-color: #28a745; color: white; margin-right: 5px;">'
                f'Подтвердить оплату</a>'
            )
            
        # Кнопка изменения статуса заказа
        status_buttons = {
            'pending': ('processing', 'Начать обработку'),
            'processing': ('shipped', 'Отправить'),
            'shipped': ('delivered', 'Подтвердить доставку'),
        }
        
        if obj.status in status_buttons:
            next_status, button_text = status_buttons[obj.status]
            buttons.append(
                f'<a class="button" href="/admin/orders/order/{obj.id}/change-status/{next_status}/" '
                f'style="background-color: #007bff; color: white;">'
                f'{button_text}</a>'
            )
            
        return format_html('&nbsp;'.join(buttons))
    
    actions_buttons.short_description = 'Действия'
    
    def get_urls(self):
        from django.urls import path
        urls = super().get_urls()
        custom_urls = [
            path(
                '<int:order_id>/confirm-payment/',
                self.admin_site.admin_view(self.confirm_payment),
                name='order-confirm-payment',
            ),
            path(
                '<int:order_id>/change-status/<str:new_status>/',
                self.admin_site.admin_view(self.change_status),
                name='order-change-status',
            ),
        ]
        return custom_urls + urls
    
    def confirm_payment(self, request, order_id):
        from django.shortcuts import redirect
        from django.contrib import messages
        
        try:
            order = Order.objects.get(id=order_id)
            order.payment_status = 'completed'
            if order.status == 'pending':
                order.status = 'processing'
            order.save()
            
            messages.success(request, f'Оплата заказа #{order_id} подтверждена')
        except Order.DoesNotExist:
            messages.error(request, 'Заказ не найден')
        
        return redirect('admin:orders_order_changelist')
    
    def change_status(self, request, order_id, new_status):
        from django.shortcuts import redirect
        from django.contrib import messages
        
        status_transitions = {
            'processing': 'В обработке',
            'shipped': 'Отправлен',
            'delivered': 'Доставлен'
        }
        
        try:
            order = Order.objects.get(id=order_id)
            order.status = new_status
            order.save()
            
            messages.success(
                request, 
                f'Статус заказа #{order_id} изменен на "{status_transitions.get(new_status, new_status)}"'
            )
        except Order.DoesNotExist:
            messages.error(request, 'Заказ не найден')
        
        return redirect('admin:orders_order_changelist')

    def get_readonly_fields(self, request, obj=None):
        if obj:  # Если это существующий объект
            return self.readonly_fields + ('payment_status', 'status')
        return self.readonly_fields
