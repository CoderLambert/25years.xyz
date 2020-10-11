var EventModel = Backbone.Model.extend({
    defaults: {
        title: '',
        desc: '',
        start: '',
        end: ''
    },

    // yyyy-mm-dd hh:mm
    formatDateTime: function (date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        minute = minute < 10 ? ('0' + minute) : minute;
        var second = date.getSeconds();
        second = second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
    },

    DateTimeToValue: function (value) {
        return new Date(value).getTime();
    },


    byDateformat: function (dateVal) {
        return this.formatDateTime(new Date(this.get(dateVal)))
    },

    validate: function (attrs, options) {
        // console.log(attrs);
        var err_map = {
            notNull: {
                'title': '#event_title',
                'desc': '#event_desc',
                'start': '#event_start',
                'end': '#event_end'
            }
        }

        _.each(err_map.notNull, function (val, index, list) {

            if (attrs[index] == '') {
                var err = index + ' 不能为空';
                console.log(list[index]);
                $(list[index]).tooltip('show', err);
                return err;
            } else {
                $(list[index]).tooltip('hide');
            }

        })

        if (this.DateTimeToValue(attrs['start']) > this.DateTimeToValue(attrs['end'])) {
            var err = "开始时间不能小于结束时间"
            $('#event_start').tooltip('show', err);
            return err;
        }

        // return true;
    },

    url: function () {
        console.log(this);
        return '/api/notes/' + this.get('id') + '/'
    }
})


if (Backbone.LocalStorage === void 0) {
    var EventCollection = Backbone.Collection.extend({

        model: EventModel,

        url: '/api/notes/',

        addMondel: function (model) {

            this.add(model);

        }


    });
} else {
    var EventCollection = Backbone.Collection.extend({

        localStorage: new Backbone.LocalStorage("note-events"),

        model: EventModel,

        addMondel: function (model) {

            this.create(model.toJSON());

        }
    });
}

