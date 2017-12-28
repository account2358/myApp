package pay;
import java.util.UUID;
import java.util.Map;
import java.util.HashMap;
import java.util.Formatter;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.io.UnsupportedEncodingException;  

class SignWxConfig {
    public static void main(String[] args) {
        String jsapi_ticket = "sM4AOVdWfPE4DxkXGEs8VBxyNxYutmsz6X-EUIKfIsdw5IfNb7flAYFG7Hzgd7ZCSy9g7QsZM-qXpIMPnbL1Kw";
        // 注意 URL 一定要动态获取，不能 hardcode
        //String url = "http://wx.zhimoo.com/WechatDemo/wxpay.jsp";
        String url = "http://wx.zhimoo.com/WechatDemo/pay.html";
        Map<String, String> ret = sign(jsapi_ticket, url);
        for (Map.Entry entry : ret.entrySet()) {
            System.out.println(entry.getKey() + ", " + entry.getValue());
        }

//         ret = signMd5(jsapi_ticket, url);
//        for (Map.Entry entry : ret.entrySet()) {
//            System.out.println(entry.getKey() + ", " + entry.getValue());
//        }
        //appId, timeStamp, nonceStr, package, signType。
    };
    public static String getSign(String jsapi_ticket,String url) {
        //String jsapi_ticket = "sM4AOVdWfPE4DxkXGEs8VBxyNxYutmsz6X-EUIKfIsdw5IfNb7flAYFG7Hzgd7ZCSy9g7QsZM-qXpIMPnbL1Kw";
        // 注意 URL 一定要动态获取，不能 hardcode
        //String url = "http://wx.zhimoo.com/WechatDemo/wxpay.jsp";
        //String url = "http://wx.zhimoo.com/WechatDemo/pay.html";
        Map<String, String> ret = sign(jsapi_ticket, url);
        String retStr = new String();
        for (Map.Entry entry : ret.entrySet()) {
            System.out.println(entry.getKey() + ", " + entry.getValue());
            retStr += entry.getKey() + ", " + entry.getValue();
            
        }
        return retStr;
//         ret = signMd5(jsapi_ticket, url);
//        for (Map.Entry entry : ret.entrySet()) {
//            System.out.println(entry.getKey() + ", " + entry.getValue());
//        }
        //appId, timeStamp, nonceStr, package, signType。
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


    public static Map<String, String> signMd5(String jsapi_ticket, String url) {
        Map<String, String> ret = new HashMap<String, String>();
        String nonce_str = create_nonce_str();
        String timestamp = create_timestamp();
        String string1;
        String signature = "";

        //appId, timeStamp, nonceStr, package, signType。
        String prepay_id = "prepay_id=wx201712272349177aaedb32190868881333";
        //注意这里参数名必须全部小写，且必须有序
        String paySign= "appId=&nonceStr=&package=&signType=&timeStamp=&key=";  
        //paySign=md5(paySign).toUpperCase(); 
        string1 = "appId=wx087f671c8d3d42b4" +
                "&noncestr=" + nonce_str +
                "&package=" + prepay_id +
                "&signType=MD5"+
                  "&timestamp=" + timestamp +
                  "&key=23581321235813212358132123581321";
        System.out.println(string1);

        try
        {
            MessageDigest crypt = MessageDigest.getInstance("MD5");
            crypt.reset();
            crypt.update(string1.getBytes("UTF-8"));
            signature = byteToHex(crypt.digest());
            signature = signature.toUpperCase();
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
        ret.put("prepay_id", prepay_id);
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
