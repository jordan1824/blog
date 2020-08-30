from .models import SavedPost

def saved_posts_list(request):
    saved_posts = list(SavedPost.objects.filter(user=request.user).all().values('saved_post'))
    saved_posts_list = list(map(lambda x: x["saved_post"], saved_posts))

    return {
        'saved_posts_list': saved_posts_list,
    }