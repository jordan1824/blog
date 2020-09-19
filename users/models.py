from django.db import models
from django.contrib.auth.models import User
from PIL import Image


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.ImageField(default='default-pic.jpg',
                              upload_to='profile-images')
    bio = models.CharField(max_length=150, blank=True)

    def __str__(self):
        return self.user.username

    # def save(self, *args, **kwargs):
    #     super().save(*args, **kwargs)
    #     img = Image.open(self.image.path)
    #     dimensions = (300, 300)
    #     img.thumbnail(dimensions)
    #     img.save(self.image.path)
