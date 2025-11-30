from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Patient, DentalHistory, Prescription, Appointment
from users.serializers import UserSerializer

# --- 1. MOVED TO TOP: AppointmentSerializer ---
class AppointmentSerializer(serializers.ModelSerializer):
    """
    Serializer for viewing appointment details.
    """
    patient_username = serializers.CharField(source='patient.user.username', read_only=True)
    patient_name = serializers.CharField(source='patient.user.get_full_name', read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 
            'patient', 
            'patient_username', 
            'patient_name',
            'service_requested', 
            'appointment_date', 
            'appointment_time', 
            'notes', 
            'status', 
            'created_at'
        ]
        read_only_fields = ['patient', 'patient_username', 'patient_name', 'created_at']

# --- EXISTING SERIALIZERS ---

class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = ['id', 'medicine_name', 'dosage', 'instructions']

class DentalHistorySerializer(serializers.ModelSerializer):
    prescriptions = PrescriptionSerializer(many=True, read_only=True)

    class Meta:
        model = DentalHistory
        fields = ['id', 'visit_date', 'notes', 'treatment_provided', 'prescriptions']

class PatientSerializer(serializers.ModelSerializer):
    """
    Main serializer for Patient Profile.
    Now includes 'appointments' so the patient can see their status.
    """
    user = UserSerializer(read_only=True)
    history = DentalHistorySerializer(many=True, read_only=True)
    
    # --- 2. ADDED: Include appointments in the profile ---
    appointments = AppointmentSerializer(many=True, read_only=True)
    # -----------------------------------------------------

    class Meta:
        model = Patient
        fields = [
            'id', 
            'user', 
            'phone', 
            'date_of_birth', 
            'added_date', 
            'history',
            'appointments' # <-- Added to fields list
        ]

class DentalHistoryCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DentalHistory
        fields = ['patient', 'visit_date', 'notes', 'treatment_provided']

class PrescriptionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = ['history_entry', 'medicine_name', 'dosage', 'instructions']

class AppointmentCreateSerializer(serializers.ModelSerializer):
    # Allow nulls for the initial request
    appointment_date = serializers.DateField(required=False, allow_null=True)
    appointment_time = serializers.TimeField(required=False, allow_null=True)

    class Meta:
        model = Appointment
        fields = ['id', 'service_requested', 'appointment_date', 'appointment_time', 'notes']