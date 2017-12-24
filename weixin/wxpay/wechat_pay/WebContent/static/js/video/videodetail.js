var pageLocalStorage = window.localStorage;

var Videodetail = {
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

        Videodetail.initData();        //加载数据

        $("#head,#wechat_menu,.shade_div").bind("click", function (e) {
            Videodetail.hideShade();
        });
    },
    initData: function () {
        var title = pageLocalStorage.getItem("title");
        var videourl = pageLocalStorage.getItem("videourl");
        $("#video_title").text(title);
        var strhtml='<video  id="videoplayer" width="100%" controls="controls" autoplay="autoplay"><source type="video/mp4"  src="'+ videourl +'"></video>';
        $("#videoplay").html(strhtml);

        Videodetail.launchFullscreen(document.getElementById("videoplayer"));

    },
    GoPage: function () {
        window.location.href = "../video/videolist.html";
    },

    launchFullscreen: function (element)
    {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }
};

$(document).bind("pageshow", function (e) {
    var id = e.target.id;
    if ("videodetail_page" == id) {
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        if (!Videodetail.scroll) {
            Videodetail.scroll = new iScroll("underpart_div_scorll", {
                useTransition: true,
                checkDOMChanges: true,
                hScrollbar: false,
                vScrollbar: false
            });
        }
        Videodetail.init();
    }
});
