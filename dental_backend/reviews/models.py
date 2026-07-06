from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

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
    is_approved = models.BooleanField(default=False, help_text="Only approved reviews are shown publicly.")
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        if self.user:
            name = self.user.get_full_name() or self.user.username
            return f"Review by {name}"
        if self.patient_name:
            return f"Review by {self.patient_name}"
        return f"Review (ID: {self.id} - No Name)"


class ReviewImage(models.Model):
    review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name='images')
    image = models.URLField(max_length=500)

    def __str__(self):
        return f"Image for {self.review}"