require.config({
    config: {
        i18n: {
            locale : 'zh-cn'
        }
    },
    // map: {
    //     '*': {
    //         'css': '../js/backbone_plugin/css.min' // require的css.js
    //     }
    // },
    paths: {
        "underscore": "../js/underscore",
        "jquery": "../js/lib/jquery/jquery",

        'zui':'../js/zui',

        "i18n": "../js/backbone_plugin/i18n",
        "text": "../js/backbone_plugin/text",
        "backbone": "../js/backbone",
        "layoutmanager": "../js/backbone_plugin/backbone.layoutmanager",
        "backboneValidation": "../js/backbone_plugin/backbone-validation-amd",
        "bootbox":"../js/lib/bootbox/bootbox.min",
        "datagrid": "../js/lib/datagrid/zui.datagrid",
        "echarts": "./libs/echarts/echarts",
        "chosen": "../js/lib/chosen/chosen",
        'css': '../js/backbone_plugin/css.min'  // 按需加载 CSS
    },

    shim: {
        "backbone": {
            deps: ["jquery", "underscore"],
            exports: "Backbone"
        },

        "layoutmanager": {
            deps: ["backbone"],
        },

        "backboneValidation":{
            deps: ["backbone"],
        },

        "zui": {
            deps: ["jquery"],
        }

    }
});
