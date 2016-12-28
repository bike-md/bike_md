from django.shortcuts import render, HttpResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets, permissions
from .models import Vote, Problem, Solution, Tech, Rating, System, Brand
from .models import Model, Problem_Model
from .serializers import VoteSerializer, ProblemSerializer, SolutionSerializer
from .serializers import TechSerializer, RatingSerializer, SystemSerializer
from .serializers import BrandSerializer, ModelSerializer






def index(request):
    return HttpResponse("Hi there")

def test(request):
    return HttpResponse("Yep")

class SystemViewSet(viewsets.ModelViewSet):
    queryset = System.objects.all()
    serializer_class = SystemSerializer
    permission_classes = (permissions.IsAuthenticated,)
