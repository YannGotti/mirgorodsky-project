from django.urls import path
from . import views

urlpatterns = [
    path('', views.MainPage.as_view()),

    path('ajax/create_task/', views.CreateTask.as_view(), name='createTask'),
    path('ajax/ready_task/', views.ReadyTask.as_view(),),
    path('ajax/setfavorite/', views.SetFavoriteTask.as_view(),),
]