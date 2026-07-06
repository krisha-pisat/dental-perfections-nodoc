from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reviews', '0007_remove_review_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='reviewimage',
            name='image',
            field=models.URLField(max_length=500),
        ),
    ]
