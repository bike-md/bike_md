from django.db import models
from django.contrib.auth.models import User
from django.urls import reverse


class Tech(models.Model):
    experience = models.IntegerField(default=0)
    job_title = models.CharField(max_length=25)
    shop = models.CharField(max_length=25)
    user = models.OneToOneField(User)
    tech_rating = models.IntegerField(default=0)


class Rating(models.Model):
    tech = models.ForeignKey(Tech)
    value = models.IntegerField(default=1)


class Solution(models.Model):
    description = models.TextField(max_length=500)
    time_required = models.FloatField(default=0)
    parts_cost = models.DecimalField(max_digits=6, decimal_places=2)
    tech = models.ForeignKey(Tech)
    posted = models.DateTimeField(auto_now=True)
    score = models.IntegerField(default=0)


class Vote(models.Model):
    tech = models.ForeignKey(Tech)
    solution = models.ForeignKey(Solution)
    value = models.IntegerField(default=1)


class System(models.Model):
    name = models.CharField(max_length=25)


class Brand(models.Model):
    name = models.CharField(max_length=25)


class Model(models.Model):
    name = models.CharField(max_length=25)
    motor_size = models.IntegerField(default=0)
    brand = models.ForeignKey(Brand)
    year = models.IntegerField(default=0)


class Problem(models.Model):
    system = models.ForeignKey(System)
    solution = models.ForeignKey(Solution)
    description = models.TextField(max_length=500)
    tech = models.ForeignKey(Tech)
    posted = models.DateTimeField(auto_now=True)


class Problem_Model(models.Model):
    problem = models.ForeignKey(Problem)
    model = models.ForeignKey(Model)
