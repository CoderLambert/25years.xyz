require(["config"], function() {
    
        //判断是否是汉语
        var storedLocale = 'root';
        if ( localStorage.getItem('locale') == 'root' ) {
            storedLocale =  'root';
        } else {
            storedLocale = 'zh-cn'
        }

        
        requirejs.config({
            config: {
                i18n: {
                    locale: storedLocale
                },
            }
        });
    // }


    require(['app','router'], function(app, Router){

        app.router = new Router();

        app.initialize();

        Backbone.history.start({
            pushState: false,
            root: app.root
        });04
    })

})