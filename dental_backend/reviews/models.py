from django.db import models
from django.contrib.auth.models import User 

class Review(models.Model):
    user = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True,  
        blank=True, 
        related_name='reviews'
    )

    patient_name = models.CharField(max_length=100, blank=True) 
    review_text = models.TextField()
    rating = models.IntegerField(default=5)

    def __str__(self):
        # --- THIS IS THE NEW, SAFER CODE ---
        if self.user:
            # If a user is linked, use their name
            name = self.user.get_full_name() or self.user.username
            return f"Review by {name}"
        if self.patient_name:
            # If no user, but patient_name exists (like your old reviews)
            return f"Review by {self.patient_name}"
        
        # If no user AND no name (the "broken" review)
        return f"Review (ID: {self.id} - No Name)"