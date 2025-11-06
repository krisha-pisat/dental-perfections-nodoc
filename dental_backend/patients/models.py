
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Patient(models.Model):
    # This links a Patient to a User account (like 'Kiah')
    # A User can have one Patient profile, and a Patient profile belongs to one User.
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient_profile')
    phone = models.CharField(max_length=20, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    added_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        # This will show the user's full name or username in the admin
        return f"{self.user.first_name} {self.user.last_name}" or self.user.username

class DentalHistory(models.Model):
    # A Patient can have MANY history entries
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='history')
    visit_date = models.DateTimeField(default=timezone.now)
    notes = models.TextField(blank=True, help_text="Notes from the visit")
    treatment_provided = models.CharField(max_length=500, blank=True)

    def __str__(self):
        return f"Visit for {self.patient.user.username} on {self.visit_date.strftime('%Y-%m-%d')}"

    class Meta:
        ordering = ['-visit_date'] # Show newest visits first
        verbose_name_plural = "Dental Histories"

class Prescription(models.Model):
    # A single history entry (visit) can have MANY prescriptions
    history_entry = models.ForeignKey(DentalHistory, on_delete=models.CASCADE, related_name='prescriptions')
    medicine_name = models.CharField(max_length=200)
    dosage = models.CharField(max_length=100, blank=True, help_text="e.g., 500mg")
    instructions = models.CharField(max_length=500, blank=True, help_text="e.g., Twice a day after meals")

    def __str__(self):
        return f"{self.medicine_name} ({self.dosage})"