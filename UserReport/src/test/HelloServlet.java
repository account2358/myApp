package test;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import sun.misc.IOUtils;


/**
 * Servlet implementation class HelloServlet
 */
@WebServlet("/HelloServlet")
public class HelloServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public HelloServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        System.out.println("doGet"); 
		String sig =  request.getParameter("signature");
		    String timestamp =  request.getParameter("timestamp");
		    String nonce =  request.getParameter("nonce");
		    String echostr =  request.getParameter("echostr");
		    String token = "dssjtgg2358"; // 这里填写自己的 token
		    List<String> list = new ArrayList<String>();
		    list.add(nonce);
		    list.add(token);
		    list.add(timestamp);
		    Collections.sort(list);
		    String hash = getHash(list.get(0)+list.get(1)+list.get(2), "SHA-1");
		    if(sig.equals(hash)){ // 验证下签名是否正确
		        response.getWriter().println(echostr);
		    }else{
		        response.getWriter().println("");
		    }
    }
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
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
        System.out.println("doPost"); // 消息的接收、处理、响应
        // 将请求、响应的编码均设置为UTF-8（防止中文乱码）
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");
        InputStream is= request.getInputStream(); 
        String contentStr=""; 
        StringBuffer out = new StringBuffer();
        byte[] b = new byte[4096];
        for (int n; (n = is.read(b)) != -1;) {
             out.append(new String(b, 0, n));
        }
        contentStr  = out.toString();
        System.out.println(contentStr);
       
		//doGet(request, response);
	}

}
