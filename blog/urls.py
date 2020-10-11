"""blog URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.views.decorators.csrf import csrf_exempt

from django.contrib import admin
from django.contrib.sitemaps import GenericSitemap
from django.contrib.sitemaps.views import sitemap
from article.views import  ArticleView,ArticleCreateView, UploadImg, ShowUploadImg

from django.urls import path,include,re_path
from blog.settings import MEDIA_ROOT
from django.views.static import serve
from django.conf import settings
from django.views.decorators.cache import cache_page
from django.conf.urls.static import static


from rest_framework import routers

from notebook.views import NoteListViewSet
from filemanagement.views import DocumentFileListViewSet,SoftWareFileListViewSet,DocTagListViewSet

from rest_framework.documentation import include_docs_urls

# sitemaps = {
#     'article': GenericSitemap({'queryset': UserProfile.objects.all(),}, priority=0.6),
#     # 如果还要加其它的可以模仿上面的
# }

router = routers.DefaultRouter()

router.register(r'notes', NoteListViewSet, basename="notes")
router.register(r'docs', DocumentFileListViewSet, basename="docs")
router.register(r'softs', SoftWareFileListViewSet, basename="docs")
router.register(r'doctags', DocTagListViewSet, basename="doctags")



urlpatterns = [

    path('', ArticleView.as_view(), name='index'),
    path('add', ArticleCreateView.as_view(), name='addArticle'),
    path('admin/', admin.site.urls),
    path('article/', include('article.urls')),
    path('user/', include('user.urls')),
    path('notebook/', include('notebook.urls')),
    path('jquery/', include('jqueryDemo.urls')),
    path('store/', include('filemanagement.urls',  namespace='file-management')),

    path('uploadImg/', csrf_exempt(UploadImg), name='UploadImg'),
    path('showImage/', ShowUploadImg, name='ShowUploadImg'),
    path('docs/', include_docs_urls(title="Beyond PLM")),
    path('api/', include(router.urls)),

    re_path('media/(?P<path>.*)', serve, {"document_root": MEDIA_ROOT }),
    url(r'^api-auth/', include('rest_framework.urls'))
    # path('sitemap.xml',sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap')
]
if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns


REST_FRAMEWORK = {
    # Use Django's standard `django.contrib.auth` permissions,
    # or allow read-only access for unauthenticated users.
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly'
    ],

    'DEFAULT_SCHEMA_CLASS': 'rest_framework.schemas.coreapi.AutoSchema'

}