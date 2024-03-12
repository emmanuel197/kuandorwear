from django.contrib import admin
from .models import *
from accounts.models import User


# Define inline admin classes for related models
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    readonly_fields = ('get_total',)
    extra = 0

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.select_related('product', 'order')

class ShippingAddressInline(admin.StackedInline):
    model = ShippingAddress
    fields = ('address', 'city', 'state', 'zipcode', 'country')
    readonly_fields = ('address', 'city', 'state', 'zipcode', 'country')
    extra = 0

# Define admin classes for main models

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email')
    search_fields = ('first_name', 'last_name', 'email')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('transaction_id', 'customer', 'date_ordered', 'complete', 'date_completed')
    list_filter = ('complete', 'date_ordered')
    search_fields = ('transaction_id',)
    inlines = [OrderItemInline, ShippingAddressInline]

    list_per_page = 10

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('customer').prefetch_related('orderitem_set')
    
@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product', 'quantity', 'date_added', 'get_total')
    list_filter = ('date_added',)
    search_fields = ('order__transaction_id', 'product__name')

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('order', 'product')

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

