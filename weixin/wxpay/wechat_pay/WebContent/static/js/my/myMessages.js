var pageLocalStorage = window.localStorage;
var myMessagesPage = {
    scroll: null,
    storage: window.localStorage,
    userId: pageLocalStorage.getItem("userid"),
    pageNo: 1,
    pageSizr: 10,
    init: function () {
        //user messages
        $.M.get({
            method:"/message/notice.jhtml?memberId=" + myMessagesPage.userId,
            success: function (data) {
                if (data.returnValue.total != "0") {
                    var messagesData = data.returnValue.message;
                    $("#mainText").hide();
                    $("#message_complete").hide();
                    $("#message_edit").show();
                    var messages = "";
                    for (var i = 0; i < messagesData.length; i++) {
                        messages = messages + "<div class='message_record_div'><span class='messageTitle'>" + messagesData[i].title + "</span>";
                        messages = messages + "<span class='messageDate'>" + messagesData[i].date + "</span>";
                        messages = messages + "<span class='messageContent'>" + messagesData[i].content + "</span>";
                        messages = messages + "<span class='clear'></span></div>";
                    }
                    $("#messagesList").html(messages);
                    $("#messagesList").show();
                } else {
                    $("#mainText").show();
                    $("#messagesList").hide();
                    $("#message_complete").hide();
                    $("#message_edit").hide();
                }

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        });
    },
    messageEdit: function () {
        $.M.get({
            method: "/message/notice.jhtml?memberId=" + myMessagesPage.userId,
            success: function (data) {
                if (data.returnValue != "") {
                    var messagesData = data.returnValue.message;
                    $("#mainText").hide();
                    $("#messagesList").hide();
                    var messages = "";
                    for (var i = 0; i < messagesData.length; i++) {
                        messages = messages + "<div class='message_record_div'><div class='message_del' onclick='myMessagesPage.messageRemove(" + messagesData[i].id + ");'><img src='../css/images/my/icon_delete.png' alt='' /></div>"
                        messages = messages + "<div class='message_edit_div'><span class='messageTitle'>" + messagesData[i].title + "</span>";
                        messages = messages + "<span class='messageDate'>" + messagesData[i].date + "</span>";
                        messages = messages + "<span class='messageContent'>" + messagesData[i].content + "</span>";
                        messages = messages + "</div><span class='clear'></span></div>";
                    }
                    $("#messagesList").html(messages);
                    $("#messagesList").show();
                    $("#message_edit").hide();
                    $("#message_complete").show();

                } else {
                    $("#mainText").show();
                    $("#messagesList").hide();
                    $("#message_edit").show();
                    $("#message_complete").hide();
                }

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        });
    },
    messageComplete: function () {
        myMessagesPage.init();
    },
    messageRemove: function (messageId) {
        $.M.post({
            method:"/message/delMessage.jhtml?id=" + messageId,
            success: function (data) {
                if (data.success) {
                    myMessagesPage.showMessages("操作成功");
                    myMessagesPage.messageEdit();
                } else {
                    myMessagesPage.showMessages("操作失败，失败原因：" + data.errorReason);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        });
    },
    showMessages: function (messges) {
        $(".errorLabel").html(messges);
        $(".errorDiv").css("visibility", "visible");
        setTimeout('$(".errorDiv").css("visibility", "hidden")', 3000);
    }
};

$(document).bind("pageshow", function (e) {
    var id = e.target.id;
    if ("myMessages_page" == id) {
        document.addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, false);
        if (!myMessagesPage.scroll) {
            myMessagesPage.scroll = new iScroll("underpart_div_scroll", {
                useTransition: true,
                checkDOMChanges: true,
                hScrollbar: false,
                vScrollbar: false
            });
        }
        myMessagesPage.init();
    }
});