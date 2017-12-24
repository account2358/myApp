var myCustomerServicePage = {
    scroll: null
};
$(document).bind("pageshow", function (e) {
    var id = e.target.id;
    if ("myCustomerService_page" == id) {
        document.addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, false);
        if (!myCustomerServicePage.scroll) {
            myCustomerServicePage.scroll = new iScroll("underpart_div_scroll", {
                useTransition: true,
                checkDOMChanges: true,
                hScrollbar: false,
                vScrollbar: false
            });
        }
    }
});