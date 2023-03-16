from django.shortcuts import HttpResponse
from django.http import JsonResponse
from django.views.generic.base import View
from django.core import serializers
from main.models import Task, FilesTask
from django.core.files.storage import FileSystemStorage
import json

import datetime
import random

from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets
from rest_framework.views import APIView
from drf_yasg import openapi



#ROUTERS VIEWS
class AjaxRequestDataTasks(viewsets.ViewSet):
    flagName_swagger = openapi.Parameter('flagName', openapi.IN_QUERY, description="Имя кастомного флага, использовать только с customFlagTasks", type=openapi.TYPE_STRING)

    @swagger_auto_schema(
            operation_description='Получение информации по фильтру. 1.all, 2.favorite, 3.easy, 4.normal, 5.hard, 6.customFlagTasks',
            responses={200: 'Задачи получены'},
            manual_parameters=[flagName_swagger]
    )
    def list(self, request, method):
        data = request.GET

        if (not method):
            method = data.get('method')



        tasks = None

        if (method == 'all'):
            tasks = Task.objects.filter(is_ready=False)
        
        if (method == 'favorite'):
            tasks = Task.objects.filter(is_ready=False, favorite=True)
        
        if (method == 'easy'):
            tasks = Task.objects.filter(is_ready=False, flag = 1)

        if (method == 'normal'):
            tasks = Task.objects.filter(is_ready=False, flag = 2)

        if (method == 'hard'):
            tasks = Task.objects.filter(is_ready=False, flag = 3)

        if (method == 'customFlags'):
            tasks = Task.objects.filter(is_ready=False)
            flags = []
            for task in tasks:
                flag = json.loads(json.dumps(task.custom_flags))
                for params in flag:

                    meta = {
                            'flagName' : params['flagName']
                        }

                    if meta not in flags:
                        flags.append(meta)

            return JsonResponse(flags, safe=False)
        
        if (method == 'customFlagTasks'):
            flagName = data.get('flagName')

            tasks = Task.objects.filter(is_ready=False)
            data_tasks = []
            for task in tasks:
                flag = json.loads(json.dumps(task.custom_flags))
                for params in flag:
                    if (params['flagName'] == flagName):
                        data_tasks.append(task)
                    
            data_tasks = serializers.serialize('json', data_tasks)
            return HttpResponse(data_tasks, content_type="application/json")
        
        if (method == 'taskCustomFlags'):
            id_task = data.get('id_task')

            task = Task.objects.get(id=id_task)
            flags = []
            flag = json.loads(json.dumps(task.custom_flags))
            for params in flag:
                flagName = params['flagName']
                meta = {
                        'flagName' : flagName,
                        'count' : getCountCustomFlags(flagName)
                    }

                if meta not in flags:
                    flags.append(meta)
                    
            return JsonResponse(flags, safe=False)



        data = serializers.serialize('json', tasks)
        return HttpResponse(data, content_type="application/json")
        

#API VIEWS
class TaskRequest(APIView):
    @swagger_auto_schema(
        operation_description='Создать задачу'
    )
    def post(self, request):
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
    
    id_swagger = openapi.Parameter('id', openapi.IN_QUERY, description="ID задачи", type=openapi.TYPE_INTEGER)

    @swagger_auto_schema(
        operation_description='Завершить задачу',
        manual_parameters=[id_swagger],
        responses={200:'Задача завершена'}
    )
    def put(self, request):
        data = request.GET


        task = Task.objects.get(id = int(data.get('id')))
        task.is_ready = True
        task.save()

        tasks = Task.objects.filter(is_ready = False)

        responseData = {
            'count' : tasks.count(),
        }

        return JsonResponse(responseData)

class UpdateFavoriteTask(APIView):
    id_swagger = openapi.Parameter('task', openapi.IN_QUERY, description="ID задачи", type=openapi.TYPE_INTEGER)

    @swagger_auto_schema(
        operation_description='Изменить приоритет задаче',
        manual_parameters=[id_swagger],
        responses={200:'Приоритет изменен'}
    )
    def put(self, request):
        data = request.GET

        task = Task.objects.get(id = int(data.get("task")))

        task.favorite = not task.favorite
        task.save()

        return HttpResponse(int(task.favorite))
    
class RenameTask(APIView):
    id_swagger = openapi.Parameter('id', openapi.IN_QUERY, description="ID задачи", type=openapi.TYPE_INTEGER)
    title_swagger = openapi.Parameter('title', openapi.IN_QUERY, description="Название задачи", type=openapi.TYPE_STRING)

    @swagger_auto_schema(
        operation_description='Изменить название задачи',
        manual_parameters=[id_swagger, title_swagger],
        responses={200:'Название изменено'}
    )
    def put(self, request):
        data = request.GET

        task = Task.objects.get(id = int(data.get("id")))

        task.title = data.get("title")
        task.save()

        return HttpResponse('Название изменено')

