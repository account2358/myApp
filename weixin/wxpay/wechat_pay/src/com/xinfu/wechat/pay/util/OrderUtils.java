package com.xinfu.wechat.pay.util;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * 订单工具类
 * @author JeffXu
 * @since 2016-08-11
 */
public class OrderUtils {
	
	public static String genOrderNo(){
		String orderNo = "xf";
		SimpleDateFormat sdf=new SimpleDateFormat("yyyyMMddhhmmssSSS");
		String nowTime = sdf.format(new Date());
		orderNo+=nowTime;
		return orderNo;
	}

}
