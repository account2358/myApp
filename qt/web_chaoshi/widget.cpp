#include "widget.h"
#include "ui_widget.h"
#include <QJsonArray>
#include <QJsonDocument>
#include <QJsonObject>
#include <QNetworkProxy>
#include <QNetworkReply>
#include <QSqlDatabase>
#include <QSqlQuery>
#include <QSqlRecord>
#include <QWebFrame>
#include <QWebView>
#include <qDebug>
#include <QMutex>
#include <QSerialPort>
#include <QSettings>
#include <QSerialPortInfo>
#include <QTcpServer>
QMutex g_mutex;
QMutex g_mutex_request;
#include "json/json.h"
extern MyThread *g_Thread;
extern Widget *g_w;

QNetworkAccessManager *m_accessManager;
QList<QByteArray> g_data;
QByteArray g_bytearray;
int g_size = 0;
bool g_NextIsSize = false;
int g_index = 0;
enum Status
{
    STATUS_FLAG,
    STATUS_SIZE,
    STATUS_DATA
} g_status;
QMap<unsigned int,CellInfo *> g_map;
enum DATA_TYPE
{
    DATA_TYPE_NULL=0x8000,
    DATA_TYPE_JSON_REQ,
    DATA_TYPE_JSON_RSP
};
struct DataHead
{
    int type;
    int dataSize;
};

/*
获取JSON对象
*/
static Json::Value GetJsonObject(char* jsonstr)
{
    //std::string strValue;
    using namespace std;
    std::string strValue = jsonstr;
    Json::Reader reader;
    Json::Value root;
    if (reader.parse(strValue, root))  // reader将Json字符串解析到root，root将包含Json里所有子元素
    {
        //std::string upload_id = root["uploadid"].asString();  // 访问节点，upload_id = "UP000000"
        //int code = root["code"].asInt();    // 访问节点，code = 100
    }
    else{
        //LogUtils::i("get json object failed!", __LINE__, __FUNCTION__);
    }
    return root;
}
int MyThread::SendJson(Json::Value &value)
{
    qDebug("into");
    qint64  ret = 0;
    DataHead header;
    std::string strValue = value.toStyledString();
    header.type = DATA_TYPE_JSON_REQ;
    header.dataSize = strValue.size();
    ret = client->write((const char *)&header,sizeof(DataHead));
    if (ret <= 0)
    {
        qDebug("send failed.");
        return -1;
    }
    ret = client->write((const char *)strValue.c_str(), strValue.length());
    if (ret <= 0)
    {
        qDebug("SEND failed");
        return -1;
    }
    qDebug("send json is %s", strValue.c_str());
    qDebug("out");
    return 0;
};

