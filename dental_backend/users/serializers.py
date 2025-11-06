from django.contrib.auth.models import User
from rest_framework import serializers

# --- NEW SERIALIZER ---
# This will be used to show the user's details
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # Only include non-sensitive fields
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

# --- Your existing RegisterSerializer ---
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=8)

    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'first_name', 'last_name')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            password=validated_data['password']
        )
        return user