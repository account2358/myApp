package com.xinfu.wechat.pay.util;

import java.io.IOException;
import java.util.Properties;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.support.PropertiesLoaderUtils;

public class SystemConfig {
	
private static Properties properties = null;
	
	static{
		try {
			properties = PropertiesLoaderUtils.loadProperties(new ClassPathResource("systemConfig.properties"));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * 获取收费比例
	 * @return
	 */
	public static String getRateKey(){
		return properties.getProperty("rate");
	}	

}
