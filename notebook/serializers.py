from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db.models.aggregates import Count
from .models import NoteBook
User = get_user_model()


class NoteSerializer(serializers.ModelSerializer):

    start = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S')
    end = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S')
    class Meta:
        model = NoteBook
        fields = ('id', 'title','desc','start', 'end','created_time','last_mod_time')


class NoteCreateSerializer(serializers.ModelSerializer):

    def __str__(self):
        return self.title

    class Meta:
        model = NoteBook
        fields = ('id', 'title','desc','start', 'end')




