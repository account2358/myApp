var pageLocalStorage = window.localStorage;
var sessionStorage = window.sessionStorage;
var strprovince = "";

var Homepage = {
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
        pageLocalStorage.setItem("goBackPage", "../index.html");

        if ($(document.body).height() < 630)
            $("#footEmpty").show();
        else
            $("#footEmpty").hide();
        Homepage.initLocation();   //定位
        Homepage.initData();        //加载首页数据
        $("#head,#wechat_menu,.shade_div").bind("click", function (e) {
            Homepage.hideShade();
            $(".leare").hide();
        });
        $(".area_div").click(function () {
            $("#list_first").show();
            Homepage.showShade();
        })
        $("#childTable a").click(function () {
            $("#childTable a").each(function () {
                if ($(this).attr("class") == "childSelected")
                    $(this).attr("class", "childunSelected");
            })
            $("#areaText").text($(this).text());
            sessionStorage.setItem("myarea", $(this).text());  //存储区域
            Homepage.hideShade();
            $("#list_first").hide();
            $(this).attr("class", "childSelected");
        })
        $("#div_grain").click(function () {
            var typeID = pageLocalStorage.getItem("typegraint");
            Homepage.GoList(typeID);
        })
        $("#div_oil").click(function () {
            var typeID = pageLocalStorage.getItem("typeoil");
            Homepage.GoList(typeID);
        })
    },
    initData: function () {
        var str1 = "";
        var str2 = "";
        var str3 = "";
        var strhtml = "";
        var str = "";
        var activitystr = "";
        $.M.get({
            method: "/index.jhtml",
            success: function (data) {
                Homepage.initSwiper();
                TabScrollTop.tabsSwiper.removeAllSlides();
                $.each(data.returnValue.top, function (i, info) {
                    if (info.category == 1) {
                        var str = '<img src="' + info.image + '" class="headerimg"/>';
                        TabScrollTop.tabsSwiper.appendSlide(str, 'swiper-slide');
                    }
                    else if (info.category == 2) {
                        var str = '<img src="' + info.image + '" class="headerimg"   onclick="Homepage.GoProductDetail(\'' + info.goodsId + '\')" />';
                        TabScrollTop.tabsSwiper.appendSlide(str, 'swiper-slide');
                    }
                    else if (info.category == 3) {
                        var str = '<img src="' + info.image + '" class="headerimg"   onclick="Homepage.GoList(\'' + info.category + '\')" />';
                        TabScrollTop.tabsSwiper.appendSlide(str, 'swiper-slide');
                    }
                    else {
                        var str = '<img src="' + info.image + '" class="headerimg"/>';
                        TabScrollTop.tabsSwiper.appendSlide(str, 'swiper-slide');
                    }
                   
                })
                Homepage.setHeight();

                $.each(data.returnValue.grainList, function (i, info) {
                    str += '<div onclick="Homepage.GoDetail(\'' + info.goodsId + '\')"><a>';
                    str += ' <img src="' + info.image + '"/>';
                    str += '<div class="categoryFont"><span class="first_txt">' + info.title + '</span></div>';
                    str += '<div class="categorysmallFont"><span class="second_txt">' + info.subTitle + '</span></div>';
                    str += '</a></div>';
                    pageLocalStorage.setItem("typegraint", info.typeId);
                })
                $("#categoryFirst").html(str);

                str1 += ' <div class="left_oil" onclick="Homepage.GoDetail(\'' + data.returnValue.oilList[0].goodsId + '\')"><a><div class="categoryFont"><span class="first2_txt">' + data.returnValue.oilList[0].title + '</span></div><div class="categorysmallFont"><span class="second2_txt">' + data.returnValue.oilList[0].subTitle + '</span></div><img src="' + data.returnValue.oilList[0].image + '"  style="margin-top:1em;" /></a></div>';
                str2 += '<div class="right_oil">';
                str2 += ' <div style="width: 100%; border-bottom: 1px solid #dfdfdf;"  onclick="Homepage.GoDetail(\'' + data.returnValue.oilList[1].goodsId + '\')"><a><div class="div_lefttxt"><div class="categoryFont"><span class="first3_txt">' + data.returnValue.oilList[1].title + '</span></div><div class="categorysmallFont"><span class="second2_txt">' + data.returnValue.oilList[1].subTitle + '</span></div></div><div style="float:right;"><img src="' + data.returnValue.oilList[1].image + '" /></div></a></div>';
                str3 += ' <div style="width: 100%;" onclick="Homepage.GoDetail(\'' + data.returnValue.oilList[2].goodsId + '\')"><a> <div class="div_lefttxt"><div class="categoryFont"><span class="first4_txt">' + data.returnValue.oilList[2].title + '</span></div><div class="categorysmallFont"><span class="second2_txt">' + data.returnValue.oilList[2].subTitle + '</span></div></div><div style="float:right;"><img src="' + data.returnValue.oilList[2].image + '" /></div></a></div>';
                str3 += "  </div>";
                strhtml += str1 + str2 + str3;
                $("#categorySecond").html(strhtml);


                activitystr += '<div class="unit" style="border-right: 1px solid #dfdfdf;"  onclick ="Homepage.GoActivity()" >';
                activitystr += '<div class="bg_img">';
                activitystr += '<img src="' + data.returnValue.left.image + '"/>';
                activitystr += '<div style="position: absolute;z-index: 22; top: 13.5em;"><div class="categoryFont">  <span class="a_txt1">'+ data.returnValue.left.title+'</span> </div> <div class="categorysmallFont"> <span class="a_txt2"> '+ data.returnValue.left.subTitle +'</span></div></div>';
                activitystr += '</div></div>';

                activitystr += '<div class="unit"  onclick ="Homepage.GoVideolist()">';
                activitystr += '<div class="bg_img">';
                activitystr += '<img src="' + data.returnValue.right.image + '"/>';
                activitystr += '<div style="position: absolute;z-index: 22; top: 13.5em;"><div class="categoryFont">  <span class="a_txt1">' + data.returnValue.right.title + '</span> </div> <div class="categorysmallFont"> <span class="a_txt2"> ' + data.returnValue.right.subTitle + '</span></div></div>';
                activitystr += '</div></div>';


                $("#acivitydiv").html(activitystr);

                pageLocalStorage.setItem("typeoil", data.returnValue.oilList[0].typeId);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                Homepage.hideMask("c", "正在加载...");
            }
        });
    },
    initLocation: function () {
        var myarea = sessionStorage.getItem("myarea");
        if (myarea!=null && myarea!="") {
            $("#areaText").text(myarea);
        }
        var Cpoint = $("#areaText").text();
        if (Cpoint == "") {
            $.getScript('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js', function () {
                strprovince = remote_ip_info.province;
                var hd = new Array("江苏", "浙江", "安徽", "山东", "福建", "上海", "江西");//华东
                var hn = new Array("广东", "广西", "海南"); //华南
                var hz = new Array("湖北", "湖南", "河南");  //华中
                var hb = new Array("北京", "天津", "河北", "山西", "内蒙古"); //华北
                var xb = new Array("宁夏", "新疆", "青海", "陕西", "甘肃");  //西北
                var xn = new Array("四川", "云南", "贵州", "西藏", "重庆");  //西南
                var db = new Array("辽宁", "吉林", "黑龙江")    //东北
                for (var i = 0; i < hd.length; i++) {
                    if (hd[i] == strprovince) {
                        $("#areaText").text("华东");
                        document.getElementById("area_hd").className = "childSelected";
                    }
                }
                for (var i = 0; i < hn.length; i++) {
                    if (hn[i] == strprovince) {
                        $("#areaText").text("华南");
                        document.getElementById("area_hn").className = "childSelected";
                    }
                }
                for (var i = 0; i < hz.length; i++) {
                    if (hz[i] == strprovince) {
                        $("#areaText").text("华中");
                        document.getElementById("area_hz").className = "childSelected";
                    }
                }
                for (var i = 0; i < hb.length; i++) {
                    if (hb[i] == strprovince) {
                        $("#areaText").text("华北");
                        document.getElementById("area_hb").className = "childSelected";
                    }
                }
                for (var i = 0; i < xb.length; i++) {
                    if (xb[i] == strprovince) {
                        $("#areaText").text("西北");
                        document.getElementById("area_xb").className = "childSelected";
                    }
                }
                for (var i = 0; i < xn.length; i++) {
                    if (xn[i] == strprovince) {
                        $("#areaText").text("西南");
                        document.getElementById("area_xn").className = "childSelected";
                    }
                }
                for (var i = 0; i < db.length; i++) {
                    if (db[i] == strprovince) {
                        $("#areaText").text("东北");
                        document.getElementById("area_db").className = "childSelected";
                    }
                }
            });
        }
        else
        {
            var areastr = $("#areaText").text();
            switch (areastr) {
                case '华东':
                    document.getElementById("area_hd").className = "childSelected";
                    break;
                case '华南':
                    document.getElementById("area_hn").className = "childSelected";
                    break;
                case '华中':
                    document.getElementById("area_hz").className = "childSelected";
                    break;
                case '西北':
                    document.getElementById("area_xb").className = "childSelected";
                    break;
                case '东北':
                    document.getElementById("area_db").className = "childSelected";
                    break;
                case '华北':
                    document.getElementById("area_hb").className = "childSelected";
                    break;
                case '西南':
                    document.getElementById("area_xn").className = "childSelected";
                    break;
                default:
                    break;
            }
        }
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
    setHeight: function () {
        var wWidth = $(window).width();
        var imgHeight = 150;
        var imgConHeight = 150;
        $(".swiper-container").css("height", imgConHeight + "px");
        $(".swiper-wrapper").css("height", imgConHeight + "px");
        $(".swiper-wrapper .swiper-slide").css("height", imgConHeight + "px");
        $(".swiper-wrapper .swiper-slide").css("width", wWidth + "px");
        $(".swiper-slide img").css("max-height", imgHeight + "px");
        $(".swiper-slide img").css("width", (wWidth) + "px");
        $(".tabBanner").css("height", imgHeight + "px");
    },
    GoDetail: function (goodsId) {
        getprodId(goodsId); 
    },
    GoProductDetail: function (produid) {
        pageLocalStorage.setItem("proddetailId", produid);
        window.location.href = "products/productdetail.html";
    },
    GoList: function (productCategoryId) {
        pageLocalStorage.setItem("productCategoryId", productCategoryId);
        window.location.href = "products/productsList.html";
    },
    GoActivity:function()
    {
        window.location.href = "activities/activitylist.html";
    },
    GoVideolist: function () {
        window.location.href = "video/videolist.html";
    }
};

function getprodId(id) {
    $.M.get({
        method: "/product/detail/" + id + ".jhtml",
        success: function (data) {
            $.each(data.returnValue, function (k, eachReturn) {
                if (k == 0) {
                    pageLocalStorage.setItem("proddetailId", eachReturn.id);
                    window.location.href = "products/productdetail.html";
                }
            });
        }
    })
}
var TabScrollTop = {
    tabsSwiper: null,
    bindEvent: function () {
        $(window).resize(function () {
            setTimeout("Homepage.setHeight()", 20);
        });
    }
}
$(document).bind("pageshow", function (e) {
    var id = e.target.id;
    if ("index_page" == id) {
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        if (!Homepage.scroll) {
            Homepage.scroll = new iScroll("underpart_div_scorll", {
                useTransition: true,
                checkDOMChanges: true,
                hScrollbar: false,
                vScrollbar: false
            });
        }
        Homepage.init();
    }
});
