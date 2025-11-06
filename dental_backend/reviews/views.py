from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Review
from .serializers import ReviewSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all().order_by('-id')
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.action == 'list' or self.action == 'retrieve':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        """
        This method is called when a new review is created (POST).
        This is the new, corrected logic.
        """
        # 1. Get the logged-in user from the request
        user = self.request.user
        
        # 2. Get their full name or fallback to their username
        #    (The 'Kiah' user has a full name, so this will work)
        name_to_save = user.get_full_name() or user.username
        
        # 3. Save the serializer, explicitly passing in the 'user'
        #    and 'patient_name' data.
        serializer.save(user=user, patient_name=name_to_save)