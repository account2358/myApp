var pageLocalStorage = window.localStorage;
var timestamp = new Date().getTime();

var evection = {
    scroll: null,
    canMore: true,
    isIos: false,
    isAndroid: true,
    userId: "",
    pageSize: 6,
    pageNum1: 1,
    totalNum1: 0,
    orderType: "salesDesc",
    showMask: function (theme, msg) {
        $.mobile.showPageLoadingMsg(theme, msg);
        $(".maskDiv").css("display", "block");
    },
    hideMask: function (theme, msg) {
        $.mobile.hidePageLoadingMsg(theme, msg);
        $(".maskDiv").css("display", "none");
    },
    showShade: function () {
        $(".shade_div").show();
    },
    hideShade: function () {
        $(".shade_div").hide();
    },
    init: function () {
        pageLocalStorage.setItem("goBackPage", "productsList.html");

        //清除上一次缓存的选择的地址
        pageLocalStorage.removeItem("selectedAddress");
		//清除立即购买标志
        pageLocalStorage.removeItem("buy");
		pageLocalStorage.removeItem("buyNumber");
		
		//清除购物车储存的购物车id和产品id
        pageLocalStorage.removeItem("suregoods");
        pageLocalStorage.removeItem("sureprods");
        evection.getEvectionInfo(evection.pageNum1, false);
        $("#listContentDiv_switch1_content").css("height", $(document.body).height() - 93 + "px");
        $("#listContentDiv").css("height", $(document.body).height() - 141 + "px");
        $("#salesTitle").bind("click", function () {
            $(this).css("border-bottom", "2px solid #FE960C");
            $("#priceTitle").css("border-bottom", "0");
            evection.orderType = $(this).attr("rel");
            $("#priceTitle").attr("rel", "");
            $("#priceImg").hide();
            evection.getEvectionInfo(1, false);
        });

        $("#priceTitle").bind("click", function () {
            $(this).css("border-bottom", "2px solid #FE960C");
            $("#salesTitle").css("border-bottom", "0");
            $("#listContentDiv").css("height", $(document.body).height() - 141 + "px");
            if ($(this).attr("rel") == "" || $(this).attr("rel") == "priceAsc") {
                evection.orderType = "priceDesc";
                $(this).attr("rel", "priceDesc");
                $("#priceImg").show();
                $("#priceImg").attr("src", "../css/images/products/arrow_2.png");
            } else if ($(this).attr("rel") == "priceDesc") {
                evection.orderType = "priceAsc";
                $(this).attr("rel", "priceAsc");
                //$("#priceImg").css("display", "block");
                $("#priceImg").show();
                $("#priceImg").attr("src", "../css/images/products/arrow_1.png");
            }
            evection.getEvectionInfo(1, false);
        });

        $("#backLink").bind("click", function () {
            window.location.href = "../admin/evectionEntry.html";
        });
    },
    GoDetail: function (prodId) {
        pageLocalStorage.setItem("proddetailId", prodId);
        window.location.href = "../products/productdetail.html";
    },
    getEvectionInfo: function (page, isMore) {
        evection.showMask("c", "正在加载...");
        var productCategoryId = 0;
        if (pageLocalStorage.getItem("productCategoryId") != null && pageLocalStorage.getItem("productCategoryId") != "")
            productCategoryId = pageLocalStorage.getItem("productCategoryId");
        $.M.get({
            method: "/product/list.jhtml?productCategoryId=" + productCategoryId + "&orderType=" + evection.orderType + "&pageNumber=" + page + "&pageSize=" + evection.pageSize,
            success: function (data) {
                evection.hideMask("c", "正在加载...");
                if (data.success) {
                    evection.totalNum1 = Math.ceil(parseInt(data.returnValue.total) / parseInt(evection.pageSize));
                    var str = '';
                    $.each(data.returnValue.products, function (i, info) {
                        str += '<div class="itemDiv" onclick="evection.GoDetail(\'' + info.id + '\')">';
                        str += '<div class="itemImg"><img src="' + info.image + '" /></div>';
                        str += '<div class="itemName">' + (info.name.length > 11 ? (info.name.substring(0, 8) + "...") : info.name) + '</div>';
                       
                        if (info.marketPrice != null && info.marketPrice != "") {
                            str += '<div class="itemPrice">￥' + info.price.toFixed(2) + '</div>';
                            str += '<div class="itemmarketPrice"><strike>￥' + info.marketPrice.toFixed(2) + '</strike></div>';
                            
                        } else {
                            str += '<div class="itemPrice">￥' + info.price.toFixed(2) + '</div>';
                            str += '<div class="itemmarketPrice" style="display:none;"><strike>￥' + info.price.toFixed(2) + '</strike></div>'; 
                        }
                        str += '<div class="itemmonthSales">月销量：<span class="monthSales">' + info.monthSales + '</span>件</div>';
                        str += '</div>';
                    });
                    if (isMore == false) {
                        $("#produtsItemContent").html(str);
                        $("#pullDown1").css("display", "none");

                    } else {
                        $("#produtsItemContent").append(str);
                        $("#pullDown1").css("display", "none");
                    }
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                evection.hideMask("c", "正在加载...");
            }
        });
    },
    pullDownAction1: function () {
        evection.pageNum1 = 1;
        evection.getEvectionInfo(1, false);
    },
    pullUpAction1: function () {
        pullUpEl1 = document.getElementById('pullUp1');
        pullUpOffset1 = pullUpEl1.offsetHeight;
        setTimeout(function () {
            if ((evection.totalNum1) > (evection.pageNum1)) {
                evection.pageNum1 += 1;
                evection.getEvectionInfo(evection.pageNum1, true);
            } else {
                pullUpEl1.className = '';
                pullUpEl1.querySelector('.pullUpLabel1').innerHTML = '所有记录加载完毕';
                setTimeout(function () { pullUpEl1.style.display = 'none'; }, 3000);
            }
            myScroll1.refresh();
        }, 1000);
    },
    loaded1: function () {
        pullUpEl1 = document.getElementById('pullUp1');
        pullDownEl = document.getElementById('pullDown1');
        pullUpOffset1 = pullUpEl1.offsetHeight;
        myScroll1 = new iScroll('listContentDiv_switch1_content', {
            checkDOMChanges: true,
            hScrollbar: false,
            vScrollbar: false,
            useTransition: true,
            onRefresh: function () {
                if (pullUpEl1.className.match('loading')) {
                    pullUpEl1.className = '';
                    pullUpEl1.style.display = 'block';
                    pullUpEl1.querySelector('.pullUpLabel1').innerHTML = '上拉加载更多...';
                }
            },
            onScrollMove: function () {
                if (this.y < (this.maxScrollY - 20) && !pullUpEl1.className.match('flip')) {
                    pullUpEl1.className = 'flip';
                    pullUpEl1.style.display = 'block';
                    pullUpEl1.querySelector('.pullUpLabel1').innerHTML = '松手开始更新...';
                    this.maxScrollY = this.maxScrollY;
                } else if (this.y > (this.maxScrollY + 5) && pullUpEl1.className.match('flip')) {
                    pullUpEl1.className = '';
                    pullUpEl1.style.display = 'block';
                    pullUpEl1.querySelector('.pullUpLabel1').innerHTML = '上拉加载更多...';
                    this.maxScrollY = pullUpOffset1;
                } else if (this.y > 1 && !pullDownEl.className.match('flip')) {
                    pullDownEl.className = 'flip';
                    pullDownEl.querySelector('.pullDownLabel1').innerHTML = "刷新...";
                    pullDownEl.style.display = 'block';
                    this.minScrollY = 0;
                } else if (this.y < 1 && pullDownEl.className.match('flip')) {
                    pullDownEl.className = '';
                    pullDownEl.querySelector('.pullDownLabel1').innerHTML = "下拉刷新";
                    this.minScrollY = -pullDownOffset1;
                }
            },
            onScrollEnd: function () {
                if (pullUpEl1.className.match('flip')) {
                    pullUpEl1.className = 'loading';
                    pullUpEl1.style.display = 'block';
                    pullUpEl1.querySelector('.pullUpLabel1').innerHTML = '加载中...';
                    evection.pullUpAction1();
                } else if (pullDownEl.className.match('flip')) {
                    pullDownEl.className = 'loading';
                    pullDownEl.style.display = 'block';
                    pullDownEl.querySelector('.pullDownLabel1').innerHTML = "正在加载...";
                    evection.pullDownAction1();
                }

            }
        });
        setTimeout(function () { document.getElementById('listContentDiv_switch1_content').style.left = '0'; }, 800);
    }
};

var evectionScroll = null;

$(document).bind("pageshow", function (e) {
    var id = e.target.id;
    if ("ProductsList" == id) {
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        evection.init();
    }
});
