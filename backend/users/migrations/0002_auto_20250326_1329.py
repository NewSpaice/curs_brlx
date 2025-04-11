from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='User',
            name='avatar',
            field=models.ImageField(upload_to='avatars/', blank=True, null=True),
        ),
    ]
