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
from django.contrib.auth import logout
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


class CreateOrUpdateOrderView(APIView):
    def post(self, request, *args, **kwargs):
        data = request.data
        print(data)
        product_id = data.get('product_id')
        product = Product.objects.get(id=product_id)
        print(request.user.is_authenticated)
        if request.user.is_authenticated:
            customer = Customer.objects.filter(user=request.user).first()
        else:
            print(self.request.session.exists(self.request.session.session_key))
            if not self.request.session.exists(self.request.session.session_key):
                self.request.session.create()
            print(self.request.session.session_key)
            customer, created = Customer.objects.get_or_create(customer_id=self.request.session.session_key)

        order, created = Order.objects.get_or_create(customer=customer, complete=False)
        
        order_item, created = OrderItem.objects.get_or_create(
            order=order, 
            product=product,
            quantity=1
        )

        if not created:
            order_item.quantity += 1
            order_item.save()

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
            return Response({'logged_in': user.is_authenticated}, status=status.HTTP_200_OK)
        else:
            # No backend authenticated the credentials
            return Response({'error': 'Invalid username or password'}, status=status.HTTP_400_BAD_REQUEST)
        
class LogoutView(APIView):
    def post(self, request):
        logout(request)
        print(request.user.is_authenticated)
        return Response({'message': 'User logged out successfully'}, status=status.HTTP_200_OK)

class CartDataView(APIView):
    def get(self, request, *args, **kwargs):
        # Assuming the customer's order is passed in the request

        print(request.user.is_authenticated)
        customer = Customer.objects.filter(customer_id=self.request.session.session_key).first()
        print(customer)
        order = Order.objects.filter(customer=customer, complete=False)[0]
        items = order.orderitem_set.all()

        item_list = []
        for item in items:
            item_list.append({
                'product': item.product.name,
                'price': item.product.price,
                'image': item.product.image.url,
                'quantity': item.quantity,
                'total': item.get_total
            })

        cart_data = {
            'total_items': order.get_cart_items,
            'total_cost': order.get_cart_total,
            'items': item_list
        }

        return Response(cart_data)

class updateCartView(APIView):
    def post(self, request, format=None):
        data = request.data
        product_name = data.get('product_name')
        action = data.get('action')
        product = Product.objects.get(name=product_name)

        if request.user.is_authenticated:
            customer = Customer.objects.filter(user=request.user).first()
        else:
            customer = Customer.objects.filter(customer_id=self.request.session.session_key).first()
        order = Order.objects.filter(customer=customer, complete=False).first()
        order_item = OrderItem.objects.filter(order=order, product=product).first()

        if 'add' == action:
            order_item.quantity += 1
            order_item.save()
        elif 'remove' == action:
            order_item.quantity -= 1
            if order_item.quantity <= 0:
                order_item.delete()
            else:
                order_item.save()
        return Response({'message': 'Cart updated successfully'}, status=status.HTTP_200_OK)