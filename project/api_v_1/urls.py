from django.urls import path
from . import views

urlpatterns = [
    path('api/v.1/addFileTask/', views.AddFileTask.as_view()),
]