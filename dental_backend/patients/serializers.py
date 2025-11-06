from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Patient, DentalHistory, Prescription, Appointment
from users.serializers import UserSerializer

class PrescriptionSerializer(serializers.ModelSerializer):
    """
    Serializer for the Prescription model.
    """
    class Meta:
        model = Prescription
        fields = ['id', 'medicine_name', 'dosage', 'instructions']

class DentalHistorySerializer(serializers.ModelSerializer):
    """
    Serializer for the DentalHistory model.
    It nests the prescriptions related to it.
    """
    # 'prescriptions' is the 'related_name' we set in models.py
    prescriptions = PrescriptionSerializer(many=True, read_only=True)

    class Meta:
        model = DentalHistory
        fields = ['id', 'visit_date', 'notes', 'treatment_provided', 'prescriptions']

class PatientSerializer(serializers.ModelSerializer):
    """
    Serializer for the Patient model.
    This is the main serializer for the DOCTOR's dashboard.
    It nests the user's details and their full dental history.
    """
    # 'user' is the field on the Patient model
    user = UserSerializer(read_only=True)
    # 'history' is the 'related_name' we set in models.py
    history = DentalHistorySerializer(many=True, read_only=True)

    class Meta:
        model = Patient
        fields = [
            'id', 
            'user', 
            'phone', 
            'date_of_birth', 
            'added_date', 
            'history'
        ]

# --- Serializers for *Creating* Data (Doctor/Staff) ---

class DentalHistoryCreateSerializer(serializers.ModelSerializer):
    """
    Simple serializer for creating/updating a history entry.
    """
    class Meta:
        model = DentalHistory
        # 'patient' will be a dropdown/ID in the API
        fields = ['patient', 'visit_date', 'notes', 'treatment_provided']

class PrescriptionCreateSerializer(serializers.ModelSerializer):
    """
    Simple serializer for creating/updating a prescription.
    """
    class Meta:
        model = Prescription
        # 'history_entry' will be a dropdown/ID in the API
        fields = ['history_entry', 'medicine_name', 'dosage', 'instructions']

# --- NEW APPOINTMENT SERIALIZERS ---

class AppointmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['id', 'service_requested', 'appointment_date', 'appointment_time', 'notes']

class AppointmentSerializer(serializers.ModelSerializer):
    """
    Serializer for viewing appointment details (used by the Doctor/Staff).
    """
    # CRITICAL FIX: Comment out nested fields to avoid crashes with AllowAny permissions
    # patient_username = serializers.CharField(source='patient.user.username', read_only=True)
    # patient_name = serializers.CharField(source='patient.user.get_full_name', read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 
            'patient', # Patient ID
            # 'patient_username', 
            # 'patient_name',
            'service_requested', 
            'appointment_date', 
            'appointment_time', 
            'notes', 
            'status', 
            'created_at'
        ]
        read_only_fields = [
            'patient', 
            # 'patient_username', 
            # 'patient_name', 
            'created_at'
        ]