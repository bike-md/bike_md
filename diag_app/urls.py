from django.conf.urls import url
from . import views
import diag_app


urlpatterns = [
    url(r'^$', diag_app.views.index, name='index'),
    url(r'^problems/$', diag_app.views.test, name='problems')

]
