# lambert 的个人网站
  因为个人知识管理需要建立的技术博客网站, 作为博客来说，前端相对业务逻辑不会很复杂，并且为了以后进一步对 SEO 支持以及通过缓存进一步提高访问速度，所以就避免使用了 SPA 开发技术，大多直接通过 Django 自带模板进行多页面内容开发，其中文件管理功能，页面稍微会复杂些，因此使用了 Backbone 及其相关技术搭建，对 Backbone 感兴趣的或者有学习需求的可以好好看看源码，基本上 Backbone 相关技术，及使用场景都覆盖到了，是一个非常好的学习例子

## 在线展示
[WWW.25years.xyz](https://25years.xyz/)
## 环境安装
- 后端
  1. pip install -r requirement.txt
  2. 安装 Mysql 数据库，填入连接信息到 seetings.py
  3. 安装 redis 数据库，填入连接信息到 seetings.py （也可以不装，熟悉的同学在 Django 中去掉 CACHE
  即可）
  4. 下面就可以启动了  python manage.py runserver localhost:port
- 前端
   1. 传统多面应用，所有 lib 都已存在
   
## 使用到的主要技术
  1. Django
  2. Django-RestFramWork
  3. Mysql
  4. Redis
  5. ZUI
  6. Ztree
  7. Jquery
  8. Backbone、Backbone Validation 、Backbone LayoutManagement、 Backbone LocalStorage
  9. datepicker
  10. Echart
  11. Ueditor
  12. Meditor
  13. chossen
  14. Ajax
  15. LazyLoad
  16. Requirejs

## 主要功能
1. 博客文章显示
2. 对博客文章进行分类管理，方便索引查找 (父子分类关系，进行树形嵌套展示)
3. 博客文章支持 Ueditor、Meditor 两种编辑器格式(分别对应 富文本、Markdown)
4. 博客文章详情，支持自动生成目录
5. 支持全文本搜索查找
6. 可以对博客文章上传图片进行统一管理
7. 支持自定义上传 PDF 等文档文件，可在线查看或下载
8. 后台 API 接口文档展示
9. 看板娘交互，根据用户动作提示相应信息

## 联系我
如果你对该站点有好的建议，请用以下方式联系我

QQ: 156486648

微信: L156486648