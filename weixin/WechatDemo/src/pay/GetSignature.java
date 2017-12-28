package pay;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Formatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.ServletException;  
import javax.servlet.http.HttpServlet;  
import javax.servlet.http.HttpServletRequest;  
import javax.servlet.http.HttpServletResponse;  
  
import service.CoreService;  

import demo.process.WechatProcess;  
  
/** 
 * 核心请求处理类 
 *  
 * @author liufeng 
 * @date 2013-05-18 
 */  
public class GetSignature extends HttpServlet {  
    private static final long serialVersionUID = 4440739483644821986L;
    public Map<String,String> MachineMap;

	public  String getHash(String source, String hashType) {
	    StringBuilder sb = new StringBuilder();
	    MessageDigest md5;
	    try {
	        md5 = MessageDigest.getInstance(hashType);
	        md5.update(source.getBytes());
	        for (byte b : md5.digest()) {
	            sb.append(String.format("%02x", b));
	        }
	        return sb.toString();
	    } catch (NoSuchAlgorithmException e) {
	        e.printStackTrace();
	    }
	    return null;
	}
	

	/**
	 * The doGet method of the servlet. <br>
	 * 
	 * This method is called when a form has its tag value method equals to get.
	 * 
	 * @param request
	 *            the request send by the client to the server
	 * @param response
	 *            the response send by the server to the client
	 * @throws ServletException
	 *             if an error occurred
	 * @throws IOException
	 *             if an error occurred
	 */
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");

        System.out.println("doGet");
        
        // 微信加密签名  
        String paymoney = request.getParameter("PayMoney");  

    	String machineNumber = request.getParameter("MachineNumber"); 
        System.out.println("paymoney:" + paymoney);
        System.out.println("machineNumber:" + machineNumber);
    	String respContent = "";
    	if(machineNumber.length() == 8 && 
    			(machineNumber.charAt(0) == 'E' || machineNumber.charAt(0) == 'B')
    			)
    	{
            respContent = "payok";
    	}
    	else
    	{
            respContent = "payfail";
    	}
        System.out.println("respContent:" + respContent);
        // 响应消息  
        PrintWriter out = response.getWriter();  
        out.print(respContent);  
        out.close();  
	}

  
    /** 
     * 处理微信服务器发来的消息 
     */  
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {  
        // 将请求、响应的编码均设置为UTF-8（防止中文乱码）  
        request.setCharacterEncoding("UTF-8");  
        response.setCharacterEncoding("UTF-8");  
  
        // 调用核心业务类接收消息、处理消息  
        String respMessage = CoreService.processRequest(request);  
          
        // 响应消息  
        PrintWriter out = response.getWriter();  
        out.print(respMessage);  
        out.close();  
    }  
    
    public static void getSign() {
        String jsapi_ticket = "sM4AOVdWfPE4DxkXGEs8VBxyNxYutmsz6X-EUIKfIsfMGuB1sm1dLcktsIBDfgdOEpBvelRh5_bHyQZjAEEWqQ";

        // 注意 URL 一定要动态获取，不能 hardcode
        String url = "http://wx.zhimoo.com/WechatDemo/wxpay.jsp";
        Map<String, String> ret = sign(jsapi_ticket, url);
        for (Map.Entry entry : ret.entrySet()) {
            System.out.println(entry.getKey() + ", " + entry.getValue());
        }
    };

    public static Map<String, String> sign(String jsapi_ticket, String url) {
        Map<String, String> ret = new HashMap<String, String>();
        String nonce_str = create_nonce_str();
        String timestamp = create_timestamp();
        String string1;
        String signature = "";

        //注意这里参数名必须全部小写，且必须有序
        string1 = "jsapi_ticket=" + jsapi_ticket +
                  "&noncestr=" + nonce_str +
                  "&timestamp=" + timestamp +
                  "&url=" + url;
        System.out.println(string1);

        try
        {
            MessageDigest crypt = MessageDigest.getInstance("SHA-1");
            crypt.reset();
            crypt.update(string1.getBytes("UTF-8"));
            signature = byteToHex(crypt.digest());
        }
        catch (NoSuchAlgorithmException e)
        {
            e.printStackTrace();
        }
        catch (UnsupportedEncodingException e)
        {
            e.printStackTrace();
        }

        ret.put("url", url);
        ret.put("jsapi_ticket", jsapi_ticket);
        ret.put("nonceStr", nonce_str);
        ret.put("timestamp", timestamp);
        ret.put("signature", signature);

        return ret;
    }

    private static String byteToHex(final byte[] hash) {
        Formatter formatter = new Formatter();
        for (byte b : hash)
        {
            formatter.format("%02x", b);
        }
        String result = formatter.toString();
        formatter.close();
        return result;
    }

    private static String create_nonce_str() {
        return UUID.randomUUID().toString();
    }

    private static String create_timestamp() {
        return Long.toString(System.currentTimeMillis() / 1000);
    }
  
}  