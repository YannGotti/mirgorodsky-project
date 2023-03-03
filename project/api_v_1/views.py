from django.shortcuts import HttpResponse
from django.http import JsonResponse
from django.views.generic.base import View
from django.core import serializers
from main.models import Task, FilesTask
from django.core.files.storage import FileSystemStorage
import json

import datetime
import random

class AjaxRequestDataTasks(View):
    def get(self, request):
        tasks = Task.objects.filter(is_ready = False)
        data = serializers.serialize('json', tasks)
        return HttpResponse(data, content_type="application/json")
    
class AjaxRequestFilesTasks(View):
    def get(self, request):
        data = request.GET
        id_task = data.get('id_task')

        files = FilesTask.objects.filter(task=id_task)
        data = [

        ]

        for file in files:
            datafile = {
                'filename' : file.filename,
                'path' : '/media/files/' + file.filename,
                'id_task' : file.task.id
            }

            data.append(datafile)

        return HttpResponse(json.dumps(data), content_type="application/json")


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
    
class AddFileTask(View):
    def post(self, request):

        if request.method == 'POST' and request.FILES['file']:

            image = request.FILES['file']
            fss = FileSystemStorage(location='media/files/')
            file = fss.save(image.name, image)
            id_task = request.POST.get('id_task')
            task = Task.objects.get(id = id_task)
            fileTaskModel = FilesTask(filename = image.name, file = file, task = task)
            fileTaskModel.save()

            data = {
                'filename' : image.name,
                'path' : '/media/files/' + image.name,
                'id_task' : id_task
            }

            return HttpResponse(json.dumps(data), content_type="application/json")
        

class DeleteFileTask(View):
    def get(self, request):
        data = request.GET
        file = FilesTask.objects.get(filename = data.get('filename'))
        file.delete()
        fss = FileSystemStorage(location='media/files/')
        fss.delete(data.get('filename'))
        
        task = Task.objects.get(id = data.get('id'))
        filescount = FilesTask.objects.filter(task = task)

        return HttpResponse(filescount.count())
    
class SetFlagTask(View):
    def get(self, request):
        data = request.GET
        task = Task.objects.get(id = data.get('id'))
        task.flag = int(data.get('flag'))
        task.save()

        return HttpResponse(task.flag)

class CustomFlags(View):
    def get(self, request):
        data = request.GET

        task = Task.objects.get(id = data.get('id'))


        if (not data.get('flagName')):
            return HttpResponse(json.dumps(task.custom_flags), content_type="application/json")

        flagName = data.get('flagName')

        flags = []
        
        random.seed(random.randrange(0,1000))
        dataFlag = {
                'flagName' : flagName,
                'id_task' : data.get('id'),
                'id_flag' : random.random()
            }

        
        if (task.custom_flags == None):
            flags.append(dataFlag)
            task.custom_flags = flags
        else:
            flags = json.loads(json.dumps(task.custom_flags))
            flags.append(dataFlag)
            task.custom_flags = flags

        if (len(flags) > 5):
            info = {
                'error' : 'exceeds the allowable',
            }
            return HttpResponse(json.dumps(info), content_type="application/json")

        task.save()
        return HttpResponse(json.dumps(dataFlag), content_type="application/json")
    
class DeleteCustomFlags(View):
    def get(self, request):
        data = request.GET

        dataFlag = {
                'flagName' : data.get('flagName'),
                'id_task' : data.get('id_task'),
                'id_flag' : float(data.get('id_flag'))
            }
        
        task = Task.objects.get(id = data.get('id_task'))
        
        flags = json.loads(json.dumps(task.custom_flags))
        flags.remove(dataFlag)
        task.custom_flags = flags
        task.save()

        return HttpResponse('Ok')