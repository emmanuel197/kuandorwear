from django.urls import path
from .views import *

urlpatterns = [
    path('', index, name="homepage"),
    path('product/<int:id>', index),
    path('cart', index),
    path('checkout', index)
]