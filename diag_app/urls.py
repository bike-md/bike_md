from django.conf.urls import url
from . import views
import diag_app
from django.views.generic import TemplateView


urlpatterns = [
    url((r'^$'),  TemplateView.as_view(template_name='main.html')),
    url(r'^brands/$', diag_app.views.test, name='brands'),
    url((r'^model_detail/([0-9]+)'), TemplateView.as_view(template_name='bikedetails.html')),
    url((r'^problem_detail/([0-9]+)'), TemplateView.as_view(template_name='problem-detail.html')),

    # developemnt urls
    url((r'^problems/'),TemplateView.as_view(template_name="build_templates/problem_listing.html")),
    url((r'^model_details/([0-9]+)'), TemplateView.as_view(template_name='build_templates/bike_detail.html')),
    url((r'^problem_details/([0-9]+)'), TemplateView.as_view(template_name='build_templates/problem_detail.html')),

]
