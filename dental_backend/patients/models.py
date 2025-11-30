from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Patient(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient_profile')
    phone = models.CharField(max_length=20, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    added_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}" or self.user.username

class DentalHistory(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='history')
    visit_date = models.DateTimeField(default=timezone.now)
    notes = models.TextField(blank=True, help_text="Notes from the visit")
    treatment_provided = models.CharField(max_length=500, blank=True)

    def __str__(self):
        return f"Visit for {self.patient.user.username} on {self.visit_date.strftime('%Y-%m-%d')}"

    class Meta:
        ordering = ['-visit_date']
        verbose_name_plural = "Dental Histories"

class Prescription(models.Model):
    history_entry = models.ForeignKey(DentalHistory, on_delete=models.CASCADE, related_name='prescriptions')
    medicine_name = models.CharField(max_length=200)
    dosage = models.CharField(max_length=100, blank=True, help_text="e.g., 500mg")
    instructions = models.CharField(max_length=500, blank=True, help_text="e.g., Twice a day after meals")

    def __str__(self):
        return f"{self.medicine_name} ({self.dosage})"

class Appointment(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('CANCELLED', 'Cancelled'),
        ('COMPLETED', 'Completed'),
    ]

    patient = models.ForeignKey('Patient', on_delete=models.CASCADE, related_name='appointments') 
    
    service_requested = models.CharField(max_length=100) 
    
    # --- UPDATED: Allow nulls here so patients can just "Request" ---
    appointment_date = models.DateField(null=True, blank=True)
    appointment_time = models.TimeField(null=True, blank=True)
    # ---------------------------------------------------------------

    notes = models.TextField(blank=True, help_text="Reason for the visit or special request.")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['appointment_date', 'appointment_time']
        verbose_name_plural = "Appointments"
        
    def __str__(self):
        date_str = self.appointment_date if self.appointment_date else "Not Scheduled"
        return f"Appointment for {self.patient.user.username} on {date_str}"