#include <stdio.h>    
#include <stdlib.h>    
#include <strings.h>    
#include <sys/types.h>    
#include <sys/socket.h>    
#include <memory.h>    
#include <unistd.h>    
//#include <linux/in.h>    
#include <netinet/in.h>    
//#include <linux/inet_diag.h>    
#include <arpa/inet.h>    
    
#include <signal.h>    
    
/**  
  .. sockaddr  sockaddr_in  socketaddr_un..  
  http://maomaozaoyue.blog.sohu.com/197538359.html  
  */    
    
#define PORT    8181   //......    
#define BACKLOG 5       //........    
#define buflen  1024    
    
void process_conn_server(int s);    
void sig_pipe(int signo);    
    
int ss,sc;  //ss....socket....sc........socket...    
    
int main(int argc,char *argv[])    
{    
    
    struct sockaddr_in server_addr; //......socket....    
    struct sockaddr_in client_addr; //..... socket....    
    
    int err;    //...    
    pid_t pid;  //.....ID    
    
    /*****************socket()***************/    
    ss = socket(AF_INET,SOCK_STREAM,0); //......................    
    if(ss<0)    
    {    
        printf("server : server socket create error\n");    
        return -1;    
    }    
    //....    
    sighandler_t ret;    
    ret = signal(SIGTSTP,sig_pipe);    
    if(SIG_ERR == ret)    
    {    
        printf("......\n");    
        return -1;    
    }    
    else    
        printf("......\n");    
    
    
    /******************bind()****************/    
    //.......    
    memset(&server_addr,0,sizeof(server_addr));    
    server_addr.sin_family = AF_INET;           //...    
    server_addr.sin_addr.s_addr = htonl(INADDR_ANY);   //....    
    server_addr.sin_port = htons(PORT);    
    
    err = bind(ss,(struct sockaddr *)&server_addr,sizeof(sockaddr));    
    if(err<0)    
    {    
        printf("server : bind error\n");    
        return -1;    
    }    
    
    /*****************listen()***************/    
    err = listen(ss,BACKLOG);   //.........    
    if(err < 0)    
    {    
        printf("server : listen error\n");    
        return -1;    
    }    
    
    /****************accept()***************/    
    /**  
    ........................  
    1............;2,......C/S....  
    .........................  
    ........ ........ .......  
    ..........................  
    .........fork................  
    ........................  
    */    
    
    for(;;)    
    {    
        socklen_t addrlen = sizeof(client_addr);    
        //accept...........    
        sc = accept(ss,(struct sockaddr *)&client_addr,&addrlen);  //............. .....    
        if(sc < 0)  //..    
        {    
            continue;   //......    
        }    
        else    
        {    
            printf("server : connected\n");    
        }    
    
        //................    
        pid = fork();    
        //fork .......... 0 ......... ID    
        if(pid == 0)        //..........    
        {    
            close(ss);    
            process_conn_server(sc);    
        }    
        else    
        {    
            close(sc);    
        }    
    }    
}    
    
/**  
  ............................  
  .....................  
  */    
    
//..... s ........    
void process_conn_server(int s)    
{    
    ssize_t size = 0;    
    char buffer[buflen];  //.......    
    for(;;)    
    {    
        //...    
        for(size = 0;size == 0 ;size = read(s,buffer,buflen));    
        //............    
        printf("%s",buffer);    
    
        //....    
        if(strcmp(buffer,"quit") == 0)    
        {    
            close(s);   //....0.....-1    
            return ;    
        }    
        sprintf(buffer,"%d bytes altogether\n",size);    
        write(s,buffer,strlen(buffer)+1);    
    }    
}    
void sig_pipe(int signo)    
{    
    printf("catch a signal\n");    
    if(signo == SIGTSTP)    
    {    
        printf("... SIGTSTP ..\n");    
        int ret1 = close(ss);    
        int ret2 = close(sc);    
        int ret = ret1>ret2?ret1:ret2;    
        if(ret == 0)    
            printf(".. : .....\n");    
        else if(ret ==-1 )    
            printf(".. : ......\n");    
    
        exit(1);    
    }    
}  
