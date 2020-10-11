from django.urls import reverse
from django.shortcuts import render
from django.db.models import Q

from django.contrib.auth.decorators import login_required
from django.http.response import JsonResponse, HttpResponseRedirect
from django.views.generic.base import View

class jqueryTemplate(View):

    def get(self,request):
        return render(request,'jqueryDemo/video.html')






