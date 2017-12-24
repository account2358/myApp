var pageLocalStorage = window.localStorage;

var Videolist = {
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
        Videolist.initData();        //加载数据

        $("#head,#wechat_menu,.shade_div").bind("click", function (e) {
            Videolist.hideShade();
        });
    },
    initData: function () {
        var strhtml = "";
        $.M.get({
            method: "/video/list.jhtml",
            success: function (data) {
                Videolist.initSwiper();
                TabScrollTop.tabsSwiper.removeAllSlides();
                $.each(data.returnValue.videos, function (i, info) {
                    var str = '<div class="playimg" onclick="Videolist.GoVideoDetail(\'' + info.name + '\',\'' + info.video + '\')"><img src="../css/images/video/vidio.png" /></div>';
                    str += '<img src="' + info.videoBgPic + '"  class="headerimg"  onclick="Videolist.GoVideoDetail(\'' + info.name + '\',\'' + info.video + '\')"/>';
                    TabScrollTop.tabsSwiper.appendSlide(str, 'swiper-slide');
                })
                Videolist.setHeight();
                $.each(data.returnValue.hotVideos, function (i, info) {
                    strhtml += '<div class="itemDiv" >';
                    strhtml += '<div class="smallvideo" onclick="Videolist.GoVideoDetail(\'' + info.name + '\',\'' + info.video + '\')"><img src="../css/images/video/vidio_small.png" /></div>';
                    strhtml += '<div class="itemImg"    onclick="Videolist.GoVideoDetail(\'' + info.name + '\',\'' + info.video + '\')" ><img src="' + info.thumbnail + '" /></div>';
                    strhtml += ' <div class="itemName">' + (info.name.length > 10 ? (info.name.substring(0, 10) + "...") : info.name) + '</div>';
                    strhtml += ' <div class="itemDesc">' + (info.introduction.length > 10 ? (info.introduction.substring(0,10) + "...") : info.introduction) + '</div>';
                    strhtml += '</div>';
                })
                $("#videodiv").html(strhtml);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                Videolist.hideMask("c", "正在加载...");
            }
        });
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
        $(".swiper-slide .headerimg").css("max-height", imgHeight + "px");
        $(".swiper-slide .headerimg").css("width", (wWidth) + "px");
        $(".tabBanner").css("height", imgHeight + "px");
    },
    GoVideoDetail: function (title, videourl) {
        pageLocalStorage.setItem("title", title);
        pageLocalStorage.setItem("videourl", videourl);
        window.location.href = "../video/videodetail.html";
    },
    GoPage : function()
    {
        window.location.href = "../index.html";
    },
};
var TabScrollTop = {
    tabsSwiper: null,
    bindEvent: function () {
        $(window).resize(function () {
            setTimeout("Videolist.setHeight()", 20);
        });
    }
}
$(document).bind("pageshow", function (e) {
    var id = e.target.id;
    if ("video_page" == id) {
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        if (!Videolist.scroll) {
            Videolist.scroll = new iScroll("underpart_div_scorll", {
                useTransition: true,
                checkDOMChanges: true,
                hScrollbar: false,
                vScrollbar: false
            });
        }
        Videolist.init();
    }
});
