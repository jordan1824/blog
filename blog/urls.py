from django.urls import path

from . import views

from .views import PostListView, PostDetailView, UserPostListView

urlpatterns = [
    path("", views.PostListView.as_view(), name='blog-home'),
    path("post/<int:pk>/", views.PostDetailView.as_view(), name='post-detail'),
    path("user/<str:username>", views.UserPostListView.as_view(), name='user-posts')
]
