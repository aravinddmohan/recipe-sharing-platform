from django.contrib.auth.models import AbstractBaseUser,BaseUserManager 
from django.db import models
from django.core.validators import MinValueValidator

class UserManager(BaseUserManager): 
    def create_user(self, email, password=None):
        if not email:
          raise ValueError("Users must have an email address") 
        email = self.normalize_email(email) 
        user = self.model(email=email) 
        user.set_password(password) 
        user.save(using=self._db) 
        return user 
    
    def create_superuser(self, email, password): 
        user = self.create_user(email, password)
        user.is_admin = True 
        user.is_superuser = True 
        user.save(using=self._db) 
        return user 
 
class User(AbstractBaseUser): 
    email = models.EmailField(unique=True) 
    name = models.CharField(max_length =255)
    is_active = models.BooleanField(default=True) 
    is_admin = models.BooleanField(default=False) 
    objects = UserManager() 
 
    USERNAME_FIELD = 'email'

class RecipeTable(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    recipe_name=models.CharField(max_length=100)
    image=models.FileField(
        upload_to="recipe_files/",
        null=True,
        blank=True
    )
    ingredients=models.TextField()
    steps=models.TextField()    
    views = models.IntegerField(default=0)
    cooking_time = models.IntegerField(validators=[MinValueValidator(0)])
    difficulty=models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ["-created_at"] 
        indexes = [
            models.Index(fields=["recipe_name"]),
            models.Index(fields=["-views"]),
        ]

    def __str__(self):
        return self.recipe_name

