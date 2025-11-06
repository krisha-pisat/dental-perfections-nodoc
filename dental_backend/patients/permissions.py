from rest_framework.permissions import BasePermission

class IsStaffUser(BasePermission):
    """
    Allows access only to "staff" users.
    This is for your Doctor Dashboard (cookie authentication).
    """
    def has_permission(self, request, view):
        # request.user is available because of the admin cookie
        return request.user and request.user.is_staff
