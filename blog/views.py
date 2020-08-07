from django.shortcuts import render, redirect, get_object_or_404
from django.db.models import Q
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from .models import Post, SavedPost, PostComment
from django.contrib.auth.models import User
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.contrib import messages


class PostListView(LoginRequiredMixin, ListView):
    model = Post
    template_name = 'blog/index.html'
    paginate_by = 5
    ordering = ['-last_modified']

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["home"] = 'active'
        context["saved_posts"] = SavedPost.objects.filter(
            user=self.request.user).all().order_by('-time_added')
        return context


class PostDetailView(LoginRequiredMixin, DetailView):
    model = Post

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["comments"] = PostComment.objects.filter(
            post=context['object']).all().order_by('-time_posted')
        return context


class UserPostListView(LoginRequiredMixin, ListView):
    model = Post
    template_name = 'blog/userposts.html'
    paginate_by = 10

    def get_queryset(self):
        user = get_object_or_404(User, username=self.kwargs.get('username'))
        return Post.objects.filter(author=user).order_by('-last_modified').all()


class PostCreateView(LoginRequiredMixin, CreateView):
    model = Post
    fields = ['title', 'content']

    def form_valid(self, form):
        form.instance.author = self.request.user
        return super().form_valid(form)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["create"] = 'active'
        return context


class PostUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = Post
    fields = ['title', 'content']
    template_name = 'blog/update.html'

    def form_valid(self, form):
        form.instance.author = self.request.user
        return super().form_valid(form)

    def test_func(self):
        if self.request.user == self.get_object().author:
            return True
        return False


class PostDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = Post
    success_url = '/'

    def test_func(self):
        if self.request.user == self.get_object().author:
            return True
        return False


def post_save(request, pk):
    url = request.GET.get('url')
    post = Post.objects.get(id=pk)
    current_user = request.user
    if SavedPost.objects.filter(user=current_user, saved_post=post).first():
        messages.error(request, 'You already have that post saved.')
    else:
        new_save = SavedPost(user=current_user, saved_post=post)
        new_save.save()
        messages.success(request, f'"{post.title}" Has Been Saved!')
    return redirect(url)


class UsersListView(LoginRequiredMixin, ListView):
    model = User
    template_name = 'blog/users.html'
    paginate_by = 15

    def get_queryset(self):
        return User.objects.exclude(username=self.request.user.username).all()


class SavedPostListView(LoginRequiredMixin, ListView):
    model = SavedPost
    template_name = 'blog/saved_posts.html'
    paginate_by = 10

    def get_queryset(self):
        return SavedPost.objects.filter(user=self.request.user).all().order_by('-time_added')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["saved"] = 'active'
        return context


def remove_post(request, pk):
    post = Post.objects.get(id=pk)
    current_user = request.user
    if SavedPost.objects.filter(user=current_user, saved_post=post).first():
        SavedPost.objects.filter(user=current_user, saved_post=post).delete()
        messages.success(request, f'"{post.title}" Has Been Removed!')
    else:
        messages.error(request, 'That post is not in your saved posts.')
    return redirect('saved-posts')


def user_search(request):
    name = request.GET.get('q')
    if ' ' not in name:
        result = User.objects.filter(
            Q(first_name__icontains=name) | Q(last_name__icontains=name)).all()
    elif name.count(' ') == 1:
        first, last = name.split(' ')
        result = User.objects.filter(first_name=first, last_name=last).all()
        if not result:
            lowercase = first.lower()
            capital = lowercase.capitalize()
            result = User.objects.filter(Q(first_name__icontains=lowercase) | Q(
                first_name__icontains=capital)).all()
    elif name.count(' ') > 1:
        first = name.split(' ')[0]
        result = User.objects.filter(first_name=first).all()
    return render(request, 'blog/user_search.html', {'result': result})


def post_search(request):
    if request.method == "POST":
        topic = request.POST.get('topic')
        result = Post.objects.filter(
            Q(title__icontains=topic) | Q(content__icontains=topic)).all()
        if not result:
            note = f'Sorry, we could not find any posts about "{topic}"'
        else:
            note = ''
    else:
        note = ''
        result = ''

    return render(request, 'blog/post_search.html', {
        'note': note,
        'result': result
    })


def add_comment(request):
    comment = request.GET.get('comment')
    post_id = request.GET.get('post')
    post = Post.objects.get(id=post_id)
    user = request.user
    PostComment.objects.create(user=user, post=post, comment=comment)
    return redirect('post-detail', pk=post_id)


def delete_comment(request, pk):
    post_comment = PostComment.objects.get(id=pk)
    post = post_comment.post
    post_comment.delete()
    return redirect('post-detail', pk=post.id)