class UpdateDescriptionTask(APIView):

    id_swagger = openapi.Parameter('id', openapi.IN_QUERY, description="ID задачи", type=openapi.TYPE_INTEGER)
    description_swagger = openapi.Parameter('description', openapi.IN_QUERY, description="Описание задачи", type=openapi.TYPE_STRING)

    @swagger_auto_schema(
        operation_description='Изменить описание задаче',
        manual_parameters=[id_swagger, description_swagger],
        responses={200:'Описание изменено'}
    )
    def put(self, request):
        data = request.GET

        task = Task.objects.get(id = int(data.get("id")))

        task.description = data.get("description")
        task.save()

        return HttpResponse('Описание изменено')

class EditDateTask(APIView):
    @swagger_auto_schema(
        operation_description='Изменить время завершения задаче'
    )
    def put(self, request):
        data = request.GET

        task = Task.objects.get(id = int(data.get("id")))

        task.date_finish = data.get("date")
        task.save()

        return HttpResponse(task.date_finish)


class FlagTask(APIView):
    difficult = openapi.Parameter('flag', openapi.IN_QUERY, description="Сложность задачи, 1.Легко, 2.Нормально, 3.Сложно", type=openapi.TYPE_INTEGER, default=1)
    id_swagger = openapi.Parameter('id', openapi.IN_QUERY, description="ID задачи", type=openapi.TYPE_INTEGER)

    @swagger_auto_schema(
        operation_description='Установить флаг задаче',
        manual_parameters=[difficult, id_swagger],
        responses={200:'Флаг изменен'}
    )
    def put(self, request):
        data = request.GET
        task = Task.objects.get(id = data.get('id'))
        task.flag = int(data.get('flag'))
        task.save()

        return HttpResponse(task.flag)

class FileTask(APIView):
    file_input = openapi.Parameter('file', openapi.IN_QUERY, description="Файл задачи", type=openapi.TYPE_FILE)
    id_swagger = openapi.Parameter('id_task', openapi.IN_QUERY, description="ID задачи", type=openapi.TYPE_INTEGER)
    filename_swagger = openapi.Parameter('filename', openapi.IN_QUERY, description="Имя файла", type=openapi.TYPE_STRING)

    
    @swagger_auto_schema(
        operation_description='Получить файл задачи',
        manual_parameters=[id_swagger],
        responses={200:'Файлы получены'},
    )
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

    

    @swagger_auto_schema(
        operation_description='Добавить файл',
        manual_parameters=[file_input, id_swagger],
        responses={200:'Файл добавлен'},
    )
    def post(self, request):

        if request.method == 'POST' and request.FILES['file']:
            filename = ''
            image = request.FILES['file']

            valid_file = FilesTask.objects.filter(filename = image.name, task = request.POST.get('id_task'))
            if (valid_file):
                data = {
                    'error' : 'A file with the same name already exists',
                }
                return HttpResponse(json.dumps(data), content_type="application/json")

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
        
    @swagger_auto_schema(
        operation_description='Удалить файл',
        manual_parameters=[filename_swagger],
        responses={200:'Файл удален'},
    )
    def delete(self, request):
        data = request.GET
        file = FilesTask.objects.get(filename = data.get('filename'))
        file.delete()
        fss = FileSystemStorage(location='media/files/')
        fss.delete(data.get('filename'))
        
        task = Task.objects.get(id = data.get('id'))
        filescount = FilesTask.objects.filter(task = task)

        return HttpResponse(filescount.count())

class CustomFlag(APIView):
    id_swagger = openapi.Parameter('id', openapi.IN_QUERY, description="ID задачи", type=openapi.TYPE_INTEGER)
    id_swagger_two = openapi.Parameter('id_task', openapi.IN_QUERY, description="ID задачи", type=openapi.TYPE_INTEGER)
    id_flag_swagger = openapi.Parameter('id_flag', openapi.IN_QUERY, description="ID флага задачи", type=openapi.TYPE_INTEGER)
    flagname_swagger = openapi.Parameter('flagName', openapi.IN_QUERY, description="Имя флага", type=openapi.TYPE_STRING)
    
    @swagger_auto_schema(
        operation_description='Добавить флаг',
        manual_parameters=[id_swagger, flagname_swagger],
        responses={200:'Флаг добавлен'},
    )
    def post(self, request):
        data = request.GET

        task = Task.objects.get(id = data.get('id'))


        if (not data.get('flagName')):
            return HttpResponse(json.dumps(task.custom_flags), content_type="application/json")

        flagName = data.get('flagName')

        flags = []
        dataFlag = {
                'flagName' : flagName,
                'id_task' : data.get('id'),
                'id_flag' : random.randrange(0, 1000000000)
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
    
    @swagger_auto_schema(
        operation_description='Удалить флаг',
        manual_parameters=[id_swagger_two, id_flag_swagger, flagname_swagger],
        responses={200:'Флаг удален'},
    )
    def delete(self, request):
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
                
        return HttpResponse(getCountCustomFlags(data.get('flagName')))

def getCountCustomFlags(flagName):
    tasks = Task.objects.filter(is_ready=False)
    count_flags = 0
    for task in tasks:
        flag = json.loads(json.dumps(task.custom_flags))
        for params in flag:
            if (params['flagName'] == flagName):
                count_flags += 1
    return count_flags