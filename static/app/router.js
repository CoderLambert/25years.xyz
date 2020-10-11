var gload_app;

define([
    "app",
    "views/fileManagementView",
    "views/softManagementView",
],
	 

function( 
    app,
    FileManagementView,
    SoftManagementView,

) {

	"use strict";
    // console.log('enter router');
    // console.log(FileManagementView);
	/*将全局变量赋予app，避免出现app未定义的错误*/
	gload_app = app;
    // console.log(app);

    // Defining the application router.
    var Router = Backbone.Router.extend({

        routes: {
        	// "h5kvm": "H5KVM",
            "fm": "FileManagement",
            "sm": "SoftManagement",
            "": "FileManagement"
        },

        default: function() {
            // console.log('default')
        },


        FileManagement: function() {
            this.preSwitch();
            // console.log(FileManagementView);

            this.setView( FileManagementView );
            this.postSwitch();

            // console.log('FileManagementView')
        },

        SoftManagement: function() {
            this.preSwitch();
            // console.log(FileManagementView);

            this.setView( SoftManagementView );
            this.postSwitch();

            // console.log('FileManagementView')
        },
		
        preSwitch: function() {

			app.abortAll(); //终止前一页面所有还在请求中的AJAX请求

            // console.log('preSwitch')

        },

        postSwitch: function() {

            // console.log('postSwitch')

        },

        setView: function(View) {
            // console.log('setView' +View )
            var view = new View();
            // console.log(view);
            app.layout.setView(".right-side", view).render();
            app.lastActiveView = view;

        }

    });

    return Router;
});
