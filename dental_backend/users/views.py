from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated # <-- Import IsAuthenticated
from .serializers import RegisterSerializer, UserSerializer # <-- Import UserSerializer

# --- Your existing RegisterView ---
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

# --- NEW VIEW ---
# This view is protected and only accessible with a valid token.
# It returns the details of the user who owns the token.
class UserDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated] # <-- Requires a valid token
    serializer_class = UserSerializer

    def get_object(self):
        # get_object() is automatically called by RetrieveAPIView
        # We return the user associated with the request (token).
        return self.request.user