from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import DocumentFile, SoftWareFile, DocTag
User = get_user_model()

class DocTagSerializer(serializers.ModelSerializer):

    create_time = serializers.SerializerMethodField(help_text="文档上传时间")

    class Meta:
        model = DocTag
        fields = ('id', 'name','create_time')



    def get_create_time(self, obj):
        return obj.add_time.strftime('%Y-%m-%d %H:%M:%S')


class DocumentFileSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault(), help_text="所有者 ID")

    username = serializers.SerializerMethodField(help_text="所有者")
    tagname = serializers.SerializerMethodField(help_text="分类")
    create_time = serializers.SerializerMethodField(help_text="文档上传时间")

    # def create(self, validated_data):
    #     user = self.context["request"].user
    #     return DocumentFile.objects.create(**validated_data)

    class Meta:
        model = DocumentFile
        fields = ('id', 'name','desc','file','username','user','tagname','create_time','is_delete')

    def get_username(self, obj):

        return obj.user.username

    def get_tagname(self, obj):

        return obj.tag.name

    def get_create_time(self, obj):
        return obj.add_time.strftime('%Y-%m-%d %H:%M:%S')


class DocumentFileCreateSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = DocumentFile
        fields = ('id', 'name','desc','file', 'tag','user')

class DocumentFileRecoverSerializer(serializers.ModelSerializer):

    class Meta:
        model = DocumentFile
        fields = ('id', 'is_delete')


class SoftWareFileSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault(), help_text="所有者 ID")

    username = serializers.SerializerMethodField(help_text="所有者")
    tagname = serializers.SerializerMethodField(help_text="分类")

    # def create(self, validated_data):
    #     user = self.context["request"].user
    #     return DocumentFile.objects.create(**validated_data)
    create_time = serializers.SerializerMethodField(help_text="机器使用起始时间")

    class Meta:
        model = SoftWareFile
        fields = ('id', 'name','desc','file','username','user','tagname','create_time','is_delete')

    def get_username(self, obj):

        return obj.user.username

    def get_tagname(self, obj):

        return obj.tag.name

    def get_create_time(self, obj):
        return obj.add_time.strftime('%Y-%m-%d %H:%M:%S')

class SoftWareFileCreateSerializer(serializers.ModelSerializer):

    def __str__(self):
        return self.title

    class Meta:
        model = SoftWareFile
        fields = ('id', 'name','desc','file', 'tag')

