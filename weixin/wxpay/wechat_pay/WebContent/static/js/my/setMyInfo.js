var pageLocalStorage = window.localStorage;
var setMyInfoPage = {
    scroll: null,
    storage: window.localStorage,
    userId: pageLocalStorage.getItem("userid"),
    pageNo: 1,
    pageSizr: 10,
    photoSrc: "",
    init: function () {
        var isLogined = pageLocalStorage.getItem("userid");
        if (isLogined == "" || isLogined == null) {
            window.location.href = "../login.html";
        }

        $.M.get({
            method: "/member/info.jhtml?memberId=" + setMyInfoPage.userId,
            success: function (data) {
                if (data.returnValue != null && data.returnValue != "") {
                    pageLocalStorage.setItem("myInfo", JSON.stringify(data.returnValue));
                    var userPhoto = data.returnValue.headPic;
                    var userPhotoArr = userPhoto.split("/");
                    var userPhotoValue = userPhotoArr[userPhotoArr.length - 1];
                    if (userPhotoValue == "null") {
                        $("#userPhoto").attr("src", "../css/images/my/img-02.png");
                    } else {
                        $("#userPhoto").attr("src", userPhoto);
                    }

                    $("#udetailNameId").text(data.returnValue.name == "" || data.returnValue.name == null ? "" : data.returnValue.name);
                    $("#udetailNickNameId").text(data.returnValue.username == "" || data.returnValue.username == null ? "" : data.returnValue.username);
                    $("#udetailBirthId").text(data.returnValue.birth == "" || data.returnValue.birth == null ? "" : data.returnValue.birth);
                    $("#udetailPhoneId").text(data.returnValue.mobile == "" || data.returnValue.mobile == null ? pageLocalStorage.getItem("smaccount").toString() : data.returnValue.mobile);
                    $("#udetailCityId").html((data.returnValue.address.length > 40 ? (data.returnValue.address.substring(0, 40) + "...") : data.returnValue.address) + "<div style='clear:both'></div>");
                    var address = data.returnValue.address
                    var district = address.substring(0, address.indexOf(" "));
                    var addrDetail = address.substring(address.indexOf(" ") + 1, address.length);
                    pageLocalStorage.setItem("district", district);
                    pageLocalStorage.setItem("address", addrDetail);
                    $("#udetailMailId").text((data.returnValue.email.length > 20 ? (data.returnValue.email.substring(0, 20) + "...") : data.returnValue.email));
                    $("#udetailFamilyId").text(data.returnValue.familyMember == "" || data.returnValue.familyMember == null ? "" : data.returnValue.familyMember);
                    if (data.returnValue.gender == "male") {
                        $("#udetailSexId").text("男");
                    }
                    else {
                        $("#udetailSexId").text("女");
                    }
                    if (data.returnValue.memberRank !== "") {
                        $("#memberType").attr("src", "../css/images/my/member-type_" + data.returnValue.memberRank.id + ".png");
                    }
                } else {
                    this.showMessages("Connection error");
                }

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        });

        $("#userPhotoInput").change(function () {
            var imgObj = document.getElementById("userPhotoInput");
            if (imgObj.files[0].size > 5242880) {
                alert("????С???????5M");
            } else {
                setMyInfoPage.showPageLoadingMsg();
                var options = {
                    url: $.M.baseMemberUrl + "/member/uploadLogo",
                    data: '',
                    type: "post",
                    success: function (data) {
                        setMyInfoPage.photoSrc = data.returnValue;
                        var imgObj = document.getElementById("userPhoto");
                        var imgObjInput = document.getElementById("userPhotoInput");
                        imgObj.src = window.URL.createObjectURL(imgObjInput.files[0]);
                        setMyInfoPage.updateUserInfo();

                    },
                    error: function (request) {
                        this.showMessages("Connection error");
                    }
                };
                $("#userPhotoForm").ajaxSubmit(options);
            }
        });
    },
    backMyImfomation: function () {
        window.location.href = "myInformation.html";
    },
    showMessages: function (messges) {
        $(".errorLabel").html(messges);
        $(".errorDiv").css("visibility", "visible");
        setTimeout('$(".errorDiv").css("visibility", "hidden")', 2000);
    },
    showPageLoadingMsg: function () {
        $(".errorLabel").html("数据加载失败...");
        $(".errorDiv").css("visibility", "visible");
    },
    hidePageLoadingMsg: function () {
        $(".errorDiv").css("visibility", "hidden");
    },
    back: function () {
        window.location.href = "setting.html";
    }

};
$(document).bind("pageshow", function (e) {
    var id = e.target.id;
    if ("setMyInfo_page" == id) {
        document.addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, false);
        if (!setMyInfoPage.scroll) {
            setMyInfoPage.scroll = new iScroll("underpart_div_scorll", {
                useTransition: true,
                checkDOMChanges: true,
                hScrollbar: false,
                vScrollbar: false
            });
        }
        setMyInfoPage.init();
    }
});

$(function () {
    $("#name_btn").click(function () {
        window.location.href = "setName.html";

    });
    $("#gender_btn").click(function () {
        window.location.href = "setGender.html";
    });
    $("#birthday_btn").click(function () {
        window.location.href = "setBirthday.html";

    });
    $("#mobile_btn").click(function () {
        window.location.href = "setMobileNumber.html";

    });
    $("#email_btn").click(function () {
        window.location.href = "setEmail.html";

    });
    $("#Location_btn").click(function () {
        window.location.href = "setLocation.html";

    });
    $("#family_btn").click(function () {
        window.location.href = "setFamily.html";

    });
});