// var user = "{{ request }}";


function OPTION() {
    this.config = {
        'scroll_top': '.option-scroll-top',
        'scroll_bottom': '.option-scroll-bottom',
        'switch_toc': '.option-toc',
    }

    this.toc_options = {
        selector: 'h1,h2, h3, h4, h5, h6',
        scope: '#post',
        overwrite: false,
        prefix: 'toc'
    }

    this.doc_scroll_positions = {
        top: null,
        left: null,
        width: null,
        height: null
    };    
}
OPTION.prototype.toTop = function () {
    $('html,body').animate({ scrollTop: 0 }, 'slow');
}

OPTION.prototype.toBottom = function () {
    $('html,body').animate({ scrollTop: $('body')[0].offsetHeight }, 'slow');
}

OPTION.prototype.siwtchToc = function () {
    // console.log('切换目录');
    $('.toc-wrapper').toggleClass('col-md-3 hide');
    $('.main-content').toggleClass('col-md-9');
}

OPTION.prototype.ScollPostion = function () {
    var t, l, w, h;

    if (document.documentElement && document.documentElement.scrollTop) {
        t = document.documentElement.scrollTop;
        l = document.documentElement.scrollLeft;
        w = document.documentElement.scrollWidth;
        h = document.documentElement.scrollHeight;
    } else if (document.body) {
        t = document.body.scrollTop;
        l = document.body.scrollLeft;
        w = document.body.scrollWidth;
        h = document.body.scrollHeight;
    }

    this.doc_scroll_positions = {
        top: t,
        left: l,
        width: w,
        height: h
    };
    return this.doc_scroll_positions
}

OPTION.prototype.SetOptionByScroll =  function(e){  
    // console.log('开始执行')
    var article_titles = $('#post').find('h1,h2,h3,h4,h5,h6');
    var article_titles_status = []
    var scrollTop = $(document).scrollTop();  //滚动高度
    var viewH = $(window).height();  //可见高度 
    var contentH = $(document).height();  //内容高度

    // 滚动到顶部超过一个屏幕可视高度时， 
    // 显示 toTop
    if(scrollTop > viewH) { 
        $('.option-scroll-top').css('display','flex');
    } else {
        $('.option-scroll-top').css('display','none');
    }

    // 如果可视高度 小于 内容高度
    // 显示 toBottom
    if ( viewH < contentH ) {
        $('.option-scroll-bottom').css('display','flex');
    } else {
        $('.option-scroll-bottom').css('display','none');
    }

    //当滚动到距离底部100px时,隐藏  toBottom
    if(contentH - viewH - scrollTop <= viewH) { 
        // console.log("当滚动到距离底部400px时");
        $('.option-scroll-bottom').css('display','none');
    } else {
        $('.option-scroll-bottom').css('display','flex');
    }

    // console.log(article_titles);
    var title_content_index = null;
    var title_toc_index = null;

    $( article_titles ).each( function(index,title) {
        if( title.offsetTop - scrollTop >=0 ){

            var locate_index = index > 0 ? index-1 : index;
            article_titles_status.push(article_titles[locate_index]);
            // console.log(locate_index);
            title_content_index = locate_index;
            title_toc_index = index;
            return false;
        }
    })
    // console.log(article_titles_status);

    if(article_titles_status[0]){
        // console.log(article_titles_status);
        if(editor_type ==='md'){
            var  tocContainer = $('#toc').find('ul').first();
        } else {
            var  tocContainer = $('#toc').find('ol').first();
        }
        
        var toc = $('#toc a').eq(title_toc_index);

        $('#toc').find('li').removeClass();
        $(toc).parent().addClass('active');

        //  目录自动滚动到高亮地方
        var location_item = tocContainer.find('.active');

        if (location_item.length>0) {
            // console.log(location_item);
            // offset().top   相对于文档的偏移高度
            // scrollTop()    滚动条的垂直高度位置
            $(tocContainer).animate({
                scrollTop: $(location_item).offset().top - $(tocContainer).offset().top +$(tocContainer).scrollTop()
            },100);
        }
    }
}


// 初始化设置一下
var side_option = new OPTION();
$(side_option.config['scroll_top']).bind('click', side_option.toTop);
$(side_option.config['scroll_bottom']).bind('click', side_option.toBottom);
$(side_option.config['switch_toc']).bind('click', side_option.siwtchToc);
$(window).on('scroll',_.debounce(side_option.SetOptionByScroll, 50));

side_option.SetOptionByScroll();


if ( $('.option-toc').length >0 ) {
    $('.option-toc').click()
}
