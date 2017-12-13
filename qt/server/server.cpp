#include<server.h>
#include<stdio.h>

void MyServer::serverNewConnect()
{
	printf("new connect");
	socket = server->nextPendingConnection();
} 
void MyServer::init()
{
	printf("init");
	server = new QTcpServer();
	server->listen(QHostAddress::Any,PORT);
	QObject::connect(server,&QTcpServer::newConnection,this,&MyServer::serverNewConnect);
}

