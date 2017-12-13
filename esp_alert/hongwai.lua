--modify DEVICEID1 INPUTID APIKEY DEVICEID2

print(status, wifi.sta.getip())
local DEVICE_NAME = "hongwai_1"
local pin = 5
local host = host or "192.168.2.166"
local port = port or 8888
local mytimer = tmr.create()
local value = gpio.LOW;

mytimer:register(1000, tmr.ALARM_SEMI, function() 
print("hey there")
cu:connect(8888,"192.168.2.166") end)

gpio.mode(5,gpio.INT)
cu=net.createConnection(net.TCP, 0)
--receive message from bigiot
cu:on("connection", function(sck, c) 
    print("connection");
    print(c)

    tmr.alarm(2, 5000, 1, function() 
        ok, json = pcall(sjson.encode, {device=DEVICE_NAME,type="heartbeat",V=value})
        if ok then
            print(json)
        else
            print("failed to encode!")
        end
        cu:send(json.."\n")
        end)
end )

cu:on("disconnection", function(sck, c)
    print("disconnection");
    print(c)
    mytimer:start();
end)


cu:on("receive", function(cu, c) 
    print("receive")
    print(c)
end)
local function sendmessage(level, pulse2)
	if level == gpio.HIGH then
        value = gpio.HIGH;
	else
        value = gpio.LOW;
	end
 
    ok, json = pcall(sjson.encode, {device=DEVICE_NAME,type="update",V=value})
    if ok then
        print(json)
    else
        print("failed to encode!")
    end
    cu:send( json.."\n") 
end

gpio.trig(pin, "both", sendmessage)
mytimer:start()