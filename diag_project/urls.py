from django.conf.urls import url, include
from django.contrib import admin
from django.contrib.auth import views as auth_views
from rest_framework import routers
from diag_app import views
from django.views.generic import TemplateView


router = routers.DefaultRouter()
router.register(r'systems', views.SystemViewSet)
router.register(r'brands', views.BrandViewSet)
router.register(r'models', views.ModelViewSet)
router.register(r'get-problems', views.ProblemGetViewSet)
router.register(r'post-problems', views.ProblemPostViewSet)
router.register(r'get-solutions', views.SolutionGetViewSet)
router.register(r'post-solutions', views.SolutionPostViewSet)
router.register(r'votes', views.VoteViewSet)
router.register(r'techs', views.TechViewSet)
router.register(r'ratings', views.RatingViewSet)


urlpatterns = [
    url(r'^api/', include(router.urls)),
    url(r'^diag_app/', include('diag_app.urls')),
    url(r'^admin/', admin.site.urls),
    url(r'^create_account/$', views.create_account, name='create_account'),
    url((r'^accounts/profile$'), TemplateView.as_view(template_name='build_templates/profile.html')),
    url(r'^login/$', views.login_user, name='login'),
    url(r'^logout/$', auth_views.logout, {'next_page': 'login'},
        name='logout'),
]
