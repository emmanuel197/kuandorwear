from rest_framework import serializers
from .models import Product, Order
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ('id' ,'name', 'price', 'image', 'description')


