from django.shortcuts import render, HttpResponse, HttpResponseRedirect
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets, permissions, generics
from . import models, forms
from .forms import UserForm, TechForm, LoginForm
from .models import Vote, Problem, Solution, Tech, Rating, System, Brand
from .models import Model, Problem_Model
from .serializers import VoteSerializer, ProblemGetSerializer
from .serializers import TechSerializer, RatingSerializer, SystemSerializer
from .serializers import BrandSerializer, ModelSerializer, ProblemPostSerializer
from .serializers import SolutionPostSerializer, SolutionGetSerializer
from django.views.generic import ListView
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django_filters.rest_framework import DjangoFilterBackend
import django_filters


def create_account(request):
    if request.method == 'GET':
        user_form = UserForm()
        tech_form = TechForm()
    elif request.method =='POST':
        user_form = UserForm(request.POST)
        tech_form = TechForm(request.POST)
        print(tech_form)
        print(user_form)
        if user_form.is_valid() and tech_form.is_valid():
            user = user_form.save()
            tech = tech_form.save(commit=False)
            tech.user = user
            print(tech)
            tech.save()
            login(request, user)
            password = user.password
            user.set_password(password)
            user.save()
            user = authenticate(username=user.username, password=password)
            login(request, user)
            return HttpResponseRedirect('/diag_app/')
    return render(request, 'createaccount.html', {'user_form': user_form,
                  'tech_form': tech_form})


def login_user(request):
    form = LoginForm(request.POST or None)
    if request.POST and form.is_valid():
        user = form.login(request)
        if user:
            login(request, user)
            return HttpResponseRedirect("/diag_app/")
    return render(request, 'registration/login.html')


@login_required(login_url='/login/')
def main_page(request):
    return render(request, 'main.html')


@login_required(login_url='/login/')
def model_detail(request, id):
    return render(request, 'bikedetails.html')


@login_required(login_url='/login/')
def problem_detail(request, id):
    return render(request, 'problem-detail.html')


@login_required(login_url='/login/')
def profile(request):
    return render(request, 'profile.html')


def test(request):
    return render(request, 'build_templates/load.html')


# class viewsets and filters
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


class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = (permissions.IsAuthenticated,)


class ProblemFilter(django_filters.rest_framework.FilterSet):
    no_solutions = django_filters.BooleanFilter(name='solutions',
                                                lookup_expr='isnull')

    class Meta:
        model = Problem
        fields = ['system', 'model', 'tech', 'no_solutions']


class ProblemGetViewSet(viewsets.ModelViewSet):
    queryset = Problem.objects.all()
    serializer_class = ProblemGetSerializer
    filter_backends = (django_filters.rest_framework.DjangoFilterBackend,)
    filter_class = ProblemFilter
    permission_classes = (permissions.IsAuthenticated,)


class ProblemPostViewSet(viewsets.ModelViewSet):
    queryset = Problem.objects.all()
    serializer_class = ProblemPostSerializer
    filter_backends = (django_filters.rest_framework.DjangoFilterBackend,)
    filter_class = ProblemFilter
    permission_classes = (permissions.IsAuthenticated,)


class SolutionGetViewSet(viewsets.ModelViewSet):
    queryset = Solution.objects.all()
    serializer_class = SolutionGetSerializer
    permission_classes = (permissions.IsAuthenticated,)


class SolutionPostViewSet(viewsets.ModelViewSet):
    queryset = Solution.objects.all()
    serializer_class = SolutionPostSerializer
    permission_classes = (permissions.IsAuthenticated,)


class VoteFilter(django_filters.rest_framework.FilterSet):

    class Meta:
        model = Vote
        fields = ['solution', 'tech']


class VoteViewSet(viewsets.ModelViewSet):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer
    filter_backends = (django_filters.rest_framework.DjangoFilterBackend,)
    filter_class = VoteFilter
    permission_classes = (permissions.IsAuthenticated,)


class TechViewSet(viewsets.ModelViewSet):
    queryset = Tech.objects.all()
    serializer_class = TechSerializer
    permission_classes = (permissions.IsAuthenticated,)


class RatingViewSet(viewsets.ModelViewSet):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = (permissions.IsAuthenticated,)
