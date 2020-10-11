from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import filters, viewsets, status, permissions


from .models import DocumentFile,SoftWareFile, DocTag
from .serializers import DocumentFileSerializer,\
                         DocumentFileCreateSerializer,\
                         DocumentFileRecoverSerializer,\
                         SoftWareFileCreateSerializer,\
                         SoftWareFileSerializer,\
                         DocTagSerializer

# Create your views here.
def fileManagement(request):

    return  render(request, 'pages/file_management.html',{'title': '存储管理'})

class DocumentFileListViewSet(viewsets.ModelViewSet):
    """
    获取上传文档信息
    """
    # throttle_classes = (UserRateThrottle, )
    queryset = DocumentFile.objects.all().order_by('add_time')
    serializer_class = DocumentFileSerializer

    def get_serializer_class(self):
        if self.action == "list":
            return DocumentFileSerializer
        elif self.action == "create" or self.action == "update":
            return DocumentFileCreateSerializer
        elif self.action == "partial_update":
            return DocumentFileRecoverSerializer
        return DocumentFileSerializer


    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance);
        self.perform_destroy(instance)

        # 如果 该实例不存在，则 ID 为null
        if instance.id:
            return Response(data=serializer.data)

        else:
            return Response(data=serializer.data, status=status.HTTP_204_NO_CONTENT)

    def perform_destroy(self, instance):
        # 第一次放到垃圾箱
        if instance.is_delete == False:
            instance.is_delete = True
            instance.save()
        # 第二次永远删除
        else:
            instance.delete()


class DocTagListViewSet(viewsets.ModelViewSet):
    """
    获取上传文档信息
    """
    # throttle_classes = (UserRateThrottle, )
    queryset = DocTag.objects.all().order_by('add_time')
    serializer_class = DocTagSerializer


class SoftWareFileListViewSet(viewsets.ModelViewSet):
    """
    获取上传文档信息
    """
    # throttle_classes = (UserRateThrottle, )
    queryset = SoftWareFile.objects.all().order_by('add_time')
    serializer_class = SoftWareFileSerializer

    def get_serializer_class(self):
        if self.action == "list":
            return SoftWareFileSerializer
        elif self.action == "create" or self.action == "update":
            return SoftWareFileCreateSerializer
        return SoftWareFileSerializer