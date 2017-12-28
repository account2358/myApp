<pre name="code" class="html">
	<span style="font-size: 18px;">
		<!DOCTYPE html>  
<html>  
  
    <head>  
        <meta charset="UTF-8">  
        <title></title>  
        <meta name="viewport"
	content="width=device-width, initial-scale=1.0,user-scalable=no">  
        <meta name="apple-mobile-web-app-capable" content="yes" />  
        <meta name="apple-mobile-web-app-status-bar-style"
	content="black">  
        <script type="text/javascript" src="js/jquery-1.11.3.js"></script>  
        <script src="http://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>  
        <script type="text/javascript">  
                  wx.config({  
                      debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。  
                      appId: wx087f671c8d3d42b4, // 必填，公众号的唯一标识  
                      timestamp: 1514389628, // 必填，生成签名的时间戳  
                      nonceStr: 3391d687-2484-4b4d-b9dc-87ba5b49e77a, // 必填，生成签名的随机串  
                      signature: e0942f17471e84b009d83d3541e64fa12501436b, // 必填，签名，见附录1  
                      jsApiList: [  
                              "chooseWXPay"  
                          ] // 所有要调用的 API 都要加到这个列表中  
                  })  
                  
                $('a').on('click', function() {  
                      
                    wx.ready(function() { // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。  
                        wx.chooseWXPay({   
                            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。  
                            appId: 'wx087f671c8d3d42b4',  
                            timestamp: '1514389853', // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符  
                            nonceStr: '9f60f4e4-e40a-42b6-9ad4-854f8afd0553', // 支付签名随机串，不长于 32 位  
                            package: 'prepay_id=wx201712272349177aaedb32190868881333', // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）  
                            signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'  
                            paySign: '4ff69a82bd955a3413d831bc537bb659', // 支付签名  
                            success: function(res) {  
                                // 支付成功后的回调函数  
                                if (res.errMsg == "chooseWXPay:ok") {  
                                    //支付成功  
                                    alert('success');  
                                } else {  
                                    alert(res.errMsg);  
                                }  
                            },  
                            cancel: function(res) {  
                                //支付取消  
                                alert('failed');  
                            }  
                        });  
                    });  
                      
                      
                });  
            })  
        </script>  
    </head>  
  
    <body>  
        <a style="font-size: 20px;">abc</a>  
    </body>  
  
</html>
	</span> 