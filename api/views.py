from django.shortcuts import render, get_object_or_404
from .serializers import ProductSerializer
from .models import Product, Order, OrderItem, Customer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status
from django.contrib.auth.forms import UserCreationForm
from .forms import CustomUserCreationForm
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
# Create your views here.

class ProductListView(generics.ListAPIView):
        queryset = Product.objects.all()
        serializer_class = ProductSerializer

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
        
# class CreateOrderView():
#     def post(self, request, format=None):
#         order = Order()
#         order.save()
        
#         product =request.data.get('product')
#         product_result = Product.objects.filter

class CreateOrderView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        data = request.data
        print(data)
        print(request.user)
        product_id = data.get('product_id')
        product = Product.objects.get(id=product_id)
        customer = Customer.objects.filter(user=request.user).first()
        order = Order.objects.filter(customer=customer, complete=False).first()
        if not order:
            order = Order.objects.create(
                customer=request.user.customer,
                complete=False
            )
        
        order_item = OrderItem.objects.filter(order=order, product=product).first()

        if order_item:
            order_item.quantity += 1
            order_item.save()
        # If not, create a new order item
        else:
            OrderItem.objects.create(
                product=product,
                order=order,
                quantity=1
            )
        
        

        return Response({'message': 'Order created successfully'}, status=status.HTTP_200_OK)
    
# class CartDataView(generics.APIView):
#     def get(self, request, format=None):
#         number_of_items = 


class RegisterView(APIView):
    # serializer_class = ProductSerializer
    def post(self, request):
        form = CustomUserCreationForm(request.data)
        if form.is_valid():
            # Validate email
            email = form.cleaned_data.get('email')
            print(email)
            try:
                validate_email(email)
            except ValidationError:
                return Response(
                    {'error': 'Invalid email'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            user = form.save()
            Customer.objects.create(user=user, email=email, name=request.data.get('name'))
            return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        else:
            return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        print(username)
        password = request.data.get('password')
        print(password)
        user = authenticate(username=username, password=password)
        print(user)

        if user is not None:
            # A backend authenticated the credentials
            return Response({'message': 'User logged in successfully'}, status=status.HTTP_200_OK)
        else:
            # No backend authenticated the credentials
            return Response({'error': 'Invalid username or password'}, status=status.HTTP_400_BAD_REQUEST)