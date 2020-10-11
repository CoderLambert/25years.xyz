var selected_category = []
$('#CategoryTree input').change(function (e) {
     if ($(this).is(':checked')) {
          selected_category.push($(this).val());
     } else {
          selected_category.pop($(this).val());
     }
})

function getCookie(name) {
     var cookieValue = null;
     if (document.cookie && document.cookie !== '') {
         var cookies = document.cookie.split(';');
         for (var i = 0; i < cookies.length; i++) {
             var cookie = cookies[i].trim();
             // Does this cookie string begin with the name we want?
             if (cookie.substring(0, name.length + 1) === (name + '=')) {
                 cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                 break;
             }
         }
     }
     return cookieValue;
 }
//  初始化 csrf token 设置
 var csrftoken = getCookie('csrftoken');
 $.ajaxSetup({
     headers: { 'X-CSRFTOKEN': csrftoken },
     beforeSend: function (req) {
         req.setRequestHeader('X-CSRFTOKEN', csrftoken);
     }
 });


// yyyy-mm-dd hh:mm
 var formatDateTime = function (date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h=h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    var second=date.getSeconds();
    second=second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
};