# Generated by Django 4.2.6 on 2024-02-20 13:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='date_completed',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
