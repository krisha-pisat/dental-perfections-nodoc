from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Patient, DentalHistory, Prescription

# This serializer is from your 'users' app.
# We import it to nest it inside the PatientSerializer.
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

# --- Serializers for *Creating* Data ---
# These are simple, non-nested serializers for the Doctor to create new records.

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
