from .models import SavedPost

def saved_posts_list(request):
    if (request.user.username):
        saved_posts = list(SavedPost.objects.filter(user=request.user).all().values('saved_post'))
        saved_posts_list = list(map(lambda x: x["saved_post"], saved_posts))
    else:
        saved_posts_list = 0
    return {
        'saved_posts_list': saved_posts_list,
    }