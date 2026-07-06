from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reviews', '0004_review_is_approved_review_created_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='review',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='reviews/'),
        ),
    ]
