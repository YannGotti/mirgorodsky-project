from rest_framework.routers import DefaultRouter, SimpleRouter
from .views import *

apiRouters = SimpleRouter()
apiRouters.register(r'selectAllTasks/(?P<method>.+)', AjaxRequestDataTasks, basename='selectAllTasks')