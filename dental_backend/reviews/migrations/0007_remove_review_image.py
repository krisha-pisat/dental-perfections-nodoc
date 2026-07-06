from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('reviews', '0006_reviewimage'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='review',
            name='image',
        ),
    ]
