var areaJsonData = {};
var cityData = {};
var areaData = {};
var areaName = $("#addrDistrict").val();

//get area data
function getProvince() {
    $.M.get({
        method: "/receiver/area.jhtml",
        success: function (data) {
            areaJsonData = data.returnValue.areaList;
            var provinces = "";
            var selectObj = "<select id='province' onchange='changeProvince()' class='div_input'><option value='0'>«Î—°‘Ò</option>";
            for (var i = 0; i < areaJsonData.length; i++) {
                provinces += '<option id="' + areaJsonData[i].id + '" value="'+areaJsonData[i].id+'">' + areaJsonData[i].name + '</option>';
            }
            selectObj += provinces;
            selectObj += "</select>";
            $(".maintitleDiv").show();
            $("#areaDiv").show();
            $("#provinceList").html();
            $("#cityList").html();
            $("#areaList").html();
            $("#provinceList").html(selectObj);
            $("#provinceList").show();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        }
    });
}

function setCity(data) {
    var cities = "";
    var selectObj = "<select id='city' onchange='changeCity()' class='div_input'><option value='0'>«Î—°‘Ò</option>";
    for (var i = 0; i < data.length; i++) {
        cities += '<option id="' + data[i].id + '" value="' + data[i].id + '">' + data[i].name + '</option>';

    }
    selectObj += cities;
    selectObj += "</select>";
    $("#cityList").html(selectObj);
}

function setArea(data) {
    var areas = "";
    var selectObj = "<select id='area' onchange='changeArea()' class='div_input'><option value='0'>«Î—°‘Ò</option>";
    for (var i = 0; i < data.length; i++) {
        areas += '<option id="' + data[i].id + '" value="' + data[i].id + '">' + data[i].name + '</option>';

    }
    selectObj += areas;
    selectObj += "</select>";
    $("#areaList").html(selectObj);
}

function changeProvince(provinceId) {
    provinceId = $("#province").val();
    for (var i = 0; i < areaJsonData.length; i++) {
        if (areaJsonData[i].id == provinceId) {
            areaName = areaJsonData[i].name;
            if (areaJsonData[i].childrens !== undefined) {
                cityData = areaJsonData[i].childrens;
                setCity(cityData);
                $("#cityList").show();
                $("#city").click();
            } else {
                $("#areaId").val(provinceId);
                selectedArea();

            }
        }
    }
}

function changeCity(cityId) {
    cityId = $("#city").val();
    for (var i = 0; i < cityData.length; i++) {
        if (cityData[i].id == cityId) {
            areaName += cityData[i].name;
            if (cityData[i].childrens !== undefined) {
                areaData = cityData[i].childrens;
                setArea(areaData);
                $("#areaList").show();
            } else {
                $("#areaId").val(cityId);
                selectedArea();
            }
        }
    }
}

function changeArea(areaId) {
    areaId = $("#area").val();
    for (var i = 0; i < areaData.length; i++) {
        if (areaData[i].id == areaId) {
            areaName += areaData[i].name;
            $("#areaId").val(areaId);
            selectedArea();
        }
    }
}

function selectedArea() {
    $("#provinceList").hide();
    $("#cityList").hide();
    $("#areaList").hide();
    $("#areaDiv").hide();
    $("#addrDistrict").val(areaName);
    $(".maintitleDiv").show();
}

