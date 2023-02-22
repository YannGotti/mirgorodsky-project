from django.db import models

class Task(models.Model): 
    title = models.CharField('Задача', max_length=50)
    description = models.CharField('Описание', max_length=50)
    is_ready = models.BooleanField('Выполнено?', default=False)
    favorite = models.BooleanField('Избранное?', default=False)
    date_create = models.DateField('Дата создания', auto_now=True)
    date_finish = models.DateField('Дата завершения', null=True)
    
    flags = [
        (1, 'Легко'),
        (2, 'Средне'),
        (3, 'Сложно'),
    ]

    flag = models.IntegerField('Флаг', default=1, choices=flags)

    def __str__(self):
        return f'{self.title}, {self.description}, {self.flag}, {self.is_ready}'
    
    class Meta:
        verbose_name = 'Задачу'
        verbose_name_plural = 'Задачи'


