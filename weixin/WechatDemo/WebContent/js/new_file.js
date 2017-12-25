var money = 1500;
var machineNumber = "noinput";
var url;
$(function(){
	var a=100;
	$(".person_wallet_recharge .ul li").click(function(e){
		$(this).addClass("current").siblings("li").removeClass("current");
		$(this).children(".sel").show(0).parent().siblings().children(".sel").hide(0);
		money = $(this).text();
		money = Number(money);

		$("#txt").val(money);
		//alert($(".person_wallet_recharge .ul li").hasClass('current'));
	});
	
	$(".botton").click(function(e){
		var txt = $("#txt").val();
		if(!$(".person_wallet_recharge .ul li").hasClass('current') && txt ==''){			
		layer.open({
            content: '请输入或选择金额',
            style: 'background:rgba(0,0,0,0.6); color:#fff; border:none;',
            time:3
           });
           return false;
		}	
		if(!$(".person_wallet_recharge .ul li").hasClass('current')){	
			if( txt < a){
				layer.open({
	            content: '金额必须是100元以上',
	            style: 'background:rgba(0,0,0,0.6); color:#fff; border:none;',
	            time:3
	           });
	           return false;
			} 
		}
		$("#txt").val();
		$("#payMoney").text($("#txt").val());
		$(".f-overlay").show();
		$(".addvideo").show();
	})
	$(".cal").click(function(e){
		$(".f-overlay").hide();
		$(".addvideo").hide();
	})
	
	$("#doPay").click(function(e){
		var getString = "servlet/PayMoney?PayMoney="+money + "&MachineNumber=" + machineNumber;
	    $.get(getString,function(data,status){

	    	//alert("Data: " + data + "\nStatus: " + status);
	    	if(data == "payok")
    		{
			    window.location.href="paystatus.html?PayStatus=success";
    		}
	    	else
		    {
	    		window.location.href="paystatus.html?PayStatus=fail";
		    }
	    });
	})
});
function getParameter(param)  
{  
    var query = window.location.search;//获取URL地址中？后的所有字符  
    var iLen = param.length;//获取你的参数名称长度  
    var iStart = query.indexOf(param);//获取你该参数名称的其实索引  
    if (iStart == -1)//-1为没有该参数  
        return "";  
    iStart += iLen + 1;  
    var iEnd = query.indexOf("&", iStart);//获取第二个参数的其实索引  
    if (iEnd == -1)//只有一个参数  
        return query.substring(iStart);//获取单个参数的参数值  
    return query.substring(iStart, iEnd);//获取第二个参数的值  
}  
function init() {  
    var m = getParameter("MachineNumber");  
    if(m.length == 8)
    	machineNumber = m; 
} 
