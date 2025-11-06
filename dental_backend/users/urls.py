from django.urls import path
from .views import RegisterView, UserDetailView # <-- Import UserDetailView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('me/', UserDetailView.as_view(), name='user_detail'), # <-- ADD THIS NEW ROUTE
]