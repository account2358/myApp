<!DOCTYPE html>
<!-- saved from url=(0122)http://www.17sucai.com/preview/396215/2017-06-15/%E5%AE%9E%E7%94%A8%E7%9A%84%E5%85%85%E5%80%BC%E9%A1%B5%E9%9D%A2/demo.html -->
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<meta name="viewport"
	content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width">
<link rel="stylesheet" href="css/new_file.css">
<script type="text/javascript" src="js/jquery-1.8.2.min.js"></script>
<script type="text/javascript" src="js/new_file.js"></script>
<link rel="stylesheet" href="css/layer.css">
<script type="text/javascript" src="js/layer.js"></script>
<link href="css/layer(1).css" type="text/css" rel="styleSheet"
	id="layermcss">
<title>充值</title>
</head>


 <script language="javascript" type="text/javascript">
function GetRequest() {  
    var url = location.search; //获取url中"?"符后的字串   
    var theRequest = new Object();  
    if (url.indexOf("?") != -1) {  
        var str = url.substr(1);  
        strs = str.split("&");  
        for (var i = 0; i < strs.length; i++) {  
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);  
        }  
    }  
    return theRequest;  
}  
$(document).ready(function () {  
    var Request = new Object();  
    Request = GetRequest();  
    var number= Request["MachineNumber"];  
    if(number.length == 8)
    	machineNumber= number;
    else
    	window.close();
});

</script>
<body>
	<!--头部 end-->
	<div class="banner">
		<img src="images/banner.png" width="100%" height="100%">
	</div>
	<!--充值列表-->
	<div class="person_wallet_recharge">
		<ul class="ul">
			<li>
				<h2>500</h2>
				<div class="sel" style=""></div>
			</li>
			<li>
				<h2>800</h2>
				<div class="sel" style=""></div>
			</li>
			<li>
				<h2>1200</h2>
				<div class="sel" style=""></div>
			</li>
			<li>
				<h2>2000</h2>
				<div class="sel" style=""></div>
			</li>
			<li>
				<h2>3000</h2>
				<div class="sel" style=""></div>
			</li>
			<li>
				<h2>5000</h2>
				<div class="sel" style=""></div>
			</li>
			<li>
				<h2>10000</h2>
				<div class="sel" style=""></div>
			</li>
			<li>
				<h2>20000</h2>
				<div class="sel" style=""></div>
			</li>
			<li>
				<h2>50000</h2>
				<div class="sel" style=""></div>
			</li>
			<div style="clear: both;"></div>
		</ul>
		<div class="pic">
			金额：<input type="text" placeholder="金额必须为100元以上" id="txt">
		</div>
		<div class="botton">我要充值</div>
		<!--遮罩层-->
		<div class="f-overlay"></div>
		<div class="addvideo" style="display: none;">
			<h3>
				本次充值<span id="payMoney">2000</span>元
			</h3>
			<ul>
				<li><a id="doPay">微信支付</a></li>
				<li class="cal">取消</li>
			</ul>
		</div>
	</div>
</body>
</html>