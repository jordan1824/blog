from django.urls import reverse
from django.db import models
from django.contrib.auth.models import User


class Post(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    last_modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('post-detail', kwargs={'pk': self.pk})


class SavedPost(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    saved_post = models.ForeignKey(Post, on_delete=models.CASCADE)
    time_added = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.user} - {self.saved_post}'


class PostComment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    comment = models.TextField()
    time_posted = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.post} - {self.comment}'
