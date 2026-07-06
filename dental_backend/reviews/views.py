from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Review, ReviewImage
from .serializers import ReviewSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        if self.action in ['list', 'retrieve']:
            return Review.objects.filter(is_approved=True).order_by('-created_at')
        return Review.objects.all().order_by('-created_at')

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        user = self.request.user
        name_to_save = user.get_full_name() or user.username
        review = serializer.save(user=user, patient_name=name_to_save, is_approved=False)

        # Save each uploaded image as a ReviewImage
        for img in self.request.FILES.getlist('images'):
            ReviewImage.objects.create(review=review, image=img)
