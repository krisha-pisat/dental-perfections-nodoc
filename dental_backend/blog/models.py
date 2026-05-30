# blog/models.py
from django.db import models
from django.utils import timezone

class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, max_length=200)
    excerpt = models.TextField(blank=True)
    category = models.CharField(max_length=50)
    image_url = models.CharField(max_length=200, blank=True, null=True)
    publish_date = models.DateField(default=timezone.now)
    read_time = models.CharField(max_length=20, blank=True)
    content = models.TextField(blank=True) 
    external_url = models.URLField(max_length=500, blank=True, null=True) 

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-publish_date']