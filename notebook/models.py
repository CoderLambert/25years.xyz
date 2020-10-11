from django.db import models
from django.utils.timezone import now
from django.utils.html import strip_tags
from django.urls import reverse
from django.db.models import Q
from user.models import UserProfile
from article.models import  BaseModel

class NoteBook(BaseModel):

    title = models.CharField('标题', max_length=50)
    desc = models.TextField('事件描述', max_length=500)
    start = models.DateTimeField('开始时间')
    end = models.DateTimeField('结束时间')
    author = models.ForeignKey(UserProfile, blank=True, null=True, on_delete=models.SET_NULL,default=None)

    class Meta:
        verbose_name = '记事本'
        verbose_name_plural = verbose_name
        ordering = ['-created_time']




