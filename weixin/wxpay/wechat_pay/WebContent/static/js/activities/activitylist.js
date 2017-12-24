var pageLocalStorage = window.localStorage;
var evection = {
    scroll: null,
    canMore: true,
    isIos: false,
    isAndroid: true,
    userId: "",
    pageSize: 50,
    pageNum1: 1,
    totalNum1: 0,
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

        if ($(document.body).height() < 630)
            $("#footEmpty").show();
        else
            $("#footEmpty").hide();

        evection.getEvectionInfo(evection.pageNum1, false);
        $("#listContentDiv_switch1_content").css("height", $(document.body).height() - 93 + "px");
        $("#listContentDiv").css("height", $(document.body).height() - 141 + "px");
    },
    GoDetail: function (activityId) {
        pageLocalStorage.setItem("activityId", activityId);
        window.location.href = "../activities/activitydetail.html";
    },
    getEvectionInfo: function (page, isMore) {
        evection.showMask("c", "正在加载...");
        $.M.get({
            method: "/promotion/list.jhtml?pageNumber=" + page + "&pageSize=" + evection.pageSize,
            success: function (data) {
                evection.hideMask("c", "正在加载...");
                if (data.success) {
                    evection.totalNum1 = Math.ceil(parseInt(data.returnValue.length) / parseInt(evection.pageSize));
                    var str = '';
                    $.each(data.returnValue, function (i, info) {
                        var reviewDate = new Date(info.endDate);
                        var year = reviewDate.getFullYear();
                        var month = reviewDate.getMonth() < 10 ? "0" + reviewDate.getMonth() : reviewDate.getMonth();
                        var day = reviewDate.getDay() < 10 ? "0" + reviewDate.getDay() : reviewDate.getDay();
                       
                        if (info.overdue == false)   //未过期，可以进活动详情
                        {
                            str += '<div  id="divunit"  onclick="evection.GoDetail(\'' + info.id + '\')">';
                            str += '<div id="img_area"><img src="' + info.promotionImages[0].source + '"/></div>';
                            str += ' <div id="div_text">';
                            str += ' <div class="titletxt">' + info.title + '</div>';
                            str += ' <div><div class ="timetxt">' + (year + "-" + month + "-" + day) + '</div><div class="isoverdure"></div></div> ';
                            str += ' </div></div>';
                        }
                        else {
                            str += '<div  id="divunit">';
                            str += '<div id="img_area"><img src="' + info.promotionImages[0].source + '"/></div>';
                            str += ' <div id="div_text">';
                            str += ' <div class="titletxt">' + info.title + '</div>';
                            str += '  <div><div class ="timetxt">' + (year + "-" + month + "-" + day) + '</div> <div class="isoverdure">已过期</div></div>';
                            str += ' </div></div>';
                        }
                    });
                    if (isMore == false) {
                        $("#div_activity").html(str);
                        $("#pullDown1").css("display", "none");

                    } else {
                        $("#div_activity").append(str);
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
    },
    Gopage: function () {
        window.location.href = "../index.html";
    }
};

var evectionScroll = null;

$(document).bind("pageshow", function (e) {
    var id = e.target.id;
    if ("activitylist_page" == id) {
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        evection.init();
    }
});
