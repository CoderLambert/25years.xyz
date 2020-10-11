define([
    "jquery",
    "underscore",
    "backbone",
    // data
    "model//software",
    "collection//software",
    "views/softItmeView",
    "i18n!strings/nls/file_management",
    'text!templates/fileManagement.html',
    'css!style/style',
    'css!style/zui.datagrid',
    'datagrid'
    
], function($, _, Backbone,SoftModel, SoftCollection,SoftItemeView, locale ,tpl) {



    var view = Backbone.View.extend({
        tagName: "div",
        className: 'file-management-box',
        template:  _.template(tpl),

        initialize: function() {
            console.log(SoftModel);
            this.model = new SoftModel();
            this.collection = SoftCollection;
            console.log(this)

        },

        events: {

        },


        beforeRender: function() {
        
        },


        afterRender: function() {
        
            var _parent = this;
            this.collection.fetch({
                success: function(collection) {

                    $(_parent.$el).find('#docBox').datagrid({
                        dataSource: {
                            cols:[
                                {name: 'id', label: 'id', width: 0.05},
                                {name: 'name', label: '文件名', width: 0.2},
                                {name: 'desc', label: '描述', width: 0.3},
                                {name: 'file', label: '路径', width: 0.3},
                                {name: 'tagname', label: '分类', width: 0.08},
                                {name: 'username', label: '上传者', width: 0.1}
                            ],
                            array: collection.toJSON()

                            // ... Data source 其他属性
                        },
                        // ... 其他初始化选项
                        sortable: true

                    });

                }
            })
        },

        load: function(model, collection, xhr) {

        },

        reload: function(model, value) {

        },

        serialize: function() {
            return {
                locale: locale
            };
        }

    });

    return view;

});