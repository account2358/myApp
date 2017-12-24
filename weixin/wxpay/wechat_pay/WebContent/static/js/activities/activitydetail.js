var pageLocalStorage = window.localStorage;

var activitydetail = {
    scroll: null,
    userId: "",
    pageNo: 1,
    pageSizr: 10,
    showMask: function (theme, msg) {
        $(".maskDiv").css("display", "block");
    },
    hideMask: function (theme, msg) {
        $(".maskDiv").css("display", "none");
    },
    showShade: function () {
        $(".shade_div").show();
    },
    hideShade: function () {
        $(".shade_div").hide();
    },
    init: function () {
        if ($(document.body).height() < 630)
            $("#footEmpty").show();
        else
            $("#footEmpty").hide();

        activitydetail.initData();        //加载数据
    },
    initData: function () {
        var id = pageLocalStorage.getItem("activityId");
        var str = '';
        $.M.get({
            method: "/promotion/detail.jhtml?id=" + id,
            success: function (data) {
                $.each(data.returnValue, function (i, info) {

                    var reviewDate = new Date(info.endDate);
                    var year = reviewDate.getFullYear();
                    var month = reviewDate.getMonth() < 10 ? "0" + reviewDate.getMonth() : reviewDate.getMonth();
                    var day = reviewDate.getDay() < 10 ? "0" + reviewDate.getDay() : reviewDate.getDay();
                 
                    str += '<div id="titlediv">' + info.title + '</div>';
                    str += '<div id="timediv"><img src="../css/images/activities/ico_date.png" /><span class="time_title">' + (year + "-" + month + "-" + day) + '</span></div>';
                    str += ' <div id="imgdiv"><img src="' + info.promotionImages[0].source + '" /></div>'
                    str += '<div id="infodiv">'
                    $.each(info.promotionParagraphs, function (i, data) {
                        str += '<div class="unit">' + data.paragraph + '</div>';
                    });
                    str += '</div>';
                    str += '<div id="productdiv">';
                    $.each(info.products, function (i, info) {
                        str += '<div class="itemDiv"  onclick="activitydetail.GoDetail(\'' + info.id + '\')">';
                        str += '<div class="itemImg"><img src="' + info.image + '" /></div>';
                        str += '<div class="itemName">' + (info.name.length > 8 ? (info.name.substring(0, 8) + "...") : info.name) + '</div>';
                        str += '<div class="itemSpecifications">规格：' + info.fullName.substring(info.fullName.indexOf('[')) + '</div>';
                        str += '<div class="itemPrice">￥' + info.price.toFixed(2) + '</div>';
                        str += '</div>';
                    });
                    str += "</div>";
                })

                $("#detail_div").html(str);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                activitydetail.hideMask("c", "正在加载...");
            }
        });
    },
    GoDetail: function (prodId) {
        pageLocalStorage.setItem("proddetailId", prodId);
        window.location.href = "../products/productdetail.html";
    },
    Gopage: function () {

        window.location.href = "../activities/activitylist.html";
    },
};
$(document).bind("pageshow", function (e) {
    var id = e.target.id;
    if ("activitydetail_page" == id) {
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        if (!activitydetail.scroll) {
            activitydetail.scroll = new iScroll("underpart_div_scorll", {
                useTransition: true,
                checkDOMChanges: true,
                hScrollbar: false,
                vScrollbar: false
            });
        }
        activitydetail.init();
    }
});
