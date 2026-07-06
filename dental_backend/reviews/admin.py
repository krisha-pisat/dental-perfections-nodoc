import cloudinary.uploader
from django import forms
from django.contrib import admin
from .models import Review, ReviewImage


class ReviewImageAdminForm(forms.ModelForm):
    upload = forms.ImageField(required=False, label='Upload Image')

    class Meta:
        model = ReviewImage
        fields = []

    def save(self, commit=True):
        instance = super().save(commit=False)
        upload_file = self.cleaned_data.get('upload')
        if upload_file:
            result = cloudinary.uploader.upload(upload_file, folder='reviews')
            instance.image = result['secure_url']
        if commit:
            instance.save()
        return instance


class ReviewImageInline(admin.TabularInline):
    model = ReviewImage
    form = ReviewImageAdminForm
    extra = 1
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
