from django.shortcuts import get_object_or_404, redirect
from .serializers import ProductSerializer
from .models import Product, Order, OrderItem, Customer, ShippingAddress
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status
from django.core.validators import validate_email
from django.http import JsonResponse
from django.db import transaction
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
import json
# from django.contrib.auth.decorators import login_required

# Create your views here.

class ProductListView(generics.ListAPIView):
        queryset = Product.objects.all()
        serializer_class = ProductSerializer

class ProductDetailView(generics.RetrieveAPIView):
    serializer_class = ProductSerializer
    def get(self, request, *args, **kwargs):
        # print(request.headers)
        id = self.kwargs.get('id')
        try:
            product = Product.objects.get(id=id)
            serializer = ProductSerializer(product)
            return Response(serializer.data)
        except Product.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        

class CreateOrUpdateOrderView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    def post(self, request, *args, **kwargs):
        data = request.data
        product_id = data.get('product_id')
        product = get_object_or_404(Product, id=product_id)
        # print(request.user)
        customer, created = Customer.objects.get_or_create(user=request.user)

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

    

class AuthCheck(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            return Response({'logged_in': request.user.is_authenticated}, status=status.HTTP_200_OK)
        else:
            return Response({'logged_out': request.user.is_authenticated}, status=status.HTTP_200_OK)


class CartDataView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes =[JWTAuthentication]

   
    def get(self, request, *args, **kwargs):
        # print(f"auth user {request.user.is_authenticated}")
        # print(f"user pk {request.user.pk}")

        # if request.user.is_authenticated:
        customer = Customer.objects.filter(user=self.request.user).first()
        # print(f'customer {customer}')
        order, order_created = Order.objects.get_or_create(customer=customer, complete=False)
        # print(f'order {order}')
        items = order.orderitem_set.all()
        # print(f'items {items}')
        item_list = []
        for item in items:
            item_list.append({
                'id': item.product.id,
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
                'order_status': order.complete
            }

            
           
            

        return Response(cart_data)

class updateCartView(APIView):
    authentication_classes = [  JWTAuthentication ]
    permission_classes = [ IsAuthenticated ]
    
    def post(self, request, format=None):
        data = request.data
        product_id = data.get('product_id')
        action = data.get('action')
        product = Product.objects.get(id=product_id)
        # print(product)
        # if request.user.is_authenticated:
        customer = Customer.objects.filter(user=request.user).first()
        # else:
            # customer = Customer.objects.filter(customer_id=self.request.session.session_key).first()
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
    permission_classes = [ IsAuthenticated ]
    authentication_classes = [ JWTAuthentication ]
    def post(self, request, format=None):         
        user_info = request.data.get('user_info')
        shipping_info = request.data.get('shipping_info')
        total = request.data.get('total')
        

        # print(request.user)
        
        # Check if the user is authenticated
        # if not request.user.is_authenticated:
        #     customer, created = Customer.objects.get_or_create(customer_id=self.request.session.session_key)
        #     customer.name = name
        #     customer.email = email
        #     customer.save()
        #     order, created = Order.objects.get_or_create(customer=customer)
        # else:
        customer = request.user.customer
        order, created = Order.objects.get_or_create(customer=customer, complete=False)

        # Check if the user has the necessary permissions
        # In this example, we'll assume that only the customer who placed the order or a superuser can process it
        if request.user != customer.user and not request.user.is_superuser:
            return Response({"error": "You do not have permission to process this order"}, status=status.HTTP_403_FORBIDDEN)

        # Add your order processing logic here

        # For example, you might update the order's status to 'processed'
        
        if total == float(order.get_cart_total):
            order.complete = True
            order.save()
    
        if order.shipping == True:
            ShippingAddress.objects.create(
            customer=customer,
            order=order,
            address=shipping_info['address'],
            city=shipping_info['city'],
            state=shipping_info['state'],
            zipcode=shipping_info['zipcode'],
            country=shipping_info['country']
            )
        
        return Response({'order_status': order.complete}, status=status.HTTP_200_OK)

class UnAuthProcessOrderView(APIView):
    def post(self, request, format=None):         
        user_info = request.data.get('user_info')
        shipping_info = request.data.get('shipping_info')
        total = request.data.get('total')
        name = user_info['name']
        email = user_info['email']

        customer, created = Customer.objects.get_or_create(name=name, email=email)
        order, created = Order.objects.get_or_create(customer=customer)

        cart = json.loads(request.COOKIES['cart'])
        for i in cart:
            if cart[i]['quantity'] > 0:  
                product = Product.objects.get(id=i)
                OrderItem.objects.get_or_create(
                order=order, 
                product=product,
                defaults={'quantity': cart[i]['quantity']}
            )
        if total == float(order.get_cart_total):
            order.complete = True
            order.save()
    
        if order.shipping == True:
            ShippingAddress.objects.create(
            customer=customer,
            order=order,
            address=shipping_info['address'],
            city=shipping_info['city'],
            state=shipping_info['state'],
            zipcode=shipping_info['zipcode'],
            country=shipping_info['country']
            )
        
        return Response({'order_status': order.complete}, status=status.HTTP_200_OK)
