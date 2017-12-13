#ifndef WIDGET_H
#define WIDGET_H

#include <QWidget>
#include <QWebView>
#include <QNetworkReply>
#include <QThread>
#include <QSqlDatabase>
#include <QTimer>
#include <QSerialPort>
#include "json/json.h"

namespace Ui {
class Widget;
class WebPinTu;
}
class CellInfo
{
public:
    unsigned short CellId;
    unsigned short LAC;
    QString lat;
    QString lon;
    bool isInRequest;
    bool isFinished;
    bool isInvalid;

    CellInfo(){CellId = 0;LAC=0;isInRequest = false;}
};
class MyThread:public QThread
{
    Q_OBJECT



    // QThread interface
protected:
    void run();
public:



    int ReciveJson(Json::Value &value);
    int SendJson(Json::Value &value);
    QTcpSocket *client;
    QSqlDatabase db;

    void OpenDatabase();
    void RequestCellInfo(QString LAC, QString CellId);
public slots:
    void on_PostFinished(QNetworkReply *reply);
};

class JsonReply :public QNetworkReply
{
    Q_OBJECT
    QString LAC;
    QString CellId;
    QString lat;
    QString lon;
};
class WebPinTu :public QWebView
{
    Q_OBJECT

public slots:

    void on_loadFinished(bool ok);
};
class Widget : public QWidget
{
    Q_OBJECT

public:
    explicit Widget(QWidget *parent = 0);
    ~Widget();


private slots:
    void on_pushButton_clicked();
    void on_PostFinished(QNetworkReply*);

    void on_pushButton_2_clicked();

    void on_pushButton_3_clicked();

    void on_pushButton_connect_clicked();

    void on_pushButton_close_clicked();

private:
    Ui::Widget *ui;
public:


    QTimer *m_timer;
    QTimer *m_TimerJiDianQi;
    QTimer *m_TimerRfidReader;
    CellInfo *m_cell;
    void RequestCellInfo(QString LAC, QString CellId);
public:
 QSerialPort serial;//串口实例
 void initSeialPort();//初始化串口函数
 void write(QTcpSocket *tcpSocket, const char *str);
private slots://必须加slots
    void serialRead();

    void on_comboBox_currentIndexChanged(const QString &arg1);

    void on_checkBox_clicked(bool checked);

    void on_checkBox_2_clicked(bool checked);

    void on_checkBox_2_stateChanged(int arg1);

public slots:
    void on_timer();
    void on_TimerJiDianQi();
    void on_TimerRfidReader();
    void processNewConnection();
    void processReadyRead();
};

#endif // WIDGET_H
