from django.conf.urls import url, include
from django.contrib import admin
from rest_framework import routers

router = routers.DefaultRouter()
# router.register(r'')


urlpatterns = [
    url(r'^api/', include(router.urls)),
    url(r'^diag_app/', include('diag_app.urls')),
    url(r'^admin/', admin.site.urls),
]
