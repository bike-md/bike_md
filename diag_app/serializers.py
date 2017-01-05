from .models import Vote, Problem, Solution, Tech, Rating, System, Brand
from .models import Model, Problem_Model, Commit
from django.contrib.auth.models import User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = "__all__"

#eliminate double tech serializer
class TechSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False, read_only=True)

    class Meta:
        model = Tech
        fields = ['id', 'experience', 'job_title', 'shop', 'user',
                  'tech_rating']


class CommitSerializer(serializers.ModelSerializer):

    class Meta:
        model = Commit
        fields = ['id', 'solution', 'tech', 'posted', 'text', 'url']


class VoteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Vote
        fields = "__all__"


class SolutionGetSerializer(serializers.ModelSerializer):
    votes = VoteSerializer(many=True, read_only=True)
    commits = CommitSerializer(many=True, read_only=True)
    tech = TechSerializer(many=False, read_only=True)

    class Meta:
        model = Solution
        fields = ['id', 'description', 'time_required', 'parts_cost',
                  'problem', 'tech', 'posted', 'score', 'commits',
                  'votes', 'url']


class SolutionPostSerializer(serializers.ModelSerializer):

    class Meta:
        model = Solution
        fields = ['id', 'description', 'time_required', 'parts_cost',
                  'problem', 'tech', 'posted', 'score', 'url']


class ProblemGetSerializer(serializers.ModelSerializer):
    solutions = SolutionGetSerializer(many=True, read_only=True)
    tech = TechSerializer(many=False, read_only=True)
    class Meta:
        model = Problem
        fields = ['id', 'title', 'system', 'description', 'tech',
                  'model', 'posted', 'url', 'solutions']


class ProblemPostSerializer(serializers.ModelSerializer):

    class Meta:
        model = Problem
        fields = ['id', 'title', 'system', 'description', 'tech',
                  'model', 'posted', 'url']


# class TechGetSerializer(serializers.ModelSerializer):
#     problems = ProblemGetSerializer(many=False, read_only=True)
#     solutions = SolutionGetSerializer(many=False, read_only=True)
#     user = UserSerializer(many=False, read_only=True)
#
#     class Meta:
#         model = Tech
#         fields = ['id', 'experience', 'job_title', 'shop', 'user',
#                   'tech_rating', 'problems', 'solutions']


class RatingSerializer(serializers.ModelSerializer):

    class Meta:
        model = Rating
        fields = "__all__"


class SystemSerializer(serializers.ModelSerializer):

    class Meta:
        model = System
        fields = "__all__"


class BrandSerializer(serializers.ModelSerializer):

    class Meta:
        model = Brand
        fields = ['id', 'name', 'url']


class ModelSerializer(serializers.ModelSerializer):

    class Meta:
        model = Model
        fields = ['id', 'name', 'brand', 'year', 'url']
