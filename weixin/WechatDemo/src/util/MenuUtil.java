package util;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

import entity.Button;
import entity.CommonButton;
import entity.ComplexButton;
import entity.Menu;
import entity.ViewButton;
import thread.TokenThread;
public class MenuUtil {
}
//import net.sf.json.JSONObject;
//
//public class MenuUtil {
//	/**
//	 * 	创建自定义菜单(每天限制1000次)
//	 * */
//	public static int createMenu(Menu menu){
//		String jsonMenu=JSONObject.fromObject(menu).toString();
//		
//		int status=0;
//		
//		//System.out.println("菜单："+jsonMenu);
//		String path="https://api.weixin.qq.com/cgi-bin/menu/create?access_token="+TokenThread.access_token.getAccess_token();
//		try {
//			URL url=new URL(path);
//			HttpURLConnection http = (HttpURLConnection)url.openConnection();
//			http.setDoOutput(true);
//			http.setDoInput(true);
//			http.setRequestMethod("POST");
//			http.setRequestProperty("Content-Type","application/x-www-form-urlencoded");
//			http.connect();
//			OutputStream os = http.getOutputStream();
//			os.write(jsonMenu.getBytes("UTF-8"));
//			os.close();
//			
//			InputStream is = http.getInputStream();
//			int size = is.available();
//			byte[] bt = new byte[size];
//			is.read(bt);
//			String message=new String(bt,"UTF-8");
//			JSONObject jsonMsg = JSONObject.fromObject(message);
//			status = Integer.parseInt(jsonMsg.getString("errcode"));
//		} catch (MalformedURLException e) {
//			e.printStackTrace();
//		} catch (IOException e) {
//			e.printStackTrace();
//		}
//		return status;
//	}
//	
//	
//	
//	/**
//	 * 		封装菜单数据
//	 * */
//	public static Menu getMenu(){
//		//预约挂号
//		String yygh="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx3e4a89adbc62b1e9&redirect_uri=http://www.jiaqiankun.site/imessage/wechat/event/yygh.html&response_type=code&scope=snsapi_base&state=0533_0001";
//		//我的挂号
//		String wdgh="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx3e4a89adbc62b1e9&redirect_uri=http://www.jiaqiankun.site/imessage/wechat/event/zyfy.html&response_type=code&scope=snsapi_base&state=0531_819";
//		//门诊缴费
//		String mzjf="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx3e4a89adbc62b1e9&redirect_uri=http://www.jiaqiankun.site/imessage/wechat/event/zyfy.html&response_type=code&scope=snsapi_base&state=0531_819";
//		//住院押金补缴
//		String zyyj="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx3e4a89adbc62b1e9&redirect_uri=http://www.jiaqiankun.site/imessage/wechat/event/zyfy.html&response_type=code&scope=snsapi_base&state=0531_819";
//		//我的报告
//		String wdbg="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx3e4a89adbc62b1e9&redirect_uri=http://www.jiaqiankun.site/imessage/wechat/event/wdbg.html&response_type=code&scope=snsapi_base&state=0531_819";
//		
//		CommonButton cb_1 = new CommonButton();
//		cb_1.setKey("yyjs");
//		cb_1.setName("医院介绍");
//		cb_1.setType("click");
//		CommonButton cb_2 = new CommonButton();
//		cb_2.setKey("jyzn");
//		cb_2.setName("就医指南");
//		cb_2.setType("click");
//		CommonButton cb_3 = new CommonButton();
//		cb_3.setKey("wgw");
//		cb_3.setName("微官网");
//		cb_3.setType("click");
//		ComplexButton cx_1 = new ComplexButton();
//		cx_1.setName("医院信息");
//		cx_1.setSub_button(new Button[]{cb_1,cb_2,cb_3});
//		
//		ViewButton vb = new ViewButton();
//		vb.setName("挂号");
//		vb.setType("view");
//		vb.setUrl(yygh);
//		ViewButton vb_1 = new ViewButton();
//		vb_1.setName("我的挂号");
//		vb_1.setType("view");
//		vb_1.setUrl(wdgh);
//		ViewButton vb_3 = new ViewButton();
//		vb_3.setName("门诊缴费");
//		vb_3.setType("view");
//		vb_3.setUrl(mzjf);
//		ViewButton vb_4 = new ViewButton();
//		vb_4.setName("住院押金补缴");
//		vb_4.setType("view");
//		vb_4.setUrl(zyyj);
//		ViewButton vb_2 = new ViewButton();
//		vb_2.setName("我的报告");
//		vb_2.setType("view");
//		vb_2.setUrl(wdbg);
//		/*
//			ViewButton vb_3 = new ViewButton();
//			vb_3.setName("支付测试");
//			vb_3.setType("view");
//			vb_3.setUrl(zfcs);
//		*/
//		ComplexButton cx_2 = new ComplexButton();
//		cx_2.setName("信息查询");
//		cx_2.setSub_button(new Button[]{vb,vb_1,vb_2,vb_3,vb_4});
//		
//		CommonButton cb_6 = new CommonButton();
//		cb_6.setKey("cjwt");
//		cb_6.setName("常见问题");
//		cb_6.setType("click");
//		CommonButton cb_7 = new CommonButton();
//		cb_7.setKey("myddc");
//		cb_7.setName("满意度调查");
//		cb_7.setType("click");
//		CommonButton cb_8 = new CommonButton();
//		cb_8.setKey("jyfk");
//		cb_8.setName("建议反馈");
//		cb_8.setType("click");
//		CommonButton cb_9 = new CommonButton();
//		cb_9.setKey("app");
//		cb_9.setName("APP下载");
//		cb_9.setType("click");
//		ComplexButton cx_3 = new ComplexButton();
//		cx_3.setName("服务");
//		cx_3.setSub_button(new Button[]{cb_6,cb_7,cb_8,cb_9});
//		
//		Menu menu=new Menu();
//		menu.setButton(new ComplexButton[]{cx_1,cx_2,cx_3});
//		
//		return menu;
//	}
//}
