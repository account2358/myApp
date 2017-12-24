/**
 * 调用方式:$.M.funtion(params);
 */
(function($) {
	$.now_version = "0.1.1(20141109)";
	$.support.cors = true;
	$.extend({
				M : {
					openAjax : true,
					iosDelayTime : 20,
					openIosSyncDraft : true,
					openSyncDraft : true,
					isAndroid : false,
					isIos : false,
					bridge : null,
					last_click_time : "",
					click_time : "",
					clientType : "other",
					// this is the web service just for test
					//内网
					//baseUrl : "http://172.19.50.32:1030/eco_orchard/rest",
					//外网
					//baseUrl : "http://58.210.98.46:1030/eco_orchard/rest",
					//UAT
					//baseUrl : "http://116.236.195.138:8080/eco_orchard/rest",
					//img url for test
					//imgUrl:"http://121.41.47.152:8080/filesystem/graphics/",
					
					// this is the web service just for release
					baseUrl : 'http://218.4.117.11:6061/mobile',	
					//img url for test
					imgUrl:"http://180.153.238.213:8080/filesystem/graphics/",
					REGX_HTML_ENCODE : /"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g,
					REGX_HTML_DECODE : /&\w{1,};|&#\d{1,};/g,
					REGX_ENTITY_NUM : /\d{1,}/,
					REGX_TRIM : /(^\s*)|(\s*$)/g,
					HTML_DECODE : {
						"&lt;" : "<",
						"&gt;" : ">",
						"&amp;" : "&",
						"&nbsp;" : " ",
						"&quot;" : "\"",
						"&copy;" : "©"
					},
					encodeHtml : function(s) {// 加码html字符
						s = (s != undefined) ? s : this;
						return (typeof s != "string") ? s : s.replace(
								this.REGX_HTML_ENCODE, function($0) {
									var c = $0.charCodeAt(0), r = [ "&#" ];
									c = (c == 0x20) ? 0xA0 : c;
									r.push(c);
									r.push(";");
									return r.join("");
								});
					},
					decodeHtml : function(s) {// 解码html字符
						var HTML_DECODE = this.HTML_DECODE, REGX_NUM = this.REGX_ENTITY_NUM;
						s = (s != undefined) ? s : this;
						return (typeof s != "string") ? s : s.replace(
								this.REGX_HTML_DECODE, function($0) {
									var c = HTML_DECODE[$0];
									if (c == undefined) {
										var m = $0.match(REGX_NUM);
										if (m) {
											var cc = m[0];
											cc = (cc == 160) ? 32 : cc;
											c = String.fromCharCode(cc);
										} else {
											c = $0;
										}
									}
									return c;
								});
					},
					trim : function(s) {// 过滤空格
						s = (s != undefined) ? s : this;
						return (typeof s != "string") ? s : s.replace(
								this.REGX_TRIM, "");
					},
					hashCode : function() {
						var hash = this.__hash__, _char;
						if (hash == undefined || hash == 0) {
							hash = 0;
							for ( var i = 0, len = this.length; i < len; i++) {
								_char = this.charCodeAt(i);
								hash = 31 * hash + _char;
								hash = hash & hash; // Convert to 32bit integer
							}
							hash = hash & 0x7fffffff;
						}
						this.__hash__ = hash;
						return this.__hash__;
					},
					createXml : function(str) {// xml字符串转对象
						var xml = null;
						try {
							xml = new DOMParser().parseFromString(str,
									"text/xml");
						} catch (e) {
							xml = new ActiveXObject("Microsoft.XMLDOM");
							xml.async = false;
							xml.loadXML(str);
						}
						return xml;
						// return new DOMParser().parseFromString(str,
						// "text/xml")
					},
					rootVal : function(xmlStr) {// 获取xml根元素的Text
						var xml = this.createXml(xmlStr);
						if (xml.hasChildNodes()) {
							item = xml.childNodes.item(0);
							return $(item).text().replace(/\\/g, "\\\\");
						}
						return "";
					},
					bigRootVal : function(xmlStr) {// 获取xml根元素的Text
						var jsonStr = xmlStr.substring(xmlStr.indexOf('{'));
						jsonStr = jsonStr.replace("</string>", "");
						var jsonObj = eval("(" + jsonStr + ")");
						return jsonObj;
					},
					rootJson : function(xmlStr) {// xml转化成json
						var startIndex = xmlStr.indexOf('{');
						if (startIndex == -1) {
							return null;
						} else {
							var jsonStr = xmlStr.substring(startIndex);
							jsonStr = jsonStr.replace("</string>", "");
							var jsonObj = eval("(" + jsonStr + ")");
							return jsonObj;
						}
					},
					bigRootOrg : function(xmlStr) {// xml转化成json
						var jsonStr = xmlStr.substring(xmlStr.indexOf('['));
						jsonStr = jsonStr.replace("</string>", "");
						var jsonObj = eval("(" + jsonStr + ")");
						return jsonObj;
					},
					xmlToJson : function(xml) {// xml转化成json
						var obj = {};
						if (xml.nodeType == 1) { // element
							if (xml.attributes.length > 0) {
								obj["@attributes"] = {};
								for (var j = 0; j < xml.attributes.length; j++) {
									var attribute = xml.attributes.item(j);
									obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
								}
							}
						} else if (xml.nodeType == 3) { // text
							obj = xml.nodeValue;
						}
						if (xml.hasChildNodes()) {
							for (var i = 0; i < xml.childNodes.length; i++) {
								var item = xml.childNodes.item(i);
								var nodeName = item.nodeName;
								if (typeof (obj[nodeName]) == "undefined") {
									nodeName == "#text" ? obj = this
											.xmlToJson(item)
											: obj[nodeName] = this
													.xmlToJson(item);
								} else {
									if (typeof (obj[nodeName].length) == "undefined") {
										var old = obj[nodeName];
										obj[nodeName] = [];
										obj[nodeName].push(old);
									}
									obj[nodeName].push(this.xmlToJson(item));
								}
							}
						}
						return obj;
					},
					sPost : function(options, serverType) {
						if($.M.isAndroid == true && !$.M.isOnLine()){
							options.error(XMLHttpRequest, null, null);
						} else if ($.M.isAndroid == false && $.M.isIos == true && $.M.bridge) {
							$.M.bridge.callHandler('isOnline', {}, function(response) {
								if (response == "1") {
									$.M.sPostOnLine(options, serverType);
								} else {
									options.error(XMLHttpRequest, null, null);
								}
							});
						} else {
							$.M.sPostOnLine(options, serverType);
						}
					},
					sPostOnLine : function(options, serverType) {
						options = $.extend({
							method : '',
							url : '',
							params : {},
							dataType : 'text',
							success : function(data) {

							},
							error : function(XMLHttpRequest, textStatus,
									errorThrown) {

							}
						}, options);
						var serverUrl = "";
						var postData = null;
						var languageType = "1";
						if($.M.language() == "1"){
							languageType = "2";
						}
						if (serverType == "0") {
							serverUrl = $.M.baseUrl + options.method;
							postData = $.extend({
								"languageType" : languageType,
								'dateTime' : new Date().getTime()
							}, options.params);
						} else if (serverType == "1") {
							serverUrl = $.M.baseUrl + options.method ;
							postData = $.extend({
								"languageType" : languageType,
								'dateTime' : new Date().getTime()
							}, options.params);
						} else if (serverType == "2") {
							serverUrl = $.M.baseUrl + options.method;
							postData = $.extend({
								"dateTime" : new Date().getTime(),
								"showType" : "2",
								"languageType" : languageType,
								"userId" : window.localStorage.getItem('selfUser')
							}, options.params);
						}
						$.ajax({
							url : serverUrl,
							type : 'post',
							dataType : options.dataType,
							data : postData,
							success : function(data) {
								try {
									data =eval('(' + data+')');
									options.success(data);
								} catch (e) {
									//alert(e);
								}
							},
							error : function(XMLHttpRequest, textStatus,
									errorThrown) {
								if (options.isTip == undefined
										|| options.isTip == null
										|| options.isTip != false) {
								}
								options.error(XMLHttpRequest, textStatus,
										errorThrown);
							}
						});
					},
					post : function(options) {
						if($.M.isAndroid == true && !$.M.isOnLine()){
							options.error(XMLHttpRequest, null, null);
						} else if ($.M.isAndroid == false && $.M.isIos == true && $.M.bridge) {
							$.M.bridge.callHandler('isOnline', {}, function(response) {
								if (response == "1") {
									$.M.postOnLine(options);
								} else {
									options.error(XMLHttpRequest, null, null);
								}
							});
						} else {
							$.M.postOnLine(options);
						}
					},
					postOnLine : function(options) {
						options = $.extend({
							method : '',
							url : '',
							params : {},
							dataType : 'text',
							success : function(data) {

							},
							error : function(XMLHttpRequest, textStatus,
									errorThrown) {

							}
						}, options);
						var that = this;
						$.ajax({
							url : that.baseUrl + options.method,
							type : 'post',
							dataType : options.dataType,
							data : $.extend({
								'dateTime' : new Date().getTime()
							}, options.params),
							success : function(data) {
								try {
									data = eval('(' + data + ')');
									options.success(data);
								} catch (e) {
								}
							},
							error : function(XMLHttpRequest, textStatus,
									errorThrown) {
								if (options.isTip == undefined
										|| options.isTip == null
										|| options.isTip != false) {
								}
								options.error(XMLHttpRequest, textStatus,
										errorThrown);
							}
						});
					},
					get : function(options) {
						if($.M.isAndroid == true && !$.M.isOnLine()){
							options.error(XMLHttpRequest, null, null);
						} else if ($.M.isAndroid == false && $.M.isIos == true && $.M.bridge) {
							$.M.bridge.callHandler('isOnline', {}, function(response) {
								if (response == "1") {
									$.M.getOnLine(options);
								} else {
									options.error(XMLHttpRequest, null, null);
								}
							});
						} else {
							$.M.getOnLine(options);
						}
					},
					getOnLine : function(options) {
						options = $.extend({
							method : '',
							url : '',
							params : {},
							dataType : 'text',
							success : function(data) {

							},
							error : function(XMLHttpRequest, textStatus,
									errorThrown) {

							}
						}, options);
						var that = this;
						$.ajax({
							url : that.baseUrl + options.method,
							type : 'get',
							dataType : options.dataType,
							data : $.extend({
								'dateTime' : new Date().getTime()
							}, options.params),
							success : function(data) {
								try {
									data = eval('(' + data + ')');
									options.success(data);
								} catch (e) {
								}
							},
							error : function(XMLHttpRequest, textStatus,
									errorThrown) {
								if (options.isTip == undefined
										|| options.isTip == null
										|| options.isTip != false) {
								}
								options.error(XMLHttpRequest, textStatus,
										errorThrown);
							}
						});
					},
					language : function() {
						var val = "0";
						if (window.localStorage.getItem('language') == undefined) {
						} else {
							val = window.localStorage.getItem('language');
						}
						return val;
					},
					isOnLine : function() {
						/*if ($.M.openSyncDraft == false) {
							return true;
						}
						if ($.M.isAndroid == true && $.M.isIos == false && typeof(webview) != "undefined" && webview) {
							return webview.checkNetwork();
						} else if ($.M.isAndroid == true && $.M.isIos == false && typeof(detailWv) != "undefined" && detailWv) {
							return detailWv.checkNetwork();
						} else {
							return true;
						}*/
						return true;
					},
					iosRefreshHtml : function(htmlPath) {
						window.localStorage.setItem("iosRefreshHtml", htmlPath);
						window.location.href = "goto.html";
						//$.M.bridge.callHandler('closeDetailPageAndRedirect', {'url' : 'www/' + htmlPath}, function(response) {});
					}
				}
			});
})($);

