from django.contrib import admin
from .models import Task, FilesTask

@admin.register(Task)
class TaskOnAdminPanel(admin.ModelAdmin):
    list_display = ('title', 'description', 'flag', 'is_ready', 'date_finish')

@admin.register(FilesTask)
class FilesTaskOnAdminPanel(admin.ModelAdmin):
    list_display = ('file', 'task')