define(["jquery", "underscore", "backbone", "model/document"],

function($, _, Backbone, DocModel) {

    var collection = Backbone.Collection.extend({

        url: function() {
            return '/api/docs/'
        },

        model: DocModel

    });

    return  collection;

});
