from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models import Patient

@receiver(post_save, sender=User)
def create_patient_profile(sender, instance, created, **kwargs):
    """
    A signal that automatically creates a Patient profile
    as soon as a new User is created.
    """
    if created:
        # We only create a profile for non-staff users
        if not instance.is_staff:
            Patient.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_patient_profile(sender, instance, **kwargs):
    """
    A signal that saves the profile when the User object is saved.
    """
    if hasattr(instance, 'patient_profile'):
        instance.patient_profile.save()
