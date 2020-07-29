from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic import ListView, DetailView
from .models import Post
from django.contrib.auth.models import User


class PostListView(ListView):
    model = Post
    template_name = 'blog/index.html'
    paginate_by = 5
    ordering = ['-last_modified']


class PostDetailView(DetailView):
    model = Post


class UserPostListView(ListView):
    model = Post
    template_name = 'blog/userposts.html'
    paginate_by = 10

    def get_queryset(self):
        user = get_object_or_404(User, username=self.kwargs.get('username'))
        return Post.objects.filter(author=user).order_by('-last_modified').all()
