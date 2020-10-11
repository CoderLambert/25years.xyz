import datetime
from haystack import indexes
from article.models import Article


class ArticleIndex(indexes.SearchIndex, indexes.Indexable):  # 类名必须为需要检索的Model_name+Index，这里需要检索Note，所以创建NoteIndex
    text = indexes.CharField(document=True, use_template=True)  # 创建一个text字段

    # pub_date = indexes.DateTimeField(model_attr='pub_date')  # 创建一个pub_date字段
    text_content = indexes.CharField('纯文本', blank=True, null=True)


    def get_model(self):  # 重载get_model方法，必须要有！
        return Article

    def index_queryset(self, using=None):  # 重载index_..函数
        """Used when the entire index for model is updated."""
        return self.get_model().objects.filter(state =1)