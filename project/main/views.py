from django.shortcuts import render
from django.views.generic.base import View
from .models import Task

class MainPage(View):
    def get(self, request):
        tasks = Task.objects.all()
        tasks = Task.objects.filter(is_ready = False)

        context = {
            'title' : 'Главная страница',
            'tasks' : tasks,
            'count_tasks' : tasks.count(),
        }

        return render(request, 'main/index.html', context = context)