#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#define ARRAY_SIZE 8 //2^20 elements
#define MAX_RANDOM_RANGE 100
#define FOR_LOOP_TIMES 10

//Generate a array with random data
int * generateArray(){
    //Allocate memory for array
    int *randomArray = (int *)malloc(sizeof(int)*ARRAY_SIZE);
    if(randomArray == NULL){
        printf("randomArray malloc failed.");
        exit(1);
    }

    int i;
    for(i=0;i<ARRAY_SIZE;i++){
        randomArray[i]=rand() % (MAX_RANDOM_RANGE+1);
    }
    return randomArray;
}
//Print the elements of the array
void printArray(int *arr){
    for(int i=0;i<ARRAY_SIZE;i++){
        printf("%d : %d\n",i,arr[i]);
    }
}

//calculate the dot with step 1
long int calculateDotWithStepOne(int *x,int *y){

    long int i;
    long int countCalculations=0;
    long int dot=0;
    for(i=0;i<ARRAY_SIZE;i=i+1){
            dot=dot+x[i]*y[i];    
            countCalculations=countCalculations+2;
    }
    return countCalculations;
}
long int calculateDotWithStepTwo(int *x,int *y){
    long int i;
    long int dot=0;
    long int countCalculations=0;
    for(i=0;i<ARRAY_SIZE;i=i+2){
        if(i+1 <ARRAY_SIZE){
            dot=dot+x[i]*y[i]+x[i+1]*y[i+1];   
            countCalculations=countCalculations+4; 
        }
        else{
            dot=dot+x[i]*y[i];
            countCalculations=countCalculations+2;
        }
       // printf("Dot here: %li\n",dot);
    }
    return countCalculations;
}
long int calculateDotWithStepFour(int *x,int *y){
    long int i;
    long int dot=0;
    long int countCalculations=0;
    for(i=0;i<ARRAY_SIZE;i=i+4){
        if(i+3<ARRAY_SIZE){
            dot=dot+x[i]*y[i]+x[i+1]*y[i+1] + x[i+2]*y[i+2] + x[i+3]*y[i+3];   
            countCalculations=countCalculations+8;
        }
        else if(i+2 <ARRAY_SIZE){
            dot=dot+x[i]*y[i]+x[i+1]*y[i+1] + x[i+2]*y[i+2];
            countCalculations=countCalculations+6; 
        }
        else if(i+1<ARRAY_SIZE){
            dot=dot+x[i]*y[i]+x[i+1]*y[i+1];
            countCalculations=countCalculations+4; 
        }
        else{
            dot=dot+x[i]*y[i];
            countCalculations=countCalculations+2;
        }
        //printf("Dot here: %li\n",dot);
    }
    return countCalculations;
}
long int calculateDotWithStepEight(int *x,int *y){
    long int i;
    long int dot=0;
    long int countCalculations=0;

    for(i=0;i<ARRAY_SIZE;i=i+8){

        if( i+7<ARRAY_SIZE ){
            dot=dot+x[i]*y[i]+x[i+1]*y[i+1] + x[i+2]*y[i+2] + x[i+3]*y[i+3] + x[i+4]*y[i+4]+
            x[i+5]*y[i+5] + x[i+6]*y[i+6] + x[i+7]*y[i+7];    
            countCalculations=countCalculations+16;
        }
        else if( i+6 <ARRAY_SIZE){
            dot=dot+x[i]*y[i]+x[i+1]*y[i+1] + x[i+2]*y[i+2] + x[i+3]*y[i+3] + x[i+4]*y[i+4]+
            x[i+5]*y[i+5] + x[i+6]*y[i+6];
            countCalculations=countCalculations+14;
        }
        else if(i+5 <ARRAY_SIZE){
            dot=dot+x[i]*y[i]+ x[i+1]*y[i+1] + x[i+2]*y[i+2] + x[i+3]*y[i+3] + x[i+4]*y[i+4]+
            x[i+5]*y[i+5];
            countCalculations=countCalculations+12;
        }
        else if(i+4 <ARRAY_SIZE){
            dot=dot+x[i]*y[i]+ x[i+1]*y[i+1] + x[i+2]*y[i+2] + x[i+3]*y[i+3] + x[i+4]*y[i+4];
            countCalculations=countCalculations+10;
        }
        else if(i+3 < ARRAY_SIZE){
            dot=dot+x[i]*y[i]+ x[i+1]*y[i+1] + x[i+2]*y[i+2] + x[i+3]*y[i+3];
            countCalculations=countCalculations+8;
        }
        else if(i+2 <ARRAY_SIZE){
            dot=dot+x[i]*y[i]+x[i+1]*y[i+1] + x[i+2]*y[i+2];
            countCalculations=countCalculations+6;
        }
        else if(i+1<ARRAY_SIZE){
            dot=dot+x[i]*y[i]+x[i+1]*y[i+1];
            countCalculations=countCalculations+4;
        }
        else{
            dot=dot+x[i]*y[i];
            countCalculations=countCalculations+2;
        }
        //printf("Dot here: %li\n",dot);
    }
    return countCalculations;
}
long int calculateDotWithStepSixteen(int *x,int *y){
    long int i;
    long int dot=0;
    long int countCalculations=0;
    
    for(i=0;i<ARRAY_SIZE;i=i+16){

        if(i+15 <ARRAY_SIZE){
            dot=dot+x[i]*y[i]+x[i+1]*y[i+1] + x[i+2]*y[i+2] + x[i+3]*y[i+3] + x[i+4]*y[i+4]+
            x[i+5]*y[i+5] + x[i+6]*y[i+6] + x[i+7]*y[i+7] +x[i+8]*y[i+8]+ x[i+9]*y[i+9]+
            x[i+10]*y[i+10]+ x[i+11]*y[i+11] + x[i+12]*y[i+12] + x[i+13]*y[i+13] + x[i+14]*y[i+14]+
            x[i+15]*y[i+15]; 
            countCalculations=countCalculations+32;
        }
        else if(i+14 <ARRAY_SIZE){
            dot=dot+x[i]*y[i]+x[i+1]*y[i+1] + x[i+2]*y[i+2] + x[i+3]*y[i+3] + x[i+4]*y[i+4]+
            x[i+5]*y[i+5] + x[i+6]*y[i+6] + x[i+7]*y[i+7] +x[i+8]*y[i+8]+ x[i+9]*y[i+9]+
            x[i+10]*y[i+10]+ x[i+11]*y[i+11] + x[i+12]*y[i+12] + x[i+13]*y[i+13] + x[i+14]*y[i+14]; 
            countCalculations=countCalculations+30;
        }
        else if(i+13 <ARRAY_SIZE){
            dot=dot+x[i]*y[i]+x[i+1]*y[i+1] + x[i+2]*y[i+2] + x[i+3]*y[i+3] + x[i+4]*y[i+4]+
            x[i+5]*y[i+5] + x[i+6]*y[i+6] + x[i+7]*y[i+7] +x[i+8]*y[i+8]+ x[i+9]*y[i+9]+
            x[i+10]*y[i+10]+ x[i+11]*y[i+11] + x[i+12]*y[i+12] + x[i+13]*y[i+13];
            countCalculations=countCalculations+28;
        }
        else if(i+12 <ARRAY_SIZE){
            dot=dot+x[i]*y[i]+x[i+1]*y[i+1] + x[i+2]*y[i+2] + x[i+3]*y[i+3] + x[i+4]*y[i+4]+
            x[i+5]*y[i+5] + x[i+6]*y[i+6] + x[i+7]*y[i+7] +x[i+8]*y[i+8]+ x[i+9]*y[i+9]+
            x[i+10]*y[i+10]+ x[i+11]*y[i+11] + x[i+12]*y[i+12];
            countCalculations=countCalculations+26;
        }
        else if(i+11 <ARRAY_SIZE){
            dot=dot+x[i]*y[i]+x[i+1]*y[i+1] + x[i+2]*y[i+2] + x[i+3]*y[i+3] + x[i+4]*y[i+4]+
            x[i+5]*y[i+5] + x[i+6]*y[i+6] + x[i+7]*y[i+7] +x[i+8]*y[i+8]+ x[i+9]*y[i+9]+
            x[i+10]*y[i+10]+ x[i+11]*y[i+11];
            countCalculations=countCalculations+24;
        }
        else if(i+10 <ARRAY_SIZE){
            dot=dot+x[i]*y[i]+x[i+1]*y[i+1] + x[i+2]*y[i+2] + x[i+3]*y[i+3] + x[i+4]*y[i+4]+
            x[i+5]*y[i+5] + x[i+6]*y[i+6] + x[i+7]*y[i+7] +x[i+8]*y[i+8]+ x[i+9]*y[i+9]+
            x[i+10]*y[i+10];
            countCalculations=countCalculations+22;
        }
        else if(i+9 <ARRAY_SIZE){
            dot=dot+x[i]*y[i]+x[i+1]*y[i+1] + x[i+2]*y[i+2] + x[i+3]*y[i+3] + x[i+4]*y[i+4]+
            x[i+5]*y[i+5] + x[i+6]*y[i+6] + x[i+7]*y[i+7] +x[i+8]*y[i+8]+ x[i+9]*y[i+9];
            countCalculations=countCalculations+20;
        }
        else if(i+8 <ARRAY_SIZE){
            dot=dot+x[i]*y[i]+x[i+1]*y[i+1] + x[i+2]*y[i+2] + x[i+3]*y[i+3] + x[i+4]*y[i+4]+
            x[i+5]*y[i+5] + x[i+6]*y[i+6] + x[i+7]*y[i+7] +x[i+8]*y[i+8];
            countCalculations=countCalculations+18;
        }
        else if( i+7<ARRAY_SIZE ){
            dot=dot+x[i]*y[i]+x[i+1]*y[i+1] + x[i+2]*y[i+2] + x[i+3]*y[i+3] + x[i+4]*y[i+4]+
            x[i+5]*y[i+5] + x[i+6]*y[i+6] + x[i+7]*y[i+7];    
            countCalculations=countCalculations+16;
        }
        else if( i+6 <ARRAY_SIZE){
            dot=dot+x[i]*y[i]+x[i+1]*y[i+1] + x[i+2]*y[i+2] + x[i+3]*y[i+3] + x[i+4]*y[i+4]+
            x[i+5]*y[i+5] + x[i+6]*y[i+6];
            countCalculations=countCalculations+14;
        }
        else if(i+5 <ARRAY_SIZE){
            dot=dot+x[i]*y[i]+ x[i+1]*y[i+1] + x[i+2]*y[i+2] + x[i+3]*y[i+3] + x[i+4]*y[i+4]+
            x[i+5]*y[i+5];
            countCalculations=countCalculations+12;
        }
        else if(i+4 <ARRAY_SIZE){
            dot=dot+x[i]*y[i]+ x[i+1]*y[i+1] + x[i+2]*y[i+2] + x[i+3]*y[i+3] + x[i+4]*y[i+4];
            countCalculations=countCalculations+10;
        }
        else if(i+3 < ARRAY_SIZE){
            dot=dot+x[i]*y[i]+ x[i+1]*y[i+1] + x[i+2]*y[i+2] + x[i+3]*y[i+3];
            countCalculations=countCalculations+8;
        }
        else if(i+2 <ARRAY_SIZE){
            dot=dot+x[i]*y[i]+x[i+1]*y[i+1] + x[i+2]*y[i+2];
            countCalculations=countCalculations+6;
        }
        else if(i+1<ARRAY_SIZE){
            dot=dot+x[i]*y[i]+x[i+1]*y[i+1];
            countCalculations=countCalculations+4;
        }
        else{
            dot=dot+x[i]*y[i];
            countCalculations=countCalculations+2;
        }
       // printf("Dot here: %li\n",dot);
    }
    return countCalculations;
}
int main(int argc,char *argv[]){

    clock_t tStart,tEnd;
    double cpu_time_used;
    double flops;
    long int calculations;

    /* Open file to write data */
    FILE *f = fopen("VectorsMultiplyResults.dat", "a+");
    if (f == NULL)
    {
        printf("Error opening file!\n");
        exit(1);
    }

    //Initialize the random
    srand(time(NULL));

    if(argc == 1){
        printf("Please enter number of step as argument.\n");
        printf("Example: ./askhsh6 0\n");
        return 1;
    }
    else{

        //Get the argument 
        int step = atoi(argv[1]);
        printf("Step: %d\n",step);

        //Generate the vectors
        int *x=generateArray();
        int *y=generateArray();

        //Check what case we have 
        switch(step){
            case 1:
                tStart=clock();
                for(int i=0;i<FOR_LOOP_TIMES;i++){
                    calculations=calculateDotWithStepOne(x,y);
                }
                tEnd=clock();
                cpu_time_used = ((double) (tEnd - tStart)) / CLOCKS_PER_SEC;
		cpu_time_used = ((double) cpu_time_used /10);
                flops=((double) calculations / cpu_time_used);
                printf("Time taken: %f seconds.Calculations: %li.Flops: %f\n",cpu_time_used,calculations,flops);
                fprintf(f, "Data Length:%d Step:%d\nTime: %f seconds Calculations: %li Flops: %f\n",ARRAY_SIZE,step,cpu_time_used,calculations,flops);
                break;
            case 2:
                tStart=clock();
                for(int i=0;i<FOR_LOOP_TIMES;i++){
                    calculations=calculateDotWithStepTwo(x,y);
                }
                tEnd=clock();
                cpu_time_used = ((double) (tEnd - tStart)) / CLOCKS_PER_SEC;
		cpu_time_used = ((double) cpu_time_used /10);
		flops=((double) calculations / cpu_time_used);
                printf("Time taken: %f seconds.Calculations: %li.Flops: %f\n",cpu_time_used,calculations,flops);
                fprintf(f, "Data Length:%d Step:%d\nTime: %f seconds Calculations: %li Flops: %f\n",ARRAY_SIZE,step,cpu_time_used,calculations,flops);
                break;
            case 4:
                tStart=clock();
                for(int i=0;i<FOR_LOOP_TIMES;i++){
                    calculations=calculateDotWithStepFour(x,y);
                }
                tEnd=clock();
                cpu_time_used = ((double) (tEnd - tStart)) / CLOCKS_PER_SEC;
		cpu_time_used = ((double) cpu_time_used /10);
                flops=((double) calculations / cpu_time_used);
                printf("Time taken: %f seconds.Calculations: %li.Flops: %f\n",cpu_time_used,calculations,flops);
                fprintf(f, "Data Length:%d Step:%d\nTime: %f seconds Calculations: %li Flops: %f\n",ARRAY_SIZE,step,cpu_time_used,calculations,flops);
                break;
            case 8:
                tStart=clock();
                for(int i=0;i<FOR_LOOP_TIMES;i++){
                    calculations=calculateDotWithStepEight(x,y);
                }
                tEnd=clock();
                cpu_time_used = ((double) (tEnd - tStart)) / CLOCKS_PER_SEC;
                cpu_time_used = ((double) cpu_time_used /10);
		flops=((double) calculations / cpu_time_used);		
                printf("Time taken: %f seconds.Calculations: %li.Flops: %f\n",cpu_time_used,calculations,flops);
                fprintf(f, "Data Length:%d Step:%d\nTime: %f seconds Calculations: %li Flops: %f\n",ARRAY_SIZE,step,cpu_time_used,calculations,flops);
                break;
            case 16:
                tStart=clock();
                for(int i=0;i<FOR_LOOP_TIMES;i++){
                    calculations=calculateDotWithStepSixteen(x,y);
                }
                tEnd=clock();
                cpu_time_used = ((double) (tEnd - tStart)) / CLOCKS_PER_SEC;
		cpu_time_used = ((double) cpu_time_used /10);
                flops=((double) calculations / cpu_time_used);
                printf("Time taken: %f seconds.Calculations: %li.Flops: %f\n",cpu_time_used,calculations,flops);
                fprintf(f, "Data Length:%d Step:%d\nTime: %f seconds Calculations: %li Flops: %f\n",ARRAY_SIZE,step,cpu_time_used,calculations,flops);
                break;
        }
    }
    return 0;
}
