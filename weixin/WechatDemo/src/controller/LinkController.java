package controller;

import java.io.PrintWriter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
/*
import msun.wechat.util.CheckLink;
import msun.wechat.util.CoreMessage;
import msun.wechat.util.MenuUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
*/
public class LinkController {
	/**
	 * 创建菜单
	 * */
	public void createMenu(){
		int status = 0;
		//= MenuUtil.createMenu(MenuUtil.getMenu());
		if(status==0){
			System.out.println("菜单创建成功！");
		}else{
			System.out.println("菜单创建失败！");
		}
	}
	
}
