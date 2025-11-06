from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    # 'patient_name' is now read-only. It will be provided by the view.
    patient_name = serializers.CharField(read_only=True)

    class Meta:
        model = Review
        # We only list fields the user submits, plus read-only fields
        # 'user' and 'patient_name' will be added by the view.
        fields = ['id', 'patient_name', 'review_text', 'rating']
        read_only_fields = ['id', 'patient_name']