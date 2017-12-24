var pageLocalStorage = window.localStorage;
var productcartPage = {
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
        //清除上一次缓存的选择的地址
        pageLocalStorage.removeItem("selectedAddress");

        //清除购物车储存的购物车id和产品id
        pageLocalStorage.removeItem("suregoods");
        pageLocalStorage.removeItem("sureprods");

        //清除点击删除按钮的flag
        pageLocalStorage.removeItem("deleteFlag");

        //清除立即购买标志
        pageLocalStorage.removeItem("buy");
        pageLocalStorage.removeItem("buyNumber");
        $(".settleDiv").bind("click", settleClick);
        
        $(".selectAll").click(function () {
            var selectCnt = 0;
            var totalPrice = 0.00;
            //$(".selectarea").each(function () {
            //    if ($(this).attr("rel") == "N") {
            //        allTrue = false;
            //    } else {
            //        var relId = $(this).attr("name");
            //        var num = $(this).attr("name1");
            //        var price = $(this).attr("name2");
            //        totalPrice += num * price;
            //        selectCnt++;
            //    }
            //})
            if ($(this).attr("rel") == "Y") {
                $(".selectarea").each(function () {
                    $(this).children("img").attr("src", "../css/images/products/icon_check_gray.png");
                    $(this).attr("rel", "N");
                })
                $(this).children("img").attr("src", "../css/images/products/icon_check_gray.png");
                $(this).attr("rel", "N");
            } else {
                $(".buyPrice").each(function () {
                    totalPrice += parseFloat($(this).text());
                    selectCnt++;
                })
                $(".selectarea").each(function () {
                    $(this).children("img").attr("src", "../css/images/products/icon_ok.png");
                    $(this).attr("rel", "Y");
                })
                $(this).children("img").attr("src", "../css/images/products/icon_ok.png");
                $(this).attr("rel", "Y");
            }
            
            if (selectCnt > 0)
                $(".settleDiv").css("background-color", "#FE960C");
            else
                $(".settleDiv").css("background-color", "#9C9C9C");
            $("#settlePrice").text(totalPrice.toFixed(2));
            $("#settleNum").text(selectCnt);
        })
        productcartPage.GetCats();
    },
    GetCats: function () {
        $(".selectAll").attr("rel", "N");
        $(".selectAll").children("img").attr("src", "../css/images/products/icon_check_gray.png");
        $("#settlePrice").text("0.00");
        $("#settleNum").text("0");
        productcartPage.showMask("c", "正在加载...");
        if (pageLocalStorage.getItem("userid") != null && pageLocalStorage.getItem("userid") != "") {
            $.M.get({
                method: "/cart/cartList.jhtml?memberId=" + pageLocalStorage.getItem("userid"),
                success: function (data) {
                    if (data.success) {
                        productcartPage.hideMask("c", "正在加载...");
                        var str = '';
                        $.each(data.returnValue, function (i, info) {
                            var currValue = "";
                            $.each(info.specificationValues, function (i, curinfo) {
                                currValue = curinfo.value;
                            });
                            str += '<div class="cartItem">';
                            str += '<div class="selectarea" name1="' + info.quantity + '"  name2="' + info.price.toFixed(2) + '" name3="' + info.productId + '" name="' + info.id + '" rel="N" onclick="productcartPage.SelectCart(\'' + info.id + '\')"><img src="../css/images/products/icon_check_gray.png" /></div>';
                            str += '<div class="deletearea" onclick="productcartPage.deleteCart(\'' + info.id + '\')"><img src="../css/images/products/icon_delete.png"  onclick="productcartPage.deleteCart(\'' + info.id + '\')"/></div>';
                            str += '<div class="imgarea"><img src="' + info.appImage + '" /></div>';
                            str += '<div class="descriptionarea">';
                            str += '<div class="prodName">' + info.name + '</div>';
                            str += '<div class="prodspecification">规格：<span clss="buyspec">' + currValue + '</span></div>';
                            str += '<div class="amountarea"><div class="pricearea">￥<span class="buyPrice" name2="' + info.price.toFixed(2) + '"  rel="' + info.id + '">' + (info.quantity * info.price).toFixed(2) + ' </span></div>';
                            str += '<div class="amountdiv"><div class="icoMinus" rel="' + info.id + '" onclick="productcartPage.MinusNum(\'' + info.id + '\')"></div>';
                            str += '<div class="numdiv" style="position: relative;" name1="' + info.stock + '" rel="' + info.id + '">' + info.quantity + '</div>';
                            str += '<div class="icoPlus" rel="' + info.id + '"  onclick="productcartPage.AddNum(\'' + info.id + '\')">';
                            str += '</div></div><div class="selectamount">x<span class="selectvalue" rel="' + info.id + '">' + info.quantity + '</span></div></div></div>';
                            str += '</div>';
                        });
                        $("#picdetail").html(str);
                        if (pageLocalStorage.getItem("deleteFlag")!=null &&  pageLocalStorage.getItem("deleteFlag")=="Y"){
                            $("#operEdit").hide();
                            $("#operFinish").show();
                            $(".deletearea").show();
                            $(".selectarea").hide();
                            $(".amountdiv").show();
                            $(".selectamount").hide();
                            $(".selectAll").hide();
                            $(".priceDiv").hide();
                            $(".settleDiv").css("background-color", "#9C9C9C");
                            $(".settleDiv").unbind("click");
                        }
                        
                    }
                }
            })
        } else {
            window.location.href = "../login.html";
        }
    },
    showMessges: function (messges) {
        $(".errorLabel").html(messges);
        $(".errorDiv").css("visibility", "visible");
        setTimeout('$(".errorDiv").css("visibility", "hidden")', 3000);
    },
    back: function () {
        window.location.href = "../products/productsList.html";
    },
    EditCart:function(){
        $("#operEdit").hide();
        $("#operFinish").show();
        $(".deletearea").show();
        $(".selectarea").hide();
        $(".amountdiv").show();
        $(".selectamount").hide();
        $(".selectAll").hide();
        $(".priceDiv").hide();
        $(".settleDiv").css("background-color", "#9C9C9C");
        $(".settleDiv").unbind("click");
    },
    FinishEdit: function () {
        $("#operEdit").show();
        $("#operFinish").hide();
        $(".deletearea").hide();
        $(".selectarea").show();
        $(".selectamount").show();
        $(".amountdiv").hide();
        $(".selectAll").show();
        $(".priceDiv").show();
        $("#settleNum").text(0);
        $("#settlePrice").text("0.00");
        $(".settleDiv").bind("click", settleClick);
        $(".selectarea").each(function () {
            if ($(this).attr("rel") == "Y") {
                $(this).children("img").attr("src", "../css/images/products/icon_check_gray.png");
                $(this).attr("rel", "N");
            }
        })
        $(".selectAll").children("img").attr("src", "../css/images/products/icon_check_gray.png");
        $(".selectAll").attr("rel", "N");
    },
    SelectCart: function (cartId) {
        $(".selectarea").each(function () {
            if ($(this).attr("name") == cartId) {
                if ($(this).attr("rel") == "Y") {
                    $(this).children("img").attr("src", "../css/images/products/icon_check_gray.png");
                    $(this).attr("rel", "N");
                    
                } else {
                    $(this).children("img").attr("src", "../css/images/products/icon_ok.png");
                    $(this).attr("rel", "Y");
                }

                var allTrue = true;
                var selectCnt = 0;
                var totalPrice=0.00;
                $(".selectarea").each(function () {
                    if ($(this).attr("rel") == "N") {
                        allTrue = false;
                    } else {
                        var relId=$(this).attr("name");
                        var num = $(this).attr("name1");
                        var price = $(this).attr("name2");
                        totalPrice += num * price;
                        selectCnt++;
                    }
                })
                $("#settlePrice").text(totalPrice.toFixed(2));
                $("#settleNum").text(selectCnt);
                if (selectCnt > 0)
                    $(".settleDiv").css("background-color", "#FE960C");
                else
                    $(".settleDiv").css("background-color", "#9C9C9C");
                if (allTrue) {
                    $(".selectAll").children("img").attr("src", "../css/images/products/icon_ok.png");
                    $(".selectAll").attr("rel", "Y");
                } else {
                    $(".selectAll").attr("rel", "N");
                    $(".selectAll").children("img").attr("src", "../css/images/products/icon_check_gray.png");
                }
            }
        })
    },
    AddNum: function (cartId) {
        $(".numdiv").each(function () {
            if ($(this).attr("rel") == cartId) {
                var curNum = parseInt($(this).html());
                if (parseInt($(this).html()) < parseInt($(this).attr("name1"))) {
                    $(this).html(curNum + 1);

                    //储存当前的数量，方便在选择的时候用来计算
                    //找寻第一个元素方法一：
                    $(this).parent().parent().parent().siblings().eq(0).attr("name1", curNum + 1);

                    //找寻第一个元素方法二：
                    //$(".selectarea").each(function(){
                    //    if ($(this).attr("name") == cartId) {
                    //        $(this).attr("name1",curNum + 1);
                    //    }
                    //})

                    $.M.post({
                        method: "/cart/cartEdit.jhtml",
                        params: {
                            "memberId": pageLocalStorage.getItem("userid"), "id": cartId,
                            "quantity": $(this).html()
                        },
                        success: function (data) {
                            if (data.success) {
                                productcartPage.RefreshCartNum();
                            }
                        }
                    })

                    //当前商品的数量方法一：
                    $(this).parent().next().children("span").text(curNum + 1);

                    //当前项的数量方法二：
                    //$(".selectvalue").each(function () {
                    //    if ($(this).attr("rel") == cartId) {
                    //        $(this).text(curNum + 1);
                    //    }
                    //})

                    //当前商品的总价方法一：
                    var obj = $(this).parent().prev().children("span");
                    obj.text(((curNum + 1) * obj.attr("name2")).toFixed(2));

                    //当前商品的总价方法二：
                    //$(".buyPrice").each(function () {
                    //    if ($(this).attr("rel") == cartId) {
                    //        $(this).text(((curNum + 1)*$(this).attr("name2")).toFixed(2));
                    //    }
                    //})
                }
            }
        })
        var selectCnt = 0;
        var totalPrice = 0.00;
        $(".selectarea").each(function () {
            if ($(this).attr("rel") == "N") {
                allTrue = false;
            } else {
                var relId = $(this).attr("name");
                var num = $(this).attr("name1");
                var price = $(this).attr("name2");
                totalPrice += num * price;
                selectCnt++;
            }
        })
        
        $("#settlePrice").text(totalPrice.toFixed(2));
        $("#settleNum").text(selectCnt);
    },
    MinusNum: function (cartId) {
        $(".numdiv").each(function () {
            if ($(this).attr("rel") == cartId) {
                var curNum = parseInt($(this).html());
                if (curNum > 1) {
                    $(this).html(curNum - 1);
                    //储存当前的数量，方便在选择的时候用来计算
                    //找寻第一个元素方法一：
                    $(this).parent().parent().parent().siblings().eq(0).attr("name1", curNum - 1);

                    //找寻第一个元素方法二：
                    //$(".selectarea").each(function () {
                    //    if ($(this).attr("name") == cartId) {
                    //        $(this).attr("name1", curNum - 1);
                    //    }
                    //})

                    //当前商品的数量方法一：
                    $(this).parent().next().children("span").text(curNum - 1);

                    //当前项的数量方法二：
                    //$(".selectvalue").each(function () {
                    //    if ($(this).attr("rel") == cartId) {
                    //        $(this).text(curNum - 1);
                    //    }
                    //})

                    //当前商品的总价方法一：
                    var obj = $(this).parent().prev().children("span");
                    obj.text(((curNum - 1) * obj.attr("name2")).toFixed(2));

                    //当前商品的总价方法二：
                    //$(".buyPrice").each(function () {
                    //    if ($(this).attr("rel") == cartId) {
                    //        $(this).text(((curNum - 1) * $(this).attr("name2")).toFixed(2));
                    //    }
                    //})

                    $.M.post({
                        method: "/cart/cartEdit.jhtml",
                        params: {
                            "memberId": pageLocalStorage.getItem("userid"), "id": cartId,
                            "quantity": $(this).html()
                        },
                        success: function (data) {
                            if (data.success) {
                                productcartPage.RefreshCartNum();
                            }
                        }
                    })
                    
                }
            }
        })
        var selectCnt = 0;
        var totalPrice = 0.00;
        $(".selectarea").each(function () {
            if ($(this).attr("rel") == "N") {
                allTrue = false;
            } else {
                var relId = $(this).attr("name");
                var num = $(this).attr("name1");
                var price = $(this).attr("name2");
                totalPrice += num * price;
                selectCnt++;
            }
        })
        $("#settlePrice").text(totalPrice.toFixed(2));
        $("#settleNum").text(selectCnt);
    },
    deleteCart: function (cartId) {
        if (pageLocalStorage.getItem("userid") != null && pageLocalStorage.getItem("userid") != "") {
            $.M.post({
                method: "/cart/cartDelete.jhtml",
                params: {
                    "memberId": pageLocalStorage.getItem("userid"), "id": cartId
                },
                success: function (data) {
                    if (data.success) {
                        pageLocalStorage.setItem("deleteFlag", "Y");
                        productcartPage.GetCats();
                        productcartPage.RefreshCartNum();
                    }
                }
            })
            
        } else {
            window.location.href = "../login.html";
        }
    },
    RefreshCartNum: function () {
        $.M.get({
            method: "/cart/countCartItem.jhtml?memberId=" + pageLocalStorage.getItem("userid"),
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
    }
};
var settleClick = function () {
    if ($("#settleNum").text() != 0) {
        var selectStr = '';
        var prodStr = '';
        $(".selectarea").each(function () {
            if ($(this).attr("rel") == "Y") {
                selectStr += $(this).attr("name") + ",";
                prodStr += $(this).attr("name3") + ",";
            }
        })
        if (selectStr != '' && prodStr != '') {
            selectStr=selectStr.substr(0, selectStr.length - 1);
            prodStr=prodStr.substr(0, prodStr.length - 1);

            //将确认的购物车id放入缓存
            pageLocalStorage.setItem("suregoods", selectStr);
            pageLocalStorage.setItem("sureprods", prodStr);
            window.location.href = "productorder.html";
        } 
    }
}
$(document).bind("pageshow", function (e) {
    var id = e.target.id;
    if ("product_CartPage" == id) {
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        if (!productcartPage.scroll) {
            productcartPage.scroll = new iScroll("underpart_div_scorll", {
                useTransition: true,
                checkDOMChanges: true,
                hScrollbar: false,
                vScrollbar: false
            });
        }
        productcartPage.init();
    }
});

