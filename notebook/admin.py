from django.contrib import admin
from .models import NoteBook
from mptt.admin import MPTTModelAdmin

# Register your models here.
@admin.register(NoteBook)
class NoteBookAdmin(admin.ModelAdmin):
    list_display = ('id','title','desc')
    list_filter = ('title','desc')
    search_fields = ("title", "desc", )  # 搜索字段



