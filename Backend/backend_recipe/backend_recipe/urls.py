from django.contrib import admin
from django.urls import path
from core_recipe import views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    # ADMIN urls
    # path('admin/', admin.site.urls),
    path("adminlogin/", views.admin_login, name='adminlogin'),  
    path("admin-home/", views.admin_home, name='admin_home'),
    path('adminuserlist/',views.admin_userlist,name='userlist'),
    path("block-user/<int:id>/", views.block_user, name="block_user"),
    path("unblock-user/<int:id>/", views.unblock_user, name="unblock_user"),
    path('adminmostviewed/',views.admin_most_viewed_recipes,name='most_viewed'),
    path('adminuserhistory/<int:id>/',views.adminuser_history,name='adminuserhistory'),
    path("adminlogout/",views.admin_logout,name='adminlogout'),
    # USER urls
    path('signup/',views.Signup,name='signup'),
    path('userlogin/',views.UserLogin,name='login'),
    path('useraddrecipe/',views.add_recipe,name='addrecipe'),
    path('allrecipelist/',views.list_recipes,name='userrecipelist'),
    path('usersinglerecipe/<int:recipe_id>/',views.get_single_recipe,name='usersinglerecipe'),
    path('userupdaterecipe/<int:recipe_id>/',views.update_recipe,name='userupdaterecipe'),
    path('userdeleterecipe/<int:recipe_id>/',views.delete_recipe,name='userdeleterecipe'),
    path("userprofile/", views.user_profile, name="userprofile"),
    path("changepassword/", views.change_password, name="changepassword"),
    path("userlogout/", views.logout, name="userlogout"),
    path("myrecipe/",views.my_recipes,name="myrecipe"),
    path("trending/",views.trending_recipes,name="trending"),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)