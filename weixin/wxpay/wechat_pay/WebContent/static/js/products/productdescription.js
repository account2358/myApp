var pageLocalStorage = window.localStorage;
var productdescriptionPage = {
    scroll: null,
    userId: pageLocalStorage.getItem("userid"),
    pageNo: 1,
    pageSizr: 10,
    showMask: function (theme, msg) {
        $.mobile.showPageLoadingMsg(theme, msg);
        $(".maskDiv").css("display", "block");
    },
    hideMask: function (theme, msg) {
        $.mobile.hidePageLoadingMsg(theme, msg);
        $(".maskDiv").css("display", "none");
    },
    init: function () {
        //if ($(document.body).height() < 630)
        //    $("#footEmpty").show();
        //else
        //    $("#footEmpty").hide();
        var prodId = pageLocalStorage.getItem("proddetailId");

        $.M.get({
            method: "/product/detail/product/" + prodId + ".jhtml",
            success: function (data) {
                $("#picdetail").html(data.returnValue.introduction);
     
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                productdescriptionPage.hideMask("c", "正在加载...");
            }
        });

    },
    showMessges: function (messges) {
        $(".errorLabel").html(messges);
        $(".errorDiv").css("visibility", "visible");
        setTimeout('$(".errorDiv").css("visibility", "hidden")', 3000);
    },
    back: function () {
        window.location.href = "../products/productdetail.html";
    }
};

$(document).bind("pageshow", function (e) {
    var id = e.target.id;
    if ("product_DescriptionPage" == id) {
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        if (!productdescriptionPage.scroll) {
            productdescriptionPage.scroll = new iScroll("underpart_div_scorll", {
                useTransition: true,
                checkDOMChanges: true,
                hScrollbar: false,
                vScrollbar: false
            });
        }
        productdescriptionPage.init();
    }
});
