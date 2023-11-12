from django.shortcuts import render, get_object_or_404
from .serializers import ProductSerializer
from .models import Product
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status
# Create your views here.

class ProductListView(generics.ListAPIView):
        queryset = Product.objects.all()
        serializer_class = ProductSerializer
       
class ProductDetailView(APIView):
    serializer_class = ProductSerializer

    def get(self, request, id, format=None):
    
        print(id)
        if id != None:
            product = Product.objects.filter(id=id)
            print(product)
            if product.exists():
                 data = self.serializer_class(product[0]).data
                 return Response(data, status=status.HTTP_200_OK)
            return Response({"Product Not Found": "Invalid Product Id"}, status=status.HTTP_404_NOT_FOUND)
        return Response({"BAD REQUEST": "No id was passed to url"}, status=status.HTTP_400_BAD_REQUEST)
    

# class ProductDetailView(generics.RetrieveAPIView):
#     serializer_class = ProductSerializer

#     def get_object(self):
#         id = self.kwargs.get('id')
#         product = get_object_or_404(Product, id=id)
#         return product
    

class ProductDetailView(generics.RetrieveAPIView):
    serializer_class = ProductSerializer

    def get(self, request, *args, **kwargs):
        id = self.kwargs.get('id')
        try:
            product = Product.objects.get(id=id)
            serializer = ProductSerializer(product)
            return Response(serializer.data)
        except Product.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
