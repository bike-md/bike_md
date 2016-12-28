from django.conf.urls import url, include
from django.contrib import admin
from rest_framework import routers
from diag_app import views


router = routers.DefaultRouter()
router.register(r'systems', views.SystemViewSet)
# router.register(r'brands')
# router.register(r'models')
# router.register(r'techs')
# router.register(r'votes')
# router.register(r'problems')
# router.register(r'solutions')
# router.register(r'ratings')


urlpatterns = [
    url(r'^api/', include(router.urls)),
    url(r'^diag_app/', include('diag_app.urls')),
    url(r'^admin/', admin.site.urls),
]
