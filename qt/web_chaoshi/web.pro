#-------------------------------------------------
#
# Project created by QtCreator 2017-07-25T10:59:38
#
#-------------------------------------------------

QT       += core gui
QT += webkitwidgets
QT += network
QT += sql
QT += serialport

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

TARGET = web
TEMPLATE = app


SOURCES += main.cpp\
        widget.cpp \
    jsoncpp.cpp

HEADERS  += widget.h \
    json/json.h \
    json/json-forwards.h

FORMS    += widget.ui
