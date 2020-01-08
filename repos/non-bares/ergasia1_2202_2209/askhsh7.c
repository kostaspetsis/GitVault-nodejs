#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#define ARRAY_SIZE 512
#define MAX_RANDOM_RANGE 100
#define FOR_LOOP_TIMES 10
#define ONE 1
#define TWO 2
#define FOUR 4
#define EIGHT 8
#define SIXTEEN 16

long int ** generateArray(){

    //Allocate memory for array
    long int **randomArray = (long int **)malloc(sizeof(long int *)*ARRAY_SIZE);
    if(randomArray == NULL){
        printf("randomArray malloc failed.");
        exit(1);
    }

    int i,j;
    for(i=0;i<ARRAY_SIZE;i++){
        randomArray[i] = ( long int *)malloc(sizeof(long int)*ARRAY_SIZE);
        if(randomArray[i] == NULL){
            printf("randomArray element malloc failed.");
            exit(1);
        }
        for(j=0;j<ARRAY_SIZE;j++){
            randomArray[i][j]=rand() % (MAX_RANDOM_RANGE+1);
        }
    }
    return randomArray;
}
//Print the elements of the array
void printArray(long int **arr){
    
    long int i,j;
    for(i=0;i<ARRAY_SIZE;i++){
        for(j=0;j<ARRAY_SIZE;j++){
            printf("%li,%li : %li\n",i,j,arr[i][j]);
        }
    }
    printf("\n\n");
}

long int calculateDotWithStepOne(long int **a,long int **b){
    long int i,j,k;
    long int inner_i,inner_j;
    long int dot[ARRAY_SIZE][ARRAY_SIZE];
    long int countCalculations=0;

    /* Initialize Dot array */
    for(i=0;i<ARRAY_SIZE;i++){
        for(j=0;j<ARRAY_SIZE;j++){
            dot[i][j]=0;
        }
    }

    /* Calculate the dot */
    for(i=0;i<ARRAY_SIZE;i++){
        for(j=0;j<ARRAY_SIZE;j++){
            for(k=0;k<ARRAY_SIZE;k++){
                for(inner_i=0;inner_i<ONE;inner_i++){
                    for(inner_j=0;inner_j<ONE;inner_j++){
                        dot[i+inner_i][j+inner_j]=dot[i+inner_i][j+inner_j] + a[i+inner_i][k]*b[k][j+inner_j];
                        countCalculations=countCalculations+2;
                    }
                }
            }
        }
    }

    
    /*for(i=0;i<ARRAY_SIZE;i++){
        for(j=0;j<ARRAY_SIZE;j++){
            printf("%li,%li :%li\n",i,j,dot[i][j]);
        }
    }*/
    return countCalculations;
}
long int calculateDotWithStepTwo(long int **a,long int **b){
    long int i,j,k;
    long int inner_i,inner_j;
    long int dot[ARRAY_SIZE][ARRAY_SIZE];
    long int countCalculations=0;

   
    /* Initialize Dot array */
    for(i=0;i<ARRAY_SIZE;i++){
        for(j=0;j<ARRAY_SIZE;j++){
            dot[i][j]=0;
        }
    }
    
    /* Calculate the dot */
    for(i=0;i<ARRAY_SIZE;i=i+TWO){
        for(j=0;j<ARRAY_SIZE;j=j+TWO){
            for(k=0;k<ARRAY_SIZE;k++){
                for(inner_i=0;inner_i<TWO;inner_i++){
                    for(inner_j=0;inner_j<TWO;inner_j++){
                        dot[i+inner_i][j+inner_j]+=a[i+inner_i][k]*b[k][j+inner_j];
                        countCalculations=countCalculations+2;
                    }
                }
            }
        }
    }

    /*for(i=0;i<ARRAY_SIZE;i++){
        for(j=0;j<ARRAY_SIZE;j++){
            printf("%li,%li :%li\n",i,j,dot[i][j]);
        }
    }*/
    return countCalculations;
}
long int calculateDotWithStepFour(long int **a,long int **b){
    long int i,j,k;
    long int inner_i,inner_j;
    long int dot[ARRAY_SIZE][ARRAY_SIZE];
    long int countCalculations=0;

    
    /* Initialize Dot array */
    for(i=0;i<ARRAY_SIZE;i++){
        for(j=0;j<ARRAY_SIZE;j++){
            dot[i][j]=0;
        }
    }
    
    /* Calculate the dot */
    for(i=0;i<ARRAY_SIZE;i=i+FOUR){
        for(j=0;j<ARRAY_SIZE;j=j+FOUR){
            for(k=0;k<ARRAY_SIZE;k++){
                for(inner_i=0;inner_i<FOUR;inner_i++){
                    for(inner_j=0;inner_j<FOUR;inner_j++){
                        dot[i+inner_i][j+inner_j]=dot[i+inner_i][j+inner_j] + a[i+inner_i][k]*b[k][j+inner_j];
                        countCalculations=countCalculations+2;
                    }
                }
            }
        }
    }
    
    /*for(i=0;i<ARRAY_SIZE;i++){
        for(j=0;j<ARRAY_SIZE;j++){
            printf("%li,%li :%li\n",i,j,dot[i][j]);
        }
    }*/
    return countCalculations;
}
long int calculateDotWithStepEight(long int **a,long int **b){
    long int i,j,k;
    long int inner_i,inner_j;
    long int dot[ARRAY_SIZE][ARRAY_SIZE];
    long int countCalculations=0;

    /* Initialize Dot array */
    for(i=0;i<ARRAY_SIZE;i++){
        for(j=0;j<ARRAY_SIZE;j++){
            dot[i][j]=0;
        }
    }

    for(i=0;i<ARRAY_SIZE;i=i+EIGHT){
        for(j=0;j<ARRAY_SIZE;j=j+EIGHT){
            for(k=0;k<ARRAY_SIZE;k++){
                for(inner_i=0;inner_i<EIGHT;inner_i++){
                    for(inner_j=0;inner_j<EIGHT;inner_j++){
                        dot[i+inner_i][j+inner_j]=dot[i+inner_i][j+inner_j] + a[i+inner_i][k]*b[k][j+inner_j];
                        countCalculations=countCalculations+2;
                    }
                }
            }
        }
    }

   /* for(i=0;i<ARRAY_SIZE;i++){
        for(j=0;j<ARRAY_SIZE;j++){
            printf("%li,%li :%li\n",i,j,dot[i][j]);
        }
    }*/
    return countCalculations;
}

