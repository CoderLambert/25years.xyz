define(["jquery", "underscore", "backbone"],

function($, _, Backbone, app, locale) {

    var model = Backbone.Model.extend({
        
        defaults: {},
        
        validation: {},

        url: function () {
            return '/api/softs/' + this.get('id') + '/'
        }
    });

    return  model;
});
