from rest_framework import viewsets, generics
from rest_framework.permissions import IsAuthenticated
from .models import Patient, DentalHistory, Prescription
from .serializers import (
    PatientSerializer, 
    DentalHistorySerializer, 
    PrescriptionSerializer,
    DentalHistoryCreateSerializer,
    PrescriptionCreateSerializer
)
from .permissions import IsStaffUser

# --- DOCTOR-ONLY VIEWS (Uses Admin Cookie) ---

class PatientViewSet(viewsets.ReadOnlyModelViewSet):
    """
    A viewset for the DOCTOR to view and search patients.
    Protected to only allow staff (admin) users.
    This is what your DoctorDashboard.jsx will use.
    """
    queryset = Patient.objects.all().prefetch_related('user', 'history__prescriptions')
    serializer_class = PatientSerializer
    permission_classes = [IsStaffUser] # <-- Custom permission

class DentalHistoryViewSet(viewsets.ModelViewSet):
    """
    A viewset for the DOCTOR to create, view, edit, and delete dental history.
    """
    queryset = DentalHistory.objects.all()
    # Use the simple serializer for creating/updating
    serializer_class = DentalHistoryCreateSerializer 
    permission_classes = [IsStaffUser]

class PrescriptionViewSet(viewsets.ModelViewSet):
    """
    A viewset for the DOCTOR to create, view, edit, and delete prescriptions.
    """
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionCreateSerializer
    permission_classes = [IsStaffUser]


# --- PATIENT-ONLY VIEW (Uses JWT Token) ---

class MyProfileView(generics.RetrieveAPIView):
    """
    A view for a logged-in PATIENT to see their own profile.
    Protected to only allow authenticated users (with a JWT token).
    """
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated] # <-- Built-in permission

    def get_object(self):
        """
        This view automatically returns the 'patient_profile'
        associated with the logged-in user (from the token).
        """
        # self.request.user is the User (from the JWT token)
        # .patient_profile is the related Patient object we created
        return self.request.user.patient_profile
