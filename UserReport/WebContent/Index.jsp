<%@ page language="java" contentType="text/html;  charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html;  charset=UTF-8">
<title>用户评分系统</title>
</head>
<body>
<%
    out.println("Hello World!");
%>
<form action="HelloServlet" method="POST" target="_blank">
<input type="checkbox" name="runoob" checked="checked" /> 菜鸟教程
<input type="checkbox" name="google"  /> Google
<input type="checkbox" name="taobao" checked="checked" /> 淘宝
<input type="submit" value="选择站点" />
</form>
</body>
</html>