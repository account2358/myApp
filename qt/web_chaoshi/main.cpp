#include "widget.h"
#include <QApplication>
#include <QNetworkProxy>
#include <QWebView>
#include <qDebug>
#include "json/json.h"
MyThread *g_Thread;
Widget *g_w;
int main(int argc, char *argv[])
{
    QApplication a(argc, argv);

    QList<QNetworkProxy> listOfProxies = QNetworkProxyFactory::systemProxyForQuery();
    foreach ( QNetworkProxy loopItem, listOfProxies ) {
        qDebug() << "proxyUsed:" << loopItem.hostName();
    }


    QNetworkProxy proxy;
    proxy.setType(QNetworkProxy::HttpProxy);
    proxy.setHostName("child-prc.intel.com");
    proxy.setPort(913);
    //proxy.setUser("username");
    //proxy.setPassword("password");
    //QNetworkProxy::setApplicationProxy(proxy);

    /*
    WebPinTu web;
    QObject::connect(&web, SIGNAL(loadFinished(bool)),
                                  &web,  SLOT(on_loadFinished(bool)));
    web.load(QUrl("http://game.guanggaotongapp.cn/"));
    //web.load(QUrl("http://www.google.com"));
    web.resize(1300,1000);
    QSize size = web.sizeHint();
    qDebug()<<size;
    web.show();
*/
    g_Thread = new MyThread;
    g_Thread->start();
    g_w = new Widget();
    g_w->show();
    return a.exec();
}
