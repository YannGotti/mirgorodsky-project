from django.contrib import admin
from .models import Task

@admin.register(Task)
class TaskOnAdminPanel(admin.ModelAdmin):
    list_display = ('title', 'description', 'flag', 'is_ready')