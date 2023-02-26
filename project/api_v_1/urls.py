from django.urls import path
from . import views

urlpatterns = [
    path('api/v.1/create_task/', views.CreateTask.as_view(), name='createTask'),
    path('api/v.1/selectAllTasks/', views.AjaxRequestDataTasks.as_view()),

    path('api/v.1/ready_task/', views.ReadyTask.as_view()),
    path('api/v.1/setfavorite/', views.SetFavoriteTask.as_view()),
    path('api/v.1/renameTask/', views.RenameTask.as_view()),
    path('api/v.1/addDescriptionTask/', views.AddDescriptionTask.as_view()),
    path('api/v.1/editDateTask/', views.EditDateTask.as_view()),
]