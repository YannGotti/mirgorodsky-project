from django.db import models

class Task(models.Model): 
    title = models.CharField('Задача', max_length=50)
    description = models.CharField('Описание', max_length=50)
    is_ready = models.BooleanField('Выполнено?', default=False)

    EASY = 1
    MIDDLE = 2
    HARD = 3
    
    flags = [
        (EASY, 'Легко'),
        (MIDDLE, 'Средне'),
        (HARD, 'Сложно'),
    ]

    flag = models.IntegerField('Флаг', default=EASY, choices=flags)

    def __str__(self):
        return f'{self.title}, {self.description}, {self.flag}, {self.is_ready}'
    
    class Meta:
        verbose_name = 'Задачу'
        verbose_name_plural = 'Задачи'


