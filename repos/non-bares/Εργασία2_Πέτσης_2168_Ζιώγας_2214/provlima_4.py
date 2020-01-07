import matplotlib.pyplot as plotter
import numpy as np
import random#for random choice
import sys

#global 
errorsList = []

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

def exitApp(patterns,labels,weights,error,bias=0):
	# print("Final weights: ")
	# for i in range(len(weights)):
	# 	print(weights[i])
	# return
	MIN_FLOAT = 0.1
	for i in range(len(patterns)):
		print("")
		print(labels[i])
		print(patterns[i])
		#if withBIAS == 1:
		a = forward_propagation(patterns[i],weights,bias)
		#else:
		#	a = forward_propagation(patterns[i],weights)
		print("\tOutput: " + str(a) +" ,bias: "+str(bias))
	
		# if a >= -60 - MIN_FLOAT or a <= -60+MIN_FLOAT:
		# 	print("\tPredict = (F)")
		# elif a >= 0 - MIN_FLOAT or a <= 0+MIN_FLOAT:
		# 	print("\tPredict = (G)")
		# elif a >= 60 - MIN_FLOAT or a <= 60+MIN_FLOAT:
		# 	print("\tPredict = (T)")
		if a <= -59.01:
			print("\tPredict = (F)")
			error1 = -60 - a
		elif a >= -1 and a < 59:
			print("\tPredict = (G)")
			error1 = 0 - a
		elif a >=59.01:
			print("\tPredict = (T)")
			error1 = 60 - a
		print("error : "+ str(error1))
	print("Final weights are:")
	for i,w in enumerate(weights):
		print("\t\tWeight"+str(i)+": "+str(w))
	global errorsList
	#do the plot
	plotter.title('Letters classifier<-Plot of the reducing error->')
	plotter.ylabel('Sum square error')
	plotter.xlabel('Training steps')
	plotter.plot(errorsList)
	plotter.show()
	sys.exit()

def least_mean_square(inputs,targets,weights):
	sum1 = 0
	
	for i in range(len(weights)):
		sum1 += pow((targets[i] - np.dot(inputs[i], weights)),2)

	return sum1

def main():
	EPOCHS = 100
	MIN_FLOAT = 0.1
	withBIAS = 0
	
	#learning rate
	learn_r = 0.03

	#bias
	bias = 0.5

	#T,G,F patterns and shifted
	patterns = np.array([ [1,-1,-1,-1,  1,1,1,1,  1,-1,-1,-1,  -1,-1,-1,-1],
						  [1,1,1,1,     1,-1,1,1, 1,-1,1,1,  -1,-1,-1,-1],
						  [1,1,1,1,     1,1,-1,-1, 1,-1,-1,-1, -1,-1,-1,-1],
						  #shifted
						  [-1,-1,-1,-1,  1,-1,-1,-1, 1,1,1,1,  1,-1,-1,-1],
						  [-1,-1,-1,-1,  1,1,1,1,  1,-1,1,1,   1,-1,1,1],
						  [-1,-1,-1,-1,  1,1,1,1,  1,1,-1,-1,  1,-1,-1,-1]])
	pat_targets = np.array([60,0,-60, 60,0,-60])#0 for horizontal,1 for vertical
	labels_targets = np.array(['T','G','F','T','G','F'])

	
	steps = 102+6

	inputs = np.full((steps, 16),0)
	targets = np.full((steps,1),0)
	labels = np.full((steps,1),'')
	global errorsList
	#mperdema twn 4 patterns kai twn targets
	#inputs = []
	#targets = []
	for i in range(steps):
		rand_index = random.choice([0,1,2,3,4,5])
		#inputs.append(patterns[rand_index])
		for j in range(16):
			inputs[i][j] = patterns[rand_index][j]
		targets[i] = pat_targets[rand_index]
		labels[i] = labels_targets[rand_index]
	for i in range(6):
		for j in range(16):
			inputs[102+i] = patterns[i][j]
			targets[102+i] = pat_targets[i]
			labels[102+i] = labels_targets[i]

	weights = np.random.rand(16,1)#4 inputs 1 output, no hidden,simple adaline
	#currentSumOfErrors = 0.0000000
	lms =0
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
			#currentSumOfErrors += error*error
			lms = least_mean_square(inputs,targets,weights)
			errorsList.append(lms)
			if lms < 0.1:
				print("lms is very small.Exiting...")
				if withBIAS:
					exitApp(patterns,labels_targets,weights,error,bias)
				else:
					exitApp(patterns,labels_targets,weights,error)
				# if withBIAS == 1:
				# 	print("\tOutput: " + str(a) +", error: "+str(error)+",bias: "+str(bias)+",\n\tweights: ")
				# else:
				# 	print("\tOutput: " + str(a) +", error: "+str(error)+",\n\tweights: ")
				
				
				
			if withBIAS == 1:
				#recalculate bias
				bias = bias + learn_r * a * error
				#print("\tOutput: " + str(a) +", error: "+str(error)+",bias: "+str(bias)+",\n\tweights: ")
			else:
				pass#print("\tOutput: " + str(a) +", error: "+str(error)+",\n\tweights: ")
			#newWeights = np.random.rand(4,1)
			#recalculate weights
			for i in range(len(weights)):
				weights[i] = weights[i] + learn_r*error*inputs[x][i]
			# for i,w in enumerate(weights):
			# 	print("\t\tWeight"+str(i)+": "+str(w))
			#for i in range(len(newWeights)):
				#weights[i] = newWeights[i]
		
	# for i in range(len(patterns)):
	# 	print(patterns[i])
	# 	if withBIAS == 1:
	# 		a = forward_propagation(patterns[i],weights,bias)
	# 	else:
	# 		a = forward_propagation(patterns[i],weights)
	# 	print("Output = " + str(a))	
	# 	if a == 60 - MIN_FLOAT or a == 60+MIN_FLOAT:
	# 		print("\t(T)")
	# 	elif a == 0 - MIN_FLOAT or a == 0+MIN_FLOAT:
	# 		print("\t(G)")
	# 	elif a == -60 - MIN_FLOAT or a == -60+MIN_FLOAT:
	# 		print("\t(F)")

	if withBIAS:
		exitApp(patterns,labels_targets,weights,error,bias)
	else:
		exitApp(patterns,labels_targets,weights,error)
if __name__ == "__main__":
	main()
