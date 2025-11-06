# dental_backend/urls.py
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

def home(request):
    return JsonResponse({
        "message": "Welcome to the Dental Perfections API 🎉",
        "endpoints": {
            "blog": "/api/blog/posts/",
            "faq": "/api/faq/categories/",
            "reviews": "/api/reviews/",
            "patients": "/api/patients/patients/" # <-- Add new endpoint
        }
    })

urlpatterns = [
    path('admin/', admin.site.urls),

    # --- Authentication (JWT) URLs ---
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # --- App URLs ---
    path('api/users/', include('users.urls')), # For registration
    path('api/blog/', include('blog.urls')),
    path('api/faq/', include('faq.urls')),
    path('api/reviews/', include('reviews.urls')),
    
    # --- ADD THIS LINE ---
    # This connects all the new patient/doctor URLs
    path('api/patients/', include('patients.urls')), 
    
    # Root route
    path('', home),
]