int MyThread::ReciveJson(Json::Value &value)
{
    qDebug("into");
    qint64 ret = 0;
    DataHead header;
    ret = client->read((char *)&header, sizeof(DataHead));
    if (ret <= 0)
    {
        qDebug("recv failed");
        return -1;
    }
    if (header.dataSize <= 0 || header.type != DATA_TYPE_JSON_RSP)
    {
        qDebug("invalid data revice!\n");
        return -1;
    }
    //recive json data
    char *buffer = (char *)malloc(header.dataSize);
    memset(buffer, 0, header.dataSize);
    ret = client->read(buffer, header.dataSize);
    if (ret <= 0)
    {
        qDebug("ret <= 0");
        free(buffer);
        return -1;
    }
    Json::Value res = GetJsonObject(buffer);
    if (res.size() <= 0)
    {
        qDebug("GetJsonObject failed");
        free(buffer);
        return -1;

    }
    value = res;
    qDebug("recive json is %s", value.toStyledString().c_str());
    free(buffer);
    return 0;
}
//连接sqlserver数据库
void MyThread::OpenDatabase()
{
    db = QSqlDatabase::addDatabase("QODBC");
    db.setDatabaseName(QString("DRIVER={SQL SERVER};"
                               "SERVER=%1;" //服务器名称
                               "DATABASE=%2;"//数据库名
                               "UID=%3;"           //登录名
                               "PWD=%4;"        //密码
                               )
                       .arg("www.zhimoo.com")
                       .arg("ICATE")
                       .arg("sa")
                       .arg("redhat2021")
                       );
    if (!db.open())
    {
        qDebug()<<"connect sql server failed!";

    }
    else
    {
        qDebug()<<"connect sql server successfully!";
    }
}
QNetworkAccessManager accessManager;
void MyThread::RequestCellInfo(QString LAC,QString CellId)
{

    qDebug()<<__FUNCTION__;
    QNetworkRequest *request = new QNetworkRequest();
    QString url = "http://api.cellocation.com:81/cell/?mcc=460&mnc=0&lac=";
    url.append(LAC);
    url.append("&ci=");
    url.append(CellId);
    url.append("&output=json");
    qDebug()<<url;

    QNetworkReply* reply = accessManager.get(*request);
    return;
    reply->waitForReadyRead(10000);

    this->sleep(10);



    QByteArray bytes = reply->readAll();
    qDebug()<<bytes;
    QString string = QString::fromUtf8(bytes);
    Json::Reader reader;
    Json::Value root;
    reader.parse(string.toStdString(),root);
    FILE* fd = fopen("1.json","a");
    fprintf(fd,"%s",string.toStdString().c_str());
    fclose(fd);
    qDebug()<<root.toStyledString().c_str();

    if(root["lat"].isNull() == false && root["lon"].isNull() == false)
    {
        QString lat = root["lat"].asCString();
        QString lon = root["lon"].asCString();
        QString  lac = url.mid(url.indexOf("lac=")+4,url.indexOf("&ci=") - url.indexOf("lac=") -4);
        QString  CellId = url.mid(url.indexOf("&ci=")+4,url.indexOf("&output=") - url.indexOf("&ci=") -4);
        qDebug()<<url;
        qDebug()<<lat;
        qDebug()<<lon;
        qDebug()<<lac;
        qDebug()<<CellId;
    }

}
void MyThread::run()
{
    OpenDatabase();
    QObject::connect(&accessManager, SIGNAL(finished(QNetworkReply*)), this, SLOT(on_PostFinished(QNetworkReply*)));

    while(0)
    {

        if(g_mutex.tryLock(3000) == false)
        {
            qDebug()<<"get lock failed "<<__FUNCTION__;
            continue;
        };


        if (!db.open())
        {
            OpenDatabase();
            qDebug()<<"connect sql server failed!";
            if (!db.open())
            {
                qDebug()<<"sleep 3 s";
                this->sleep(3);
                continue;
            }
        }



        QMap<unsigned int,CellInfo*>::const_iterator it = g_map.constBegin();
        while(it != g_map.constEnd())
        {
            qDebug()<<it.key()<<"  "<<it.value();
            CellInfo *cell = it.value();
            if(cell->isFinished == true)
            {
                QSqlQuery query_insert(db);
                QString update;
                QTextStream(&update)<<"update AddressList set lat='"<<cell->lat
                                   <<"',lon = '"<<cell->lon
                                  <<"' , Status = 1 where LAC = "<<cell->LAC
                                 <<"and CellID = "<<cell->CellId<<" ;";
                qDebug()<<update;
                query_insert.exec(update);
            }
            it++;
        }
        g_map.clear();
        QSqlQuery query(db);
        query.exec("SELECT * FROM AddressList where STATUS = 0");
        QSqlRecord rec = query.record();
        int LAC_fieldNo = rec.indexOf("LAC");
        int CellId_fieldNo = rec.indexOf("CellID");
        while (query.next()) {
            QString LAC = query.value(LAC_fieldNo).toString();
            QString CellId = query.value(CellId_fieldNo).toString();
            qDebug()<<"LAC:"<<LAC<<"CellId:"<<CellId;


            CellInfo* cell = g_map[LAC.toInt() *65535 + CellId.toInt()];
            if(cell == NULL)
            {
                cell = new CellInfo;
                g_map[LAC.toInt() *65535 + CellId.toInt()] = cell;
                cell->LAC = LAC.toInt();
                cell->CellId = CellId.toInt();
                cell->isFinished = false;
                cell->isInRequest = false;
                cell->isInvalid = false;
            }
            //RequestCellInfo(LAC,CellId);
        }

        g_mutex.unlock();
        qDebug()<<"sleep 30 s";
        this->sleep(3);
    }
}

