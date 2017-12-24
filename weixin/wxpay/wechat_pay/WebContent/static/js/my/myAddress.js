var myAddressPage = {
    scroll: null,
    storage: window.localStorage,
    userId: pageLocalStorage.getItem("userid"),
    pageNo: 1,
    pageSizr: 10,
    init: function () {
        pageLocalStorage.removeItem("selectedAddress");
        //user address
        $.M.get({
            method:"/receiver.jhtml?memberId=" + myAddressPage.userId,
            success: function (data) {
                if (data.returnValue != "") {
                    var addressData = data.returnValue;
                    $("#mainText").hide();
                    $("#address_complete").hide();
                    $("#address_edit").show();
                    $("#address_add_div").attr("onclick", "myAddressPage.addAddress()");
                    $("#address_add_div").attr("class", "enable");
                    $("#address_add_div img").attr("src", "../css/images/my/icon_add.png");
                    var address = "";
                    for (var i = 0; i < addressData.length; i++) {
                        address = address + "<div class='address_record_div' onclick=myAddressPage.selectAddress(\'" + (JSON.stringify(addressData[i])) + "\')><span class='addressPerson'>收货人:&nbsp;" + addressData[i].consignee + "</span>";
                        address = address + "<span class='addressPhone'>" + addressData[i].phone + "</span>";
                        address = address + "<span class='addressAreaName'>" + addressData[i].areaName + "</span>";
                        address = address + "<span class='addressContent'>" + addressData[i].address + "</span>";
                        address = address + "<span class='clear'></span></div>";
                    }
                    $("#addressList").html(address);
                    $("#addressList").show();
                } else {
                    $("#mainText").show();
                    $("#addressList").hide();
                }

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        });
    },
    addressEdit: function () {
        $.M.get({
            method:"/receiver.jhtml?memberId=" + myAddressPage.userId,
            success: function (data) {
                if (data.returnValue != "") {
                    var addressData = data.returnValue;
                    $("#mainText").hide();
                    $("#addressList").hide();
                    $("#address_add_div").removeAttr('onclick');
                    $("#address_add_div").attr("class", "disable");
                    $("#address_add_div img").attr("src", "../css/images/my/icon_add_gray.png");
                    var address = "";
                    for (var i = 0; i < addressData.length; i++) {
                        address = address + "<div class='address_record_div'><div class='address_del' onclick='myAddressPage.addressRemove(" + addressData[i].id + ");'><img src='../css/images/my/icon_delete.png' alt='' /></div>";
                        address = address + "<div class='address_edit_div'><span class='addressPerson'>收货人:" + addressData[i].consignee + "</span>";
                        address = address + "<span class='addressPhone'>" + addressData[i].phone + "</span>";
                        address = address + "<span class='addressAreaName'>" + addressData[i].areaName + "</span>";
                        address = address + "<span class='addressContent'>" + addressData[i].address + "</span>";
                        address = address + "</div><div class='address_modify' onclick='myAddressPage.addAddress(" + addressData[i].id + ");'><img src='../css/images/my/icon_edit.png' alt='' /></div>";
                        address = address + "<span class='clear'></span></div>";
                        
                    }
                    
                    $("#addressList").html(address);
                    $("#addressList").show();
                    $("#address_edit").hide();
                    $("#address_complete").show();

                } else {
                    $("#mainText").show();
                    $("#addressList").hide();
                    $("#address_edit").show();
                    $("#address_complete").hide();
                }

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        });
    },
    addressComplete: function () {
        myAddressPage.init();
    },
    addressRemove: function (addressId) {
        $.M.post({
            method:"/receiver/deleteReceiver.jhtml?id=" + addressId + "&memberId=" + myAddressPage.userId,
            success: function (data) {
                if (data.success) {
                    myAddressPage.showMessages("操作成功");
                    myAddressPage.addressEdit();
                } else {
                    myAddressPage.showMessages("操作失败，失败原因：" + data.errorReason);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        });
    },
    addAddress: function (id) {
        if (typeof(id) !== "undefined"){
            pageLocalStorage.setItem("addressEditFlag", "T");
            pageLocalStorage.setItem("addressDetailId", id);
        } else {
            pageLocalStorage.setItem("addressEditFlag", null);
        }
        window.location.href = "addAddress.html";
    },
    showMessages: function (messges) {
        $(".errorLabel").html(messges);
        $(".errorDiv").css("visibility", "visible");
        setTimeout('$(".errorDiv").css("visibility", "hidden")', 3000);
    },
    selectAddress: function (obj) {
        if (pageLocalStorage.getItem("addressFrompage") != null && pageLocalStorage.getItem("addressFrompage") != "") {
            pageLocalStorage.setItem("selectedAddress", obj);
            window.location.href = pageLocalStorage.getItem("addressFrompage");
        }    
    }
};
$(document).bind("pageshow", function (e) {
    var id = e.target.id;
    if ("myAddress_page" == id) {
        document.addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, false);
        if (!myAddressPage.scroll) {
            myAddressPage.scroll = new iScroll("underpart_div_scroll", {
                useTransition: true,
                checkDOMChanges: true,
                hScrollbar: false,
                vScrollbar: false
            });
        }
        myAddressPage.init();
    }
});