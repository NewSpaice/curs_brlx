# Generated by Django 5.1.7 on 2025-04-11 01:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0002_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='order',
            options={'ordering': ['-created_at'], 'verbose_name': 'Заказ', 'verbose_name_plural': 'Заказы'},
        ),
    ]