void MyThread::on_PostFinished(QNetworkReply *reply)
{
    if (reply->error() == QNetworkReply::NoError)
    {
        QString url = reply->url().toString();
        QByteArray bytes = reply->readAll();
        qDebug()<<bytes;
        QString string = QString::fromUtf8(bytes);
        Json::Reader reader;
        Json::Value root;
        reader.parse(string.toStdString(),root);
        FILE* fd = fopen("1.json","a");
        fprintf(fd,"%s",string.toStdString().c_str());
        fclose(fd);
        qDebug()<<root.toStyledString().c_str();

        if(root["lat"].isNull() == false && root["lon"].isNull() == false)
        {
            QString lat = root["lat"].asCString();
            QString lon = root["lon"].asCString();
            QString  lac = url.mid(url.indexOf("lac=")+4,url.indexOf("&ci=") - url.indexOf("lac=") -4);
            QString  CellId = url.mid(url.indexOf("&ci=")+4,url.indexOf("&output=") - url.indexOf("&ci=") -4);
            qDebug()<<url;
            qDebug()<<lat;
            qDebug()<<lon;
            qDebug()<<lac;
            qDebug()<<CellId;
        }
    }
    else
    {
        qDebug()<<"handle errors here";
        QVariant statusCodeV = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute);
        //statusCodeV是HTTP服务器的相应码，reply->error()是Qt定义的错误码，可以参考QT的文档
        qDebug( "found error ....code: %d %d\n", statusCodeV.toInt(), (int)reply->error());
        qDebug(qPrintable(reply->errorString()));
    }
    reply->deleteLater();
}
QTcpServer *tcpServer;
#define SERVER_PORT 8888
Widget::Widget(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::Widget)
{
    ui->setupUi(this);
    m_cell = NULL;
    m_accessManager = new QNetworkAccessManager(this);
    QObject::connect(m_accessManager, SIGNAL(finished(QNetworkReply*)), this, SLOT(on_PostFinished(QNetworkReply*)));
    this->initSeialPort();

    tcpServer = new QTcpServer();
    if(tcpServer->listen(QHostAddress::Any, SERVER_PORT)) {
        qDebug()<<"tcpServer init";
        connect(tcpServer, SIGNAL(newConnection()), this, SLOT(processNewConnection()));
    } else {
        qDebug()<<tcpServer->errorString();
    }


    m_TimerJiDianQi = new QTimer(this);
    connect(m_TimerJiDianQi, SIGNAL(timeout()), this, SLOT(on_TimerJiDianQi()));
    m_TimerRfidReader = new QTimer(this);
    connect(m_TimerRfidReader, SIGNAL(timeout()), this, SLOT(on_TimerRfidReader()));
}
int count = 0;
void Widget::processNewConnection() {
    qDebug()<<"processNewConnection";
    count ++;
    QTcpSocket* tcpSocket = tcpServer->nextPendingConnection();
    connect(tcpSocket, SIGNAL(readyRead()), this, SLOT(processReadyRead()));

    if(ui->checkBox->isChecked())
        write(tcpSocket,"{\"M\":\"jidianqi\",\"V\":\"on\"}");
    else
        write(tcpSocket,"{\"M\":\"jidianqi\",\"V\":\"off\"}");

   connect(tcpSocket, SIGNAL(disconnected()), this, SLOT(processDisconnected()));
}
void Widget::processReadyRead() {
    QByteArray rawreply= static_cast<QTcpSocket*>(sender())->readAll();
    char *data = new char[rawreply.size()];
    strcpy(data, rawreply.data());
    qDebug()<<"read : "<<rawreply.data();

    Json::Value v =  GetJsonObject(data);
    //qDebug()<<"json : "<<v.toStyledString().c_str();
    QString device = v["device"].asCString();
    //qDebug()<<"device :"<<device;
    if(device == "hongwai_1" && v["V"].asInt() == 1 )
    {
        ui->checkBox_2->setChecked(true);
    }
    else
    {
        ui->checkBox_2->setChecked(false);
    }
    delete [] data;

}
QTcpSocket*g_tcpSocket;
void Widget::write(QTcpSocket*tcpSocket,const char* str) {
   //QTcpSocket* tcpSocket = static_cast<QTcpSocket*>(sender());
   tcpSocket->open(QTcpSocket::ReadWrite);
   tcpSocket->write(str);
   tcpSocket->flush();
   g_tcpSocket = tcpSocket;
}
Widget::~Widget()
{
    delete ui;
}

