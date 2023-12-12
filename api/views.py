from django.shortcuts import render, get_object_or_404, redirect
from .serializers import ProductSerializer
from .models import Product, Order, OrderItem, Customer, ShippingAddress
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status
from django.contrib.auth.forms import UserCreationForm
from .forms import CustomUserCreationForm
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate
from django.contrib.auth import login, logout
from django.http import JsonResponse
from django.db import transaction
# from django.contrib.auth.decorators import login_required

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

class CreateOrUpdateOrderView(APIView):
    def post(self, request, *args, **kwargs):
        data = request.data
        print(data)
        product_id = data.get('product_id')
        product = Product.objects.get(id=product_id)
        if request.user.is_authenticated:
            customer = Customer.objects.filter(user=request.user).first()
        else:
            print(self.request.session.exists(self.request.session.session_key))
            if not self.request.session.exists(self.request.session.session_key):
                self.request.session.create()
            
            
            customer, created = Customer.objects.get_or_create(customer_id=self.request.session.session_key)

        order, created = Order.objects.get_or_create(customer=customer, complete=False)
        
        order_item, created = OrderItem.objects.get_or_create(
            order=order, 
            product=product,
            defaults={'quantity': 1}
        )

        if not created:
            order_item.quantity += 1
            order_item.save()

        return Response({'message': 'Order created successfully'}, status=status.HTTP_200_OK)


    


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
            customer_qs = Customer.objects.filter(customer_id=self.request.session.session_key)

            if customer_qs.exists():
                # If a Customer with the same customer_id exists, update its details with registration info
                existing_customer = customer_qs.first()
                existing_customer.user = user
                existing_customer.name = request.data.get('name')
                existing_customer.email = email
                existing_customer.save()
            # Check if there is a stored URL in the session
            else:
                # If no Customer with the same customer_id exists, create a new one
                Customer.objects.create(
                    user=user,
                    name=request.data.get('name'),
                    email=email
                )
            return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        else:
           form_errors = {field: form.errors[field][0] for field in form.errors}
           return JsonResponse({'error': 'Form validation failed', 'form_errors': form_errors}, status=status.HTTP_400_BAD_REQUEST)



class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        anonymous_session_key = self.request.session.session_key
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            
            # Check if there is an existing session with a cart for the anonymous user
            anonymous_customer = Customer.objects.filter(customer_id=anonymous_session_key).first()
            
            if anonymous_customer is not None:
                with transaction.atomic():
                    # Transfer items from the anonymous user's cart to the logged-in user's cart
                    anonymous_order = Order.objects.filter(customer=anonymous_customer, complete=False).first()
                    if anonymous_order is not None:
                        logged_in_customer = Customer.objects.filter(user=user).first()
                        logged_in_order, created = Order.objects.get_or_create(customer=logged_in_customer, complete=False)
                        
                        for item in anonymous_order.orderitem_set.all():
                            # Check if the same product is already in the logged-in user's cart
                            existing_item = logged_in_order.orderitem_set.filter(product=item.product).first()
                            if existing_item:
                                existing_item.quantity += item.quantity
                                existing_item.save()
                            else:
                                item.order = logged_in_order
                                item.save()
                        
                        # Delete the anonymous user's cart
                        anonymous_order.delete()
                        anonymous_customer.delete()

            redirect_url = request.session.get('redirect_url', '/')
            
            # Clear the stored URL in the session
            request.session.pop('redirect_url', None)
            
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

class AuthCheck(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            return Response({'logged_in': request.user.is_authenticated}, status=status.HTTP_200_OK)
        return Response({'bad request': 'user not logged in'}, status=status.HTTP_400_BAD_REQUEST)
class CartDataView(APIView):
    def get(self, request, *args, **kwargs):
        # Assuming the customer's order is passed in the request
        anonymous_user = False
        # print(request.user.is_authenticated)
        if not request.user.is_authenticated:
            if not request.session.exists(request.session.session_key):
                request.session.create()
            
            customer, customer_created = Customer.objects.get_or_create(customer_id=request.session.session_key)
            anonymous_user = True
        else:
            customer = Customer.objects.filter(user=request.user).first()
        
        
        order, order_created = Order.objects.get_or_create(customer=customer, complete=False)
        # print(order_created)
        print(f'session_key_cart_data: {request.session.session_key}')
        # print(order)

        if not order.orderitem_set.exists():
            cart_data = {
            'total_items': 0,
            'total_cost': 0,
            'items': [],
            'shipping': False,
            'anonymous_user': anonymous_user
        }
            return Response(cart_data)
        
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
            'items': item_list,
            'shipping': order.shipping,
            'anonymous_user': anonymous_user
        }

        # print(anonymous_user)
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
    

class ProcessOrderView(APIView):

    def post(self, request, format=None):
        if not request.user.is_authenticated:
            # Redirect unauthenticated users to the registration page
            return Response({"error": "User not authenticated", "redirect": "/register"}, status=status.HTTP_401_UNAUTHORIZED)
         
         
        user_info = request.data.get('user_info')
        shipping_info = request.data.get('shipping_info')
        total = request.data.get('total')
        name = user_info['name']
        email = user_info['email']

        print(request.user)
        
        # Check if the user is authenticated
        if not request.user.is_authenticated:
            customer, created = Customer.objects.get_or_create(customer_id=self.request.session.session_key)
            customer.name = name
            customer.email = email
            customer.save()
            order, created = Order.objects.get_or_create(customer=customer)
        else:
            customer = request.user.customer
            order, created = Order.objects.get_or_create(customer=customer)

        # Check if the user has the necessary permissions
        # In this example, we'll assume that only the customer who placed the order or a superuser can process it
        if request.user != customer.user and not request.user.is_superuser:
            return Response({"error": "You do not have permission to process this order"}, status=status.HTTP_403_FORBIDDEN)

        # Add your order processing logic here

        # For example, you might update the order's status to 'processed'
        if total == order.get_cart_total:
            order.complete = True
            order.save()
            print(order)
        if order.shipping == True:
            ShippingAddress.objects.create(
            customer=customer,
            order=order,
            address=shipping_info['address'],
            city=shipping_info['city'],
            state=shipping_info['state'],
            zipcode=shipping_info['zipcode'],
            )

        return Response({"message": "Order processed successfully"}, status=status.HTTP_200_OK)
