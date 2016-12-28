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


class ProblemSerializer(serializers.ModelSerializer):

    class Meta:
        model = Problem
        fields = "__all__"


class  SolutionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Solution
        fields = "__all__"


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
        fields = "__all__"


class ModelSerializer(serializers.ModelSerializer):

    class Meta:
        model = Model
        fields = "__all__"
