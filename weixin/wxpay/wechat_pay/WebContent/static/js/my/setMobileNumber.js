var pageLocalStorage = window.localStorage;
var setMobileNumberPage = {
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
        $("#udetailPhoneId").attr("value", GetQueryString("udetailPhone"));
    },
    saveMobileNumber: function () {
        var udetailPhone = $("#udetailPhoneId").val();
        if (udetailPhone == "") {
            setMobileNumberPage.showMessges("�������ֻ��");
            return;
        } else if (isNaN(udetailPhone)) {
            setMobileNumberPage.showMessges("�ֻ�Ÿ�ʽ����");
            return;
        } else if (udetailPhone.length != 11) {
            setMobileNumberPage.showMessges("�ֻ�Ÿ�ʽ����");
            return;
        }
        var datas = {};
        datas.memberId = pageLocalStorage.getItem("userid"); //��ʱ�ȹ̶�
        datas.udetailPhone = udetailPhone;
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
    if ("setMobileNumber_page" == id) {
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        if (!setMobileNumberPage.scroll) {
            setMobileNumberPage.scroll = new iScroll("underpart_div_scorll", {
                useTransition: true,
                checkDOMChanges: true,
                hScrollbar: false,
                vScrollbar: false
            });
        }
        setMobileNumberPage.init();
    }
});
