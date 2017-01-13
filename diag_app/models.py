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
    value = models.IntegerField(default=5)


class System(models.Model):
    name = models.CharField(max_length=25)


class Brand(models.Model):
    name = models.CharField(max_length=25)

    def __repr__(self):
        return str(self.name)


class Model(models.Model):
    name = models.CharField(max_length=40)
    brand = models.ForeignKey(Brand)
    year = models.IntegerField(default=0)

    def __repr__(self):
        return str(self.name)


class Problem(models.Model):
    title = models.CharField(max_length=65)
    system = models.ForeignKey(System, related_name='problems')
    description = models.TextField(max_length=1000)
    tech = models.ForeignKey(Tech, related_name='problems')
    model = models.ForeignKey(Model)
    posted = models.DateTimeField(auto_now=True)


class Solution(models.Model):
    description = models.TextField(max_length=1000)
    time_required = models.FloatField(default=0)
    parts_cost = models.DecimalField(max_digits=6, decimal_places=2)
    problem = models.ForeignKey(Problem, related_name='solutions')
    tech = models.ForeignKey(Tech, related_name='solutions')
    posted = models.DateTimeField(auto_now=True)
    score = models.IntegerField(default=0)


class Commit(models.Model):
    solution = models.ForeignKey(Solution, related_name='commits')
    tech = models.ForeignKey(Tech)
    posted = models.DateTimeField(auto_now=True)
    text = models.TextField(max_length=200)


class Vote(models.Model):
    tech = models.ForeignKey(Tech)
    solution = models.ForeignKey(Solution, related_name='votes')
    value = models.IntegerField(default=1)


class Problem_Model(models.Model):
    problem = models.ForeignKey(Problem)
    model = models.ForeignKey(Model)
