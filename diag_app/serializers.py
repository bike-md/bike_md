from .models import Vote, Problem, Solution, Tech, Rating, System, Brand
from .models import Model, Problem_Model, Commit
from django.contrib.auth.models import User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = "__all__"


class CommitSerializer(serializers.ModelSerializer):

    class Meta:
        model = Commit
        fields = ['tech', 'solution', 'url', 'id', 'posted', 'text']


class TechSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False, read_only=True)
    class Meta:
        model = Tech
        fields = ['id', 'experience', 'job_title', 'shop', 'tech_rating',
                  'user']


class VoteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Vote
        fields = "__all__"


class  SolutionSerializer(serializers.ModelSerializer):
    votes = VoteSerializer(many=True, read_only=True)
    commits = CommitSerializer(many=True, read_only=True)
    tech = TechSerializer(many=False, read_only=True)

    class Meta:
        model = Solution
        fields = ['votes', 'id', 'description', 'time_required', 'parts_cost',
                  'posted', 'score', 'problem', 'tech', 'commits']


class ProblemSerializer(serializers.ModelSerializer):
    solutions = SolutionSerializer(many=True, read_only=True)
    tech = TechSerializer(many=False, read_only=True)

    class Meta:
        model = Problem
        fields = ['solutions', 'description', 'posted', 'system', 'model',
                  'id', 'title', 'url', 'tech', 'tech_id']


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
        fields = ['id', 'url', 'name']


class ModelSerializer(serializers.ModelSerializer):

    class Meta:
        model = Model
        fields = ['brand', 'id', 'url', 'year', 'name']
