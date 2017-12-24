var myFavoritesPage = {
    scroll: null,
    storage: window.localStorage,
    userId: pageLocalStorage.getItem("userid"),
    pageNo: 1,
    pageSizr: 10,
    init: function () {
        pageLocalStorage.setItem("goBackPage", "../my/myFavorites.html");

        //user favorites
        $.M.get({
            method: "/product/favorite.jhtml?memberId=" + myFavoritesPage.userId,
            success: function (data) {
                if (data.returnValue != "") {
                    var favoritesData = data.returnValue;
                    $("#mainText").hide();
                    $("#favorite_complete").hide();
                    $("#favorite_edit").show();
                    var favorites = "";
                    for (var i = 0; i < favoritesData.length; i++) {
                        var start = favoritesData[i].fullName.indexOf("[") + 1;
                        var stop = favoritesData[i].fullName.indexOf("]");
                        favorites += '<div class="itemDiv" onclick="myFavoritesPage.goProductDetail(\'' + favoritesData[i].id + '\')">';
                        favorites += '<div class="itemImg"><img src="' + favoritesData[i].image + '" /></div>';
                        favorites += '<div class="itemName">' + (favoritesData[i].name.length > 9 ? (favoritesData[i].name.substring(0, 9) + "...") : favoritesData[i].name) + '</div>';
                        favorites += '<div class="itemSize">规格：' + favoritesData[i].fullName.substring(start, stop) + '</div>';
                        favorites += '<div class="itemPrice">￥' + favoritesData[i].price.toFixed(2) + '</div>';
                        favorites += '<span class="clear"></span></div>';
                    }
                    $("#favoritesList").html(favorites);
                    $("#favoritesList").show();
                } else {
                    $("#mainText").show();
                    $("#favoritesList").hide();
                }

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        });
    },
    favoriteEdit: function () {
        $.M.get({
            method: "/product/favorite.jhtml?memberId=" + myFavoritesPage.userId,
            success: function (data) {
                if (data.returnValue != "") {
                    var favoritesData = data.returnValue;
                    $("#mainText").hide();
                    $("#favoritesList").hide();
                    var favorites = "";
                    for (var i = 0; i < favoritesData.length; i++) {
                        var start = favoritesData[i].fullName.indexOf("[") + 1;
                        var stop = favoritesData[i].fullName.indexOf("]");
                        favorites += '<div class="itemDiv">';
                        favorites += '<div class="itemDel" onclick="myFavoritesPage.favoriteRemove(' + favoritesData[i].id + ')"><img src="../css/images/my/icon_delete.png" alt="" /></div>';
                        favorites += '<div class="itemImg" onclick="myFavoritesPage.goProductDetail(\'' + favoritesData[i].id + '\')"><img src="' + favoritesData[i].image + '" /></div>';
                        favorites += '<div class="itemName">' + (favoritesData[i].name.length > 9 ? (favoritesData[i].name.substring(0, 9) + "...") : favoritesData[i].name) + '</div>';
                        favorites += '<div class="itemSize">规格：' + favoritesData[i].fullName.substring(start, stop) + '</div>';
                        favorites += '<div class="itemPrice">￥' + favoritesData[i].price.toFixed(2) + '</div>';
                        favorites += '<span class="clear"></span></div>';
                    }
                    $("#favoritesList").html(favorites);
                    $("#favoritesList").show();
                    $("#favorite_edit").hide();
                    $("#favorite_complete").show();

                } else {
                    $("#mainText").show();
                    $("#favoritesList").hide();
                    $("#favorite_edit").show();
                    $("#favorite_complete").hide();
                }

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        });
    },
    favoriteComplete: function () {
        myFavoritesPage.init();
    },
    favoriteRemove: function (productId) {
        $.M.post({
            method: "/product/favorite.jhtml?memberId=" + myFavoritesPage.userId + "&productId=" + productId,
            success: function (data) {
                if (data.success) {
                    myFavoritesPage.showMessages("操作成功");
                    myFavoritesPage.favoriteEdit();
                } else {
                    myFavoritesPage.showMessages("操作失败，失败原因：" + data.errorReason);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        });
    },
    goProductDetail: function (prodId) {
        pageLocalStorage.setItem("proddetailId", prodId);
        window.location.href = "../products/productdetail.html";
    },
    showMessages: function (messges) {
        $(".errorLabel").html(messges);
        $(".errorDiv").css("visibility", "visible");
        setTimeout('$(".errorDiv").css("visibility", "hidden")', 3000);
    }
};
$(document).bind("pageshow", function (e) {
    var id = e.target.id;
    if ("myFavorites_page" == id) {
        document.addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, false);

        if (!myFavoritesPage.scroll) {
            myFavoritesPage.scroll = new iScroll("underpart_div_scroll", {
                useTransition: true,
                checkDOMChanges: true,
                hScrollbar: false,
                vScrollbar: false
            });
        }
        $(".mainContentDiv").css("height", $(document.body).height() + 200 + "px");

        myFavoritesPage.init();
    }
});