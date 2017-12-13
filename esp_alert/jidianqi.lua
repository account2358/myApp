--modify DEVICEID1 INPUTID APIKEY DEVICEID2

print(status, wifi.sta.getip())
local DEVICE_NAME = "jidianqi_1"
local HONGWAI = 5
local host = host or "192.168.2.166"
local port = port or 8888
local mytimer = tmr.create()
local value = gpio.LOW;

mytimer:register(1000, tmr.ALARM_SEMI, function() 
print("hey there")
cu:connect(8888,"192.168.2.166") end)

gpio.mode(5,gpio.OUTPUT)
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
	print(c)
	--do something here
	r = sjson.decode(c)
	if r.M == "jidianqi" then
		if r.V == "on" then
			--gpio.write(conf.LED, gpio.HIGH)
			--gpio.write(conf.BUZZER, gpio.HIGH)
            value = gpio.HIGH;
            gpio.write(HONGWAI,value);
			--ok, begin = pcall(cjson.encode, {M="say",ID=r.ID,C="Start monitoring"})
			--cu:send( begin.."\n" )

		end
		if r.V == "off" then
            value = gpio.LOW;
            gpio.write(HONGWAI,value);
			--ok, stoped = pcall(cjson.encode, {M="say",ID=r.ID,C="Stop monitoring"})
			--cu:send( stoped.."\n" )
		end
	end
end)
mytimer:start()



