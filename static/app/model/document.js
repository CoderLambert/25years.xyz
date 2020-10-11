define(["jquery", "underscore", "backbone"],

function($, _, Backbone, app, locale) {

    var model = Backbone.Model.extend({
        
        defaults: {},
        
        validation: {},

        url: function () {
            return '/api/docs/' + this.get('id') + '/'
        }
    });

    return  model;
});
