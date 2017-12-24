var pageLocalStorage = window.localStorage;
var ForgotPassword = {
    scroll: null,
    mobileId: "",
    pageNo: 1,
    pageSizr: 10,
    canSend: true, // 是否可以发送验证码
    codeCheck: false, //验证码验证结果
    init: function () {
        $("#send_code").bind("click", function () {
            ForgotPassword.getCode();
        });
    },
    showTimeout: function (time) {
        if (time > 0) {
            time = time - 1;
            $("#send_code").css("background-color", "#B3B3B3");
            $("#send_code").attr("disabled", "disabled");
            $("#send_code").html(time); //填充内容

            setTimeout('ForgotPassword.showTimeout(' + time + ')', 1000);
            $("#send_code").unbind("click");
        } else {

            ForgotPassword.canSend = true;
            $("#send_code").css("background-color", "#fe960c");
            $("#send_code").removeAttr("disabled")
            $("#send_code").html("获取验证码");
            $("#send_code").bind("click", function () {
                ForgotPassword.getCode();
            });
        }
    },
    getCode: function () {
        var mobileId = $.M.trim($("#mobileId").val());
        var myreg = /^13\d{9}|14[57]\d{8}|15[012356789]\d{8}|18[01256789]\d{8}|170\d{8}$/;
        if (mobileId == "") {
            ForgotPassword.showMessges("请输入手机号");
            return;
        } else if (isNaN(mobileId)) {
            ForgotPassword.showMessges("请输入正确的手机号码");
            return;
        } else if (mobileId.length != 11) {
            ForgotPassword.showMessges("请输入正确的手机号码");
            return;
        } else if (!myreg.test(mobileId)) {
            ForgotPassword.showMessges("请输入正确的手机号码");
            return;
        } else if (ForgotPassword.canSend == false) {
            ForgotPassword.showMessges("60秒后重新发送");
            return;
        } else {
            ForgotPassword.showMessges("正在发送");
        }
        $.M.get({
            method:"/auth/sendResetPasswordVerificationCode.jhtml?mobile=" + mobileId,
            success: function (data) {

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                 ForgotPassword.showMessges("获取验证码失败");
               
            }
        });
        ForgotPassword.showTimeout(60);
    },
    toSubmit: function () {
        var mobileId = $.M.trim($("#mobileId").val());
        var pw = $.M.trim($("#passwordId").val());
        var rpw =$.M.trim($("#rpasswordId").val());
        var code = $.M.trim($("#verificationCodeId").val());
        var myreg = /^13\d{9}|14[57]\d{8}|15[012356789]\d{8}|18[01256789]\d{8}|170\d{8}$/;
        if (mobileId == "") {
            ForgotPassword.showMessges("请输入手机号码");
            return;
        } else if (isNaN(mobileId)) {
            ForgotPassword.showMessges("请输入正确的手机号码");
            return;
        } else if (mobileId.length != 11) {
            ForgotPassword.showMessges("请输入正确的手机号码");
            return;
        } else if (!myreg.test(mobileId)) {
            ForgotPassword.showMessges("请输入正确的手机号码");
            return;
        } else if (code == "") {
            ForgotPassword.showMessges("请输入验证码");
            return;
        } else if (pw == "") {
            ForgotPassword.showMessges("请输入密码");
            return;
        } else if (pw.length < 4 || pw.length > 20) {
            ForgotPassword.showMessges("密码长度需为4-20");
            return;
        }
        else if (rpw =="") {
            ForgotPassword.showMessges("请再次输入密码");
            return;
        } else if (pw != rpw) {
            ForgotPassword.showMessges("两次密码不一致");
            return;
        }

        ForgotPassword.doSubmit();
    },
    doSubmit: function () {
        var mobileId = $("#mobileId").val();
        var code = $("#verificationCodeId").val();
        var pw = $("#passwordId").val();

        $.M.post({
            method: "/auth/resetPassword.jhtml",
            params: { "password": pw, "mobile": mobileId, "code": code },
            success: function (data) {
                if (data.success) {
                    ForgotPassword.showMessges("设置成功");
                    if (pageLocalStorage.getItem('password') !== null) {
                        pageLocalStorage.removeItem('password');
                    }
                    setTimeout('window.location.href = "login.html"', 1000);
                }
                else {
                    ForgotPassword.showMessges(data.errorReason);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                ForgotPassword.showMessges("找回密码失败");
            }
        });
    },
    back: function () {
        window.location.href = "login.html";
    },
    showMessges: function (messges) {
        $(".errorLabel").html(messges);
        $(".errorDiv").css("visibility", "visible");
        setTimeout('$(".errorDiv").css("visibility", "hidden")', 3000);
    }
}

$(document).bind("pageshow", function (e) {
    var id = e.target.id;
    if ("forgotpassword_page" == id) {
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        ForgotPassword.init();
    }
});