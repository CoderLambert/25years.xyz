from django.db import models
from django.urls import reverse
from django.utils.timezone import now
from django.contrib.auth.models import AbstractUser
# Create your models here.


class UserProfile(AbstractUser):
    """
    用户
    """
    nickname = models.CharField('昵称', max_length=100, blank=True)
    email = models.EmailField(null=True, blank=True, max_length=25, verbose_name="邮箱")
    created_time = models.DateTimeField('创建时间', default=now)
    last_mod_time = models.DateTimeField('修改时间', default=now)

    def get_absolute_url(self):
        return reverse('user:id', kwargs={
            'article_id': self.id
        })
    
    def get_full_url(self):
        site = 'localhost'
        url = "https://{site}{path}".format(site=site, path=self.get_absolute_url())
        return url

    def __str__(self):
        return self.username
    class Meta:
        verbose_name = "用户"
        verbose_name_plural = verbose_name