(function() {
	var jUserAgent = navigator.userAgent.toLowerCase();
	var jIsIphoneOs = jUserAgent.match(/iphone os/i) == "iphone os", jIsIpad = jUserAgent
			.match(/ipad/i) == "ipad", jIsAndroid = jUserAgent
			.match(/android/i) == "android";
	if (jIsAndroid) {
		$.M.isAndroid = true;
		$.M.isIos = false;
		$.M.clientType = "android";
		$.M.last_click_time = new Date().getTime();
		document.addEventListener('click',
				function(e) {
					$.M.click_time = e['timeStamp'];
					if ($.M.click_time
							&& ($.M.click_time - $.M.last_click_time) < 500) {
						try {
							e.stopImmediatePropagation();
						} catch (e) {
						}
						try {
							e.preventDefault();
						} catch (e) {
						}
						return false;
					}
					$.M.last_click_time = $.M.click_time;
				}, true);
	} else if (jIsIphoneOs || jIsIpad) {
		$.M.isAndroid = false;
		$.M.isIos = true;
		$.M.clientType = "ios";
		if ($.M.openIosSyncDraft == true) {
			var onBridgeReady = function(event) {
				$.M.bridge = event.bridge;
				$.M.bridge.init(function(message, responseCallback) {
					var data = {
						'Javascript Responds' : 'Wee!'
					};
					if (responseCallback) {
						responseCallback(data);
					}
				});
			};
			document.addEventListener('WebViewJavascriptBridgeReady', onBridgeReady, false);
		}
	} else {
		$.M.isAndroid = false;
		$.M.isIos = false;
		$.M.clientType = "other";
	}
})();