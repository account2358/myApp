var pageLocalStorage = window.localStorage;
var productDetailPage = {
    scroll: null,
    userId: pageLocalStorage.getItem("userid"),
    pageNo: 1,
    pageSizr: 10,
    init: function () {
        //if ($(document.body).height() < 630)
        //    $("#footEmpty").show();
        //else
        //    $("#footEmpty").hide();
        var prodId = pageLocalStorage.getItem("proddetailId");
        if (productDetailPage.userId != null && productDetailPage.userId != "") {
            productDetailPage.RefreshCartNum();
        }
        //清除上一次缓存的选择的地址
        pageLocalStorage.removeItem("selectedAddress");

        //清除购物车储存的购物车id和产品id
        pageLocalStorage.removeItem("suregoods");
        pageLocalStorage.removeItem("sureprods");

        //清除立即购买标志
        pageLocalStorage.removeItem("buy");
        pageLocalStorage.removeItem("buyNumber");
        $("#buyDiv").click(function () {
            if (pageLocalStorage.getItem("userid") != null && pageLocalStorage.getItem("userid") != "") {
                var prodId = pageLocalStorage.getItem("proddetailId");
                //设置立即购买标志
                pageLocalStorage.setItem("buy", "Y");
                pageLocalStorage.setItem("buyNumber", $("#numdiv").html());
                window.location.href = "productorder.html";
            } else {
                window.location.href = "../login.html";
            }
        })
        productDetailPage.showMask("c", "正在加载...");
        $.M.get({
            method: "/product/detail/product/" + prodId + ".jhtml?memberId=" + (productDetailPage.userId != null ? productDetailPage.userId : ""),
            success: function (data) {
                productDetailPage.hideMask("c", "正在加载...");
                if (data.returnValue.hasFavorite) {
                    $("#collectImg").attr("src", "../css/images/products/shoucang_selected.jpg");
                } else {
                    $("#collectImg").attr("src", "../css/images/products/shoucang_unselected.jpg");
                }
                productDetailPage.initSwiper();
                TabScrollTop.tabsSwiper.removeAllSlides();
                $.each(data.returnValue.productImages, function (i, info) {
                    var str = '<img src="' + info.medium + '" class="headerimg" />';
                    TabScrollTop.tabsSwiper.appendSlide(str, 'swiper-slide');
                });
                productDetailPage.setHeight();
                $("#detailTitle").text(data.returnValue.name);

                if (data.returnValue.marketPrice != null && data.returnValue.marketPrice != "") {
                    $("#originalPrice").show();
                    $("#buyPrice").css("margin-top", "0");
                    $("#orgPrice").text(data.returnValue.marketPrice.toFixed(2));
                    $("#getPrice").text(data.returnValue.price.toFixed(2));
                    
                    if (data.returnValue.promotionTitles != null && data.returnValue.promotionTitles != "") {
                        $("#promotions").show();
                        $("#promotionTitle").html(data.returnValue.promotionTitles);
                        $("#amountArea").css("margin-top", "22px");
                    } else {
                        $("#promotions").hide();
                        $("#amountArea").css("margin-top", "10px");
                    }
                } else {
                    $("#originalPrice").hide();
                    $("#buyPrice").css("margin-top", "10px");
                    $("#getPrice").text(data.returnValue.price.toFixed(2));
                    if (data.returnValue.promotionTitles != null && data.returnValue.promotionTitles != "") {
                        $("#promotions").show();
                        $("#promotionTitle").html(data.returnValue.promotionTitles);
                        $("#amountArea").css("margin-top", "13px");
                    } else {
                        $("#promotions").hide();
                        $("#amountArea").css("margin-top", "3px");
                    }
                }
                if (data.returnValue.recommendedRelation != null && data.returnValue.recommendedRelation != "" && data.returnValue.recommendedRelation != "[]") {
                    $("#recommendSplit").show();
                    $("#recommendBlock").show();
                    var reStr = '';
                    $.each(data.returnValue.recommendedRelation, function (i, recominfo) {
                        reStr += '<div class="itemDiv" onclick="productDetailPage.GoDetail(\'' + recominfo.id + '\')">';
                        reStr += '<div class="itemImg"><img src="' + recominfo.image + '"></div>';
                        reStr += '<div class="itemName"><div style="display:inline; margin:0 auto;">' + (recominfo.name.length > 11 ? (recominfo.name.substring(0, 8) + "...") : recominfo.name) + '</div></div>';
                        reStr += '<div class="itemPrice">￥' + ((recominfo.marketPrice != null && recominfo.marketPrice != "") ? recominfo.marketPrice.toFixed(2) : recominfo.price) + '</div>';
                        reStr += '</div>';
                    });
                    $("#prodrecommednItem").html(reStr);
                } else {
                    $("#recommendSplit").hide();
                    $("#recommendBlock").hide();
                }
                $("#monthAmount").text(data.returnValue.monthSales);
                pageLocalStorage.setItem("availableStock", data.returnValue.stock);
                $("#storeAmount").text(data.returnValue.stock);
                $("#prontAmount").text(data.returnValue.point);
                var currValue = "";
                $.each(data.returnValue.specificationValues, function (i, info) {
                    currValue = info.value;
                });
                var str = '';
                $.each(data.returnValue.specifications, function (i, info) {
                    for (var i = 0; i < info.values.length; i++) {
                        if (currValue == info.values[i]) {
                            str += '<div class="ruleItemselect" rel="' + data.returnValue.id + '" onclick="productDetailPage.SelectSpecification(\'' + data.returnValue.id + '\')">' + info.values[i] + '</div>';
                        } else {
                            str += '<div class="unruleItemselect" rel="" onclick="">' + info.values[i] + '</div>';
                        }
                    }
                });
                var reviewstr = '';
                $("#reviewCnt").text("(" + data.returnValue.review.total + ")");
                pageLocalStorage.setItem("reviewCount", data.returnValue.review.total);
                if (data.returnValue.introduction != null && data.returnValue.introduction != "")
                    pageLocalStorage.setItem("introduction", "Y");
                else
                    pageLocalStorage.setItem("introduction", "N");

                $.each(data.returnValue.review.reviews, function (i, info) {
                    var reviewDate = new Date(info.reviewDate);
                    var year = reviewDate.getFullYear();
                    var month = reviewDate.getMonth() < 10 ? "0" + reviewDate.getMonth() : reviewDate.getMonth();
                    var day = reviewDate.getDay() < 10 ? "0" + reviewDate.getDay() : reviewDate.getDay();
                    reviewstr +='<div class="evaluateItem">';
                    reviewstr +='<div class="personImg"><img src="../css/images/products/user_unselected.png" /></div>';
                    reviewstr +='<div class="evaluateContent">';
                    reviewstr +='<div class="upPerson">';
                    reviewstr += '<div class="personName">' + info.username + '</div>';
                    reviewstr += '<div class="evaluateDate">' + (year+"-"+month+"-"+day) + '</div>';
                    reviewstr +='</div>';
                    reviewstr += '<div class="evaluatedetail">' + info.content + '</div>';
                    reviewstr += '</div> </div>';
                });
                $("#prodEvaluate").html(reviewstr);
                //根据goodsid更新除当前规格之外的规格
                getprodId(data.returnValue.goodsId);
                $(".detailRule").html(str);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                productDetailPage.hideMask("c", "正在加载...");
            }
        });
        
    },
    GoDetail: function (prodId) {
        pageLocalStorage.setItem("proddetailId", prodId);
        window.location.href = "../products/productdetail.html";
    },
    initSwiper: function () {
        if (!TabScrollTop.tabsSwiper) {
            TabScrollTop.tabsSwiper = $('#swiper-container-top').swiper({
                pagination: '#pagination-top',
                createPagination: true,
                onlyExternal: false,
                speed: 1000,
                autoplay: 3000,
                loop: true,
                onSlideChangeStart: function () { },
                onSlideChangeEnd: function () {
                    TabScrollTop.tabsSwiper.startAutoplay();
                }

            });
            TabScrollTop.bindEvent();
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
    setHeight: function () {
        var wWidth = $(window).width();
        var imgHeight = 200;
        $(".swiper-container").css("height", imgHeight + "px");
        $(".swiper-wrapper").css("height", imgHeight + "px");
        $(".swiper-wrapper .swiper-slide").css("height", imgHeight + "px");
        $(".swiper-wrapper .swiper-slide").css("width", wWidth + "px");
        $(".swiper-slide img").css("max-height", imgHeight + "px");
        $(".swiper-slide img").css("width", (wWidth) + "px");
        $(".tabBanner").css("height", imgHeight + "px");
    },
    AddNum: function () {
        var curNum = parseInt($("#numdiv").html());
        if (curNum<pageLocalStorage.getItem("availableStock"))
            $("#numdiv").html(curNum + 1);
    },
    MinusNum: function () {
        var curNum = parseInt($("#numdiv").html());
        if (curNum > 1) {
            $("#numdiv").html(curNum - 1);
        }
    },
    SelectSpecification: function (speciValue) {
        //选择规格
        pageLocalStorage.setItem("proddetailId", speciValue);
        $.M.get({
            method: "/product/detail/product/" + speciValue + ".jhtml?memberId=" + (productDetailPage.userId != null ? productDetailPage.userId : ""),
            success: function (data) {
                if (data.returnValue.hasFavorite) {
                    $("#collectImg").attr("src", "../css/images/products/shoucang_selected.jpg");
                } else {
                    $("#collectImg").attr("src", "../css/images/products/shoucang_unselected.jpg");
                }
                $("#monthAmount").text(data.returnValue.monthSales);
                $("#storeAmount").text(data.returnValue.stock);
                pageLocalStorage.setItem("availableStock", data.returnValue.stock);
                $("#prontAmount").text(data.returnValue.point);
                var currValue = "";
                $.each(data.returnValue.specificationValues, function (i, info) {
                    currValue = info.value;
                });
                var str = '';
                $.each(data.returnValue.specifications, function (i, info) {
                    for (var i = 0; i < info.values.length; i++) {
                        if (currValue == info.values[i]) {
                            str += '<div class="ruleItemselect" rel="' + data.returnValue.id + '" onclick="productDetailPage.SelectSpecification(\'' + data.returnValue.id + '\')">' + info.values[i] + '</div>';
                        } else {
                            str += '<div class="unruleItemselect" rel="" onclick="">' + info.values[i] + '</div>';
                        }
                    }
                });
                $(".detailRule").html(str);
                var reviewstr = '';
                $("#reviewCnt").text("(" + data.returnValue.review.total + ")");
                pageLocalStorage.setItem("reviewCount", data.returnValue.review.total);
                if (data.returnValue.introduction != null && data.returnValue.introduction != "")
                    pageLocalStorage.setItem("introduction", "Y");
                else
                    pageLocalStorage.setItem("introduction", "N");
                $.each(data.returnValue.review.reviews, function (i, info) {
                    var reviewDate = new Date(info.reviewDate);
                    var year = reviewDate.getFullYear();
                    var month = reviewDate.getMonth() < 10 ? "0" + reviewDate.getMonth() : reviewDate.getMonth();
                    var day = reviewDate.getDay() < 10 ? "0" + reviewDate.getDay() : reviewDate.getDay();
                    reviewstr += '<div class="evaluateItem">';
                    reviewstr += '<div class="personImg"><img src="../css/images/products/user_unselected.png" /></div>';
                    reviewstr += '<div class="evaluateContent">';
                    reviewstr += '<div class="upPerson">';
                    reviewstr += '<div class="personName">' + info.username + '</div>';
                    reviewstr += '<div class="evaluateDate">' + (year + "-" + month + "-" + day) + '</div>';
                    reviewstr += '</div>';
                    reviewstr += '<div class="evaluatedetail">' + info.content + '</div>';
                    reviewstr += '</div> </div>';
                });
                $("#prodEvaluate").html(reviewstr);
                getprodId(data.returnValue.goodsId);

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                productDetailPage.hideMask("c", "正在加载...");
            }
        });

    },
    GoReviewPage: function () {
        if(pageLocalStorage.getItem("reviewCount")!=null && parseInt(pageLocalStorage.getItem("reviewCount"))>0)
            window.location.href = "../products/productreview.html";
    },
    GoDescriptionPage: function () {
        if(pageLocalStorage.getItem("introduction")!="N")
            window.location.href = "../products/productdescription.html";
    },
    AddFavorate: function () {
        if (pageLocalStorage.getItem("userid") != null && pageLocalStorage.getItem("userid") != "") {
            var prodId = pageLocalStorage.getItem("proddetailId");
            $.M.post({
                method: "/product/favorite.jhtml",
                params: {
                    "memberId": pageLocalStorage.getItem("userid"), "productId": prodId
                },
                success: function (data) {
                    if (data.success) {
                        if (data.returnValue == 1) {
                            productDetailPage.showMessges("已收藏");
                            $("#collectImg").attr("src", "../css/images/products/shoucang_selected.jpg");
                        } else {
                            productDetailPage.showMessges("已取消收藏");
                            $("#collectImg").attr("src", "../css/images/products/shoucang_unselected.jpg");
                        }    
                    }
                }
            })
        } else {
            window.location.href = "../login.html";
        }
    },
    AddCart: function () {
        if (pageLocalStorage.getItem("userid") != null && pageLocalStorage.getItem("userid") != "") {
            var prodId = pageLocalStorage.getItem("proddetailId");
            $.M.post({
                method: "/cart/addCart.jhtml",
                params: {
                    "memberId": pageLocalStorage.getItem("userid"), "productId": prodId,
                    "quantity": $("#numdiv").html()
                },
                success: function (data) {
                    if (data.success) {
                        productDetailPage.showMessges("已加入购物车");
                        productDetailPage.RefreshCartNum();
                    }
                }
            })
        } else {
            window.location.href = "../login.html";
        }
    },
    showMask: function (theme, msg) {
        $.mobile.showPageLoadingMsg(theme, msg);
        $(".maskDiv").css("display", "block");
    },
    hideMask: function (theme, msg) {
        $.mobile.hidePageLoadingMsg(theme, msg);
        $(".maskDiv").css("display", "none");
    },
    GoCart: function () {
        window.location.href = "../products/productcart.html";
    },
    RefreshCartNum: function () {
        if (pageLocalStorage.getItem("userid") != null && pageLocalStorage.getItem("userid") != "") {
            $.M.get({
                method: "/cart/countCartItem.jhtml?memberId=" + pageLocalStorage.getItem("userid"),
                success: function (data) {
                    if (data.success) {
                        var cartQuantity = 0;
                        cartQuantity = data.returnValue.countCartItem;
                        $("#cartCount").html(cartQuantity);
                    }
                }
            })
        } else {
            window.location.href = "../login.html";
        }
    }
};
var TabScrollTop = {
    tabsSwiper: null,
    bindEvent: function () {
        $(window).resize(function () {
            setTimeout("ShopDetailPage.setHeight()", 20);
        });
    }
}

function getprodId(id) {
    
    $.M.get({
        method: "/product/detail/" + id + ".jhtml",
        async: false,
        success: function (data) {
            var currValues = "";
            var currprodids = "";
            pageLocalStorage.setItem("othergid", data.returnValue.goodsId);
            $.each(data.returnValue, function (k, eachReturn) {
                $.each(eachReturn.specificationValues, function (i, info) {
                    currValues += info.value + ",";
                });
                currprodids += eachReturn.id + ",";
            });
            if (currValues != '') {
                currValues = currValues.substr(0, currValues.length - 1);
            }
            if (currprodids != '') {
                currprodids = currprodids.substr(0, currprodids.length - 1);
            }
            var valArr = currValues.split(",");
            var prodArr = currprodids.split(",");
            $(".detailRule div").each(function () {
                var index=in_array($(this).html(), valArr);
                if (index>=0) {
                    $(this).attr("rel", prodArr[index]);
                    $(this).attr("onclick", "productDetailPage.SelectSpecification(\'" + prodArr[index] + "\')");
                } else {
                    $(this).attr("class", "unenableItemselect");
                }
            })

        }
    })

}
function in_array(stringToSearch, arrayToSearch) {
    for (s = 0; s < arrayToSearch.length; s++) {
        thisEntry = arrayToSearch[s].toString();
        if (thisEntry == stringToSearch) {
            return s;
        }
    }
    return -1;
}
$(document).bind("pageshow", function (e) {
    var id = e.target.id;
    if ("product_DetailPage" == id) {
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        if (!productDetailPage.scroll) {
            productDetailPage.scroll = new iScroll("underpart_div_scorll", {
                useTransition: true,
                checkDOMChanges: true,
                hScrollbar: false,
                vScrollbar: false
            });
        }
        productDetailPage.init();
    }
});
