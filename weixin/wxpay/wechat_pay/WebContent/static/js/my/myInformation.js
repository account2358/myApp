pageLocalStorage = window.localStorage;
var myInformationPage = {
    scroll: null,
    storage: window.localStorage,
    userId: pageLocalStorage.getItem("userid"),
    pageNo: 1,
    pageSizr: 10,
    init: function () {
        pageLocalStorage.removeItem("addressFrompage");
        var isLogined = pageLocalStorage.getItem("userid");
        if (isLogined == "" || isLogined == null) {
            window.location.href = "../login.html";
        }

        pageLocalStorage.setItem("goBackPage", "myInformation.html");

        //user info
        $.M.get({
            method: "/member/info.jhtml?memberId=" + myInformationPage.userId,
            //memberIdAndUserId
            success: function (data) {
                if (data.returnValue != "") {
                    $("#userNameId").text(data.returnValue.username);

                    var userPhoto = data.returnValue.headPic;
                    var userPhotoArr = userPhoto.split("/");
                    var userPhotoValue = userPhotoArr[userPhotoArr.length - 1];
                    if (userPhotoValue == "null") {
                        $("#userPhoto").attr("src", "../css/images/my/default_pic_user.png");

                    } else {
                        $("#userPhoto").attr("src", userPhoto);
                    }

                } else {
                    $("#userNameId").text("");
                }

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        });
    },
    setting: function () {
        window.location.href = "setting.html";
    },
    errorImg: function (avatar) {
        avatar.src = "../css/images/my/medals_2.png";
    }
}
$(document).bind("pageshow", function (e) {
    var id = e.target.id;
    if ("myInformation_page" == id) {
        document.addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, false);
        if (!myInformationPage.scroll) {
            myInformationPage.scroll = new iScroll("underpart_div_scroll", {
                useTransition: true,
                checkDOMChanges: true,
                hScrollbar: false,
                vScrollbar: false
            });
        }
        myInformationPage.init();
    }
});

$(function () {
    $("#myOrder_btn").click(function () {
        window.location.href = "myOrder.html";
    });
    $("#tradePointsId").click(function () {
        window.location.href = "myPoints.html";
    });
    $("#distributionAddress_btn").click(function () {
        pageLocalStorage.setItem("addListFromPage", "../my/myInformation.html");
        window.location.href = "distributionAddress.html";
    });
    $("#myMessage_btn").click(function () {
        pageLocalStorage.setItem("myMessageFromPage", "../my/myInformation.html");
        window.location.href = "myMessages.html";
    });
    $("#favorites_btn").click(function () {
        window.location.href = "../my/myFavorites.html";
    });
    $("#help_btn").click(function () {
        window.location.href = "help.html";
    });
    $("#myCustomerService_btn").click(function () {
        window.location.href = "myCustomerService.html";
    });
    $("#myPoints_btn").click(function () {
        window.location.href = "myPoints.html";
    });
});