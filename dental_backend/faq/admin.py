from django.contrib import admin

# Register your models here.
# faq/admin.py
from django.contrib import admin
from .models import FaqCategory, FaqItem

class FaqItemInline(admin.TabularInline): # Makes editing items easier within category
    model = FaqItem
    extra = 1 # Show one empty slot for adding new items
    fields = ('question', 'answer', 'item_order') # Fields to show inline

@admin.register(FaqCategory)
class FaqCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'display_order')
    inlines = [FaqItemInline] # Add items directly under category

