var aboutPage = {
    scroll: null,
    init: function () {
        //user messages
        $.M.get({
            method:"/article/aboutUs.jhtml",
            success: function (data) {
                if (data.returnValue != "") {

                } else {

                }

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        });
    }
};
$(document).bind("pageshow", function (e) {
    var id = e.target.id;
    if ("about_page" == id) {
        document.addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, false);
        if (!aboutPage.scroll) {
            aboutPage.scroll = new iScroll("underpart_div_scroll", {
                useTransition: true,
                checkDOMChanges: true,
                hScrollbar: false,
                vScrollbar: false
            });
        }
        aboutPage.init();
    }

});