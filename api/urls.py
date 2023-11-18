from django.urls import path
from .views import *

urlpatterns = [
    path('products', ProductListView.as_view()),
    path('product/<int:id>', ProductDetailView.as_view()),
    path('create-order/', CreateOrderView.as_view()),
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    
]