from django.shortcuts import render, HttpResponse

def index(request):
    return HttpResponse("Hi there")

def test(request):
    return HttpResponse("Yep")
