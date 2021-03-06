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
public class CoreServlet extends HttpServlet {  
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
        String signature = request.getParameter("signature");  
        // 时间戳  
        String timestamp = request.getParameter("timestamp");  
        // 随机数  
        String nonce = request.getParameter("nonce");  
        // 随机字符串  
        String echostr = request.getParameter("echostr");
        
		/*
	    String timestamp =  request.getParameter("timestamp");
	    String nonce =  request.getParameter("nonce");
	    String echostr =  request.getParameter("echostr");
	    String token = "2358"; // 这里填写自己的 token
	    List<String> list = new ArrayList<String>();
	    list.add(nonce);
	    list.add(token);
	    list.add(timestamp);
	    Collections.sort(list);
	    String hash = getHash(list.get(0)+list.get(1)+list.get(2), "SHA-1");
	    if(sig.equals(hash)){ // 验证下签名是否正确
	        response.getWriter().println(echostr);
	    }else{
	        response.getWriter().println("sig not match");
	    }
	    */ 
		/** 读取接收到的xml消息 */
		StringBuffer sb = new StringBuffer();
		InputStream is = request.getInputStream();
		InputStreamReader isr = new InputStreamReader(is, "UTF-8");
		BufferedReader br = new BufferedReader(isr);
		String s = "";
		while ((s = br.readLine()) != null) {
			sb.append(s);
		}
		String xml = sb.toString();	//次即为接收到微信端发送过来的xml数据

		String result = "";
		/** 判断是否是微信接入激活验证，只有首次接入验证时才会收到echostr参数，此时需要把它直接返回 */
		echostr = request.getParameter("echostr");

	    String token = "2358"; // 这里填写自己的 token
	    List<String> list = new ArrayList<String>();
	    list.add(nonce);
	    list.add(token);
	    list.add(timestamp);
	    Collections.sort(list);
	    String hash = getHash(list.get(0)+list.get(1)+list.get(2), "SHA-1");
	    if(signature.equals(hash)){ // 验证下签名是否正确
			result = echostr;
		} else {
			//正常的微信处理流程
			result = new WechatProcess().processWechatMag(xml);
		}

		try {
			OutputStream os = response.getOutputStream();
			os.write(result.getBytes("UTF-8"));
			os.flush();
			os.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
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
  
}  