from django.conf.urls import url, include
from django.contrib import admin
from django.contrib.auth import views as auth_views
from rest_framework import routers
from diag_app import views


router = routers.DefaultRouter()
router.register(r'systems', views.SystemViewSet)
router.register(r'brands', views.BrandViewSet)
router.register(r'models', views.ModelViewSet)
# router.register(r'model_list', views.ModelList)
router.register(r'problems', views.ProblemViewSet)
router.register(r'solutions', views.SolutionViewSet)
router.register(r'votes', views.VoteViewSet)
router.register(r'techs', views.TechViewSet)
router.register(r'ratings', views.RatingViewSet)


urlpatterns = [
    url(r'^api/', include(router.urls)),
    url(r'^diag_app/', include('diag_app.urls')),
    url(r'^admin/', admin.site.urls),
    url(r'^create_account/$', views.create_account, name='create_account'),
    url(r'^login/$', auth_views.login, name='login'),
    url(r'^logout/$', auth_views.logout, {'next_page': 'login'},
        name='logout'),

]
