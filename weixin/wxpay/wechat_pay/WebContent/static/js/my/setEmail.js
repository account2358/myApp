var pageLocalStorage = window.localStorage;
var setEmailPage = {
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
        $("#udetailMailId").val(myInfoData.email);
    },
    saveEmail: function () {
        var mail = $('#udetailMailId').val();
        if (mail != '') {
            var reg = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
            if (!reg.test(mail)) {
                setEmailPage.showMessges("ÓÊ¼þ¸ñÊ½´íÎó");
                return false;
            }
        }
        var myInfoData = JSON.parse(pageLocalStorage.getItem("myInfo"));
        var datas = {};
        datas.memberId = pageLocalStorage.getItem("userid");
        datas.areId = myInfoData.areId;
        datas.recommended = myInfoData.recommended;
        datas.address = myInfoData.address;
        datas.familyMember = myInfoData.familyMember;
        datas.email = mail;
        Common.save(datas)
    },
    showMessges: function (messges) {
        $(".errorLabel").html(messges);
        $(".errorDiv").css("visibility", "visible");
        setTimeout('$(".errorDiv").css("visibility", "hidden")', 2000);
    }
}
$(document).bind("pageshow", function (e) {
    var id = e.target.id;
    if ("setEmail_page" == id) {
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        if (!setEmailPage.scroll) {
            setEmailPage.scroll = new iScroll("underpart_div_scorll", {
                useTransition: true,
                checkDOMChanges: true,
                hScrollbar: false,
                vScrollbar: false
            });
        }
        setEmailPage.init();
    }
});
