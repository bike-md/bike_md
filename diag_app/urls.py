from django.conf.urls import url
from . import views
import diag_app
from django.views.generic import TemplateView


urlpatterns = [
    url((r'^$'), views.main_page, name='main'),
    url((r'^model_detail/([0-9]+)'), views.model_detail, name='model_detail'),
    url((r'^problem_detail/([0-9]+)'), views.problem_detail, name='problem_detail'),

    # developemnt urls
    url((r'^problems/'),TemplateView.as_view(template_name="build_templates/problem_listing.html")),
    url((r'^model_details/([0-9]+)'), TemplateView.as_view(template_name='build_templates/bike_detail.html')),
    url((r'^problem_details/([0-9]+)'), TemplateView.as_view(template_name='build_templates/problem_detail.html')),
]