long int calculateDotWithStepSixTeen(long int **a,long int **b){
    long int i,j,k;
    long int inner_i,inner_j;
    long int dot[ARRAY_SIZE][ARRAY_SIZE];
    long int countCalculations=0;

    /* Initialize Dot array */
    for(i=0;i<ARRAY_SIZE;i++){
        for(j=0;j<ARRAY_SIZE;j++){
            dot[i][j]=0;
        }
    }

    for(i=0;i<ARRAY_SIZE;i=i+SIXTEEN){
        for(j=0;j<ARRAY_SIZE;j=j+SIXTEEN){
            for(k=0;k<ARRAY_SIZE;k++){
                for(inner_i=0;inner_i<SIXTEEN;inner_i++){
                    for(inner_j=0;inner_j<SIXTEEN;inner_j++){
                        dot[i+inner_i][j+inner_j]=dot[i+inner_i][j+inner_j] + a[i+inner_i][k]*b[k][j+inner_j];
                        countCalculations=countCalculations+2;
                    }
                }
            }
        }
    }
   /* for(i=0;i<ARRAY_SIZE;i++){
        for(j=0;j<ARRAY_SIZE;j++){
            printf("%li,%li :%li\n",i,j,dot[i][j]);
        }
    }*/
    return countCalculations;
}
int main(int argc,char *argv[]){

    clock_t tStart,tEnd;
    double cpu_time_used;
    double flops;
    long int calculations; 

    /* Open file to write data */
    FILE *f = fopen("MatrixMultiplyResults.dat", "a+");
    if (f == NULL)
    {
        printf("Error opening file!\n");
        exit(1);
    }

    //Initialize the random
    srand(time(NULL));

    //Check if we enter the block
    if(argc == 1){
        printf("Please enter number of blocks as argument.\n");
        printf("Example: ./askhsh7 1\n");
        return 1;
    }
    else{
        //Get the argument 
        int step = atoi(argv[1]);
        printf("Step: %d\n",step);

        //Generate two arrays
        long int **a=generateArray();
        long int **b=generateArray();

        //Print arrays
        //printArray(a);
       	//printArray(b);

        switch(step){
            case 1:
                tStart=clock();
                for(int i=0;i<FOR_LOOP_TIMES;i++){
                    calculations=calculateDotWithStepOne(a,b);
                }
                tEnd=clock();
                cpu_time_used = ((double) (tEnd - tStart)) / CLOCKS_PER_SEC;
                cpu_time_used=((double)cpu_time_used/FOR_LOOP_TIMES);
                flops=((double) calculations / cpu_time_used);
                printf("Time taken: %f seconds.Calculations: %li.Flops: %f\n",cpu_time_used,calculations,flops);
		fprintf(f, "Data Length:%d Step:%d\nTime: %f seconds Calculations: %li Flops: %f\n",ARRAY_SIZE,step,cpu_time_used,calculations,flops);
                break;
            case 2:
                tStart=clock();
                for(int i=0;i<FOR_LOOP_TIMES;i++){
                    calculations=calculateDotWithStepTwo(a,b);
                }
                tEnd=clock();
                cpu_time_used = ((double) (tEnd - tStart)) / CLOCKS_PER_SEC;
                cpu_time_used=((double)cpu_time_used/FOR_LOOP_TIMES);
                flops=((double) calculations / cpu_time_used);
                printf("Time taken: %f seconds.Calculations: %li.Flops: %f\n",cpu_time_used,calculations,flops);
		fprintf(f, "Data Length:%d Step:%d\nTime: %f seconds Calculations: %li Flops: %f\n",ARRAY_SIZE,step,cpu_time_used,calculations,flops);
                break;
            case 4:
                tStart=clock();
                for(int i=0;i<FOR_LOOP_TIMES;i++){
                    calculations=calculateDotWithStepFour(a,b);
                }
                tEnd=clock();
                cpu_time_used = ((double) (tEnd - tStart)) / CLOCKS_PER_SEC;
                cpu_time_used=((double)cpu_time_used/FOR_LOOP_TIMES);
                flops=((double) calculations / cpu_time_used);
                printf("Time taken: %f seconds.Calculations: %li.Flops: %f\n",cpu_time_used,calculations,flops);
		fprintf(f, "Data Length:%d Step:%d\nTime: %f seconds Calculations: %li Flops: %f\n",ARRAY_SIZE,step,cpu_time_used,calculations,flops);
                break;
            case 8:
                tStart=clock();
                for(int i=0;i<FOR_LOOP_TIMES;i++){
                    calculations=calculateDotWithStepEight(a,b);
                }
                tEnd=clock();
                cpu_time_used = ((double) (tEnd - tStart)) / CLOCKS_PER_SEC;
                cpu_time_used=((double)cpu_time_used/FOR_LOOP_TIMES);
                flops=((double) calculations / cpu_time_used);
                printf("Time taken: %f seconds.Calculations: %li.Flops: %f\n",cpu_time_used,calculations,flops);
		fprintf(f, "Data Length:%d Step:%d\nTime: %f seconds Calculations: %li Flops: %f\n",ARRAY_SIZE,step,cpu_time_used,calculations,flops);
                break;
            case 16:
                tStart=clock();
                for(int i=0;i<FOR_LOOP_TIMES;i++){
                    calculations=calculateDotWithStepSixTeen(a,b);
                }
                tEnd=clock();
                cpu_time_used = ((double) (tEnd - tStart)) / CLOCKS_PER_SEC;
                cpu_time_used=((double)cpu_time_used/FOR_LOOP_TIMES);
                flops=((double) calculations / cpu_time_used);
                printf("Time taken: %f seconds.Calculations: %li.Flops: %f\n",cpu_time_used,calculations,flops);
		fprintf(f, "Data Length:%d Step:%d\nTime: %f seconds Calculations: %li Flops: %f\n",ARRAY_SIZE,step,cpu_time_used,calculations,flops);
                break;
        }
    }
}
