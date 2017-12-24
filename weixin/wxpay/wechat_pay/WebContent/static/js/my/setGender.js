var pageLocalStorage = window.localStorage;
var setGenderPage = {
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

        if (myInfoData.gender == "male") {
            $("#checkBoyId").css("display", "block");
        }
        else if (myInfoData.gender == "female") {
            $("#checkGirlId").css("display", "block");
        }
        else {
            $("#checkBoyId").css("display", "none");
            $("#checkGirlId").css("display", "none");
        }
    },
    saveGender: function (type) {
        var myInfoData = JSON.parse(pageLocalStorage.getItem("myInfo"));
        var datas = {};
        datas.memberId = pageLocalStorage.getItem("userid");
        datas.areId = myInfoData.areId;
        datas.recommended = myInfoData.recommended;
        datas.address = myInfoData.address;
        datas.familyMember = myInfoData.familyMember;
        datas.email = myInfoData.email;
        datas.gender = type;
        Common.save(datas)
    }
}
$(document).bind("pageshow", function (e) {
    var id = e.target.id;
    if ("setGender_page" == id) {
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        if (!setGenderPage.scroll) {
            setGenderPage.scroll = new iScroll("underpart_div_scorll", {
                useTransition: true,
                checkDOMChanges: true,
                hScrollbar: false,
                vScrollbar: false
            });
        }
        setGenderPage.init();
    }
});

