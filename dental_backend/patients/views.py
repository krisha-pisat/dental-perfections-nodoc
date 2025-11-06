from rest_framework import viewsets, generics
from rest_framework.permissions import IsAuthenticated, AllowAny 
from rest_framework.authentication import SessionAuthentication
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from .models import Patient, DentalHistory, Prescription, Appointment
from .serializers import (
    PatientSerializer, 
    DentalHistorySerializer, 
    PrescriptionSerializer,
    DentalHistoryCreateSerializer,
    PrescriptionCreateSerializer,
    AppointmentCreateSerializer, 
    AppointmentSerializer 
)
from .permissions import IsStaffUser

# We still include SessionAuth for functionality, but access is now controlled by AllowAny
DOCTOR_AUTH_CLASSES = [SessionAuthentication] 

# --- DOCTOR-ONLY VIEWS (NO AUTHENTICATION REQUIRED FOR ACCESS) ---

@method_decorator(csrf_exempt, name='dispatch')
class PatientViewSet(viewsets.ReadOnlyModelViewSet):
    """
    SECURITY REMOVAL: Permission is set to AllowAny for easy testing.
    """
    authentication_classes = DOCTOR_AUTH_CLASSES
    queryset = Patient.objects.all().prefetch_related('user', 'history__prescriptions')
    serializer_class = PatientSerializer
    permission_classes = [AllowAny] 

class DentalHistoryViewSet(viewsets.ModelViewSet):
    """
    SECURITY REMOVAL: Permission is set to AllowAny for easy testing.
    """
    authentication_classes = DOCTOR_AUTH_CLASSES
    queryset = DentalHistory.objects.all()
    serializer_class = DentalHistoryCreateSerializer 
    permission_classes = [AllowAny] 

class PrescriptionViewSet(viewsets.ModelViewSet):
    """
    SECURITY REMOVAL: Permission is set to AllowAny for easy testing.
    """
    authentication_classes = DOCTOR_AUTH_CLASSES
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionCreateSerializer
    permission_classes = [AllowAny] 

# --- NEW APPOINTMENT VIEWSET (NO AUTHENTICATION REQUIRED FOR VIEWING) ---

class AppointmentViewSet(viewsets.ModelViewSet):
    # CRITICAL FIX: Simplified queryset to fix 500 error
    queryset = Appointment.objects.all() 
    
    def get_serializer_class(self):
        if self.action == 'create':
            return AppointmentCreateSerializer
        return AppointmentSerializer

    def get_permissions(self):
        # Allow any user (patient or unauthorized) to view/manage appointments
        if self.action != 'create':
            return [AllowAny()] 
        # Keep patient creation secure (requires JWT token)
        return [IsAuthenticated()]
        
    def perform_create(self, serializer):
        patient_instance = self.request.user.patient_profile
        serializer.save(patient=patient_instance, status='PENDING')


# --- PATIENT-ONLY VIEW (Uses JWT Token) ---
class MyProfileView(generics.RetrieveAPIView):
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated] 

    def get_object(self):
        return self.request.user.patient_profile