void WebPinTu::on_loadFinished(bool ok)
{
    int width ;
    QWebFrame *mainFrame = this->page()->mainFrame();
    QSize size = mainFrame->contentsSize();
    qDebug()<<size;
    //this->resize(size);
}

void Widget::on_pushButton_clicked()
{
    //POST
        QNetworkRequest *request = new QNetworkRequest();
        request->setUrl(QUrl("http://localhost:8888/login"));
    //    request->setHeader(QNetworkRequest::ContentTypeHeader,"application/x-www-form-urlencoded");
    //    request->setRawHeader("Accept","text/html, application/xhtml+xml, */*");
    //    request->setRawHeader("Referer","http://localhost:8888/login");
    //    request->setRawHeader("Accept-Language","zh-CN");
    //    request->setRawHeader("X-Requested-With","XMLHttpRequest");
    //    request->setRawHeader("User-Agent","Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)");
    //    request->setRawHeader("Content-Type","application/x-www-form-urlencoded");
    //    request->setRawHeader("Accept-Encoding","gzip,deflate");
    //    request->setRawHeader("Host","localhost:8888");
    //    request->setRawHeader("Content-Length","18");
    //    request->setRawHeader("Connection","Keep-Alive");
    //    request->setRawHeader("Cache-Control","no-cache");

        QByteArray postData;
        postData.append("myname=lk&mypwd=33");
        /*
        data = {
            "version": "1.1.0" ,
            "host": "maps.google.com",
            "home_mobile_country_code": 460,
            "home_mobile_network_code":0,
            "radio_type": "gsm",
            "request_address": True,
            "address_language": "zh_CN",
            "cell_towers":[
                {
                    "cell_id":5983,
                    "location_area_code":28712,
                    "mobile_country_code":460,
                    "mobile_network_code":0,
                }
            ]
        }
        data_str = json.dumps(data)
        fh = urllib2.urlopen(url="http://www.google.com/loc/json", data=data_str)
                */
        QNetworkReply* reply = m_accessManager->post(*request,postData);

        // 构建 Json 数组 - Version
        QJsonArray versionArray;
        versionArray.append(4.8);
        versionArray.append(5.2);
        versionArray.append(5.7);

        // 构建 Json 对象 - Page
        QJsonObject pageObject;
        pageObject.insert("Home", "https://www.qt.io/");
        pageObject.insert("Download", "https://www.qt.io/download/");
        pageObject.insert("Developers", "https://www.qt.io/developers/");

        // 构建 Json 对象
        QJsonObject json;
        json.insert("Name", "Qt");
        json.insert("Company", "Digia");
        json.insert("From", 1991);
        json.insert("Version", QJsonValue(versionArray));
        json.insert("Page", QJsonValue(pageObject));

        // 构建 Json 文档
        QJsonDocument document;
        document.setObject(json);
        QByteArray byteArray = document.toJson(QJsonDocument::Compact);
        QString strJson(byteArray);

        qDebug() << strJson;
}

