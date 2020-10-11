import time
# from django.urls import reverse
from django.shortcuts import render
from django.db.models import Q

from django.shortcuts import redirect
from django.views.generic.base import View
# from django.core.exceptions import ImproperlyConfigured
from django.contrib.auth.decorators import login_required
from django.http.response import JsonResponse, HttpResponseRedirect
from django.views.generic import  ListView, DetailView, CreateView, DeleteView, UpdateView
from django.views.decorators.clickjacking import xframe_options_sameorigin
# from django.template import Context, Template
from django_redis import get_redis_connection

import logging
from article.models import Article, MPTTCategory, ImageFile
from .forms import ArticleForm, ImageFileForm
# from django.views.decorators.cache import cache_page
from django.core.cache import cache
from django.core.cache.utils import make_template_fragment_key
# from mptt.forms import MoveNodeForm

logger = logging.getLogger(__name__)

class LoginRequiredMixin(object):
    @classmethod
    def as_view(cls,**kwargs):
        view = super().as_view(**kwargs)
        return login_required(view)

class CategoryView(View):
    def get(self,request):
        # print(key)
        # cache.delete(key)
        nodes = MPTTCategory.objects.all()
        html = render(request, 'pages/article_detail/category.html', locals())
        # print(html.content)
        key = make_template_fragment_key('sidebar')
        cache.set(key, html.content.decode('utf-8'))

        return html

# class CacheMixin(object):
#     @classmethod
#     def as_view(cls,**kwargs):
#         view = super().as_view(**kwargs)
#         return CacheMixin(view)

# @cache_page(60 * 15)

class ArticleView(ListView):
    model = Article
    paginate_by = 15
    template_name = 'pages/home.html'
    context_object_name = 'articles'

    # keyword = ''
    def get_queryset(self):
        # start = time.time()

        catogary_id = self.request.GET.get('category_id')
        keyword = self.request.GET.get('keyword')
        querySet = Article.objects.filter(state =1)

        if catogary_id is not None:
            categary = MPTTCategory.objects.filter(pk = catogary_id)
            all_sub_categary = categary.get_descendants(include_self=True).values_list('id')
            result = []
            for i in list(all_sub_categary):
                result.append(i[0])
            querySet = querySet.filter(category__in=result)

        if self.request.user.is_authenticated:
            querySet = querySet.filter( Q(access_permissions = 0) | Q(access_permissions = 1) | Q(author = self.request.user))
        else:
            querySet = querySet.filter(Q(access_permissions = 0))

        if keyword is not None:
            querySet = querySet.filter( Q(text_content__icontains = keyword) | Q(title__icontains = keyword) )
        return querySet.distinct()

    def get_context_data(self, **kwargs):
        start = time.time()

        kwargs['nodes'] = MPTTCategory.objects.all()
        kwargs['hots'] = Article.objects.all().order_by('-views')[:7]
        kwargs['news'] = Article.objects.all().order_by('-created_time')[:7]
        kwargs['keyword'] = self.request.GET.get('keyword','')
        kwargs['category_id'] = self.request.GET.get('category_id','')
        kwargs['title'] = "lambert 的个人网站首页"

        # print(time.time() -start)


        return super(ArticleView, self).get_context_data(**kwargs)


class ArticleDetailView(DetailView):
    '''
    文章详情页面
    '''
    template_name = 'pages/article_detail/article_detail.html'
    model = Article
    pk_url_kwarg = 'article_id'
    context_object_name = "article"

    def get_object(self, queryset=None):
        obj = super(ArticleDetailView, self).get_object()
        obj.viewed()
        self.object = obj
        return obj

    def get_context_data(self, **kwargs):
        articleid = int(self.kwargs[self.pk_url_kwarg])
        kwargs['categorys'] = self.object.get_categorys
        kwargs['next_article'] = self.object.next_article
        kwargs['prev_article'] = self.object.prev_article
        kwargs['title'] = self.object.title

        return super(ArticleDetailView, self).get_context_data(**kwargs)


class SameOriginMixin(object):
    @classmethod
    def as_view(cls,**kwargs):
        view = super().as_view(**kwargs)
        return xframe_options_sameorigin(view)
# 文章创建
# class ArticleCreateView(LoginRequiredMixin,SameOriginMixin,CreateView):
class ArticleCreateView(LoginRequiredMixin, CreateView):

    form_class = ArticleForm  # 表类
    template_name = 'pages/article_detail/article_add.html'  # 添加表对象的模板页面
    success_url = '/'

    def form_valid(self, form):
        super(ArticleCreateView, self).form_valid(form)
        self.object.author = self.request.user
        self.object.save()
        return redirect(self.object)

    def form_invalid(self, form):  # 定义表对象没有添加失败后跳转到的页面。
        return render(self.request, self.template_name,
                      self.get_context_data(form=form))

    def get_context_data(self, **kwargs):
        ctx = super(ArticleCreateView, self).get_context_data(**kwargs)
        ctx['nodes'] = MPTTCategory.objects.all()
        ctx['editor'] = self.request.GET.get('editor_type','md')
        ctx['title'] = "创建新的文章"

        return ctx

# 文章更新
class ArticleUpdateView(LoginRequiredMixin, UpdateView):

    form_class = ArticleForm  # 表类
    success_url = '/'  # 成功添加表对象后 跳转到的页面
    model = Article
    template_name = 'pages/article_detail/article_update.html'  # 添加表对象的模板页面
    # 'allow_comment', 'set_top', 'state', 'editor',
    # fields = ['title', 'link_address','content','access_permissions']

    def get(self, request, *args, **kwargs):
        article = Article.objects.get(id=self.kwargs['pk'])
        # initial = {'name': adv_positin.name}
        # form = AdvPositionForm(initial)
        form = ArticleForm(instance=article)
        categorys = article.get_categorys
        next_article = article.next_article
        prev_article = article.prev_article
        nodes = MPTTCategory.objects.all()
        editor = article.editor
        title = "更新"+ article.title

        return render(request, self.template_name,  locals())


    def get_context_data(self, **kwargs):
        ctx = super(ArticleUpdateView, self).get_context_data(**kwargs)
        ctx['nodes'] = MPTTCategory.objects.all()
        ctx['editor'] = self.request.GET.get('editor_type','md')

        return ctx

class ArticleDeleteView(DeleteView):
    model = Article
    success_url = "/"
    template_name = 'pages/article_detail/article_confirm_delete.html'  # 添加表对象的模板页面


#图片上传
def UploadImg(request):
    if request.method == 'POST':
        form = ImageFileForm(request.POST, request.FILES)
        if form.is_valid():
            obj = form.save()
            # obj.img_url.url
            data = {
            'success':1,
            'message':'上传成功',
            'url': obj.img_url.url
            }
            return JsonResponse(data)
            # return HttpResponseRedirect(reverse('ShowUploadImg'))
    else:
        form = ImageFileForm()

    return  render(request, 'pages/imgUpload.html',{'form': form})

#图片上传
# @cache_page(60*100)
def ShowUploadImg(request):
    images = ImageFile.objects.all()
    return  render(request, 'pages/showImgUpload.html',{'images': images})


