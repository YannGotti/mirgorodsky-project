from rest_framework.routers import DefaultRouter, SimpleRouter
from .views import *

apiRouters = SimpleRouter()
apiRouters.register(r'selectAllTasks/(?P<method>.+)', AjaxRequestDataTasks, basename='selectAllTasks')
apiRouters.register(r'selectFiles', AjaxRequestFilesTasks, basename='AjaxRequestFilesTasks')
apiRouters.register(r'ready_task', ReadyTask, basename='ReadyTask')
apiRouters.register(r'create_task', CreateTask, basename='CreateTask')
apiRouters.register(r'setfavorite', SetFavoriteTask, basename='SetFavoriteTask')
apiRouters.register(r'renameTask', RenameTask, basename='RenameTask')
apiRouters.register(r'addDescriptionTask', AddDescriptionTask, basename='AddDescriptionTask')
apiRouters.register(r'editDateTask', EditDateTask, basename='EditDateTask')
apiRouters.register(r'deleteFileTask', DeleteFileTask, basename='DeleteFileTask')
apiRouters.register(r'setFlagTask', SetFlagTask, basename='SetFlagTask')
apiRouters.register(r'addCustomFlag', CustomFlags, basename='AddCustomFlags')
apiRouters.register(r'selectCustomFlags', CustomFlags, basename='SelectCustomFlags')
apiRouters.register(r'deleteCustomFlag', DeleteCustomFlags, basename='deleteCustomFlag')
