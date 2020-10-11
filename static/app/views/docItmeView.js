define([
    "jquery",
    "underscore",
    "backbone",
    "app",
    "i18n!strings/nls/file_management",
    "text!templates/docItme.html",
    "text!templates/docItmeInTrash.html"


], function ($, _, Backbone, app, locale, doc_itme_tpl, doc_trash_tpl) {

    var view = Backbone.View.extend({
        tagName: "tr",
        className: 'file-doc-itme',


        initialize: function () {

            // this.model.bind("destroy", this.removeView, this);
            // 文档列表 与 回收站使用不同的模板
            var tpl = this.model.get('is_delete') ? doc_trash_tpl : doc_itme_tpl;

            this.template = _.template(tpl);

        },

        events: {
            "click button[id^='detail_']": "fileDeatil",
            "click button[id^='edit_']": "fileEdit",
            "click button[id^='trash_']": "fileTrash",

            "click button[id^='delete_']": "fileDelete",
            "click button[id^='recover_']": "fileRecover"
        },
        afterRender: function() {

        },
        removeView: function () {
            // this.remove();
            this.RemoveFileItem()
        },

        fileDeatil: function (ev) {
            console.log('fileDeatil');
            // 展示详情
        },

        fileEdit: function (ev) {
            console.log('fileEdit');
            // 展示编辑页面

        },

        // 文件永久删除
        fileDelete: function (ev) {
            console.log('fileTrash');
            console.log(ev);
            var _parent = this;

            // 禁用按钮
            app.disableButton(ev.target)

            // 第一次放进草稿箱
            // debugger;
            this.model.destroy(
                {
                    success: function (model, response) {
                        app.enbaleButton(ev.target);
                        app.showInfoTip( model.get('name') + ' ' + locale.file_has_been_permanently_deleted);
                    },

                    error: function (model, response) {
                        app.enbaleButton(ev.target);
                        app.showErrorTip( model.get('name')+ ' '  + locale.file_delete_operation_failed)
                    },

                    wait: true,
                    patch: true

                });
        },

        fileTrash: function (ev) {
            // console.log('fileDelete');
            // console.log(ev);
            var _parent = this;

            // 禁用按钮
            app.disableButton(ev.target)

            // 第一次放进草稿箱
            // debugger;
            this.model.save({
                is_delete: true
            },
                {
                    success: function (model, response) {
                        app.enbaleButton(ev.target);
                        app.showInfoTip( model.get('name') + ' ' + locale.file_move_to_trash)
                    },

                    error: function (model, response) {
                        app.enbaleButton(ev.target);
                        app.showErrorTip( model.get('name')+ ' '  + locale.file_delet_operation_failed)
                    },

                    wait: true,
                    patch: true

                });
        },

        fileRecover: function (ev) {
            var _parent = this;


            // 禁用按钮
            app.disableButton(ev.target)

            // 第二次永远删除
            // debugger;
            this.model.save({
                is_delete: false
            },

                {
                    success: function (model, response) {
                        app.enbaleButton(ev.target);
                        app.showInfoTip(locale.file_has_recover)
                    },

                    error: function (model, response) {
                        app.enbaleButton(ev.target);
                        app.showErrorTip(locale.file_recover_failed);
                    },

                    wait: true,
                    type: 'patch'

                });
        },
        RemoveFileItem: function (model) {
            $('#delete_' + model.get('id')).parents('tr').remove();
        },
        RemoveTrashFileItme: function (model) {
            $( '#trash_' + model.get('id')).parents('tr').remove();
        },
        serialize: function () {
            return {
                locale: locale,
                model: this.model.toJSON()
            };
        }

    });

    return view;

});