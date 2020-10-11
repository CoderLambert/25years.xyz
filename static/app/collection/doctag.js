define(["jquery", "underscore", "backbone", "model/doctag"],

function($, _, Backbone, DocTagModel) {

    var collection = Backbone.Collection.extend({

        url: function() {
            return '/api/doctags/'
        },

        model: DocTagModel

    });

    return  collection;

});
