from django.db import models
from django.utils.timezone import now
from django.utils.html import strip_tags
from django.urls import reverse
from mptt.models import MPTTModel
from django.db.models import Q
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.db.models.signals import pre_init, pre_delete, post_save, post_init
from django.dispatch.dispatcher import receiver

User = get_user_model()

class BaseModel(models.Model):
    id = models.AutoField(primary_key=True)
    created_time = models.DateTimeField('创建时间', default=now)
    last_mod_time = models.DateTimeField('修改时间', default=now)

class MPTTCategory(MPTTModel):
    name = models.CharField(max_length=20)
    parent = models.ForeignKey("self", blank=True, null=True, related_name="children", on_delete=models.SET_NULL)
    description = models.CharField(max_length=200, blank=True, null=True)
    created_time = models.DateTimeField('创建时间', default=now)
    last_mod_time = models.DateTimeField('修改时间', default=now)

    class MPTTMeta:
        parent_attr = 'parent'

    def __str__(self):
        return self.name


    class Meta:
        verbose_name = '文章分类'
        verbose_name_plural = verbose_name
        ordering = ['created_time']
        unique_together = ['name']

    def get_absolute_url(self):
        return reverse('article:article-detail', kwargs={
            'article_id': self.id,
            'year': self.created_time.year,
            'month': self.created_time.month,
            'day': self.created_time.day
        })

    def get_counts(self):
        # return len(Article.objects.filter(category=self.id))
        categary = MPTTCategory.objects.filter(pk=self.id)
        all_sub_categary = categary.get_descendants(include_self=True).values_list('id')
        result = []
        for i in list(all_sub_categary):
            result.append(i[0])
        # 仅显示文章状态
        querySet = Article.objects.filter(state=1).filter(category__in=result)

        # if self.request.user.is_authenticated:
        #     querySet = querySet.filter( Q(access_permissions = 0) | Q(access_permissions = 1) | Q(author = self.request.user))
        # else:
        #     querySet = querySet.filter(Q(access_permissions = 0))

        return len(querySet.distinct())



# Create your models here.
# title  标题
# abstract  摘要
# content   内容
#
# text    去除 html/MD tag 后的文本内容，用于索引
# orginal 是否原创
# source  来源
# tag 类别
# keyword 关键词
# views 阅读数
# modify_time 最近修改时间
# create_time 发表时间
# author 作者
# comment 评论
# like 点赞

class Article(BaseModel):

    ArticleStateChoice = {
        (0, '草稿'),
        (1, '文章'),
        (2, '回收站')
    }

    AccessPermissonChoice = (
        (0, '公开'),
        (1, '仅登录用户'),
        (2, ' 仅自己可见')
    )

    EditorChoice = (
        ('md', 'markdown'),
        ('rich', 'rich text'),
        ('text', 'text')
    )
    OriginalChoice = (
                        ("yes","是"),
                        ("no","否"),
                    )

    title = models.CharField('标题', max_length=250)
    content = models.TextField('文章内容')

    allow_comment = models.BooleanField('开启评论', default=True)
    set_top = models.BooleanField('是否置顶', default=False)

    state  = models.SmallIntegerField('文章状态',default=1, choices = ArticleStateChoice )
    editor = models.CharField('编辑器', default='md', choices = EditorChoice, max_length= 5 )
    access_permissions = models.SmallIntegerField('访问权限',default=0, choices = AccessPermissonChoice )
    category = models.ManyToManyField(MPTTCategory, blank=True, null=True, related_name="category")
    original = models.CharField(max_length=6, choices = OriginalChoice, default = "yes",verbose_name="是否原创")
    link_address = models.URLField(max_length=300,null=True,blank = True,verbose_name="转载地址")


    views = models.PositiveIntegerField('浏览量', default=0)
    abstract = models.TextField('摘要',max_length=450,blank=True,null=True)
    text_content = models.TextField('纯文本',blank=True,null=True)
    author = models.ForeignKey(User, blank=True, null=True, on_delete=models.SET_NULL,default=None)
    def save(self,*args, **kwargs):
        # if self.source is None:
        #     self.source = "yes"
        # else:
        #     self.source = "no"
        self.text_content = strip_tags(self.content)
        self.abstract = self.text_content[:200]
        if self.link_address is None:
            self.original = "yes"
        else:
            self.original = "no"

        super(Article, self).save(*args, **kwargs)

    class Meta:
        verbose_name = '文章'
        verbose_name_plural = verbose_name
        ordering = ['-created_time']

    def get_absolute_url(self):
        return reverse('article:article-detail', kwargs={
            'article_id': self.id,
            'year': self.created_time.year,
            'month': self.created_time.month,
            'day': self.created_time.day
        })

    def viewed(self):
        self.views += 1
        self.save(update_fields=['views'])

    def next_article(self):
        # 下一篇
        return Article.objects.filter(id__gt=self.id).order_by('-created_time').first()

    def prev_article(self):
        # 前一篇
        return Article.objects.filter(id__lt=self.id).order_by('-created_time').first()

    def get_hots(self):
        return Article.objects.all().order_by('-views')[:5]

    def get_categorys(self):
        return self.category.all()
    def get_categorys_id(self):
        return self.category.filter(pk=self.id).values('id')

class ImageFile(models.Model):
    img_url = models.ImageField(upload_to='pictures/') #指定图片上传路径，即media/photos/

    class Meta:
        verbose_name = '上传图片'
        verbose_name_plural = verbose_name


@receiver(pre_delete, sender=ImageFile)
def rom_delete(sender, instance, **kwargs):
    instance.img_url.delete(False)