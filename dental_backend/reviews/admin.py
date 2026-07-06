from django.contrib import admin
from .models import Review, ReviewImage

class ReviewImageInline(admin.TabularInline):
    model = ReviewImage
    extra = 0
    readonly_fields = ('image',)

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('patient_name', 'rating', 'is_approved', 'created_at', 'short_review')
    list_filter = ('is_approved', 'rating')
    list_editable = ('is_approved',)
    ordering = ('-created_at',)
    search_fields = ('patient_name', 'review_text')
    inlines = [ReviewImageInline]

    def short_review(self, obj):
        return obj.review_text[:80] + '...' if len(obj.review_text) > 80 else obj.review_text
    short_review.short_description = 'Review'
