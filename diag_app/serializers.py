from .models import Vote, Problem, Solution, Tech, Rating, System, Brand
from .models import Model, Problem_Model
from rest_framework import serializers


class TechSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tech
        fields = "__all__"


class VoteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Vote
        fields = "__all__"


class  SolutionSerializer(serializers.ModelSerializer):
    votes = VoteSerializer(many=True, read_only=True)

    class Meta:
        model = Solution
        fields = ['votes', 'id', 'description', 'time_required', 'parts_cost',
                  'posted', 'score', 'problem', 'tech']


class ProblemSerializer(serializers.ModelSerializer):
    solutions = SolutionSerializer(many=True, read_only=True)

    class Meta:
        model = Problem
        fields = ['solutions', 'description', 'posted', 'system', 'model',
                  'tech', 'id', 'title', 'url']


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