void Widget::on_PostFinished(QNetworkReply *reply)
{
    if (reply->error() == QNetworkReply::NoError)
    {
        QString url = reply->url().toString();
        QByteArray bytes = reply->readAll();
        qDebug()<<bytes;
        QString string = QString::fromUtf8(bytes);
        Json::Reader reader;
        Json::Value root;
        reader.parse(string.toStdString(),root);
        FILE* fd = fopen("1.json","a");
        fprintf(fd,"%s",string.toStdString().c_str());
        fclose(fd);
        qDebug()<<root.toStyledString().c_str();

        if(root["errcode"].isNull() == false&&root["lat"].isNull() == false && root["lon"].isNull() == false)
        {
            if(root["errcode"].asInt() != 0)
            {
                m_cell->isInvalid = true;
            }
            QString lat = root["lat"].asCString();
            QString lon = root["lon"].asCString();
            QString  lac = url.mid(url.indexOf("lac=")+4,url.indexOf("&ci=") - url.indexOf("lac=") -4);
            QString  CellId = url.mid(url.indexOf("&ci=")+4,url.indexOf("&output=") - url.indexOf("&ci=") -4);
            qDebug()<<url;
            qDebug()<<lat;
            qDebug()<<lon;
            qDebug()<<lac;
            qDebug()<<CellId;
            QString line;
            QTextStream(&line)<<"LAC:"<<lac;
            QTextStream(&line)<<" CellId:"<<CellId;
            QTextStream(&line)<<" lat:"<<lat;
            QTextStream(&line)<<" lon:"<<lon;
            /*
            int row = ui->tableWidget->rowCount();
            QTableWidgetItem *item_lac = new QTableWidgetItem(lac);
            QTableWidgetItem *item_CellId = new QTableWidgetItem(CellId);
            QTableWidgetItem *item_lat = new QTableWidgetItem(lat);
            QTableWidgetItem *item_lon = new QTableWidgetItem(lon);
            ui->tableWidget->setRowCount(row + 1);
            ui->tableWidget->setItem(row,0,item_lac);
            ui->tableWidget->setItem(row,1,item_CellId);
            ui->tableWidget->setItem(row,2,item_lat);
            ui->tableWidget->setItem(row,3,item_lon);
            */
            m_cell->lat = lat;
            m_cell->lon = lon;
            m_cell->isFinished = true;
        }
    }
    else
    {
        qDebug()<<"handle errors here";
        QVariant statusCodeV = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute);
        //statusCodeV是HTTP服务器的相应码，reply->error()是Qt定义的错误码，可以参考QT的文档
        qDebug( "found error ....code: %d %d\n", statusCodeV.toInt(), (int)reply->error());
        qDebug(qPrintable(reply->errorString()));
    }
    reply->deleteLater();
    //g_mutex_request.unlock();
    if(m_cell !=NULL)
        m_cell->isInRequest = false;
    g_mutex.unlock();
    m_timer->start(1000);
}

void Widget::on_pushButton_2_clicked()
{
    //POST
    qDebug()<<__FUNCTION__;
        QNetworkRequest *request = new QNetworkRequest();
        /*
        oid=5735
        key=C9E87BD55956E735BF43119AFCCFC4B7
                */

        //request->setUrl(QUrl("http://api.gpsspg.com/bs/?oid=5735&key=C9E87BD55956E735BF43119AFCCFC4B7&bs=460,01,40977,2205409&output=json"));
        request->setUrl(QUrl("http://api.cellocation.com:81/cell/?mcc=460&mnc=1&lac=40977&ci=2205409&output=json"));
    //    request->setHeader(QNetworkRequest::ContentTypeHeader,"application/x-www-form-urlencoded");
    //    request->setRawHeader("Accept","text/html, application/xhtml+xml, */*");
    //    request->setRawHeader("Referer","http://localhost:8888/login");
    //    request->setRawHeader("Accept-Language","zh-CN");
    //    request->setRawHeader("X-Requested-With","XMLHttpRequest");
    //    request->setRawHeader("User-Agent","Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)");
    //    request->setRawHeader("Content-Type","application/x-www-form-urlencoded");
    //    request->setRawHeader("Accept-Encoding","gzip,deflate");
    //    request->setRawHeader("Host","localhost:8888");
    //    request->setRawHeader("Content-Length","18");
    //    request->setRawHeader("Connection","Keep-Alive");
    //    request->setRawHeader("Cache-Control","no-cache");

        QByteArray postData;
        postData.append("myname=lk&mypwd=33");
        /*
        data = {
            "version": "1.1.0" ,
            "host": "maps.google.com",
            "home_mobile_country_code": 460,
            "home_mobile_network_code":0,
            "radio_type": "gsm",
            "request_address": True,
            "address_language": "zh_CN",
            "cell_towers":[
                {
                    "cell_id":5983,
                    "location_area_code":28712,
                    "mobile_country_code":460,
                    "mobile_network_code":0,
                }
            ]
        }
        data_str = json.dumps(data)
        fh = urllib2.urlopen(url="http://www.google.com/loc/json", data=data_str)
                */
        //QNetworkReply* reply = m_accessManager->post(*request,postData);
        QNetworkReply* reply = m_accessManager->get(*request);

}

