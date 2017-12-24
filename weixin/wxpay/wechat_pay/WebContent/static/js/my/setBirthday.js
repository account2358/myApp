var pageLocalStorage = window.localStorage;
var setBirthdayPage = {
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
        $("#time_input").val(myInfoData.birth)
        //日历组件
        initIOSDateControlHandler($("#time_input"));
        $("#backLink").bind("click", function () {
            window.location.href = "../../my/setMyInfo.html";
        })
    },
    Save: function () {
        var myInfoData = JSON.parse(pageLocalStorage.getItem("myInfo"));
        var datas = {};
        datas.memberId = pageLocalStorage.getItem("userid");
        datas.areId = myInfoData.areId;
        datas.recommended = myInfoData.recommended;
        datas.address = myInfoData.address;
        datas.familyMember = myInfoData.familyMember;
        datas.email = myInfoData.email;
        datas.gender = myInfoData.gender;
        datas.birth = $("#time_input").val();
        Common.save(datas);
    }
}

//初始化IOS日期控件样式
function initIOSDateControlHandler(dateControl) {
    dateControl.mobiscroll($.fn.optDate).date($.fn.optDate);
    dateControl.click(function () {
        $(this).focusout();
    });
}

$(document).bind("pageshow", function (e) {
    var id = e.target.id;
    if ("setBirthday_page" == id) {
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        setBirthdayPage.init();
    }
});
