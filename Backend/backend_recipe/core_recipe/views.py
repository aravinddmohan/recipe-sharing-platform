from .models import User
from .models import RecipeTable
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth import authenticate
from django.db.models import F
from django.core.paginator import Paginator
from rest_framework.decorators import api_view,permission_classes
from rest_framework.decorators import authentication_classes
from django.shortcuts import render, redirect
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework import status
from django.contrib.auth.decorators import login_required

from django.utils.timezone import now

#---pagination frontend---
from rest_framework.pagination import PageNumberPagination

class RecipePagination(PageNumberPagination):
    page_size = 6  # recipes per page

from .serializers import RecipeSerializer

# -------------------------------ADMIN FUNCTIONALITIES ---------------------------------------------------------------------------------
def admin_login(request):
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return render(request, "adminlogin.html", {"error": "Invalid email or password"})
    
        # check password hash
        if not user.check_password(password):
            return render(request, "adminlogin.html", {"error": "Invalid email or password"})

        # check admin flag
        if not user.is_admin:
            return render(request, "adminlogin.html", {"error": "You are not an admin"})

        request.session["admin_id"] = user.id
        request.session["admin_email"] = user.email
        
        return redirect("admin_home")

    return render(request, "adminlogin.html")

@login_required
def admin_home(request):
    total_users = User.objects.filter(is_admin=False).count()
    total_recipes = RecipeTable.objects.count()
    active_users = User.objects.filter(is_active=True,is_admin=False).count()
    top_recipe = RecipeTable.objects.order_by("-views").first()

    # SEARCH LOGIC
    query = request.GET.get("q", "")
    recipes = RecipeTable.objects.filter(recipe_name__icontains=query) if query else RecipeTable.objects.all()

    # PAGINATION
    paginator = Paginator(recipes, 5)  # 5 recipes per page
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)

    return render(request, "adminhome.html", {
        "total_users": total_users,
        "total_recipes": total_recipes,
        "active_users": active_users,
        "top_recipe": top_recipe.recipe_name if top_recipe else "No Data",
        "page_obj": page_obj,
        "query": query
    })
@login_required
def admin_userlist(request):
    users = User.objects.filter(is_admin=False)
    return render(request, "adminuserlist.html", {"users": users})
@login_required
def adminuser_history(request,id):
    user = User.objects.get(id=id)
    recipes = RecipeTable.objects.filter(user=user)

    return render(request, "adminuserhistory.html", {
        "user": user,
        "recipes": recipes
    })

def block_user(request, id):
    user = User.objects.get(id=id)
    user.is_active = False
    user.save()
    return redirect("userlist")

def unblock_user(request, id):
    user = User.objects.get(id=id)  
    user.is_active = True
    user.save()
    return redirect("userlist")

@login_required
def admin_most_viewed_recipes(request):
    recipes = RecipeTable.objects.order_by("-views")
    return render(request, "adminmostviewedrecipes.html", {"recipes": recipes})

def admin_logout(request):
    request.session.flush()
    return redirect('adminlogin')
# -------------------------------------------------------------USER FUNCTIONALITIES ----------------------------------------------------
# signup user
@api_view(['POST'])
@permission_classes((AllowAny,))

def Signup(request):
        email  = request.data.get("email")
        password = request.data.get("password")
        name = request.data.get("name")
        if not name or not email or not password:
            return Response({'message':'All fields are required'})
        if User.objects.filter(email=email).exists():
            return  JsonResponse({'message':'Email already exist'})
        user = User.objects.create_user(email=email,password=password)
        user.name = name
        user.save()
        return JsonResponse({'message':'user created successsfully'} ,status = 200)

# login user
@api_view(['POST'])
@permission_classes((AllowAny,))

