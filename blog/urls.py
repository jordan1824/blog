from django.urls import path

from . import views

from .views import PostListView, PostDetailView, UserPostListView, PostCreateView, PostUpdateView, PostDeleteView, UsersListView, SavedPostListView

urlpatterns = [
    path("", views.PostListView.as_view(), name='blog-home'),
    path("post/<int:pk>/", views.PostDetailView.as_view(), name='post-detail'),
    path("user/<str:username>", views.UserPostListView.as_view(), name='user-posts'),
    path("post/new/", views.PostCreateView.as_view(), name='create-post'),
    path("post/<int:pk>/update/", views.PostUpdateView.as_view(), name='update-post'),
    path("post/<int:pk>/delete/", views.PostDeleteView.as_view(), name='delete-post'),
    path("post/<int:pk>/save/", views.post_save, name='save-post'),
    path("users/list/", views.UsersListView.as_view(), name='users-list'),
    path("saved-posts/",
         views.SavedPostListView.as_view(), name='saved-posts'),
    path("post/<int:pk>/remove/", views.remove_post, name='remove-post'),
    path('search/', views.user_search, name='search'),
    path('post/search/', views.post_search, name='post-search'),
    path('add-comment/', views.add_comment, name='add-comment'),
    path('delete-comment/<int:pk>/',
         views.delete_comment, name='delete-comment')
]
