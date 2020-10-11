define([
    "jquery",
    "underscore",
    "backbone",
    "i18n!strings/nls/file_management",
    'text!templates/docItme.html',
    
], function($, _, Backbone, locale ,tpl) {



    var view = Backbone.View.extend({
        tagName: "div",
        className: 'file-doc-itme',
        template:  _.template(tpl),

        initialize: function() {

            this.model.bind("destroy", this.removeView, this);
            console.log(this.model)
        },

        events: {

        },


        removeView: function() {
            this.remove();
        },

        serialize: function() {
            return {
                locale:locale,
                model: this.model.toJSON()
            };
        }

    });

    return view;

});