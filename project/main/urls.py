from django.urls import path
from . import views

urlpatterns = [
    path('', views.MainPage.as_view()),
    path('create_task/', views.CreateTask.as_view(), name='createTask')
]