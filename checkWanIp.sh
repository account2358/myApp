#!/bin/bash
#wget http://ipecho.net/plain -O - -q > /tmp/wan_ip
WAN_IP_NEW=`wget http://ipecho.net/plain -O - -q`
WAN_IP_OLD=`cat /tmp/wan_ip`
#echo "old is $WAN_IP_OLD"
#echo "new is $WAN_IP_NEW"
if [ "$WAN_IP_NEW" != "$WAN_IP_OLD" ]
then
	cd /home/pi/code/myApp/
#	echo "not equal"

	echo $WAN_IP_NEW > /tmp/wan_ip
	cp -rf /tmp/wan_ip ./
	echo `date` >> test
	echo $WAN_IP_NEW >> test
	zip --password 2358@guo test.zip ./* -r
	git add test.zip
	git commit -m "new test"
	git push 
fi
	


