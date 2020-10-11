from django.urls import reverse
from django.shortcuts import render
from django.db.models import Q


from django.contrib.auth.decorators import login_required

from django.http.response import JsonResponse, HttpResponseRedirect
from django.views.generic.base import View
from django.views.generic import  ListView, DetailView, CreateView

from rest_framework.response import Response
from rest_framework import filters, viewsets, status, permissions
from .models import NoteBook
from .serializers import NoteSerializer,NoteCreateSerializer

class NotebookView(View):
    def get(self,request):
        return render(request, 'notebook.html', locals())


class NoteListViewSet(viewsets.ModelViewSet):
    """
    获取日记信息
    """
    # throttle_classes = (UserRateThrottle, )
    queryset = NoteBook.objects.all().order_by('created_time')
    serializer_class = NoteSerializer

    def get_serializer_class(self):
        if self.action == "list":
            return NoteSerializer
        elif self.action == "create" or self.action == "update":
            return NoteCreateSerializer
        return NoteSerializer
    # filter_class = NoteFilter
    # filter_backends = (DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter)
    # search_fields = ('name',)