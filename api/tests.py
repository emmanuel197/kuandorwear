from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase, APIClient

from .models import (
    Brand, Customer, Order, OrderItem, Product, generate_unique_transaction_id,
)

User = get_user_model()


def make_product(name="Tee", price="50.00", stock=5, digital=False, brand=None):
    return Product.objects.create(
        name=name, price=price, stock_quantity=stock, digital=digital, brand=brand,
    )


class ProductModelTests(TestCase):
    def test_is_in_stock_true_when_quantity_positive(self):
        self.assertTrue(make_product(stock=3).is_in_stock)

    def test_is_in_stock_false_when_quantity_zero(self):
        self.assertFalse(make_product(stock=0).is_in_stock)

    def test_get_completed_counts_only_complete_orders(self):
        product = make_product()
        done = Order.objects.create(complete=True)
        pending = Order.objects.create(complete=False)
        OrderItem.objects.create(order=done, product=product, quantity=1)
        OrderItem.objects.create(order=pending, product=product, quantity=1)
        self.assertEqual(product.get_completed, 1)


class OrderModelTests(TestCase):
    def setUp(self):
        self.order = Order.objects.create()
        self.shirt = make_product(name="Shirt", price="40.00")
        self.ebook = make_product(name="Guide", price="10.00", digital=True)

    def test_cart_total_and_items(self):
        OrderItem.objects.create(order=self.order, product=self.shirt, quantity=2)
        OrderItem.objects.create(order=self.order, product=self.ebook, quantity=1)
        self.assertEqual(self.order.get_cart_items, 3)
        self.assertEqual(float(self.order.get_cart_total), 90.00)

    def test_shipping_true_when_any_physical_item(self):
        OrderItem.objects.create(order=self.order, product=self.shirt, quantity=1)
        self.assertTrue(self.order.shipping)

    def test_shipping_false_when_all_digital(self):
        OrderItem.objects.create(order=self.order, product=self.ebook, quantity=1)
        self.assertFalse(self.order.shipping)

    def test_transaction_id_is_six_uppercase_letters(self):
        tid = generate_unique_transaction_id()
        self.assertEqual(len(tid), 6)
        self.assertTrue(tid.isalpha() and tid.isupper())


class OrderItemModelTests(TestCase):
    def test_get_total_multiplies_price_by_quantity(self):
        order = Order.objects.create()
        OrderItem.objects.create(
            order=order, product=make_product(price="25.50"), quantity=4,
        )
        # Re-fetch so product.price is a Decimal (as it is everywhere the app
        # reads it from the DB) rather than the literal string passed to create().
        item = OrderItem.objects.select_related("product").get(order=order)
        self.assertEqual(float(item.get_total), 102.00)


class ProductEndpointTests(APITestCase):
    def setUp(self):
        brand = Brand.objects.create(name="Kuandor")
        self.tee = make_product(name="Logo Tee", price="50.00", brand=brand)
        make_product(name="Hoodie", price="120.00")

    def test_product_list_returns_all_products(self):
        response = self.client.get("/api/products")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        names = {p["name"] for p in response.json()}
        self.assertEqual(names, {"Logo Tee", "Hoodie"})

    def test_product_list_serializes_brand_and_stock(self):
        response = self.client.get("/api/products")
        tee = next(p for p in response.json() if p["name"] == "Logo Tee")
        self.assertEqual(tee["brand"], "Kuandor")
        self.assertTrue(tee["in_stock"])

    def test_search_matches_name(self):
        response = self.client.get("/api/search/", {"q": "hoodie"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual([p["name"] for p in response.json()], ["Hoodie"])

    def test_search_without_query_returns_empty_list(self):
        response = self.client.get("/api/search/")
        self.assertEqual(response.json(), [])


class CartEndpointAuthTests(APITestCase):
    def test_cart_data_requires_authentication(self):
        response = self.client.get("/api/cart-data/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_cart_data_returns_order_for_authenticated_user(self):
        from rest_framework_simplejwt.tokens import RefreshToken

        user = User.objects.create_user(
            email="shopper@example.com", username="shopper",
            first_name="A", last_name="B", password="pass",
        )
        token = RefreshToken.for_user(user)
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"JWT {token.access_token}")
        response = client.get("/api/cart-data/")
        # Authenticated, but the freshly-created order has no items, so the
        # view returns 404 ("No Such Order Item Exists") -- it still proves the
        # request was authenticated and the order was created for this user.
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(Order.objects.filter(customer__user=user).count(), 1)
