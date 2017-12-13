#include<QtCore/QCoreApplication>
#include<iostream>
#include<QDebug>
#include<QObject>
#include<QtCore>
#include<QTcpSocket>
#include<QTcpServer>
#include<QDebug>
#include<server.h>
#include<stdio.h>
#include <QThread>

/*
class MyThread: public QThread
{
	Q_OBJECT
public:
	MyThread(){};
	~MyThread(){};
public:
	void run()
	{
		qDebug()<<"run";
	while(1)
	{
		msleep(200);
	}
	}

};
*/

int main(int argc, char *argv[])
{

	qDebug()<<"0";
	QCoreApplication a(argc,argv);
	qDebug()<<"1";
	MyServer *server = new MyServer();
	server->init();
	return a.exec();
}

