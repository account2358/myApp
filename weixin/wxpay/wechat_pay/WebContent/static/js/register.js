var pageLocalStorage = window.localStorage;

var Register = {
    scroll: null,
    mobileId: "",
    pageNo: 1,
    pageSizr: 10,
    canSend: true, // 是否可以发送验证码
    codeCheck: false, //验证码验证结果
    init: function () {
        $("#send_code").bind("click", function () {
            Register.getCode();
        });
        $("#savePwdImg").click(function () {
            var isSave = $("#savePwdId").val();
            if (isSave == 1) {
                $(this).attr("src", "css/images/login/sp.png");
                $("#savePwdId").val(2);
            } else if (isSave == 2) {
                $(this).attr("src", "css/images/login/sp_1.png");
                $("#savePwdId").val(1);
            }
        });
    },
    back: function () {
        window.location.href = "login.html";
    },
    gopage: function () {
        window.location.href = "agreement.html";
    },
    showTimeout: function (time) {
        if (time > 0) {
            time = time - 1;
            $("#send_code").css("background-color", "#B3B3B3");
            $("#send_code").attr("disabled", "disabled");
            $("#send_code").html(time); //填充内容
            setTimeout('Register.showTimeout(' + time + ')', 1000);
            $("#send_code").unbind("click");
        } else {
            Register.canSend = true;
            $("#send_code").css("background-color", "#fe960c");
            $("#send_code").removeAttr("disabled")
            $("#send_code").html("获取验证码");
            $("#send_code").bind("click", function () {
                Register.getCode();
            });
        }
    },
    getCode: function () {
        var mobileId = $.M.trim($("#mobileId").val());
        var myreg = /^13\d{9}|14[57]\d{8}|15[012356789]\d{8}|18[01256789]\d{8}|170\d{8}$/;
        if (mobileId == "") {
            Register.showMessges("请输入手机号码");
            return;
        } else if (isNaN(mobileId)) {
            Register.showMessges("请输入正确的手机号码");
            return;
        } else if (mobileId.length != 11) {
            Register.showMessges("请输入正确的手机号码");
            return;
        } else if (!myreg.test(mobileId)) {
            Register.showMessges("请输入正确的手机号码");
            return;
        } else if (Register.canSend == false) {
            Register.showMessges("60秒后重新发送");
            return;
        } else {
            Register.showMessges("正在发送");
        }
        $.M.get({
            method: "/auth/sendRegisterVerificationCode.jhtml?mobile=" + mobileId,
            success: function (data) {
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                //alert(XMLHttpRequest.status);

            }
        });
        Register.showTimeout(60);
    },
    toRegister: function () {

        var username = $.M.trim($("#username").val());
        var mobileId = $.M.trim($("#mobileId").val());
        var pw = $.M.trim($("#passwordId").val());
        var rpw = $.M.trim($("#rpasswordId").val());
        var code = $.M.trim($("#verificationCodeId").val());
      
        var myreg = /^13\d{9}|14[57]\d{8}|15[012356789]\d{8}|18[01256789]\d{8}|170\d{8}$/;
        
        if (username == "") {
            Register.showMessges("请输入用户名");
            return;
        }
        else if (mobileId == "") {
            Register.showMessges("请输入手机号");
            return;
        } else if (isNaN(mobileId)) {
            Register.showMessges("请输入正确的手机号码");
            return;
        } else if (mobileId.length != 11) {
            Register.showMessges("请输入正确的手机号码");
            return;
        }
        else if(!myreg.test(mobileId)) {
            Register.showMessges("请输入正确的手机号码");
            return;
        } else if (code =="") {
            Register.showMessges("请输入验证码");
            return;
        }
        else if (pw =="") {
            Register.showMessges("请输入密码");
            return;
        }
        else if (pw.length < 4 || pw.length > 20) {
            Register.showMessges("密码长度需为4-20");
            return;
        }
        else if (rpw == "") {
            Register.showMessges("请再次输入密码");
            return;
        } else if (pw != rpw) {
            Register.showMessges("两次密码不一致");
            return;
        }
        else if ($("#savePwdId").val() =="2") {
            Register.showMessges("请先阅读并同意注册协议");
            return;
        }
        Register.doRegister();
    },
    doRegister: function () {

        var username = $("#username").val();
        var mobileId = $("#mobileId").val();
        var code = $("#verificationCodeId").val();
        var pw = $("#passwordId").val();
        $.M.post({
            method: "/auth/register.jhtml",
            params: { "username": username, "password": pw, "mobile": mobileId, "code": code, "deviceId": "" },
            success: function (data) {
                if (data.success) {

                    Register.showMessges("注册成功");
                    //注册成功，调用登录接口，返回userid
                    $.M.post({
                        method: "/auth/login.jhtml",
                        params: { "username": username, "password": pw },
                        success: function (data) {
                            if (data.success) {
                                pageLocalStorage.setItem("userid", data.returnValue.id);           //用户ID
                                setTimeout('window.location.href = "my/myInformation.html"', 1000);
                            }
                            else {
                                showMessges(data.errorReason);
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) { 
                        }
                    });
                }
                else {
                    Register.showMessges(data.errorReason);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                Register.showMessges("注册失败");
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
    if ("Register_page" == id) {
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        Register.init();
    }
});

