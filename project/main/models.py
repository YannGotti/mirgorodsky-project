from django.db import models

class Task(models.Model): 
    title = models.CharField('Задача', max_length=50)
    description = models.TextField('Описание')
    is_ready = models.BooleanField('Выполнено?', default=False)
    favorite = models.BooleanField('Избранное?', default=False)
    date_create = models.DateField('Дата создания', auto_now=True)
    date_finish = models.DateField('Дата завершения', null=True)


    flags = [
        (1, 'Легко'),
        (2, 'Средне'),
        (3, 'Сложно'),
    ]

    flag = models.IntegerField('Сложность', default=1, choices=flags)

    custom_flags = models.JSONField('Флаги пользователя',default=list, null=True)


    def __str__(self):
        return f'{self.title}, {self.description}, {self.flag}, {self.is_ready}'
    
    class Meta:
        verbose_name = 'Задачу'
        verbose_name_plural = 'Задачи'


class FilesTask(models.Model):
    filename = models.CharField('Имя файла', max_length=150)
    file = models.FileField('Прикрепленный файл к задаче', upload_to='files/', blank=True, null=True)
    task = models.ForeignKey(Task, verbose_name='Прикрепленная задача', on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.filename}, {self.task}'
    
    class Meta:
        verbose_name = 'Файл'
        verbose_name_plural = 'Файлы'


