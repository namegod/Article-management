;
(function(window, undefined) {
    let util = {
        change_time: function(date, format = "YYYY-MM-DD HH:mm:ss") {
            return moment(date).format(format);
        }
    };
    //  暴露给全局
    window.util = util;
})(window);