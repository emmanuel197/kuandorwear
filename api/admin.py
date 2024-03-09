from django.contrib import admin
from .models import *
from accounts.models import User


# Define inline admin classes for related models
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    readonly_fields = ('get_total',)
    extra = 0

class ShippingAddressInline(admin.StackedInline):
    model = ShippingAddress
    extra = 0

# Define admin classes for main models

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email')
    search_fields = ('first_name', 'last_name', 'email')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('transaction_id', 'customer_name', 'date_ordered', 'complete', 'date_completed', 'get_cart_total', 'get_cart_items')
    list_filter = ('complete', 'date_ordered')
    search_fields = ('transaction_id',)
    inlines = [OrderItemInline, ShippingAddressInline]

    def customer_name(self, obj):
        return obj.customer.first_name + ' ' + obj.customer.last_name if obj.customer else ''
    customer_name.short_description = 'Customer'

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product', 'quantity', 'date_added', 'get_total')
    list_filter = ('date_added',)
    search_fields = ('order__transaction_id', 'product__name')


@admin.register(ShippingAddress)
class ShippingAddressAdmin(admin.ModelAdmin):
    list_display = ('customer', 'order', 'address', 'city', 'state', 'zipcode', 'country', 'date_added')
    list_filter = ('date_added',)
    search_fields = ('order__transaction_id', 'customer__first_name', 'customer__last_name')

# Register all models to admin site
admin.site.register(Product)
admin.site.register(User)
admin.site.register(Brand)
admin.site.register(Size)
admin.site.register(ProductSize)
admin.site.register(ProductImage)

