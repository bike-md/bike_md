from django.conf.urls import url
from . import views
import diag_app
from django.views.generic import TemplateView


urlpatterns = [
    url(r'^$', diag_app.views.index, name='index'),
    url(r'^brands/$', diag_app.views.test, name='brands'),
    url((r'^model_detail/([0-9]+)'), views.model_page, name='model_detail'),
    url((r'^problem_detail/([0-9]+)'), views.problem_page, name='problem_detail'),
    url((r'^problems/'),TemplateView.as_view(template_name="problem_listing.html"), name='problems')

]
