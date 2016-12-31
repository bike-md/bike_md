from django.contrib.auth.models import User
from django import forms
from .models import Tech


class UserForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']


class TechForm(forms.ModelForm):

    class Meta:
        model = Tech
        fields = ['experience', 'job_title', 'shop']
