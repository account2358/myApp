var pageLocalStorage = window.localStorage;

var agreement = {
    scroll: null,
    mobileId: "",
    pageNo: 1,
    pageSizr: 10,
    canSend: true, // 是否可以发送验证码
    codeCheck: false, //验证码验证结果
    init: function () {
        $.M.get({
            method:"/article/registrationGreement.jhtml",
            success: function (data) {
                if (data.success) {
                    $("#agree_content").html(data.returnValue.content);
                }
                else
                {
                    agreement.showMessges(data.errorReason);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        });
    },
    showMessges: function (messges) {
        $(".errorLabel").html(messges);
        $(".errorDiv").css("visibility", "visible");
        setTimeout('$(".errorDiv").css("visibility", "hidden")', 3000);
    }
}
$(document).bind("pageshow", function (e) {
    var id = e.target.id;
    if ("agreement_page" == id) {
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        if (!agreement.scroll) {
            agreement.scroll = new iScroll("underpart_div_scorll", {
                useTransition: true,
                checkDOMChanges: true,
                hScrollbar: false,
                vScrollbar: false
            });
        }
        agreement.init();
    }
});

