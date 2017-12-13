--init.lua web config
print('Setting up WIFI...')
wifi.setmode(wifi.STATION)
station_cfg={}
station_cfg.ssid="wei"
station_cfg.pwd="2358@guowei"
station_cfg.auto=true
station_cfg.save=true
wifi.sta.config(station_cfg)

local count = 0;

tmr.alarm(1, 1000, tmr.ALARM_AUTO, function()
    if wifi.sta.getip() == nil then
        print('Waiting for IP ...')
        count = count + 1;
        if(count == 5) then
            node.restart()
        end
    else
        print('IP is ' .. wifi.sta.getip())
    tmr.stop(1)
    end
end)

status = nil

wifi.eventmon.register(wifi.eventmon.STA_GOT_IP, function(T)
 print("\n\tSTA - GOT IP".."\n\tStation IP: "..T.IP.."\n\tSubnet mask: "..
 T.netmask.."\n\tGateway IP: "..T.gateway)
 --dofile("jidianqi.lua")
 dofile("hongwai.lua")
 end)

 wifi.eventmon.register(wifi.eventmon.STA_DISCONNECTED, function(T)
 print("\n\tSTA - DISCONNECTED".."\n\tSSID: "..T.SSID.."\n\tBSSID: "..
 T.BSSID.."\n\treason: "..T.reason)
 end)