void Widget::RequestCellInfo(QString LAC,QString CellId)
{
    qDebug()<<__FUNCTION__;
    QNetworkRequest *request = new QNetworkRequest();
    QString url = "http://api.cellocation.com:81/cell/?mcc=460&mnc=0&lac=";
    url.append(LAC);
    url.append("&ci=");
    url.append(CellId);
    url.append("&output=json");
    qDebug()<<url;
    request->setUrl(QUrl(url));
    QNetworkReply* reply = m_accessManager->get(*request);
}
void Widget::on_timer()
{
    if(g_mutex.tryLock(10) == false)
    {
        return;
    }
    m_timer->stop();
    QMap<unsigned int,CellInfo*>::const_iterator it = g_map.constBegin();
    while(it != g_map.constEnd())
    {
        qDebug()<<it.key()<<"  "<<it.value();
        CellInfo *cell = it.value();
        if(cell->isFinished == true)
        {
            it++;
            continue;
        }
        if(cell->isInRequest == true)
        {
            return;
        }
        else
        {
            m_cell = cell;
            cell->isInRequest = true;
            this->RequestCellInfo(QString::number( cell->LAC),QString::number(cell->CellId));
            return;

        }
        //while(g_mutex_request.tryLock(1000) == false){};
    }
    g_mutex.unlock();
    m_timer->start(1000);
}

void Widget::on_TimerJiDianQi()
{
    static int count = 0;
    qDebug()<<"on_TimerJiDianQi";
    count ++;
    if(count < 10)
        return;
    m_TimerJiDianQi->stop();
    ui->checkBox->setChecked(false);
    count = 0;
    m_TimerRfidReader->start(1000);
}

void Widget::on_TimerRfidReader()
{
    static int count = 0;
    qDebug()<<"on_TimerRfidReader";
    count ++;
    if(count < 10)
    {
        on_pushButton_connect_clicked();
        return;
    }
    m_TimerRfidReader->stop();
    count = 0;
}
void Widget::on_pushButton_3_clicked()
{
    m_timer = new QTimer(this);
    connect(m_timer, SIGNAL(timeout()), this, SLOT(on_timer()));
    m_timer->start(1000);
}
void Widget::initSeialPort()
{
    connect(&serial,SIGNAL(readyRead()),this,SLOT(serialRead()));   //连接槽

    //获取计算机上所有串口并添加到comboBox中
    QList<QSerialPortInfo>  infos = QSerialPortInfo::availablePorts();
    if(infos.isEmpty())
    {
        ui->comboBox->addItem("无串口");
        return;
    }
    foreach (QSerialPortInfo info, infos) {
        ui->comboBox->addItem(info.portName());
        qDebug() << info.portName();
    }
}

QSerialPort* myserial = NULL;
void Widget::on_pushButton_connect_clicked()
{


    char test[10] = {0xA0,0x03, 0x01,0x70,0xEC};

    //serial.write(test,5);
    int i=0;
    test[i++] = 0xA0;
    test[i++] = 0x04;
    test[i++] = 0x01;
    test[i++] = 0x89;
    test[i++] = 0xFF;
    test[i++] = 0xD3;
    serial.write(test,i);
}

void Widget::on_pushButton_close_clicked()
{

    //myserial->close();
}

