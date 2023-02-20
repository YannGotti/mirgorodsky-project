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

        context = {
            'title' : 'Главная страница',
            'tasks' : tasks,
        }

        return render(request, 'main/index.html', context = context)
    
class CreateTask(View): 
    def post(self, request):
        form = CreateTaskForm(request.POST)

        if not form.is_valid():
            return redirect('/')
        
        form.save()
        
        return redirect('/')
    
class SetFavoriteTask(View):
    def get(self, request):
        data = request.GET

        task = Task.objects.get(id = int(data.get("task")))

        task.favorite = not task.favorite
        task.save()


        return HttpResponse(int(task.favorite))