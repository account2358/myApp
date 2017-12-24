var myPointsPage = {
    scroll: null,
    storage: window.localStorage,
    userId: pageLocalStorage.getItem("userid"),
    pageNo: 1,
    pageSizr: 10,
    init: function () {
        //user points total
        $.M.get({
            method: "/member/info.jhtml?memberId=" + myPointsPage.userId,
            success: function (data) {
                if (data.returnValue != "") {
                    $("#pointsTotal").text(data.returnValue.point);
                } else {
                    $("#pointsTotal").text(0);
                }

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        });
        //user points expire
        $.M.get({
            method: "/point/toExpire.jhtml?memberId=" + myPointsPage.userId,
            success: function (data) {
                if (data.returnValue != "") {
                    $("#pointsExpire").text(data.returnValue.toExpire);
                } else {
                    $("#pointsExpire").text(0);
                }

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        });
        
        myPointsPage.pointsRecords();
    },
    pointsRecords: function () {
        $("#pointsRecords").css("border-bottom", "2px solid");
        $("#pointsConsumption").css("border-bottom", "0");
        $.M.get({
            method:"/point/pluslist.jhtml?memberId=" + myPointsPage.userId + "&pageSize=10000&pageNumber=1",
            success: function (data) {
                if (data.returnValue != "") {
                    var pointsData = data.returnValue.pointList;
                    $("#mainText").hide();
                    var points = "";
                    for (var i = 0; i < pointsData.length; i++) {
                        var createDate = new Date(pointsData[i].createDate).toLocaleDateString();
                        points = points + "<div class='point_record_div'>";
                        points = points + "<div class='point_info_div'><div><span class='pointTitle'>" + pointsData[i].omsumptionTitle + "</span>";
                        points = points + "<span class='pointDate'>" + createDate + "</span></div>";
                        points = points + "<span class='pointValue'>＋" + pointsData[i].onsumptionValue + "<span class='pointValueName'> 分</span></span>";
                        points = points + "</div><span class='clear'></span></div>";
                    }
                    $("#pointsList").html(points);
                    $("#pointsList").show();
                } else {
                    $("#pointsList").hide();
                    var noRecord = "<span><img src='../css/images/my/icon_dingdan_gray.png' class='myPoints_icon' alt=''/></span>";
                    $("#mainText").html(noRecord + "暂无积分充值记录");
                    $("#mainText").show();
                }

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        });
    },
    pointsConsumption: function () {
        $("#pointsRecords").css("border-bottom", "0");
        $("#pointsConsumption").css("border-bottom", "2px solid");
        $.M.get({
            method:"/point/consumptionLogs.jhtml?memberId=" + myPointsPage.userId + "&pageSize=10000&pageNumber=1",
            success: function (data) {
                if (data.returnValue != "") {
                    var pointsData = data.returnValue.pointConsumptionLogs;
                    $("#mainText").hide();
                    var points = "";
                    for (var i = 0; i < pointsData.length; i++) {
                        var createDate = new Date(pointsData[i].createDate).toLocaleDateString();
                        points = points + "<div class='point_record_div'>";
                        points = points + "<div class='point_info_div'><div><span class='pointTitle'>购物消费积分</span>";
                        points = points + "<span class='pointDate'>" + createDate + "</span></div>";
                        points = points + "<span class='pointValue'>－" + pointsData[i].pointScore + "<span class='pointValueName'> 分</span></span>";
                        points = points + "</div><span class='clear'></span></div>";
                    }
                    $("#pointsList").html(points);
                    $("#pointsList").show();
                } else {
                    $("#pointsList").hide();
                    var noRecord = "<span><img src='../css/images/my/icon_dingdan_gray.png' class='myPoints_icon' alt=''/></span>";
                    $("#mainText").html(noRecord + "暂无积分消费记录");
                    $("#mainText").show();
                }

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        });

    },
    pointRules: function () {
        window.location.href = "pointRules.html"
    }
};

$(document).bind("pageshow", function (e) {
    var id = e.target.id;
    if ("myPoints_page" == id) {
        document.addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, false);
        if (!myPointsPage.scroll) {
            myPointsPage.scroll = new iScroll("underpart_div_scroll", {
                useTransition: true,
                checkDOMChanges: true,
                hScrollbar: false,
                vScrollbar: false
            });
        }
        myPointsPage.init();
    }
});