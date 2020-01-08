BARES=~/Desktop/tempClone/bare/
NONBARES=~/Desktop/tempClone/non-bare
make:
	mkdir $(BARES)test1.git;git -C $(BARES)test1.git/ init --bare;git -C $(NONBARES)test1 init; git -C $(NONBARES)test1 add .;git -C $(NONBARES)test1 commit -m 'initial';git -C $(NONBARES)test1 push $(BARES)test1.git master;git clone $(BARES)test1.git;
clone:
	git clone ~/Desktop/tempClone/bare/test1.git
clean:
	rm -r ~/Desktop/tempClone/bare/test1.git
	rm -r ~/Desktop/tempClone/non-bare/test1

