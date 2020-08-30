from django.shortcuts import render, redirect
from .forms import ProfileUpdateForm, UserUpdateForm, UserRegisterForm
from django.contrib import messages
from django.contrib.auth.views import LoginView, LogoutView
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
import re
from django.contrib.auth.models import User


@login_required
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
        'profile_form': profile_form,
        'profile': 'active'
    })

errors = []

def quickCheck(input, max, name):
    if not(input):
        errors.append(f"You must provide a valid {name}.")
    if len(input) > max:
        errors.append(f"Your {name} cannot exceed {max} characters.")
    if name != "password":
        for symbol in "[$&+,:;=?@#|<>.^*()%!_-]":
            if symbol in input:
                errors.append(f"Your {name} cannot contain special characters.")
                break


def register(request):
    if request.method == "POST":
        # Clears errors list from previous post
        errors.clear()
        # Grabs all data submitted
        first_name = request.POST['first_name']
        last_name = request.POST['last_name']
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']
        password_confirm = request.POST['password_confirm']
        # Applies length check, special character check, & makes sure each field has submitted data
        quickCheck(first_name, 250, "first name")
        quickCheck(last_name, 250, "last name")
        quickCheck(username, 50, "username")
        quickCheck(password, 50, "password")
        # Other important validation checks
        if 0 < len(username) < 4:
            errors.append("Your username must be atleast 4 characters long.")
        if 0 < len(password) < 8:
            errors.append("Your password must be atleast 8 characters long.")
        if len(email) > 200:
            errors.append("Your email cannot exceed 200 characters.")
        if not(re.match("[A-Za-z0-9]+@[a-zA-Z]+\.[a-zA-Z]+", email)):
            errors.append("You must provide a valid email address.")
        if password != password_confirm:
            errors.append("Your passwords did not match.")
        # Check to see if there are any errors, if so redirects back to page
        if len(errors) > 0:
            for message in errors:
                messages.error(request, message)
            return redirect("/register")
        else:
            # Else, check if username & email are taken
            usernameResult = User.objects.filter(username=username).all()
            if usernameResult:
                messages.error(request, "That username is already taken.")
                return redirect("/register")
            emailResult = User.objects.filter(email=email).all()
            if emailResult:
                messages.error(request, "That email is already connected to an account.")
                return redirect("/register")
            # At this point, all the data is validated, so I create a new user with the data
            user = User.objects.create(first_name=first_name, last_name=last_name, username=username, email=email)
            user.set_password(password)
            user.save()
            messages.success(request, f'Your account was successfully registered.')
            return redirect('login')
    else:
        # This is for when a GET request is made to this view
        return render(request, "users/register.html", {
            'register': 'active'
        })


class CustomLoginView(LoginView):
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["login"] = 'active'
        return context


class CustomLogoutView(LogoutView):
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["logout"] = 'active'
        return context
