var pageLocalStorage = window.localStorage;
var productorderPage = {
    scroll: null,
    userId: pageLocalStorage.getItem("userid"),
    pageNo: 1,
    pageSizr: 10,
    originalAmount: 0,
    getfreightAmount:0,
    totalquality:0,
    shippingMethodId:1,
    paymentMethodId:5,
    receiverId:0,
    sn:"",
    youMiKaMoney:0,
    freight: 0,
    pointValue: 0,
    cartToken:"",
    selectAddress:false,
	showMask: function (theme, msg) {
        $.mobile.showPageLoadingMsg(theme, msg);
        $(".maskDiv").css("display", "block");
    },
    hideMask: function (theme, msg) {
        $.mobile.hidePageLoadingMsg(theme, msg);
        $(".maskDiv").css("display", "none");
    },
    init: function () {
        pageLocalStorage.setItem("goBackPage", "../products/productorder.html");
        $("#Addressblock").click(function () {
            pageLocalStorage.setItem("addressFrompage", "../products/productorder.html");
            window.location.href = "../my/distributionAddress.html";
        });
        $("#sureBtn").click(function () {
            if ($(".choosePaypoint").attr("rel") == "N") {
                productorderPage.pointValue = 0;
            } 
            if ($(".choosePay").attr("rel") == "N") {
                productorderPage.youMiKaMoney = 0;
            }
            if (pageLocalStorage.getItem("buy") != null && pageLocalStorage.getItem("buy") == "Y") {
                //产品详细页面点击立即购买进入
                var prodId = pageLocalStorage.getItem("proddetailId");
                $.M.post({
                    method: "/order/liJiGouMaiOrderOrderCreate.jhtml",
                    params: {
                        "memberId": pageLocalStorage.getItem("userid"), "productId": prodId, 
                        "quantity": productorderPage.totalquality, "sn": productorderPage.sn,
                        "receiverId": productorderPage.receiverId, "shippingMethodId": productorderPage.shippingMethodId,
                        "paymentMethodId": productorderPage.paymentMethodId, "youMiKaMoney": productorderPage.youMiKaMoney,
                        "pointValue": productorderPage.pointValue, "freight": productorderPage.freight
                    },
                    success: function (data) {
                        if (data.success) {
                            var sn = data.returnValue.sn;
                            productorderPage.showMessges("订单创建成功");
                        }
                    }
                })
            } else {
                //购物车页面点击结算进入
                $.M.post({
                    method: "/order/createOrder.jhtml",
                    params: {
                        "memberId": pageLocalStorage.getItem("userid"), "cartToken": productorderPage.cartToken,
                        "cartItemIds": pageLocalStorage.getItem("suregoods"), "sn": productorderPage.sn,
                        "productIds": pageLocalStorage.getItem("sureprods"),
                        "receiverId": productorderPage.receiverId, "shippingMethodId": productorderPage.shippingMethodId,
                        "paymentMethodId": productorderPage.paymentMethodId, "youMiKaMoney": productorderPage.youMiKaMoney,
                        "pointValue": productorderPage.pointValue, "freight": productorderPage.freight
                    },
                    success: function (data) {
                        if (data.success) {
                            var sn = data.returnValue.sn;
                            productorderPage.showMessges("订单创建成功");
                        }
                    }
                })
            }
        })

        if ($(document.body).height() < 630)
            $("#footEmpty").show();
        else
            $("#footEmpty").hide();
        
        productorderPage.showMask("c", "正在加载...");
        if (pageLocalStorage.getItem("userid") != null && pageLocalStorage.getItem("userid") != "") {
            if (pageLocalStorage.getItem("selectedAddress") != null) {
                productorderPage.selectAddress = true;
                var obj = pageLocalStorage.getItem("selectedAddress");
                //将选择的地址转换为json对象
                var myobj = eval('(' + obj + ')');
                $("#noAddress").hide();
                $("#getAddress").show();
                $("#consignee").text(myobj.consignee);
                $("#phone").text(myobj.phone);
                $("#preaddress").text((myobj.provinceName != null ? myobj.provinceName : "") + (myobj.cityName != null ? myobj.cityName : "") + (myobj.areaName != null ? myobj.areaName : ""));
                $("#addressdetail").text(myobj.address);
                productorderPage.receiverId = myobj.id;
                productorderPage.getOrderinfo();
            } else {
                productorderPage.getOrderinfo();
            }
            
        } else {
            window.location.href = "../login.html";
        }

        $(".choosePay").click(function () {
            $(this).children("img").attr("src", "../css/images/products/selectpay_1.png");
            $(".choosePaypoint").children("img").attr("src", "../css/images/products/selectpay_2.png");
            $(this).attr("rel", "Y");
            $(".choosePaypoint").attr("rel", "N");
            
            var youmikaAmount = $("#youmikamount").text();
            var originalAmount = $("#settlePrice").text();
            productorderPage.youMiKaMoney = youmikaAmount;
            if (parseFloat(youmikaAmount) >= productorderPage.getfreightAmount) {
                $("#settlePrice").text("￥0.00");
            } else {
                $("#settlePrice").text((parseFloat(productorderPage.getfreightAmount) - parseFloat(youmikaAmount)).toFixed(2));
            }
        })
        $(".choosePaypoint").click(function () {
            $(this).children("img").attr("src", "../css/images/products/selectpay_1.png");
            $(".choosePay").children("img").attr("src", "../css/images/products/selectpay_2.png");
            $(this).attr("rel", "Y");
            $(".choosePay").attr("rel", "N");

            var pointamount = $("#pointamount").text();
            var originalAmount = $("#settlePrice").text();
            productorderPage.pointValue = pointamount*200;
            if (parseFloat(pointamount) >= productorderPage.getfreightAmount) {
                $("#settlePrice").text("￥0.00");
            } else {
                $("#settlePrice").text((parseFloat(productorderPage.getfreightAmount) - parseFloat(pointamount)).toFixed(2));
            }
        })
    },
    getOrderinfo:function(){
        var prodId = pageLocalStorage.getItem("proddetailId");
        if (pageLocalStorage.getItem("buy") != null && pageLocalStorage.getItem("buy") == "Y") {
            //产品详细页面点击立即购买进入
            $.M.get({
                method: "/order/liJiGouMaiOrderInfo.jhtml?memberId=" + pageLocalStorage.getItem("userid") + "&quantity="+pageLocalStorage.getItem("buyNumber")+"&productId=" + prodId,
                success: function (data) {
                    productorderPage.hideMask("c", "正在加载...");
                    //获取产品信息
                    var str = '';
                    //var totalPrice = 0.00;
                    var totalquality = 0;
                    
                    
                    $.each(data.returnValue.orderItems, function (i, info) {
                        var currValue = "";
                        $.each(info.specificationValues, function (i, specinfo) {
                            currValue = specinfo.value;
                        });
                        //totalPrice += (info.quantity * info.price);
                        str += '<div class="prodItem"> ';
                        str += '<div class="prodImg"> <div class="borderImg"> <img src="' + info.thumbnail + '" /> </div></div>';
                        str += '<div class="prodDesc"> <table>';
                        str += '<tr> <td class="upDesc">' + info.name + '</td> <td class="downDesc" align="right">￥' + (info.subtotal) + '</td> </tr>';
                        str += '<tr> <td class="upDesc">规格：' + currValue + '</td> <td class="downDesc" align="right">x' + info.quantity + '</td></tr>';
                        str += '</table></div>';
                        str += '</div>';
                        totalquality += info.quantity;
                    });
                    $("#productBlock").html(str);
                    
                    //获取积分信息
                    $("#youmikamount").text(data.returnValue.youMiKaBalance.toFixed(2));
                    var totalPoint = data.returnValue.order.point;
                    var pointamount = (Math.floor(data.returnValue.order.point / 200)).toFixed(2);
                    var changePoint = (pointamount * 200).toFixed(2);
                    var remainPoint = (totalPoint - changePoint).toFixed(2);
                    $("#changePoint").text(changePoint);
                    $("#remainPointPoint").text(remainPoint);
                    $("#pointamount").text(pointamount);

                    //确认订单参数赋值
                    var shippingid = 1;
                    $.each(data.returnValue.shippingMethods, function (i, shippinginfo) {
                        shippingid = shippinginfo.id;
                    });
                    productorderPage.shippingMethodId = shippingid;
                    productorderPage.sn = data.returnValue.order.sn;
                    productorderPage.totalquality = totalquality;

                    if (productorderPage.selectAddress) {
                        //重新选择地址，取freeShippingPrice的值，如果为空，或者少于总价，则包邮，否则计算运费
                        productorderPage.originalAmount = data.returnValue.order.amount;
                        if (data.returnValue.freeShippingPrice != null && data.returnValue.freeShippingPrice != "") {
                            if (parseFloat(data.returnValue.freeShippingPrice) <= parseFloat(productorderPage.originalAmount)) {
                                $(".freight").html("包邮");
                                productorderPage.freight = 0;
                                productorderPage.getfreightAmount = data.returnValue.order.amount;
                                $("#settlePrice").text(productorderPage.getfreightAmount);
                            } else {
                                productorderPage.countfreight(data.returnValue.order.weight);
                            }
                                
                        } else {
                            productorderPage.countfreight(data.returnValue.order.weight);
                        }
                    } else {
                        productorderPage.receiverId = data.returnValue.defaultReceiver.id;
                        //获取默认地址
                        if (data.returnValue.defaultReceiver != null && data.returnValue.defaultReceiver.id != null) {
                            $("#noAddress").hide();
                            $("#getAddress").show();
                            var addobj = data.returnValue.defaultReceiver;
                            $("#consignee").text(addobj.consignee);
                            $("#phone").text(addobj.phone);
                            $("#preaddress").text(addobj.areaName);
                            $("#addressdetail").text(addobj.address);
                        } else {
                            $("#noAddress").show();
                            $("#getAddress").hide();
                        }
                        productorderPage.freight = data.returnValue.order.freight;
                        //初始化订单页面，直接取freeShippingPrice的值，如果freeShippingPrice='',则直接显示freight,
                        //否则判断商品总价格是否超过freeShippingPrice，超过则显示包邮，否则显示freight
                        if (data.returnValue.freeShippingPrice != null && data.returnValue.freeShippingPrice != "") {
                            if (parseFloat(data.returnValue.freeShippingPrice) <= parseFloat(productorderPage.originalAmount)) {
                                $(".freight").html("包邮");
                            }else
                                $(".freight").html("￥" + data.returnValue.order.freight);
                        } else {
                            $(".freight").html("￥" + data.returnValue.order.freight);
                        }
                        $("#settlePrice").text(data.returnValue.order.amountPayable);
                        productorderPage.originalAmount = data.returnValue.order.amountPayable;
                        productorderPage.getfreightAmount = data.returnValue.order.amountPayable;
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    productorderPage.hideMask("c", "正在加载...");
                }
            });
        } else {
            //购物车页面点击结算进入
            if (pageLocalStorage.getItem("suregoods") != null && pageLocalStorage.getItem("suregoods") != "") {
                var cartsArr = pageLocalStorage.getItem("suregoods");
                var prodsArr = pageLocalStorage.getItem("sureprods"); 
                $.M.get({
                    method: "/order/orderInfo.jhtml?memberId=" + pageLocalStorage.getItem("userid") + "&cartItemIds=" + cartsArr + "&productIds=" + prodsArr,
                    success: function (data) {
                        productorderPage.hideMask("c", "正在加载...");
                        //获取产品信息
                        var str = '';
                        //var totalPrice = 0.00;
                        var totalquality = 0;
                        $.each(data.returnValue.orderItems, function (i, info) {
                            var currValue = "";
                            $.each(info.specificationValues, function (i, specinfo) {
                                currValue = specinfo.value;
                            });
                            //totalPrice += (info.quantity * info.price);
                            str += '<div class="prodItem"> ';
                            str += '<div class="prodImg"> <div class="borderImg"> <img src="' + info.thumbnail + '" /> </div></div>';
                            str += '<div class="prodDesc"> <table>';
                            str += '<tr> <td class="upDesc">' + info.name + '</td> <td class="downDesc" align="right">￥' + (info.subtotal) + '</td> </tr>';
                            str += '<tr> <td class="upDesc">规格：' + currValue + '</td> <td class="downDesc" align="right">x' + info.quantity + '</td></tr>';
                            str += '</table></div>';
                            str += '</div>';
                            totalquality += info.quantity;
                        });
                        $("#productBlock").html(str);

                        //获取积分信息
                        $("#youmikamount").text(data.returnValue.youMiKaBalance.toFixed(2));
                        var totalPoint = data.returnValue.order.point;
                        var pointamount = (Math.floor(data.returnValue.order.point / 200)).toFixed(2);
                        var changePoint = (pointamount * 200).toFixed(2);
                        var remainPoint = (totalPoint - changePoint).toFixed(2);
                        $("#changePoint").text(changePoint);
                        $("#remainPointPoint").text(remainPoint);
                        $("#pointamount").text(pointamount);

                        //确认订单参数赋值
                        var shippingid = 1;
                        $.each(data.returnValue.shippingMethods, function (i, shippinginfo) {
                            shippingid = shippinginfo.id;
                        });
                        productorderPage.shippingMethodId = shippingid;
                        productorderPage.sn = data.returnValue.order.sn;
                        productorderPage.totalquality = totalquality;
                        productorderPage.cartToken = data.returnValue.cartToken;

                        if (productorderPage.selectAddress) {
                            //重新选择地址，取freeShippingPrice的值，如果为空，或者少于总价，则包邮，否则计算运费
                            productorderPage.originalAmount = data.returnValue.order.amount;
                            if (data.returnValue.freeShippingPrice != null && data.returnValue.freeShippingPrice != "") {
                                if (parseFloat(data.returnValue.freeShippingPrice) <= parseFloat(productorderPage.originalAmount)) {
                                    $(".freight").html("包邮");
                                    productorderPage.freight = 0;
                                    productorderPage.getfreightAmount = data.returnValue.order.amount;
                                    $("#settlePrice").text(productorderPage.getfreightAmount);
                                } else {
                                    productorderPage.countfreight(data.returnValue.order.weight);
                                }

                            } else {
                                productorderPage.countfreight(data.returnValue.order.weight);
                            }
                        } else {
                            //获取默认地址
                            productorderPage.receiverId = data.returnValue.defaultReceiver.id;
                            if (data.returnValue.defaultReceiver != null && data.returnValue.defaultReceiver.id != null) {
                                $("#noAddress").hide();
                                $("#getAddress").show();
                                var addobj = data.returnValue.defaultReceiver;
                                $("#consignee").text(addobj.consignee);
                                $("#phone").text(addobj.phone);
                                $("#preaddress").text(addobj.areaName);
                                $("#addressdetail").text(addobj.address);
                            } else {
                                $("#noAddress").show();
                                $("#getAddress").hide();
                            }
                            productorderPage.freight = data.returnValue.order.freight;

                            //初始化订单页面，直接取freeShippingPrice的值，如果freeShippingPrice='',则直接显示freight,
                            //否则判断商品总价格是否超过freeShippingPrice，超过则显示包邮，否则显示freight
                            if (data.returnValue.freeShippingPrice != null && data.returnValue.freeShippingPrice != "") {
                                if (parseFloat(data.returnValue.freeShippingPrice) <= parseFloat(productorderPage.originalAmount)) {
                                    $(".freight").html("包邮");
                                } else
                                    $(".freight").html("￥" + data.returnValue.order.freight);
                            } else {
                                $(".freight").html("￥" + data.returnValue.order.freight);
                            }
                            $("#settlePrice").text(data.returnValue.order.amountPayable);
                            productorderPage.originalAmount = data.returnValue.order.amountPayable;
                            productorderPage.getfreightAmount = data.returnValue.order.amountPayable;
                        }

                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        productorderPage.hideMask("c", "正在加载...");
                    }
                });
            }
        }
    },
    countfreight: function (totalweight) {
        var obj = pageLocalStorage.getItem("selectedAddress");
        //将选择的地址转换为json对象
        var myobj = eval('(' + obj + ')');
        var freight = 0;
        var totalWeightFloat = totalweight;
        var firstWeightFloat = myobj.firstWeight;
        var firstPriceFloat = myobj.firstPrice;
        var continueWeightFloat = myobj.continueWeight;
        var continuePriceFloat = myobj.continuePrice;
        if (totalWeightFloat > 0 && firstPriceFloat >= 0) {
            freight = firstPriceFloat;
            if (totalWeightFloat > firstWeightFloat && firstWeightFloat >= 0 && continueWeightFloat > 0 && continuePriceFloat >= 0) {
                //总重量减去首重量，再除以增重得到的值，如果这个值带有小数，则向上取整，否则就取这个值，来计算运费
                var pricePerContinueWeithtFloat = ((totalWeightFloat - firstWeightFloat) / continueWeightFloat);
                var pricePerContinueWeithtInt = pricePerContinueWeithtFloat > Math.floor(pricePerContinueWeithtFloat) ? Math.floor(pricePerContinueWeithtFloat) + 1 : pricePerContinueWeithtFloat;
                freight = (freight + pricePerContinueWeithtInt * continuePriceFloat).toFixed(2);
            }
        }
        $(".freight").html("￥" + freight);
        productorderPage.freight = freight;
        var getfreightAmount = (parseFloat(productorderPage.originalAmount) + parseFloat(freight)).toFixed(2);
        productorderPage.getfreightAmount = getfreightAmount;

        $("#settlePrice").text(getfreightAmount);
    },
    showMessges: function (messges) {
        $(".errorLabel").html(messges);
        $(".errorDiv").css("visibility", "visible");
        setTimeout('$(".errorDiv").css("visibility", "hidden")', 3000);
    },
    back: function () {
        window.location.href = "../products/productcart.html";
    }
};

function in_array(stringToSearch, arrayToSearch) {
    for (s = 0; s < arrayToSearch.length; s++) {
        thisEntry = arrayToSearch[s].toString();
        if (thisEntry == stringToSearch) {
            return true;
        }
    }
    return false;
}

$(document).bind("pageshow", function (e) {
    var id = e.target.id;
    if ("product_OrderPage" == id) {
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        if (!productorderPage.scroll) {
            productorderPage.scroll = new iScroll("underpart_div_scorll", {
                useTransition: true,
                checkDOMChanges: true,
                hScrollbar: false,
                vScrollbar: false
            });
        }
        productorderPage.init();
    }
});
