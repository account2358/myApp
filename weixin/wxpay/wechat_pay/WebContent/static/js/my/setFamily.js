var pageLocalStorage = window.localStorage;
var setFamilyPage = {
    scroll: null,
    storage: window.localStorage,
    userId: "",
    pageNo: 1,
    pageSizr: 10,
    init: function () {
        var isLogined = pageLocalStorage.getItem("userid");
        if (isLogined == "" || isLogined == null) {
            window.location.href = "../login.html";
        }
        var myInfoData = JSON.parse(pageLocalStorage.getItem("myInfo"));
        $("#udetailFamilyId").val(myInfoData.familyMember);
    },
    saveName: function () {
        if ($.trim($("#udetailFamilyId").val()) == "") {
            setFamilyPage.showMessages("家庭成员数不能为空");
        } else {
            if (isNaN($.trim($("#udetailFamilyId").val()))) {
                setFamilyPage.showMessages("家庭成员数格式错误");
            } else {
                var myInfoData = JSON.parse(pageLocalStorage.getItem("myInfo"));
                var datas = {};
                datas.memberId = pageLocalStorage.getItem("userid");
                datas.areId = myInfoData.areId;
                datas.recommended = myInfoData.recommended;
                datas.address = myInfoData.address;
                datas.email = myInfoData.email;
                datas.familyMember = $("#udetailFamilyId").val();
                Common.save(datas)
            }
        }


    },
    showMessages: function (messges) {
        $(".errorLabel").html(messges);
        $(".errorDiv").css("visibility", "visible");
        setTimeout('$(".errorDiv").css("visibility", "hidden")', 3000);
    }
};
$(document).bind("pageshow", function (e) {
    var id = e.target.id;
    if ("setFamily_page" == id) {
        document.addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, false);
        if (!setFamilyPage.scroll) {
            setFamilyPage.scroll = new iScroll("underpart_div_scorll", {
                useTransition: true,
                checkDOMChanges: true,
                hScrollbar: false,
                vScrollbar: false
            });
        }
        setFamilyPage.init();
    }
});
