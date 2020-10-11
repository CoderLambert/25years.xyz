from django.test import TestCase
from article.models import Article
from user.models import UserProfile
# Create your tests here.
import json


class SimpleTest(TestCase):
    def add_article(self):
        # queryset = Article.objects.all()
        # print(queryset.valu)
    lambert = UserProfile.objects.filter(username = 'lambert').first()

with open('F:\代码\我的项目\\blog\\blog\\articals_articale.json','r',encoding='utf8')as fp:
    json_data = json.load(fp)
    for article in json_data['rows']:
        # print(article['title'])
        # print(article['markdown_text'])
        # print(article['pub_date'])
        # print(article['update_time'])
        # print(article['original'])
        # print(article['original_link'])
        obj = Article( title=article['title'],
                       content = article['text_content'],
                       original = article.get('original','yes'),
                       link_address = article.get('orginal_link',''),
                       editor = 'md',
                       author = lambert,
                       created_time = article['add_time'],
                       last_mod_time = article['modified_time']
                       )
        obj.save()
