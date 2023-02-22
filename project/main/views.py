from django.shortcuts import render, redirect, HttpResponse
from django.http import JsonResponse
from django.core import serializers
from django.views.generic.base import View
from datetime import datetime, date, time

from .forms import CreateTaskForm
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
    
class CreateTask(View): 
    def get(self, request):
        data = request.GET

        date_finish = data.get('date_finish')

        task = Task(title= data.get('title'))

        if (date_finish):
            task.date_finish = date_finish

        task.save()

        tasks = Task.objects.filter(is_ready = False)

        responseData = {
            'id': task.id,
            'title': task.title,
            'favorite' : task.favorite,
            'count' : tasks.count(),
        }
        
        return JsonResponse(responseData)
    

class ReadyTask(View):
    def get(self, request):
        data = request.GET

        task = Task.objects.get(id = int(data.get('id')))
        task.is_ready = True
        task.save()

        tasks = Task.objects.filter(is_ready = False)

        responseData = {
            'count' : tasks.count(),
        }

        return JsonResponse(responseData)


class SetFavoriteTask(View):
    def get(self, request):
        data = request.GET

        task = Task.objects.get(id = int(data.get("task")))

        task.favorite = not task.favorite
        task.save()


        return HttpResponse(int(task.favorite))