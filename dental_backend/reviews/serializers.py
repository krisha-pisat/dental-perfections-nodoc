from rest_framework import serializers
from .models import Review, ReviewImage

class ReviewImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ReviewImage
        fields = ['id', 'image']

    def get_image(self, obj):
        if obj.image:
            try:
                return obj.image.url
            except Exception:
                return None
        return None

class ReviewSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(read_only=True)
    images = ReviewImageSerializer(many=True, read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'patient_name', 'review_text', 'rating', 'images', 'created_at']
        read_only_fields = ['id', 'patient_name', 'created_at', 'images']
