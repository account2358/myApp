#include<iostream>
#include<QCoreApplication>
#include<QObject>
#include<QtCore>
#include<QTcpSocket>
#include<QTcpServer>
#include<QDebug>


#define PORT 8888


class MyServer:public QObject
{
	Q_OBJECT
	public:
	MyServer(){};
	~MyServer(){};

	QTcpServer *server;
	QTcpSocket *socket;

	public slots:

	void serverNewConnect();

	public :

	void init();

};

