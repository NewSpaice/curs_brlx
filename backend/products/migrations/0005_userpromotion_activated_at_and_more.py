# Generated by Django 5.1.7 on 2025-04-11 01:32

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0004_promotion_userpromotion'),
    ]

    operations = [
        migrations.AddField(
            model_name='userpromotion',
            name='activated_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now, verbose_name='Дата активации'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='userpromotion',
            name='used_at',
            field=models.DateTimeField(blank=True, null=True, verbose_name='Дата использования'),
        ),
    ]
