from rest_framework import serializers
from .models import RecipeTable
from .models import User


class RecipeSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.name', read_only=True)
    class Meta:
        model = RecipeTable
        fields = '__all__'
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["name", "email", "last_login"]