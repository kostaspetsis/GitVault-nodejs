import numpy as np
import random#for random choice


#return what comes(y=x)
def purelin(x):
	return x

def forward_propagation(ins,ws,bias=0):
	#eswteriko ginomeno inputs kai varwn
	n1 = np.dot(ins,ws) + bias

	# kane purelin
	a = purelin(n1)
	
	#epestrepse tin eksodo a
	return a

def exitApp(weights):
	print("Final weights: ")
	for i in range(len(weights)):
		print(weights[i])
	return

def least_mean_square(inputs,targets,weights):
	sum1 = 0
	
	for i in range(len(weights)):
		sum1 += pow((targets[i] - np.dot(inputs[i], weights)),2)
	return sum1

def main():
	EPOCHS = 3
	MIN_FLOAT = 0.1
	withBIAS = 0
	
	#learning rate
	learn_r = 0.001

	#bias
	bias = 0.6	

	#horizontal top, vertical left, vertical right, horizontal bot
	patterns = np.array([ [1,1,-1,-1],[1,-1,1,-1],[-1,1,-1,1],[-1,-1,1,1] ])
	pat_targets = np.array([0,1,1,0])#0 for horizontal,1 for vertical
	

	#mperdema twn 4 patterns kai twn targets
	inputs = []
	targets = []
	for i in range(100):
		rand_index = random.choice([0,1,2,3])
		inputs.append(patterns[rand_index])
		targets.append(pat_targets[rand_index])
	#meta o inputs einai 100 pinakwn opoi o kathenas einai enas apo tous tesseris twn patterns


#	for i in range(len(inputs)):
#		print(inputs[i])
#		print(targets[i])
#	return
#	return
	#random weights
	weights = np.random.rand(4,1)#4 inputs 1 output, no hidden,simple adaline

	# traing the network
	for epoch in range(EPOCHS):
		print("Epoch [" + str(epoch) + ']')
		for x in range(len(inputs)):
			if withBIAS == 1:
				a = forward_propagation(inputs[x],weights,bias)
			else:
				a = forward_propagation(inputs[x],weights)

			#poio einai to error
			error = targets[x] - a

			lms = least_mean_square(inputs,targets,weights)
			if lms < 0.001:
				print("lms is very small.Exiting...")
				exitApp(weights)			
			
			if withBIAS == 1:
				#recalculate bias
				bias = bias + learn_r * a * error
				print("\tOutput: " + str(a) +", error: "+str(error)+",bias: "+str(bias)+",\n\tweights: ")
			else:
				print("\tOutput: " + str(a) +", error: "+str(error)+",\n\tweights: ")
			#newWeights = np.random.rand(4,1)
			#recalculate weights
			for i in range(len(weights)):
				weights[i] = weights[i] + learn_r*error*inputs[x][i]
			for i,w in enumerate(weights):
				print("\t\tWeight"+str(i)+": "+str(w))
			#for i in range(len(newWeights)):
				#weights[i] = newWeights[i]
	
	for i in range(len(patterns)):
		print(patterns[i])
		if withBIAS == 1:
			a = forward_propagation(patterns[i],weights,bias)
		else:
			a = forward_propagation(patterns[i],weights)
		print("Output = " + str(a))
		print("")	
		# if a <= 0.5:
		# 	print("\t(Horizontal)")
		# elif a > 0.5:
		# 	print("\t(Vertical)")

	exitApp(weights)

if __name__ == "__main__":
	main()
