define([
    "jquery",
    "underscore",
    "backbone",
    "views/docItmeView",
    "i18n!strings/nls/file_management",
    'text!templates/docList.html',
    
], function($, _, Backbone, DocItemeView, locale ,tpl) {



    var view = Backbone.View.extend({
        el: "#fileInforTable",
        className: 'table-responsive',
        template:  _.template(tpl),

        initialize: function() {

            // this.collection.bind("destroy", this.removeView, this);

        },

        events: {

        },


        beforeRender: function() {
        
        },


        afterRender: function() {

            var _parent = this;
            this.collection.each(function(model) {
                var itemView = new DocItemeView({
                    model: model
                }).render();

                _parent.$el.find('tbody').append(itemView.el)

            })

            // 初始化提示插件
            $('[data-toggle="tooltip"]').tooltip(
                {
                    'animation':true,
                    'title': '备注描述',
                }
            );
        },

        removeView: function() {
            console.log('doc list remove')
            // this.remove();
        },

        serialize: function() {
            return {
                locale:locale
            };
        }

    });

    return view;

});