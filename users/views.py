from django.shortcuts import render, redirect
from .forms import ProfileUpdateForm, UserUpdateForm, UserRegisterForm
from django.contrib import messages


def profile(request):
    if request.method == "POST":
        user_form = UserUpdateForm(request.POST, instance=request.user)
        profile_form = ProfileUpdateForm(
            request.POST, request.FILES, instance=request.user.profile)
        if user_form.is_valid() and profile_form.is_valid():
            user_form.save()
            profile_form.save()
            return redirect('profile')
    else:
        user_form = UserUpdateForm(instance=request.user)
        profile_form = ProfileUpdateForm(instance=request.user.profile)
    return render(request, "users/profile.html", {
        'user_form': user_form,
        'profile_form': profile_form
    })


def register(request):
    if request.method == "POST":
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            messages.success(
                request, f'Your account was successfully registered. Log In Below')
            return redirect('login')
    else:
        form = UserRegisterForm()
    return render(request, "users/register.html", {'form': form})
