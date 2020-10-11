from django.contrib import admin
from .models import DocumentFile, SoftWareFile, SwTag, DocTag


@admin.register(DocumentFile)
class DocumentFileAdmin(admin.ModelAdmin):
    list_display = ('id','name','file')

@admin.register(SoftWareFile)
class SoftWareFileFileAdmin(admin.ModelAdmin):
    list_display = ('id','name','file')

@admin.register(SwTag)
class SwTagFileAdmin(admin.ModelAdmin):
    list_display = ('id','name')

@admin.register(DocTag)
class DocTagFileAdmin(admin.ModelAdmin):
    list_display = ('id','name')