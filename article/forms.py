from django import forms

from django.forms import ModelForm
from .models import Article, ImageFile


class ArticleForm(ModelForm):
    class Meta:
        model = Article  #对应的Model中的类
        fields = ('title','link_address', 'content', 'allow_comment', 'set_top','state', 'editor','access_permissions','category')     #字段，如果是__all__,就是表示列出所有的字段

        widgets = {
            "title": forms.TextInput(attrs={'class':'form-control', 'placeholder':'标题', 'required':True, 'value':''}),
            "link_address": forms.TextInput(
                attrs={'class': 'form-control', 'placeholder': '转载地址', 'value': ''}),

            "access_permissions": forms.Select(attrs={ 'id':'article_private_state'}),
            # "editor":forms.Select(attrs={ 'id':'article_private_state'}),
            "allow_comment": forms.CheckboxInput( attrs={ "value":"true"}),
            "set_top": forms.CheckboxInput(attrs={ "value": "true"}),
            "original": forms.Select(),
            "category": forms.SelectMultiple()
        }


class ImageFileForm(ModelForm):
    class Meta:
        model = ImageFile  #对应的Model中的类
        fields = ('__all__')     #字段，如果是__all__,就是表示列出所有的字段

# class SoftwareFileForm(ModelForm):
#     class Meta:
#         model = SoftwareFile
#         fields = ('__all__')

# class DocumentFileForm(ModelForm):
#     class Meta:
#         model = DocumentFile
#         fields = ('__all__')