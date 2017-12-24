var myOrdersPage = {
    scroll: null,
    storage: window.localStorage,
    userId: pageLocalStorage.getItem("userid"),
    pageNo: 1,
    pageSizr: 10,
    init: function () {
        //user orders
        $.M.get({
            method:"/order/orderApp.jhtml?memberId=" + myOrdersPage.userId,
            success: function (data) {
                if (data.returnValue.total != "0") {
                    var ordersData = data.returnValue.data;
                    $("#mainText").hide();
                    $("#order_complete").hide();
                    var orders = "";
                    for (var i = 0; i < ordersData.length; i++) {
                        var createDate = ordersData[i].createDate.substr(0, 10);
                        orders = orders + "<div class='order_record_div'><div class='order_img'><img src='" + ordersData[i].imgs[0] + "' alt='' /></div>";
                        orders = orders + "<div class='order_info_div'><span class='orderTitle'>" + ordersData[i].amount + "</span>";
                        orders = orders + "<span class='orderDate'>" + createDate + "</span>";
                        orders = orders + "<span class='orderStatus'>" + ordersData[i].orderStatus + "</span>";
                        orders = orders + "<span class='orderSN'>单号:" + ordersData[i].sn + "</span>";
                        orders = orders + "<span class='orderQuantity'>" + ordersData[i].totalItemQuantity + "件商品</span>";
                        orders = orders + "</div><span class='clear'></span></div>";
                    }
                    $("#ordersList").html(orders);
                    $("#ordersList").show();
                } else {
                    $("#mainText").show();
                    $("#ordersList").hide();
                }

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        });
    }
};
$(document).bind("pageshow", function (e) {
    var id = e.target.id;
    if ("myOrders_page" == id) {
        document.addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, false);
        if (!myOrdersPage.scroll) {
            myOrdersPage.scroll = new iScroll("underpart_div_scroll", {
                useTransition: true,
                checkDOMChanges: true,
                hScrollbar: false,
                vScrollbar: false
            });
        }
        myOrdersPage.init();
    }
});