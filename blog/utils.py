#!/usr/bin/env python
# encoding: utf-8


"""
@version: ??
@author: liangliangyy
@license: MIT Licence
@contact: liangliangyy@gmail.com
@site: https://www.lylinux.net/
@software: PyCharm
@file: utils.py
@time: 2017/1/19 上午2:30
"""
from django.core.cache import cache
from django.contrib.sites.models import Site


def get_current_site():
    site = Site.objects.get_current()
    return site



# def send_email(emailto, title, content):
#     from DjangoBlog.blog_signals import send_email_signal
#     send_email_signal.send(send_email.__class__, emailto=emailto, title=title, content=content)


