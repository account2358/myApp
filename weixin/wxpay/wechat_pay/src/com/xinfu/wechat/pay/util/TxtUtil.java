package com.xinfu.wechat.pay.util;

import java.io.File;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

/**
 * 操作txt工具类
 * @author Jeff Xu
 * @since 2016-08-11
 */
public class TxtUtil {
	
	/**
	 * 将数据写入到相关的文件地址里面
	 * @param dataSet
	 * @param file
	 */
	public static void writeToTxt(String content,String fileUrl){
		
		try {
            // 打开一个随机访问文件流，按读写方式
            RandomAccessFile randomFile = new RandomAccessFile(fileUrl, "rw");
            // 文件长度，字节数
            long fileLength = randomFile.length();
            //将写文件指针移到文件尾。
            randomFile.seek(fileLength);
            if(StringUtils.isNotBlank(content)){
            	String s = "";
            	s = content+"\r\n";
            	randomFile.writeBytes(s);
            }
           
            randomFile.close();
        } catch (IOException e) {
            e.printStackTrace();
        }finally{
        	
        }
    }

	/**
	 * 将数据写入到相关的文件地址里面
	 * @param dataSet
	 * @param file
	 */
	public static void writeToTxt(Map dataMap,String fileUrl){
		
		try {
            // 打开一个随机访问文件流，按读写方式
            RandomAccessFile randomFile = new RandomAccessFile(fileUrl, "rw");
            // 文件长度，字节数
            long fileLength = randomFile.length();
            //将写文件指针移到文件尾。
            randomFile.seek(fileLength);
            if(dataMap != null && dataMap.size() > 0){
            	String s = "";
            	String orderId = (String)dataMap.get("orderId");
            	s = orderId+"\r\n";
            	randomFile.writeBytes(s);
            }
           
            randomFile.close();
        } catch (IOException e) {
            e.printStackTrace();
        }finally{
        	
        }
    }
	
	public static void main(String[] args){
		String fileUrl = System.getProperty("user.dir") + File.separator+"WebContent" + File.separator + "data" + File.separator + "order.txt";
		Map map = new HashMap();
		map.put("orderId", "20160514");
		writeToTxt(map,fileUrl);
	}
	
}
