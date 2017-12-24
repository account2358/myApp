var pageLocalStorage = window.localStorage;
var setLocationPage = {
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
        if (pageLocalStorage.getItem("district")!==""){
            $("#addrDistrict").val(pageLocalStorage.getItem("district"));
        }
        if (pageLocalStorage.getItem("address")!==""){
            $("#addrDetail").val(pageLocalStorage.getItem("address"));
        }

    },
    saveLocation: function () {
        var myInfoData = JSON.parse(pageLocalStorage.getItem("myInfo"));
        var datas = {};
        datas.memberId = pageLocalStorage.getItem("userid");
        datas.recommended = myInfoData.recommended;
        datas.email = myInfoData.email;
        datas.familyMember = myInfoData.familyMember;
        datas.areId = $("areaId").val();
        datas.address = $("#addrDistrict").val() +" "+ $("#addrDetail").val();
        Common.save(datas)
    }
}
$(document).bind("pageshow", function (e) {
    var id = e.target.id;
    if ("setLocation_page" == id) {
        document.addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, false);
        setLocationPage.init();
    }
});
