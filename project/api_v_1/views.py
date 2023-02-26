from django.shortcuts import render, redirect, HttpResponse
from django.http import JsonResponse
from django.views.generic.base import View
from django.core import serializers
from main.models import Task

import datetime

class AjaxRequestDataTasks(View):
    def get(self, request):
        tasks = Task.objects.filter(is_ready = False)
        data = serializers.serialize('json', tasks)
        return HttpResponse(data, content_type="application/json")


class CreateTask(View): 
    def get(self, request):
        data = request.GET

        date_finish = data.get('date_finish')

        task = Task(title= data.get('title'))

        if (date_finish):
            task.date_finish = date_finish
        else:
            new_date = datetime.datetime.today()
            new_date = datetime.datetime(new_date.year + 1, new_date.month, new_date.day)
            task.date_finish = new_date

        task.save()

        task = Task.objects.filter(id = task.id)
        data = serializers.serialize('json', task)
        return HttpResponse(data, content_type="application/json")
    

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
    
class RenameTask(View):
    def get(self, request):
        data = request.GET

        task = Task.objects.get(id = int(data.get("id")))

        task.title = data.get("title")
        task.save()


        return HttpResponse('Название изменено')
    
class AddDescriptionTask(View):
    def get(self, request):
        data = request.GET

        task = Task.objects.get(id = int(data.get("id")))

        task.description = data.get("description")
        task.save()

        return HttpResponse('Описание изменено')

class EditDateTask(View):
    def get(self, request):
        data = request.GET

        task = Task.objects.get(id = int(data.get("id")))

        task.date_finish = data.get("date")
        task.save()

        return HttpResponse(task.date_finish)
