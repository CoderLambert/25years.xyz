from django import forms
class LoginForm(forms.Form):
    username = forms.CharField(label='邮箱或手机号',required=True)
    password = forms.CharField(label='密码', widget=forms.PasswordInput(render_value=True))

    def __init__(self, request, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.request = request

    # def clean_password(self):
    #     pwd = self.cleaned_data['password']
    #     # 加密 & 返回
    #     return encrypt.md5(pwd)


