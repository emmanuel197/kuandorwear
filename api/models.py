from django.db import models
from django.contrib.auth.models import User
import random, string

# Create your models here.


class Customer(models.Model):
    customer_id = models.CharField(max_length=200, null=True, blank=True)
    user = models.OneToOneField(User, null=True, blank=True, on_delete=models.CASCADE)
    name = models.CharField(max_length=200, null=True, blank=True)
    email = models.EmailField(max_length=200, null=True, blank=True)

    def __str__(self):
        if self.customer_id:
            return self.customer_id
        else:
            return self.name
    

class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=7, decimal_places=2)
    digital = models.BooleanField(default=False, null=True, blank=True)
    image = models.ImageField(upload_to='images/' ,null=True, blank=True)
    description = models.TextField(max_length=1000, null=True, blank=True)

    def __str__(self):
        return self.name
    
def generate_unique_transaction_id():
    length= 6
    while True:
        transaction_id = ''.join(random.choices(string.ascii_uppercase, k=length))
        if Order.objects.filter(transaction_id=transaction_id).count() == 0:
            break
    return transaction_id
class Order(models.Model):
    customer = models.ForeignKey(Customer, null=True, blank=True, on_delete=models.SET_NULL)
    transaction_id = models.CharField(default=generate_unique_transaction_id, max_length=8, unique=True)
    date_ordered = models.DateTimeField(auto_now_add=True)
    complete = models.BooleanField(default=False)

    def __str__(self):
        return self.transaction_id
    
    @property
    def get_cart_total(self):
        orderitems = self.orderitem_set.all()
        total = sum([item.get_total for item in orderitems])
        return total

    @property
    def get_cart_items(self):
        orderitems = self.orderitem_set.all()
        total = sum([item.quantity for item in orderitems])
        return total
    
    @property
    def shipping(self):
        shipping = False
        all_digital = all([item.product.digital for item in self.orderitem_set.all()])
        if not all_digital:
            shipping = True
        return shipping

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=0, null=True, blank=True)
    date_added = models.DateTimeField(auto_now_add=True)

    @property
    def get_total(self):
        total = self.product.price * self.quantity
        return total

class ShippingAddress(models.Model): 
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE) 
    order = models.ForeignKey(Order, on_delete=models.CASCADE) 
    address = models.CharField(max_length=200) 
    city = models.CharField(max_length=200) 
    state = models.CharField(max_length=200) 
    zipcode = models.CharField(max_length=200)
    country = models.CharField(max_length=200) 
    date_added = models.DateTimeField(auto_now_add=True)