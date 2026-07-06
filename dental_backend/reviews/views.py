from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Review
from .serializers import ReviewSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        # Public list only shows approved reviews
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
        # Patient-submitted reviews require approval before showing publicly
        serializer.save(user=user, patient_name=name_to_save, is_approved=False)