from django.contrib import admin
from .models import Article, MPTTCategory, ImageFile
from mptt.admin import MPTTModelAdmin

# Register your models here.
@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('id','title', 'abstract','original','link_address')
    list_filter = ('state','author','access_permissions','editor','original')
    search_fields = ("title", "text_content", )  # 搜索字段

@admin.register(MPTTCategory)
class MPTTCategoryAdmin(MPTTModelAdmin):
    list_display = ('id','name','parent','description')

@admin.register(ImageFile)
class ImageFileAdmin(admin.ModelAdmin):
    list_display = ('id','img_url')


# @admin.register(DocumentFile)
# class DocumentFileAdmin(admin.ModelAdmin):
#     list_display = ('id','name','url')

# @admin.register(SoftwareFile)
# class SoftwareFileAdmin(admin.ModelAdmin):
#     list_display = ('id','sw_url')