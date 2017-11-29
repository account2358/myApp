#include <bcm2835.h>
#include <stdio.h>
#include <sys/time.h>
#include <stdint.h>

#define PIN_11 RPI_GPIO_P1_11
#define PIN_12 RPI_GPIO_P1_12

struct timeval start,end;
int isTimeRun = 0;

void time_reset()
{
	isTimeRun = 0;

};
void time_begin()
{
	gettimeofday(&start,NULL);
	//printf("start : %d.%d\n",start.tv_sec, start.tv_usec);
};
void time_end()
{
	gettimeofday(&end,NULL);
}
void display_timer()
{
/*
	printf("start : %d.%d\n",start.tv_sec, start.tv_usec);
	printf("end : %d.%d\n",end.tv_sec, end.tv_usec);
	printf("start - end is : %d.%d\n",end.tv_sec - start.tv_sec,
					end.tv_usec - start.tv_usec);
*/
	double time_spend = (end.tv_usec - start.tv_usec) + (end.tv_sec - start.tv_sec)*1000000;
	time_spend = time_spend / 1000000;
	printf("time_spend is %f\n",time_spend);
	printf("dist is %0.2f m\n", (340*time_spend)/2);
	isTimeRun = 0;
	memset(&start,0,sizeof(start));
	memset(&end,0,sizeof(end));
};

int main(int argc, char **argv)
{
  if (!bcm2835_init())
  return 1;

  bcm2835_gpio_fsel(PIN_11, BCM2835_GPIO_FSEL_OUTP);
  bcm2835_gpio_fsel(PIN_12, BCM2835_GPIO_FSEL_INPT);
	bcm2835_gpio_clr(PIN_12);
  bcm2835_gpio_set_pud(PIN_12, BCM2835_GPIO_PUD_DOWN);

  while (1)
  {
    bcm2835_gpio_write(PIN_11, HIGH);
    uint8_t value = bcm2835_gpio_lev(PIN_12);
    //printf("read pin 12 is %d\n",value);
    bcm2835_delay(1);
    bcm2835_gpio_write(PIN_11, LOW);
	while(1)
	{
    	    value = bcm2835_gpio_lev(PIN_12);
		if(value == 1 && isTimeRun == 0)
		{
    			//printf("read pin 12 is %d time begin isTimeRun is %d\n",value, isTimeRun);
			time_begin();
			isTimeRun = 1;
		}
		
	
		if(value == 0 && isTimeRun == 1)
		{
    			//printf("read pin 12 is %d time end isTimeRun is %d\n",value, isTimeRun);
			time_end();
			isTimeRun = 0;
			break;
		}
	}
	display_timer();
    	bcm2835_delay(5000);
  }
  bcm2835_close();
  return 0;
}
