var pageLocalStorage = window.localStorage;

function goPage(pageId) {

    switch (pageId) {
        case '1':
            window.location.href = "index.html";
            break;
        case '2':
            window.location.href = "register.html";
            break;
        case '3':
            window.location.href = "forgetpassword.html";
            break;
        case '4':
            window.location.href = "employeelogin.html";
            break;
        default:
            break;
    }
}
function savePwd(username, password) {
    $("#username").val(username);
    $("#password").val(password);
    $("#savePwdId").val(2);
    $("#savePwdImg").attr("src", "css/images/login/sp_1.png");
}

function formSubmit() {
    try {
        var username = $.M.trim($("#username").val());
        var password = $.M.trim($("#password").val());
        if (username=="" || username==null) {
            showMessges("请输入用户名/手机号");
        }
       else if (password =="" || password ==null) {
            showMessges("请输入密码");
        }
        else
        {
           checkLogin(username, password);
        }
    } catch (e) {
        alert(e);
    }
}
function checkLogin(username, password) {
    $.M.post({
        method: "/auth/login.jhtml",
		params: {"username":username,"password":password},
        success: function (data) {
            if (data.success) {
                var isSavePwd = $("#savePwdId").val();
                pageLocalStorage.setItem("userid", data.returnValue.id);           //用户ID
                pageLocalStorage.setItem("username",username);                    //用户昵称or手机号
                pageLocalStorage.setItem("mobile", data.returnValue.mobile);      //用户手机号
                if (isSavePwd == 2) {
                    pageLocalStorage.setItem('isSavePwd', 2);
                    pageLocalStorage.setItem('password', password);
                } else {
                    pageLocalStorage.removeItem('isSavePwd');
                    pageLocalStorage.removeItem('password');
                }
                window.location.href = "index.html";
            }
            else {
                showMessges(data.errorReason);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            showMessges("登录失败");
        }
    });
}
$(function () {
    //$.ajax({
    //    type: "get",
    //    url: "https://api.weixin.qq.com/cgi-bin/user/info?access_token=ACCESS_TOKEN&openid=OPENID&lang=zh_CN",
    //    data: '',
    //    dataType: "json",
    //    contentType: "application/json; charset=utf-8",
    //    success: function (data) {
    //        ShopDetailPage.initSwiper();
    //        TabScrollTop.tabsSwiper.removeAllSlides();
    //        $.each(data.objValue, function (i, info) {
    //            var str = '<img src="' + (info.imagePath.replace(/\\/g, '/')) + '" class="headerimg" />';
    //            TabScrollTop.tabsSwiper.appendSlide(str, 'swiper-slide');
    //        });
    //        ShopDetailPage.setHeight();
    //    },
    //    error: function (XMLHttpRequest, textStatus, errorThrown) {
    //        evection.hideMask("c", "正在加载...");
    //    }
    //});

    var username = pageLocalStorage.getItem('username');
    var password = pageLocalStorage.getItem('password');
    //if (username !== null) {
    //    $("#username").val(username);
    //}
    //if (password !== null) {
    //    $("#password").val(password);
    //}
    if (pageLocalStorage.getItem('isSavePwd') != null && pageLocalStorage.getItem('isSavePwd') == 2) {
        //保存密码
        savePwd(username, password);
    }

    $(".submitButton").click(function () {
        formSubmit();
    });

    $("#savePwdImg").click(function () {
        var isSave = $("#savePwdId").val();
        if (isSave == 1) {
            $(this).attr("src", "css/images/login/sp_1.png");
            $("#savePwdId").val(2);
        } else if (isSave == 2) {
            $(this).attr("src", "css/images/login/sp.png");
            $("#savePwdId").val(1);
        }

    });

})
function showMessges(messges) {
    $(".errorLabel").html(messges);
    $(".errorDiv").css("visibility", "visible");
    setTimeout('$(".errorDiv").css("visibility", "hidden")', 4000);
}