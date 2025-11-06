from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router for the Doctor's ViewSets
router = DefaultRouter()
router.register(r'patients', views.PatientViewSet, basename='patient')
router.register(r'history', views.DentalHistoryViewSet, basename='history')
router.register(r'prescriptions', views.PrescriptionViewSet, basename='prescription')

# Define the URLs
urlpatterns = [
    # --- Doctor URLs ---
    # This automatically creates:
    # /api/patients/patients/ (for the list of patients)
    # /api/patients/history/ (for creating/viewing history)
    # /api/patients/prescriptions/ (for creating/viewing prescriptions)
    path('', include(router.urls)),
    
    # --- Patient URL ---
    # This is the separate, secure URL for a patient to see their own profile
    path('me/', views.MyProfileView.as_view(), name='my_profile'),
]