void Widget::on_comboBox_currentIndexChanged(const QString &arg1)
{
    QSerialPortInfo info;
    QList<QSerialPortInfo> infos = QSerialPortInfo::availablePorts();
    int i = 0;
    foreach (info, infos) {
        if(info.portName() == arg1) break;
        i++;
    }
    if(i != infos.size ()){//can find
       // ui->lblStatus->setText("串口打开成功");
        serial.close();
        serial.setPort(info);
        serial.open(QIODevice::ReadWrite);          //读写打开
        serial.setBaudRate(QSerialPort::Baud115200);  //波特率
//      serial.setDataBits(QSerialPort::Data8);     //数据位
//      serial.setParity(QSerialPort::NoParity);    //无奇偶校验
//      serial.setStopBits(QSerialPort::OneStop);   //无停止位
//      serial.setFlowControl(QSerialPort::NoFlowControl);  //无控制
    }else{
        serial.close();
        //ui->lblStatus->setText("串口打开失败");
    }
}

void Widget::serialRead()
{
    static QByteArray bytes;
    static QString line;
     while(serial.atEnd() == false)
     {
         switch(g_status)
         {
         case STATUS_FLAG:
         {
             unsigned char flag = 0;
             if(serial.read((char *)&flag,1) == 1)
             {
                 qDebug("%02x ",(unsigned char)flag);
                 if(flag == 0xa0)
                 {
                     g_status = STATUS_SIZE;
                 }
             }
         }
             break;
         case   STATUS_SIZE:
         {
             unsigned char size = 0;
             serial.read((char *)&size,1);
             {
                qDebug("%02x ",(unsigned char)size);
             }
             if(size > 0)
             {
                 g_status= STATUS_DATA;
                 g_size = size;
                 g_index = 0;
                 bytes.clear();
                 line.clear();
             }
         }
             break;
         case STATUS_DATA:
         {
             QByteArray tmp;
             qDebug()<<"g_index is "<<g_index;
             qDebug()<<"g_size is "<<g_size;
            if(g_index == 0)
            {
                bytes.clear();
                 bytes += 0xa0;
                 bytes += g_size;
            }

             tmp = serial.read(g_size-g_index);
             if(tmp.length() > 0)
             {
                 QString strtmp;
                 for(int i=0;i<tmp.length();i++)
                 {
                     char buf[8] = {0};
                     sprintf(buf,"%02x ",(unsigned char)tmp.at(i));
                     strtmp += buf;
                 }
                 qDebug()<<"length is "<<tmp.length();
                 qDebug()<<strtmp;
                 bytes.append(tmp);
                 g_index += tmp.length();
                 if(g_size == g_index)
                 {
                     g_status = STATUS_FLAG;
                 }
                 if(g_index < g_size)
                     break;
             }
             else
             {
                 qDebug()<<"tmp.length() is"<<tmp.length();
                 qDebug()<<"g_size is "<<g_size;
                 break;
             }
             g_data.push_back(bytes);
             for(int i=7;i<bytes.length() - 2&& bytes.length() > 12;i++)
             {
                 char buf[8] = {0};
                 sprintf(buf,"%02x ",(unsigned char)bytes.at(i));
                 line += buf;
             }
             ui->textEdit->append(line);
         }
         }
    };
  //  if(qa.at(0)=='a')
   // ui->textEdit->append(qa);
  //  QMessageBox::warning (this,tr("提示信息"),tr("串口接收成功"));
}

void Widget::on_checkBox_clicked(bool checked)
{
    if(g_tcpSocket == NULL)
        return;
    if(checked)
    {
        write(g_tcpSocket,"{\"M\":\"jidianqi\",\"V\":\"on\"}");
    }
    else
    {
        write(g_tcpSocket,"{\"M\":\"jidianqi\",\"V\":\"off\"}");

    }
}

void Widget::on_checkBox_2_clicked(bool checked)
{
    qDebug()<<"on_checkBox_2_clicked";

}

void Widget::on_checkBox_2_stateChanged(int arg1)
{
    qDebug()<<"on_checkBox_2_stateChanged arg1"<<arg1;
    if(ui->checkBox_2->isChecked() == true)
    {
        qDebug()<<"on_checkBox_2_stateChanged true";
        ui->checkBox->setChecked(true);
        m_TimerJiDianQi->stop();
        m_TimerJiDianQi->start(1000);
    }
}
