from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('reviews', '0003_alter_review_patient_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='review',
            name='is_approved',
            field=models.BooleanField(default=False, help_text='Only approved reviews are shown publicly.'),
        ),
        migrations.AddField(
            model_name='review',
            name='created_at',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
