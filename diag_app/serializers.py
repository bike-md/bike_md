from .models import Vote, Problem, Solution, Tech, Rating, System, Brand
from .models import Model, Problem_Model, Commit, Notification
from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth import login


class SystemSerializer(serializers.ModelSerializer):

    class Meta:
        model = System
        fields = ['id', 'name', 'url']


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email']
            )
        user.set_password(validated_data['password'])
        user.save()
        return user

    class Meta:
        model = User
        fields = ['id', 'password', 'email', 'username']
        read_only_fields = ['is_staff', 'is_superuser', 'is_active',
                            'date_joined',]


class TechGetSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False, read_only=True)

    class Meta:
        model = Tech
        fields = ['id', 'experience', 'job_title', 'shop', 'user',
                  'tech_rating']


class TechPostSerializer(serializers.ModelSerializer):

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
    tech = TechGetSerializer(many=False, read_only=True)

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


class ProblemPostSerializer(serializers.ModelSerializer):

    class Meta:
        model = Problem
        fields = ['id', 'title', 'system', 'description', 'tech',
                  'model', 'posted', 'url']


class RatingSerializer(serializers.ModelSerializer):

    class Meta:
        model = Rating
        fields = "__all__"


class BrandSerializer(serializers.ModelSerializer):

    class Meta:
        model = Brand
        fields = ['id', 'name', 'url']


class ModelSerializer(serializers.ModelSerializer):
    brand = BrandSerializer(many=False, read_only=True)

    class Meta:
        model = Model
        fields = ['id', 'name', 'brand', 'year', 'url']


class ProblemGetSerializer(serializers.ModelSerializer):
    solutions = SolutionGetSerializer(many=True, read_only=True)
    tech = TechGetSerializer(many=False, read_only=True)
    system = SystemSerializer(many=False, read_only=True)
    model = ModelSerializer(many=False, read_only=True)

    class Meta:
        model = Problem
        fields = ['id', 'title', 'system', 'description', 'tech',
                  'model', 'posted', 'url', 'solutions']


class NotificationSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Notification
        fields = ['id', 'tech', 'message', 'posted', 'solution', 'commit']
