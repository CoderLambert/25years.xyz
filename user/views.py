from django.shortcuts import render,  HttpResponse, redirect
from django.http  import HttpResponseRedirect, JsonResponse
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.decorators import login_required
# 并集运算
from django.db.models import Q
# 基于类实现需要继承的view
from django.views.generic.base import View
#密码明文加密
from django.contrib.auth.hashers import make_password

from user.models import UserProfile
from article.models import Article
from .forms import LoginForm

from .models import UserProfile

# Create your views here.
def HomePage(request):
    article = Article.objects.all().first()
    return render(request, 'home.html',locals())

# Create your views here.
class CustomBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        """
        第一步查找用户名是否存在，若存在，则继续验证密码，如果都通过，则返回user。
        有任何异常都直接返回空，一般是用户名不存在。
        同样的道理，既然可以先检查用户名是否存在来确认用户（因为用户名唯一）那么我们也可以使用email
        """
        try:
            user_obj = UserProfile.objects.get(Q(username=username) |Q(email=username))
            if user_obj.check_password(password):
                return user_obj
        except Exception as e:
            return None

class LoginView(View):

    def get(self,request):
        return render(request, 'pages/login.html', locals())

    def post(self,request):
        login_form = LoginForm( request, data=request.POST )
        if login_form.is_valid():
            username = login_form.cleaned_data['username']
            password = login_form.cleaned_data['password']
            user = authenticate(username=username, password=password)

            if user is not None:
                # 登录成功为止1
                if user.is_active:
                    login(request,user)
                    request.session['user_id'] = user.id
                    request.session.set_expiry(60 * 60 * 24 * 14)
                    return redirect('index')
                else:
                    return  render(request, 'pages/login.html', {"error_msg": "该用户没有激活哦！请激活后再来登录"})
            else:
                login_form.add_error('username', '用户不存在')

                return render(request, 'pages/login.html', {'login_form': login_form})
        # login_form.add_error('username', '用户名或密码错误')
        else:
            return render(request, 'pages/login.html', {'login_form': login_form})


#用户注销
@login_required
def user_logout(request):
    logout(request)
    return redirect('login')


#用户注册
class RegisterView(View):

    def get(self,request):
        return render(request, 'pages/register.html')