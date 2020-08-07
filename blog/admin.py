from django.contrib import admin
from .models import Post, SavedPost, PostComment

admin.site.register(Post)
admin.site.register(SavedPost)
admin.site.register(PostComment)
