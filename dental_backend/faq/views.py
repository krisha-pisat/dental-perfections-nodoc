from django.shortcuts import render
# Create your views here.
# faq/views.py
# faq/views.py
from rest_framework import viewsets 
from .models import FaqCategory 
from .serializers import FaqCategorySerializer
from rest_framework.permissions import AllowAny # <-- IMPORT THIS

class FaqCategoryViewSet(viewsets.ReadOnlyModelViewSet): 
    queryset = FaqCategory.objects.prefetch_related('items').all() 
    serializer_class = FaqCategorySerializer
    permission_classes = [AllowAny] # <-- ADD THIS LINE