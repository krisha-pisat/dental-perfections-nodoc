from django.contrib import admin
from .models import Patient, DentalHistory, Prescription, Appointment # <-- IMPORT Appointment

class PrescriptionInline(admin.TabularInline):
    """
    Allows you to edit prescriptions directly from the
    DentalHistory admin page.
    """
    model = Prescription
    extra = 1 # Number of empty forms to show

class DentalHistoryInline(admin.TabularInline):
    """
    Allows you to edit dental history directly from the
    Patient admin page.
    """
    model = DentalHistory
    # inlines = [PrescriptionInline]  <-- DELETE THIS LINE
    extra = 1

# --- NEW ADMIN CLASS FOR APPOINTMENTS ---
@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('patient_link', 'service_requested', 'appointment_date', 'appointment_time', 'status', 'created_at')
    list_filter = ('status', 'appointment_date', 'service_requested')
    search_fields = ('patient__user__username', 'patient__user__first_name', 'patient__user__last_name', 'service_requested')
    readonly_fields = ('patient', 'created_at') 

    def patient_link(self, obj):
        # Displays the patient's username, helping the staff identify the booking
        return obj.patient.user.username
    patient_link.short_description = 'Patient Username'


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    """
    Configuration for the Patient model in the admin panel.
    """
    list_display = ('user', 'phone', 'date_of_birth')
    search_fields = ('user__username', 'user__first_name', 'user__last_name', 'phone')
    inlines = [DentalHistoryInline]

# We can also register the other models directly if needed
@admin.register(DentalHistory)
class DentalHistoryAdmin(admin.ModelAdmin):
    list_display = ('patient', 'visit_date', 'treatment_provided')
    list_filter = ('visit_date', 'patient')
    inlines = [PrescriptionInline] # <-- THIS LINE IS GOOD, IT STAYS

@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    list_display = ('medicine_name', 'dosage', 'history_entry')
    search_fields = ('medicine_name',)