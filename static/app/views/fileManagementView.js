define([
    "jquery",
    "underscore",
    "backbone",
    "app",
    // data
    "model//document",
    "model//doctag",
    "collection//document",
    "collection//doctag",

    "views/docItmeView",
    "views/docListView",

    "i18n!strings/nls/file_management",
    'text!templates/fileManagement.html',
    'echarts',
    'zui',
    'chosen',
    'css!style/style',
    'css!style/chosen',
    'bootbox',


], function ($, _, Backbone, app, DocModel,DocTag, DocCollection,DocTagCollection, DocItemeView, DocListView, locale, tpl, echarts) {



    var view = Backbone.View.extend({
        tagName: "div",
        className: 'file-management-box',
        template: _.template(tpl),

        initialize: function () {
            console.log(this);
            this.tagCollection = new DocTagCollection();
            this.fileCollection = new DocCollection();
            this.files = new DocCollection();
            this.del_files = new DocCollection();

            this.fileCollection.bind('remove change', this.changeCollection, this);
            
            this.fileCollection.bind('destroy', this.destroyCollection, this);

            // 记录之前结果
            this.pre_search_file_name = '';
            this.fileStatus = 'info';

        },

        events: {
            'click #searchFile': 'SearchFile',
            'click #doc_file': 'FileInfo',
            'click #doc_trash': 'FileTrashInfo',
            'click #doc_upload': 'UploadFileView',
            'click #upload_doc_action': 'UploadDoc',
            'click #add_tag_cancel': 'hideTagModal',
            'click #add_tag_submit': 'addNewTag',
            'click .upload-tag-new': 'showTagModal',

            'click #edit_file_tag_cancel': 'hideEditFileModal',
            'click #edit_file_tag_submit': 'editFileSubmit',
            'click button[id^="file_edit_"]': 'showEditFileModal',

            
            'change #upload_doc_file': 'UpdateFileName',
            
            'keypress #searchName': 'EnterSearch',

        },


        beforeRender: function () {

        },

        fetchFileInfo: function () {
            var _parent = this;

            this.fileCollection.fetch({
                success: function (collection) {
                    // 未删除的文件
                    _parent.files.add( collection.where({ is_delete: false }) );

                    // 渲染已经删除的文件
                    _parent.del_files.add( collection.where({ is_delete: true }) );

                    _parent.UpdateFileBoxTable(_parent.files);
                }
            });

        },

        afterRender: function () {
            var _parent = this;
            _parent.fetchFileInfo();
            this.fileStatus = 'info';
            _parent.FetchTagOptions($('#upload_doc_tag'));
        },

        //  更新分类信息


        FetchTagOptions: function ($target,callback){
            console.log('FetchTagOptions');
            this.tagCollection.fetch({
                success: function(collection){
                    $target.empty();

                    collection.each(function(model){
                        var option = "<option value='" + model.get('id')  + "'>" + model.get('name') + "</option>";
                        $target.append(option)
                    })

                    $target.chosen({
                        no_results_text: locale.no_search_result,    // 当检索时没有找到匹配项时显示的提示文本
                        disable_search_threshold: 5, // 5 个以下的选择项则不显示检索框
                        search_contains: true         // 从任意位置开始检索
                    });
                    callback && callback();
                },

                error: function(){
                    app.showErrorTip('获取分类信息发生错误')
                },
                wait: true
            });

        },


        updateTagOptions: function ($target){
            console.log('FetchTagOptions');
            this.tagCollection.fetch({
                success: function(collection){
                    // $('#upload_doc_tag').empty();
                    $target.empty();
                    collection.each(function(model){
                        var option = "<option value='" + model.get('id')  + "'>" + model.get('name') + "</option>";
                        // $('#upload_doc_tag').append(option)
                        $target.append(option)
                    })
                    $target.trigger('chosen:updated');
                    // $('#upload_doc_tag').trigger('chosen:updated');
                },

                error: function(){
                    app.showErrorTip('获取分类信息发生错误')
                },
                wait: true
            });

        },

        // 更新文件数量信息
        UpdateFileCountsInfo: function (){
            var _parent = this;
            $('#doc_file_total').empty().text( '(' + _parent.files.length +')').css('color','#43a047');
            $('#doc_trash_total').empty().text( '(' + _parent.del_files.length + ')' ).css('color','#ea644a');
        },

        UpdateFileBoxTable: function (collection) {
            console.log('UpdateFileBoxTable');
            var _parent = this;
            // 默认挂载位置  因为 已经删除的与未删除的文件需要放在不同位置
            var $file_info_box = $(_parent.$el).find('#fileInforTable');

            // 更新前先清空
            $file_info_box.find('#table_doc').empty();

            // 没有数据，不做任何动作
            if (collection.length > 0) {
                // 渲染文件框选项
                var docInfo = new DocListView({ collection: collection }).render().$el;

                $file_info_box.append(docInfo);

            } else {
                var no_search_info = '<h2 style="text-align:center">' + locale.no_search_result + '</h2>'
                $file_info_box.find('#table_doc').append(no_search_info);
            }
            this.drawCharts('file_chart', collection)
            
            this.UpdateFileCountsInfo();
            this.LoginRequired();

        },
        
        LoginRequired: function(){
            console.log(app);
            var username = app.getUserName();
            // console.log( username );
            if (username === 'AnonymousUser') {
                // app.showInfoTip('仅登录用户才可以上传文件');
                app.disableAllbutton($('Button'));
            }
        },

        RemoveFileItem: function (model) {
            $('#delete_' + model.get('id')).parents('tr').remove();
        },

        RemoveTrashFileItme: function (model) {
            $( '#trash_' + model.get('id')).parents('tr').remove();
        },

        changeCollection: function (model) {

            var _parent = this;
            console.log('changeCollection');
            // console.log(model);
            // console.log(model.changed.is_delete);
            // 交换集合元素
            if( model.changed.is_delete) {
                this.files.remove(model);
                this.del_files.add(model);
                _parent.RemoveTrashFileItme(model);
                _parent.UpdateFileBoxTable(this.files);

            } else {
                this.files.add(model);
                this.del_files.remove(model);
                _parent.RemoveFileItem(model);
                _parent.UpdateFileBoxTable(this.del_files);
            }
        },

        destroyCollection: function (model) {
            var _parent = this;
            // console.log('destroyCollection');
            // console.log(model);
            // console.log(model.changed.is_delete);
            this.fileCollection.remove(model);
            this.del_files.remove(model);
            _parent.RemoveFileItem(model);
            _parent.UpdateFileBoxTable(this.del_files);

        },


        // 获取查找搜索的文件结果
        SearchFile: function () {
            var _parent = this;
            var search_file_name = $('#searchName').val();


            // 如果搜索文件名为空或者未产生变化，则不处理，否则过滤符合条件的进行更新视图
            if (_parent.isSearchValueChaneg(search_file_name)) {

                var search_reg = new RegExp(search_file_name, 'gi');

                var search_target_collection = _parent.fileStatus === 'info' ? _parent.files : _parent.del_files

                var update_collection = new DocCollection();

                //  获取符合结果数据
                search_target_collection.each(function (model) {

                    var isMatch = model.get('name').search(search_reg) > -1;

                    isMatch && update_collection.add(model)

                })
                // 重新渲染
                _parent.UpdateFileBoxTable(update_collection);
            }

        },

        EnterSearch: function(ev) {
            var _parent = this;
            if(event.keyCode == 13) {  
                console.log('enter'); 
                _parent.SearchFile();
            }   
        },

    //    _.throttle(EnterSearch, 100)
        // 判断搜索框值是否改变
        isSearchValueChaneg: function (search_file_name) {
            var _parent = this;
            if (search_file_name === _parent.search_file_name) {
                return false;
            }
            // 更新搜索结果记录
            _parent.search_file_name = search_file_name;

            return true
        },

        FileInfo: function (ev) {
            this.fileStatus = 'info';
            $(ev.target).parents('li').addClass('active').siblings().removeClass('active');
            $('#doc_file_box,#doc_chart_box').removeClass('hide')
            $('#doc_upload_box, .progressbar-value').addClass('hide');

            this.UpdateFileBoxTable(this.files);

        },

        FileTrashInfo: function (ev) {
            // console.log('FileTrashInfo')
            this.fileStatus = 'delete';
            $(ev.target).parents('li').addClass('active').siblings().removeClass('active');
            $('#doc_file_box,#doc_chart_box').removeClass('hide')
            $('#doc_upload_box,.progressbar-value').addClass('hide');
            this.UpdateFileBoxTable(this.del_files);

        },

        UploadFileView: function (ev) {
            $(ev.target).parents('li').addClass('active').siblings().removeClass('active');
            $('#doc_file_box,#doc_chart_box').addClass('hide')
            $('#doc_upload_box').removeClass('hide');

            // 仅登录用户才可以上传文件
             
            if (app.getUserName() ==="AnonymousUser") {
                app.showInfoTip('仅登录用户才可以上传文件');
                app.disableButton($('#upload_doc_action')[0])
            }
        },

        drawCharts: function (domid, collection) {
            // 基于准备好的dom，初始化echarts实例
            // 清空之前表格内容
            $(domid).empty();
            var Chart = echarts.init(document.getElementById(domid));
            var tag_info = collection.countBy('tagname');
            var tag_name_arr = _.map(tag_info, function (val, key) { return key });

            // 指定图表的配置项和数据
            var option = {
                title: {
                    text: locale.document_statistice,
                    subtext: locale.currently_uploaded_document_category,
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c}'
                },
                legend: {
                    left: 'left',
                    orient: 'vertical',
                    data: tag_name_arr
                },

                series: [{
                    name: locale.file_tag,
                    type: 'pie',
                    radius: '70%',

                    center: ['50%', '60%'],

                    data: _.map(tag_info, function (val, key) {

                        return { value: val, name: key }

                    })
                }],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }

            };

            // 使用刚指定的配置项和数据显示图表。
            Chart.setOption(option);
        },

        UpdateFileName: function(ev) {
            console.log('UpdateFileName');
            var name = $("#upload_doc_file")[0].files[0].name;
            // var end_index = name.lastIndexOf('.');
            // console.log(name.slice(end_index));

            $('#upload_doc_name').val(name);
        },

        UploadDoc: function() {
            console.log('上传文件');
            var formData = new FormData();
            var name = $('#upload_doc_name').val();
            var desc = $('#upload_doc_desc').val();
            var tag = $('#upload_doc_tag').val();
            var file = $("#upload_doc_file")[0].files[0];
            // console.log(name);
            // console.log(desc);
            // console.log(tag);
            // console.log(file);
            var check_list =[
                {'item':name, 'errMessage':'文件名不能为空'},
                {'item':tag, 'errMessage':'请选择分类'},
                {'item':file, 'errMessage':'请选择要上传的文件'},
            ]  
            var isValid = true;
            _.each(check_list, function(ele) {
                console.log(ele);
                // 如果为空 或者 undefined
                if( ele.item =='' || ele.item === void 0 ) {
                    console.log('error');
                    app.showErrorTip(ele['errMessage'])
                    isValid = false;
                }
            } ) 
            // 未通过验证 则不上传
            if(!isValid) {
                return false
            }
            formData.append("name",name);
            formData.append("desc",desc);
            formData.append("tag",tag);
            formData.append("file",file);
            console.log(formData);

            $.ajax({
                url:'/api/docs/', /*接口域名地址*/
                type:'post',
                data: formData,
                contentType: false,    // 不要对data参数进行序列化处理，默认为true
                processData: false,    // 不要设置Content-Type请求头，因为文件数据是以     multipart/form-data 来编码

                xhr: function(){
                    myXhr = $.ajaxSettings.xhr();
                    if(myXhr.upload){
                       $('#doc_upload_progress,.progressbar-value').removeClass('hide'); 
                       

                      myXhr.upload.addEventListener('progress',function(e) {
                        if (e.lengthComputable) {
                          var percent = Math.floor(e.loaded/e.total*100);
                          console.log(percent)
                          if(percent <= 100) {
                            $("#doc_upload_progress").find('.progress-bar').css('width', percent+'%');
                            $("#doc_upload_progress_label").html('已上传：'+percent+'%');
                            $('.progressbar-value').text(percent + '%');

                          }
                          if(percent >= 100) {
                            $("#doc_upload_progress").find('.progress-bar').css('width', percent+'%');
                            $("#doc_upload_progress_label").html('文件上传完毕，请等待...');
                            $('.progressbar-value').text(percent + '%');

                          }
                        }
                      }, false);
                    }
                    return myXhr;
                },

                success:function (res){
                    console.log(res);
                    app.showInfoTip(locale.upload_success);
                },
                error: function(res) {
                    app. showErrorTip(locale.upload_failed);
                }
            })

        },

        hideEditFileModal: function(ev){
            $('.edit-file-modal').addClass('hide');
        },

        editFileSubmit: function(ev) {
            console.log('editFileSubmit');
        },

        showEditFileModal: function(ev) {
            $('.edit-file-modal').removeClass('hide');
            var model_id = $(ev.target).data('id');
            console.log(model_id);
            var model = this.fileCollection.findWhere({id:model_id})
            // console.log(model)
            if (model === void 0) {
                return false;
            }

            $('#edit_file_name').val(model.get('name'));

            $('#edit_file_desc').val(model.get('desc'));
            this.FetchTagOptions($('#edit_file_tag'),function(){
                $('#edit_file_tag').val(model.get('tag'));
                
            })
        },

        hideTagModal: function(ev){
            $('.tag-modal').addClass('hide')
        },

        showTagModal: function(ev){
            $('.tag-modal').removeClass('hide');

        },

        addNewTag: function() {
            var _parent = this;
            var tagName = $('#add_tag_name').val().trim();
            if(tagName !== '') {
                var tag_model = new DocTag();
                tag_model.save({
                    name:tagName
                },{
                    success: function(model){
                        app.showInfoTip('分类添加成功')
                        _parent.hideTagModal();
                        // 更新分类集合
                        _parent.updateTagOptions($('#upload_doc_tag'));
                    },

                    error: function(model,res){
                        var msg = res.responseJSON.name || '分类添加发生错误'

                        app.showErrorTip(msg)

                        // console.log(res);
                    },
                    wait: true

                })

            }
        },

        serialize: function () {
            return {
                locale: locale
            };
        }

    });

    return view;

});