var pageLocalStorage = window.localStorage;

var Common = {
    storage: window.localStorage,
    tabsScroll: null,
    isOpened: false, //我的子菜单是否打开
    isOpened_mid: false, //中间的子菜单是否打开
    showChild: function (type) {
        var isLogined = Common.storage.getItem('isLogined');
        if (isLogined == "0" || isLogined == null) {
            //window.location.href = "login.html";
            $("#login_btn").show();
        } else {
            $("#login_btn").hide();
        }
        if (type == "1") {
            if (Common.isOpened == false) {
                $("#child_menu").show();
                $("#mid_menu").hide();
                Common.isOpened = true;
                Common.isOpened_mid = false;
            } else {
                $("#child_menu").hide();
                $("#mid_menu").hide();
                Common.isOpened = false;
                Common.isOpened_mid = false;
            }
        } else if (type == "2") {
            if (Common.isOpened_mid == false) {
                $("#mid_menu").show();
                $("#child_menu").hide();
                Common.isOpened_mid = true;
                Common.isOpened = false;
            } else {
                $("#child_menu").hide();
                $("#mid_menu").hide();
                Common.isOpened = false;
                Common.isOpened_mid = false;
            }
        }
    },
    goPage: function (pageId) {
        switch (pageId) {
            case '1':
                window.location.href = "../index.html";
                break;
            case '2':
				pageLocalStorage.removeItem("productCategoryId");
                window.location.href = "../products/productsList.html";
                break;
            case '3': 
                window.location.href = "../products/productcart.html";
                break;
            case '4':
                window.location.href = "../my/myInformation.html";
                break;
            default:
                break;
        }
    },
    goBack: function(){
        window.location.href = pageLocalStorage.getItem("goBackPage");
    },
    HomegoPage: function (pageId) {
        switch (pageId) {
            case '1':
                window.location.href = "index.html";
                break;
            case '2':
				pageLocalStorage.removeItem("productCategoryId");
                window.location.href = "products/productsList.html";
                break;
            case '3':
                window.location.href = "products/productcart.html";
                break;
            case '4':
                window.location.href = "my/myInformation.html";
                break;
            default:
                break;
        }
    },
    init: function () {
        $(":input").blur(function () {
            $("#wechat_menu").show();
        });
        $(":input").bind("touchstart", function () {
            $("#wechat_menu").hide();
        });
        $(":input").bind("touchmove", function () {
            $("#wechat_menu").show();
        });
        $(":input").focus(function () {
            $("#wechat_menu").hide();
        });
        $(".ui-content").bind("click", function () {
            $("#child_menu").hide();
            $("#mid_menu").hide();
            Common.isOpened = false;
            Common.isOpened_mid = false;
        });
    },
    save: function (datas) {
        $.M.post({
            method:"/member/update.jhtml?" + $.param(datas),
            success: function (data) {
                if (data.success == true) {
                    window.location.href = "setMyInfo.html";
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        })
    },
     backMyInfomation: function () {
        window.location.href = "setMyInfo.html";
    }
}



$(function () {
    $("#leftPhoto").click(function () {
       window.location.href = "Login.html";
       
    });
    if (pageLocalStorage.getItem("userid") != null && pageLocalStorage.getItem("userid") != "") {
        $.M.get({
            method:"/cart/countCartItem.jhtml?memberId=" + pageLocalStorage.getItem("userid"),
            success: function (data) {
                if (data.success) {
                    var cartQuantity = 0;
                    cartQuantity = data.returnValue.countCartItem;
                    $(".cartNum").html(cartQuantity);
                    if (cartQuantity == 0) {
                        $(".cartNum").hide();
                    }
                }
            }
        })
    } else {
        $(".cartNum").hide();
    }
})

function GetQueryString(name) {

    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");

    var r = window.location.search.substr(1).match(reg);

    if (r != null) return unescape(r[2]); return null;

}