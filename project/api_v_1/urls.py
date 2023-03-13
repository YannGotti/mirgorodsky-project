from django.urls import path
from . import views

urlpatterns = [
    path('FileTask/', views.FileTask.as_view()),
    path('customFlag/', views.CustomFlag.as_view()),
    path('flagTask/', views.FlagTask.as_view()),
    path('editDateTask/', views.EditDateTask.as_view()),
    path('updateDescriptionTask/', views.UpdateDescriptionTask.as_view()),
    path('renameTask/', views.RenameTask.as_view()),
    path('updateFavoriteTask/', views.UpdateFavoriteTask.as_view()),
    path('task/', views.TaskRequest.as_view()),
]