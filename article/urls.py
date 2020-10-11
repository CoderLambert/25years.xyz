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
from django.contrib import admin
from django.urls import path
from . import views
app_name = "article"
urlpatterns = [
    path('<int:year>/<int:month>/<int:day>/<int:article_id>', views.ArticleDetailView.as_view(), name='article-detail'),
    path('update/<int:pk>', views.ArticleUpdateView.as_view(), name='article-update'),

    path('<pk>/article/delete', views.ArticleDeleteView.as_view(), name='article-delete'),
    # path('add', views.ArticleAddView.as_view(), name = 'article-add'),
    path('category', views.CategoryView.as_view(), name='article-category'),
    path('category/<int:category_id>', views.CategoryView.as_view(), name='category-detail')

]
