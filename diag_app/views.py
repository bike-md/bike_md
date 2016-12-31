from django.shortcuts import render, HttpResponse, HttpResponseRedirect
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets, permissions, generics
from . import models, forms
from .forms import UserForm, TechForm
from .models import Vote, Problem, Solution, Tech, Rating, System, Brand
from .models import Model, Problem_Model
from .serializers import VoteSerializer, ProblemSerializer, SolutionSerializer
from .serializers import TechSerializer, RatingSerializer, SystemSerializer
from .serializers import BrandSerializer, ModelSerializer
from django.views.generic import ListView
from django.contrib.auth import login, authenticate
from django_filters.rest_framework import DjangoFilterBackend
import django_filters




def index(request):
    return render(request, 'index.html')


def test(request):
    return render(request, 'load.html')


# def problem_list(request):
#     return render(request, 'problem_list')


class SystemViewSet(viewsets.ModelViewSet):
    queryset = System.objects.all()
    serializer_class = SystemSerializer
    permission_classes = (permissions.IsAuthenticated,)


class ModelFilter(django_filters.rest_framework.FilterSet):

    class Meta:
        model = Model
        fields = ['brand', 'year']


class ModelViewSet(viewsets.ModelViewSet):
    queryset = Model.objects.all()
    serializer_class = ModelSerializer
    filter_backends = (django_filters.rest_framework.DjangoFilterBackend,)
    filter_class = ModelFilter
    permission_classes = (permissions.IsAuthenticated,)


def model_page(request, key):
    bike = models.Model.objects.get(pk=key)
    return render(request, 'bike_detail.html', {'bike': bike})


class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = (permissions.IsAuthenticated,)


class ProblemViewSet(viewsets.ModelViewSet):
    template_name = 'problem_list.html'
    queryset = Problem.objects.all()
    serializer_class = ProblemSerializer
    permission_classes = (permissions.IsAuthenticated,)


def problem_page(request, key):
    problem = models.Problem.objects.get(pk=key)
    return render(request, 'problem_detail.html', {'problem': problem})



class SolutionViewSet(viewsets.ModelViewSet):
    queryset = Solution.objects.all()
    serializer_class = SolutionSerializer
    permission_classes = (permissions.IsAuthenticated,)


class VoteViewSet(viewsets.ModelViewSet):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer
    permission_classes = (permissions.IsAuthenticated,)


class TechViewSet(viewsets.ModelViewSet):
    queryset = Tech.objects.all()
    serializer_class = TechSerializer
    permission_classes = (permissions.IsAuthenticated,)


def create_account(request):
    if request.method == 'GET':
        user_form = UserForm()
        tech_form = TechForm()
    elif request.method =='POST':
        user_form = UserForm(request.POST)
        tech_form = TechForm(request.POST)
        if user_form.is_valid() and tech_form.is_valid():
            user = user_form.save()
            tech = tech_form.save(commit=False)
            tech.user = user
            tech.save()
            login(request, user)
            password = user.password
            user.set_password(password)
            user.save()
            user = authenticate(username = user.username, password =password)
            login(request, user)
            return HttpResponseRedirect('/diag_app/brands/')
    return render(request, 'create_account.html', {'user_form': user_form,
                  'tech_form': tech_form})



class RatingViewSet(viewsets.ModelViewSet):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = (permissions.IsAuthenticated,)
