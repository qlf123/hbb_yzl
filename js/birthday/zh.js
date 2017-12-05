(function($) {

    var view_width = document.getElementsByTagName('html')[0].getBoundingClientRect().width;
    var _html = document.getElementsByTagName('html')[0];
    view_width > 640 ? _html.style.fontSize = 640 / 16 + 'px' : _html.style.fontSize = view_width / 16 + 'px';



    $.mobiscroll.zh = $.extend($.mobiscroll.zh, {
        setText: '开始制作',
        //cancelText: '取消',
        // Datetime component
        dateFormat: 'yy年mm月dd日',
        dateOrder: 'yymmdd'
    });

    var theme = {
        defaults: {
            dateOrder: 'Mddyy',
            mode: 'mixed',
            rows: 5,
            width: 100,
            height: 36,
            showLabel: false,
            useShortLabels: true
        }
    };
    $.mobiscroll.themes['android-ics light'] = theme;

    // console.log("zh.js");
})(jQuery);