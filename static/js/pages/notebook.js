    // 打开添加日志编辑框
    function OpenEventBox() {
        $('.add-flag').find('.icon').addClass('icon-chevron-sign-right').removeClass('icon-chevron-sign-left');
        $('.add-event-wrapper').addClass('open').removeClass('shrink');
    }
    // 切换添加日志编辑框

    function SwitchEventBox() {
        $('.add-flag').find('.icon').toggleClass('icon-chevron-sign-left icon-chevron-sign-right')
        $('.add-event-wrapper').toggleClass('shrink open');
        $('#event_reset').click();
    }
    // 切换添加日志编辑框状态 (标题 ==》编辑、提交按钮 ==》 修改)

    function SwitchEventBoxEdit() {
        $('#event_box_change_title,#change_event').removeClass('hide');
        $('#event_box_title, #add_event').addClass('hide');
    }

    // 切换添加日志编辑框状态 (标题 ==》新增事件记录、提交按钮 ==》 新增)

    function SwitchEventBoxNew() {
        $('#event_box_change_title,#change_event').addClass('hide');
        $('#event_box_title, #add_event').removeClass('hide');
    }

    // 获取当前日志编辑框内容

    function GetEvnentInfo() {
        return {
            // _.escape   防止 XSS 
            title: _.escape( $('#event_title').val().trim() ) ,
            desc: _.escape( $('#event_desc').val().trim()),
            start: _.escape( $('#event_start').val().trim()),
            end: _.escape( $('#event_end').val().trim())
        }
    }

    // 绑定日志编辑框打开动作
    $('.add-flag').on('click', function (ev) {
        SwitchEventBox();
        SwitchEventBoxNew();
    })
    //  初始化日历插件
    // 中文
    $('#calendar').calendar({
        "lang": "zh_cn",
    });
    // 获取实例对象
    var calendar = $('#calendar').data('zui.calendar');

    // 绑定单击日志事件
    $('#calendar').calendar().on("clickEvent.zui.calendar", function (element, event, events) {

        var event_info = event.event;

        new $.zui.Messager(event_info.desc, {
            icon: 'bell',
            type: 'info',
            placement: 'top',
            time: 0, // 不进行自动隐藏

            actions: [{
                name: 'edit',
                icon: 'edit'
            }, {
                name: 'close',
                icon: 'remove'
            }, {
                name: 'trash',
                icon: 'trash'
            }
        ],

            // 设置对应图标响应事件
            onAction: function (name, action, messager) {
                if (name === 'edit') {
                    OpenEventBox();
                    SwitchEventBoxEdit();

                    var editModel = EventCollection.get(event_info.id);

                    _.each(['title', 'desc'], function (item) {
                        $('#event_' + item).val( _.unescape( editModel.get(item) ));
                    })
                    
                    _.each(['start', 'end'], function (item) {
                        $('#event_' + item).val(  editModel.byDateformat( item ) );
                    })

                    $('#change_event').off('click').on('click', function () {

                        editModel.set(GetEvnentInfo(), {
                            silent: true
                        });
                        // 更新事件视图
                        updateEvent(editModel);
                    })

                } else if (name === 'close') {
                    //关闭按钮  do Nothing
                } else if (name == 'trash') {
                    var editModel = EventCollection.get(event_info.id);

                    editModel.destroy();
                    calendar.removeEvents(editModel.id);
                }
            }
        }).show();

    });

    // 初始化日期选择器
    $(".form-datetime").datetimepicker(
        {
            weekStart: 1,
            todayBtn: 1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 2,
            forceParse: 0,
            showMeridian: 1,
            format: "yyyy-mm-dd hh:ii"
        });


    // 初始化提示插件
    $('[data-toggle="tooltip"]').tooltip({
        placement: 'top',
        tipClass: 'tooltip-danger',
        delay: 5000
    });


    // 新增事件
    $('#add_event').on('click', function (ev) {

        var new_event_model = new EventModel();

        new_event_model.save(GetEvnentInfo(), {
            success: function (model) {
                calendar.addEvents(new_event_model.toJSON());
                
                SwitchEventBox();

                // EventCollection.add(model);
                EventCollection.addMondel(model);

            },
            error: function (model, jxhr) {
                var resJson = jxhr.responseJSON;
                _.each(resJson, function (err_message, key, errors) {
                    $('#event_' + key).tooltip('show', err_message);
                })

            },

            url: '/api/notes/'
        });
    })

    function updateEvent(model) {

        model.save(model.toJSON(), {
            url: '/api/notes/' + model.id + '/',
            // 进提交改动的内容
            patch: true,
            // 等待服务端响应再更新 
            wait: true,

            success: function (model) {
                calendar.removeEvents(model.id);
                calendar.addEvents(model.toJSON())
                SwitchEventBox();

                new $.zui.Messager('更新成功。', {
                    icon: 'bell',
                    type: 'info',
                    placement: 'top-right'
                }).show();
            }

        });
    }


    var EventCollection = new EventCollection();
    EventCollection.fetch({
        success: function (collection) {

            collection.each(function (model) {
                calendar.addEvents(model.attributes)
                model.bind('change', updateEvent, this)
            })

        },
        error: function () {
            new $.zui.Messager('获取日志出现错误。', {
                icon: 'bell',
                type: 'danger',
                placement: 'top-right'
            }).show();
        }
    })