def UserLogin(request):
    email=request.data.get("email")
    password=request.data.get("password")
    if email is None or password is None:
        return Response({'message':'Email and password are required'},status=400)
    user=authenticate(username=email,password=password)
    if user:
        user.last_login = now()
        user.save(update_fields=["last_login"])
    if not user:
        return Response({'messsage:Invalid Credentials'},status=400)
    token, _=Token.objects.get_or_create(user=user)
    return Response({'token':token.key},status=200)

# logout user
@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def logout(request):
    Token.objects.filter(user=request.user).delete()
    return Response({"success": "Logged out successfully"}, status=200)


# add recipe 
@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def add_recipe(request):
    data = request.data.copy()  # copying to avoid immutability issues
    
    # attach user to data before serializer validation
    data["user"] = request.user.id

    serializer = RecipeSerializer(data=data)

    if serializer.is_valid():
        serializer.save()
        return Response({
            "success": "Recipe added",
            "id": serializer.data["id"],
            "user": request.user.email
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# update recipe
@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def update_recipe(request,recipe_id):
    try:
        recipe=RecipeTable.objects.get(id=recipe_id)
    except RecipeTable.DoesNotExist:
        return Response({"error:Recipe not found"},status=status.HTTP_404_NOT_FOUND)
    
    if recipe.user!=request.user:
        return Response("error:Not Allowed",status=status.HTTP_403_FORBIDDEN)
    
    serializer=RecipeSerializer(recipe,data=request.data,partial=True)
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# delete recipe
@api_view(["DELETE"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def delete_recipe(request,recipe_id):
    try:
        recipe=RecipeTable.objects.get(id=recipe_id)
    except RecipeTable.DoesNotExist:
        return Response({"error":"Recipe not found"},status=status.HTTP_404_NOT_FOUND)
    
    if recipe.user!=request.user:
        return Response({"error":"Not Allowed"},status=status.HTTP_403_FORBIDDEN)
    
    recipe.delete()
    return Response({"message":"Recipe Deleted"},status=status.HTTP_200_OK)

# list recipes cards (for home page -listing all recipes)
@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def list_recipes(request):
    recipes = RecipeTable.objects.all().order_by("-id")
    paginator = RecipePagination()
    result_page = paginator.paginate_queryset(recipes, request)
    serializer = RecipeSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)


# single recipe cards
@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_single_recipe(request, recipe_id):
    try:
        recipe = RecipeTable.objects.get(id=recipe_id)
    except RecipeTable.DoesNotExist:
        return Response({"error": "Recipe not found"}, status=status.HTTP_404_NOT_FOUND)
    
    # Increment view count
    recipe.views=F('views')+1
    recipe.save()
    recipe.refresh_from_db()

    serializer = RecipeSerializer(recipe)
    return Response(serializer.data)

# self-user's recipes
@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def my_recipes(request):
    user = request.user   # logged-in user from token

    recipes = RecipeTable.objects.filter(user=user).order_by("-created_at")
    serializer = RecipeSerializer(recipes, many=True)

    return Response(serializer.data, status=200)


# user profile
@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user

    return Response({
        "id": user.id,
        "name": user.name,      
        "email": user.email,  
        "is_active": user.is_active,
        "last_login": user.last_login,
    })

# change password
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user

    current_password = request.data.get("current_password")
    new_password = request.data.get("new_password")
    confirm_password = request.data.get("confirm_password")

    if not current_password or not new_password or not confirm_password:
        return Response({"error": "All fields are required"}, status=400)

    if not user.check_password(current_password):
        return Response({"error": "Old password is incorrect"}, status=400)

    if new_password != confirm_password:
        return Response({"error": "New passwords do not match"}, status=400)

    user.set_password(new_password)
    user.save()

    # logout all sessions by deleting tokens
    Token.objects.filter(user=user).delete()

    return Response({"success": "Password updated. Please login again."}, status=200)

# trending recipes api
@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])

def trending_recipes(request):
    recipes=RecipeTable.objects.order_by("-views")[:4]
    serializer=RecipeSerializer(recipes, many=True)
    return Response(serializer.data)


