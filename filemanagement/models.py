from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.db.models.signals import pre_init, pre_delete, post_save, post_init
from django.dispatch.dispatcher import receiver

User = get_user_model()

# Create your models here.

class SwTag(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True, unique=True, verbose_name="名称")
    add_time = models.DateTimeField(default=timezone.now, verbose_name="添加时间")

    class Meta:
        verbose_name = '软件分类'
        verbose_name_plural = verbose_name
        ordering = ('add_time',)

    def __str__(self):
        return self.name


class DocTag(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True, unique=True, verbose_name="名称")
    add_time = models.DateTimeField(default=timezone.now, verbose_name="添加时间")

    class Meta:
        verbose_name = '文档分类'
        verbose_name_plural = verbose_name
        ordering = ('add_time',)

    def __str__(self):
        return self.name


def doc_path(instance, filename):

    year = instance.add_time.year
    month = instance.add_time.month
    day = instance.add_time.day
    path_name = 'uploads/doc/{year}-{month}-{day}/{filename}'.format(year=year, month=month, day=day, filename=filename)
    return path_name


class DocumentFile(models.Model):

    name = models.CharField(verbose_name='文件名',max_length=100, blank=True, null=True, default='')
    # ext = models.CharField(verbose_name='扩展名',max_length=10, blank=True, null=True, default='')

    user = models.ForeignKey(User, verbose_name='上传用户', null=True, blank=True, on_delete=models.PROTECT)
    desc = models.TextField(verbose_name='文档描述', null=True, blank=True, default='')
    is_delete = models.BooleanField(default=False, verbose_name="是否删除")
    add_time = models.DateTimeField(default=timezone.now, verbose_name="添加时间")
    file = models.FileField(upload_to=doc_path, verbose_name="文档", null=True, blank=True)
    tag = models.ForeignKey(DocTag, verbose_name='所属分类', null=True, blank=True, on_delete=models.PROTECT)


    class Meta:
        verbose_name = '文档'
        verbose_name_plural = verbose_name

        def __str__(self):
            return self.name



def soft_path(instance, filename):

    year = instance.add_time.year
    month = instance.add_time.month
    day = instance.add_time.day
    path_name = 'uploads/software/{year}-{month}-{day}/{filename}'.format(year=year, month=month, day=day, filename=filename)
    return path_name

class SoftWareFile(models.Model):
    name = models.CharField(verbose_name='文件名',max_length=100, blank=True, null=True, default='')
    # ext = models.CharField(verbose_name='扩展名',max_length=10, blank=True, null=True, default='')

    user = models.ForeignKey(User, verbose_name='上传用户', null=True, blank=True, on_delete=models.PROTECT)
    desc = models.TextField(verbose_name='软件备注', null=True, blank=True, default='')
    is_delete = models.BooleanField(default=False, verbose_name="是否删除")
    add_time = models.DateTimeField(default=timezone.now, verbose_name="添加时间")
    file = models.FileField(upload_to=soft_path, verbose_name="软件", null=True, blank=True)
    tag = models.ForeignKey(SwTag, verbose_name='所属分类', null=True, blank=True, on_delete=models.PROTECT)


    class Meta:
        verbose_name = '软件'
        verbose_name_plural = verbose_name

        def __str__(self):
            return self.name

@receiver(pre_delete, sender=SoftWareFile)
def rom_delete(sender, instance, **kwargs):
    # Pass false so FileField doesn't save the model.
    instance.file.delete(False)



@receiver(pre_delete, sender=DocumentFile)
def rom_delete(sender, instance, **kwargs):
    instance.file.delete(False)