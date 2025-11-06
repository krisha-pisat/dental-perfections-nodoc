from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router for the Doctor's ViewSets
router = DefaultRouter()
router.register(r'patients', views.PatientViewSet, basename='patient')
router.register(r'history', views.DentalHistoryViewSet, basename='history')
router.register(r'prescriptions', views.PrescriptionViewSet, basename='prescription')
# --- ADD NEW ROUTE FOR APPOINTMENTS ---
router.register(r'appointments', views.AppointmentViewSet, basename='appointment') 


# Define the URLs
urlpatterns = [
    # --- Doctor/API URLs ---
    # This automatically creates:
    # /api/patients/patients/ (list of patients)
    # /api/patients/history/ (history management)
    # /api/patients/prescriptions/ (prescription management)
    # /api/patients/appointments/ (appointment submission/management)
    path('', include(router.urls)),
    
    # --- Patient URL ---
    # This is the separate, secure URL for a patient to see their own profile
    path('me/', views.MyProfileView.as_view(), name='my_profile'),
]