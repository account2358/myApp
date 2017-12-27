package servlet;


import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

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
public class PayMoney extends HttpServlet {  
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
    	String ip = getRemoteAddress(request);  
        System.out.println("ip:" + ip);  
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
    
    public String getRemoteAddress(HttpServletRequest request) {  
        String ip = request.getHeader("x-forwarded-for");  
        if (ip == null || ip.length() == 0 || ip.equalsIgnoreCase("unknown")) {  
            ip = request.getHeader("Proxy-Client-IP");  
        }  
        if (ip == null || ip.length() == 0 || ip.equalsIgnoreCase("unknown")) {  
            ip = request.getHeader("WL-Proxy-Client-IP");  
        }  
        if (ip == null || ip.length() == 0 || ip.equalsIgnoreCase("unknown")) {  
            ip = request.getRemoteAddr();  
        }  
        return ip;  
    } 
  
}  