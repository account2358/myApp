var pageLocalStorage = window.localStorage;
var setNamePage = {
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
        $("#udetailNameId").val(myInfoData.name);
    },
    saveName: function () {
        var myInfoData = JSON.parse(pageLocalStorage.getItem("myInfo"));
        var datas = {};
        datas.memberId = pageLocalStorage.getItem("userid");
        datas.areId = myInfoData.areId;
        datas.recommended = myInfoData.recommended;
        datas.address = myInfoData.address;
        datas.familyMember = myInfoData.familyMember;
        datas.email = myInfoData.email;
        datas.gender = myInfoData.gender;
        datas.name = $("#udetailNameId").val();
        Common.save(datas)
    }
}
$(document).bind("pageshow", function (e) {
    var id = e.target.id;
    if ("setName_page" == id) {
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        if (!setNamePage.scroll) {
            setNamePage.scroll = new iScroll("underpart_div_scorll", {
                useTransition: true,
                checkDOMChanges: true,
                hScrollbar: false,
                vScrollbar: false
            });
        }
        setNamePage.init();
    }
});
