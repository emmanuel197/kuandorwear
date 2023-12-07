from django.urls import path
from .views import *

urlpatterns = [
    path('products', ProductListView.as_view()),
    path('product/<int:id>', ProductDetailView.as_view()),
    path('create-order/', CreateOrUpdateOrderView.as_view()),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('check-auth/', AuthCheck.as_view()),
    path('logout/', LogoutView.as_view()),
    path('cart-data/', CartDataView.as_view()),
    path('update-cart/', updateCartView.as_view()),
    path('process-order/', ProcessOrderView.as_view())
]