var addAddressPage = {
    scroll: null,
    storage: window.localStorage,
    userId: pageLocalStorage.getItem("userid"),
    pageNo: 1,
    pageSizr: 10,
    init: function () {
        $(".checkDiv").click(function () {
            $("#isDefault").click();
        });
        $("#titleCenter").text("新增配送地址");
        if (pageLocalStorage.getItem("addressEditFlag") != null && pageLocalStorage.getItem("addressEditFlag") == "T") {
            $("#titleCenter").text("编辑配送地址");
            $.M.get({
                method:"/receiver.jhtml?memberId=" + addAddressPage.userId,
                success: function (data) {
                    if (data.returnValue != "") {
                        var addressData = data.returnValue;
                        var addressDetailId = pageLocalStorage.getItem("addressDetailId");
                        for (var i = 0; i < addressData.length; i++) {
                            if (Number(addressDetailId) == Number(addressData[i].id)) {
                                $("#areaId").val(addressData[i].areaId);
                                $("#addrName").val(addressData[i].consignee);
                                $("#addrMobile").val(addressData[i].phone);
                                $("#addrDistrict").val(addressData[i].areaName);
                                $("#addrZipcode").val(addressData[i].zipCode);
                                $("#addrDetail").val(addressData[i].address);
                                if (addressData[i].isDefault == 1) {
                                    $("#isDefault").attr('checked', true);
                                } else {
                                    $("#isDefault").attr('checked', false);
                                }
                                return;
                            }
                        }

                    }

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                }
            });
        }else{
        }
    },
    checkAddress: function () {
        var str = "";
        if ($.trim($("#addrName").val()) == "") {
            str += ",姓名";
        }
        if ($.trim($("#addrMobile").val()) == "") {
            str += ",手机";
        }
        if ($.trim($("#addrCountry").val()) == "") {
            str += ",国家";
        }
        if ($.trim($("#addrDistrict").val()) == "") {
            str += ",所在地区";
        }
        if ($.trim($("#addrDetail").val()) == "") {
            str += ",详细地址";
        }

        if (str != "") {
            str += "不能为空";
            addAddressPage.showMessages(str.substr(1));
        }
        else {
            if (isNaN($.trim($("#addrMobile").val()))) {
                addAddressPage.showMessages("手机号格式错误");
            } else if ($.trim($("#addrMobile").val()).length != 11) {
                addAddressPage.showMessages("手机号格式错误");
            } else {
                addAddressPage.saveValues();
            }
        }

    },
    saveValues: function () {
        var datas = {};
        datas.consignee = $("#addrName").val();
        datas.phone = $("#addrMobile").val();
        datas.areaName = $("#addrDistrict").val();
        datas.zipCode = $("#addrZipcode").val();
        datas.address = $("#addrDetail").val();
        datas.areaId = $("#areaId").val()
        datas.isDefault = $("#isDefault").is(':checked') ? 1 : 0;
        datas.memberId = addAddressPage.userId;
        if (pageLocalStorage.getItem("addressEditFlag") != null && pageLocalStorage.getItem("addressEditFlag") == "T") {
            datas.id = pageLocalStorage.getItem("addressDetailId");
        }
        $.M.post({
            method: "/receiver/save.jhtml?" + $.param(datas),
            success: function (data) {
                if (data.success) {
                    addAddressPage.showMessages("操作成功");
                    window.location.href = "distributionAddress.html";
                } else {
                    addAddressPage.showMessages("操作失败，失败原因：" + data.errorReason);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                //DistributionAddress.hideMask("c", "正在加载...");
            }
        })

    },
    showMessages: function (messges) {
        $(".errorLabel").html(messges);
        $(".errorDiv").css("visibility", "visible");
        setTimeout('$(".errorDiv").css("visibility", "hidden")', 3000);
    },
    back: function () {
        window.location.href = "distributionAddress.html";
    }
};

$(document).bind("pageshow", function (e) {
    var id = e.target.id;
    if ("addAddress_page" == id) {
        document.addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, false);
        addAddressPage.init();
    }
});
