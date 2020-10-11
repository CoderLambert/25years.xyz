define(["jquery", "underscore", "backbone", "model/software"],

function($, _, Backbone, SoftModel) {

    var collection = Backbone.Collection.extend({

        url: function() {
            return '/api/softs/'
        },

        model: SoftModel

    });

    return new collection();

});
