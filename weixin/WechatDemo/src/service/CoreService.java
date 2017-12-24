package service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;  
import javax.servlet.http.HttpServletRequest;

import demo.process.TulingApiProcess;
import demo.process.WechatProcess;
import message.resp.*;  
import util.MessageUtil;  
  
/** 
 * 核心服务类 
 *  
 * @author liufeng 
 * @date 2013-05-20 
 */  
public class CoreService {  
	public static Map<String,String> m_machineMap;
	
	public CoreService()
	{
		if(CoreService.m_machineMap == null)
			CoreService.m_machineMap = new HashMap<String, String>();
	}
    /** 
     * 处理微信发来的请求 
     *  
     * @param request 
     * @return 
     */  
    public static String processRequest(HttpServletRequest request) {  
        String respMessage = null;  
        try {  
            // 默认返回的文本消息内容  
            String respContent = "请求处理异常，请稍候尝试！";

    		if(CoreService.m_machineMap == null)
    		{
    			System.out.println("new m_machineMap");
    			CoreService.m_machineMap = new HashMap<String, String>();
    		}
  
            // xml请求解析  
            Map<String, String> requestMap = MessageUtil.parseXml(request);  
  
            System.out.println(requestMap);
            // 发送方帐号（open_id）  
            String fromUserName = requestMap.get("FromUserName");  
            // 公众帐号  
            String toUserName = requestMap.get("ToUserName");  
            // 消息类型  
            String msgType = requestMap.get("MsgType");  
  
            // 回复文本消息  
            TextMessage textMessage = new TextMessage();  
            textMessage.setToUserName(fromUserName);  
            textMessage.setFromUserName(toUserName);  
            textMessage.setCreateTime(new Date().getTime());  
            textMessage.setMsgType(MessageUtil.RESP_MESSAGE_TYPE_TEXT);  
            textMessage.setFuncFlag(0);  
  
            // 文本消息  
            if (msgType.equals(MessageUtil.REQ_MESSAGE_TYPE_TEXT)) {
            	String Content = requestMap.get("Content");  
                System.out.println("recive text message!");;  
                System.out.println("Content:" + Content);;  
                if(Content.length() > 0)
                {
                	respContent = new TulingApiProcess().getTulingResult(Content);
                }
                //respContent = "您发送的是文本消息！\n";
                //respContent += " <a href=\"http://blog.csdn.net/lyq8479\">柳峰的博客</a> ";
                //respContent = new WechatProcess().processWechatMag(xml);
            }  
            // 图片消息  
            else if (msgType.equals(MessageUtil.REQ_MESSAGE_TYPE_IMAGE)) {  
                respContent = "您发送的是图片消息！";  
            }  
            // 地理位置消息  
            else if (msgType.equals(MessageUtil.REQ_MESSAGE_TYPE_LOCATION)) {  
                respContent = "您发送的是地理位置消息！";  
            }  
            // 链接消息  
            else if (msgType.equals(MessageUtil.REQ_MESSAGE_TYPE_LINK)) {  
                respContent = "您发送的是链接消息！";  
            }  
            // 音频消息  
            else if (msgType.equals(MessageUtil.REQ_MESSAGE_TYPE_VOICE)) {  
                respContent = "您发送的是音频消息！";  
            }  
            // 事件推送  
            else if (msgType.equals(MessageUtil.REQ_MESSAGE_TYPE_EVENT)) {  
                // 事件类型  
                String eventType = requestMap.get("Event");  
                // 订阅  
                if (eventType.equals(MessageUtil.EVENT_TYPE_SUBSCRIBE)) {  
                    respContent = "谢谢您的关注！\n如需充值，请先绑定!\n机器管理-扫描绑定\n";  
                }  
                // 取消订阅  
                else if (eventType.equals(MessageUtil.EVENT_TYPE_UNSUBSCRIBE)) {  
                    // TODO 取消订阅后用户再收不到公众号发送的消息，因此不需要回复消息  
                }   
                // 扫描带提示
                else if (eventType.equals(MessageUtil.EVENT_TYPE_SCANCODE_WAITMSG)) {  
                    // TODO 取消订阅后用户再收不到公众号发送的消息，因此不需要回复消息 
                    String eventKey = requestMap.get("EventKey");
                    if(eventKey.equals("bangding"))
                    {
                    	String ScanType = requestMap.get("ScanType");
                    	String ScanResult = requestMap.get("ScanResult");
                    	if(ScanResult.length() == 8 && 
                    			(ScanResult.charAt(0) == 'E' || ScanResult.charAt(0) == 'B')
                    			)
                    	{
                    		String number = ScanResult.substring(1);
                            System.out.println("number: "+ number);
                        	int numberDec = Integer.parseInt(number);
                            System.out.println("numberDec: "+ numberDec);
                            CoreService.m_machineMap.put(ScanResult, fromUserName);
                            respContent = "绑定成功:机器号" + ScanResult + "\n";
                    	}
                    	else
                    	{
                            respContent = "无效机器号" + ScanResult + "\n";
                    	}
                        System.out.println("ScanType: "+ ScanType);
                        System.out.println("MachineNumber: "+ ScanResult);
                        System.out.println("m_machineMap: "+ CoreService.m_machineMap);
                    }
                    System.out.println("eventKey: "+eventKey);
                }  
                // 自定义菜单点击事件  
                else if (eventType.equals(MessageUtil.EVENT_TYPE_CLICK)) {  
                    // TODO 自定义菜单权没有开放，暂不处理该类消息  
                	 // 事件KEY值，与创建自定义菜单时指定的KEY值对应  
                    String eventKey = requestMap.get("EventKey");  
                    System.out.println("eventKey: "+eventKey);
                    if (eventKey.equals("11")) {  
                        respContent = "天气预报菜单项被点击！";  
                    } else if (eventKey.equals("12")) {  
                        respContent = "公交查询菜单项被点击！";  
                    } else if (eventKey.equals("13")) {  
                        respContent = "周边搜索菜单项被点击！";  
                    } else if (eventKey.equals("14")) {  
                        respContent = "历史上的今天菜单项被点击！";  
                    } else if (eventKey.equals("21")) {  
                        respContent = "歌曲点播菜单项被点击！";  
                    } else if (eventKey.equals("22")) {  
                        respContent = "经典游戏菜单项被点击！";  
                    } else if (eventKey.equals("23")) {  
                        respContent = "美女电台菜单项被点击！";  
                    } else if (eventKey.equals("24")) {  
                        respContent = "人脸识别菜单项被点击！";  
                    } else if (eventKey.equals("25")) {  
                        respContent = "聊天唠嗑菜单项被点击！";  
                    } else if (eventKey.equals("31")) {  
                        respContent = "Q友圈菜单项被点击！";  
                    } else if (eventKey.equals("32")) {  
                        respContent = "电影排行榜菜单项被点击！";  
                    } else if (eventKey.equals("33")) {  
                        respContent = "幽默笑话菜单项被点击！";  
                    }  
                }  
            }  
  
            textMessage.setContent(respContent);  
            respMessage = MessageUtil.textMessageToXml(textMessage);  
        } catch (Exception e) {  
            e.printStackTrace();  
        }  
  
        return respMessage;  
    }  
}  