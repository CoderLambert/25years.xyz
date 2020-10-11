define([
    // Libraries.
    "jquery",
    "underscore",
    "backbone",
    "backboneValidation",

    'text!templates/layouts/main.html',
    "i18n!strings/nls/file_management",

    "layoutmanager",
    "zui"

],

    function ($, _, Backbone, Validation, MainTemplate,CommonStrings, Layout) {
        "use strict";
        Backbone.Model.prototype = _.extend(Backbone.Model.prototype, Validation.mixin);


        var app = {
            root: "/static/",
            getUserName: function(){
                return localStorage.getItem('user');
            },
            getCookie: function (name) {
                var cookieValue = null;
                if (document.cookie && document.cookie !== '') {
                    var cookies = document.cookie.split(';');
                    for (var i = 0; i < cookies.length; i++) {
                        var cookie = cookies[i].trim();
                        // Does this cookie string begin with the name we want?
                        if (cookie.substring(0, name.length + 1) === (name + '=')) {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            },


            initialize: function () {

                var context = this;
                // 设置 log 开关
                this.debug_mode = true;

                this.xhrPool = [];

                // 注册 全局 ajax 开始请求处理事件,
                // 作用: 添加jqXHR 到需要维护的请求队列中
                $(document).ajaxSend(function (e, jqXHR, options) {
                    app.xhrPool.push(jqXHR);
                    // window.IpCallExistXhr && window.IpCallExistXhr.abort()

                });
                // 注册 全局 ajax 请求完成处理事件,
                // 作用:  移除 jqXHR 队列中已完成对象

                $(document).ajaxComplete(function (e, jqXHR, options) {
                    app.xhrPool = $.grep(app.xhrPool, function (x) { return x != jqXHR });
                });

                $(document).ajaxError(function (e, jqXHR, options) {

                    if (jqXHR.status === 401) {
                        alert(' 401 error');
                    }
                });


                // 配置请求头，添加 X-CSRFTOKEN
                $.ajaxSetup({
                    headers: { 'X-CSRFTOKEN': this.getCookie('csrftoken') }
                });

                // 渲染布局页面
                this.useLayout("layouts/main");

                $("#page_refresh").click(function (ev) {
                    window.location.reload();
                })

                $("#change_language").on("click",function(ev){
                    var currentLanguage = localStorage.getItem('locale');
                    ev.stopPropagation();
                    ev.preventDefault();

                    if(currentLanguage == 'zh-cn'){
                        localStorage.setItem('locale', 'root');
                        $("#current_language_status").text('(EN)')
    
                    }else{
                        localStorage.setItem('locale', 'zh-cn');
                        $('#current_language_status').text('(中)')
                    }
                    location.reload();
                });



                
    
                // $('#current_language_status').text('(中)')
                localStorage.getItem('locale') === 'root'? 
                                                    $("#current_language_status").text('(EN)')
                                                    :$("#current_language_status").text('(中)')
                
            },

            log: function (message) {
              
              return  this.debug_mode  && console.log(message)
                
            },
            // 终止所有正在发送的 ajax 请求
            abortAll: function() {
                $.each(app.xhrPool, function(idx, jqXHR) {
                  jqXHR.abort();
                });
            },

            disableAllbutton: function(buttons) {
                buttons.attr('disabled','disabled');
            },
            
            disableAllinput: function() {
                $("input").attr('disabled', 'disabled');
            },

            disableAlldropdown: function() {
                $("select").attr('disabled', 'disabled');
            },

            disableButton: function (button) {
                $(button).addClass('disabled').attr('disabled', true);
            },

            enbaleButton: function (button) {
                $(button).removeClass('disabled').attr('disabled', false);
            },

            showInfoTip: function (message) {
                return new $.zui.Messager(message, {
                    type: 'info',
                    close: true
                }).show();
            },

            showErrorTip: function (message) {
                return new $.zui.Messager(message, {
                    type: 'danger',
                    close: true
                }).show();
            }       

        };

        //Templates
        window.JST = {};
        window.JST["app/templates/layouts/main.html"] = _.template(MainTemplate);


        // Localize or create a new JavaScript Template object.
        var JST = window.JST = window.JST || {};

        // Configure LayoutManager with Backbone Boilerplate defaults.

        Layout.configure({
            // Allow LayoutManager to augment Backbone.View.prototype.
            manage: true,

            prefix: "app/templates/",

            fetchTemplate: function (path) {
                // Initialize done for use in async-mode
                var done;
                // Concatenate the file extension.
                path = path + ".html";

                // If cached, use the compiled template.
                if (JST[path]) {
                    return JST[path];
                } else {
                    // Put fetch into `async-mode`.
                    done = this.async();

                    // Seek out the template asynchronously.
                    return $.ajax({
                        url: app.root + path
                    }).then(function (contents) {
                        done(JST[path] = _.template(contents));
                    });
                }
            }
        });

        // Mix Backbone.Events, modules, and layout management into the app object.
        return _.extend(app, {


            layout: new Layout({}),

            useLayout: function (name, options) {
                // If already using this Layout, then don't re-inject into the DOM.
                if (this.layout && this.layout.options.template === name) {
                    return this.layout;
                }

                // If a layout already exists, remove it from the DOM.
                if (this.layout) {
                    this.layout.remove();
                }

                var _app = this;

                // Create a new Layout with options.
                var layout = new Layout(_.extend({
                    template: name,
                    serialize: function () {
                       return { 
                                locale: CommonStrings
                            }
                    },
                    className: "layout",
                    // id: "main-box",

                    afterRender: function () {
                        console.log('app.afterRender');
                    }
                }, options));

                // Insert into the DOM.
                $("#main").empty().append(layout.$el);
                // alert();
                // Render the layout.
                layout.render();
                // Cache the refererence.
                this.layout = layout;

                // Return the reference, for chainability.
                return layout;
            }
        },

            Backbone.Events);

    });

