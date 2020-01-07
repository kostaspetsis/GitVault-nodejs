import matplotlib.pyplot as plotter
import numpy as np
import random#for random choice
import sys
import math as m

PIE = 3.14159
#global 
errorsList = []

def int_overflow(val):
  if not -sys.maxint-1 <= val <= sys.maxint:
    val = (val + (sys.maxint + 1)) % (2 * (sys.maxint + 1)) - sys.maxint - 1
  return val

def fToApproximate(p):
	if p < -2 or p > 2:
		print("p overflowed")
		sys.exit()
	res = 1.0+m.sin(p*(PIE/2.0))
	return res


def random_function(list):
	list = []
	n = 10
	bottom = -0.5
	for m in list:
		for i in range(m):
			list.append(random.uniform(bottom, bottom + m/n))
		bottom += m/n
	return list

#return what comes(y=x)
def purelin(x):
	return x

def logsigmoid(x):
	#return 1 / (1 + m.exp(-x))
	if x < 0:
		return 1 - 1 / (1 + m.exp(x))
	return 1 / (1 + m.exp(-x))

def inverse_logsigmoid(x):
	if x>0 and x < 1:
		res = m.log(x/(1-x))
	else:
		res = 1
	
	return  res

def forward_propagation(ins,ws,bias=0):
	#eswteriko ginomeno inputs kai varwn
	#n1 = np.dot(ins,ws)#
	# n1 = np.full(len(ins),0)
	# for i in range(len(ins)):
	# 	n1[i] = ins[i]*ws[i]+bias[i]
	n1 = np.dot(ins,ws)
	n1 += bias
	# kane purelin
	a = purelin(n1)
	# a = np.full(len(n1),0)
	# for i in range(len(n1)):
	# 	a[i] = logsigmoid(n1[i])

	#epestrepse tin eksodo a
	return a

def exitApp(patterns,weightsIH,weightsHO,error,biases,bias=0):
	# print("Final weights: ")
	# for i in range(len(weights)):
	# 	print(weights[i])
	# return
	MIN_FLOAT = 0.1
	# for i in range(len(patterns)):
	# 	print("")
	# 	#print(labels[i])
	# 	print(patterns[i])
	# 	#if withBIAS == 1:
	# 	#for j in range(len(patterns)):
	# 	a = forward_propagation(patterns,weights,bias)
	# 	#else:
	# 	#	a = forward_propagation(patterns[i],weights)
	# 	print("\tOutput: " + str(a) +", error: "+str(error)+",bias: "+str(bias))
	
	# 	# if a >= -60 - MIN_FLOAT or a <= -60+MIN_FLOAT:
	# 	# 	print("\tPredict = (F)")
	# 	# elif a >= 0 - MIN_FLOAT or a <= 0+MIN_FLOAT:
	# 	# 	print("\tPredict = (G)")
	# 	# elif a >= 60 - MIN_FLOAT or a <= 60+MIN_FLOAT:
	# 	# 	print("\tPredict = (T)")
	print("Final weightsIH are:")
	for i,w in enumerate(weightsIH):
		print("\t\tWeight"+str(i)+": "+str(w))
	print("\nFinal weightsHO are:")
	for i,w in enumerate(weightsHO):
		print("\t\tWeight"+str(i)+": "+str(w))


	outputL1 = np.full(len(weightsIH),0)
	for i in range(len(weightsIH)):
		outputL1[i] = logsigmoid(patterns*weightsIH[i]+biases[i])

	outputL2 = forward_propagation(outputL1,weightsHO,bias)
	a=outputL2
	print("\tOutput: " + str(a) +", error: "+str(error)+",bias: "+str(bias))
	print("Final biases are:")
	for i,w in enumerate(biases):
		print("\t\tBiasesIH"+str(i)+": "+str(w))

	
	print("correct answer is :"+str(fToApproximate(patterns)))
	# global errorsList
	# #do the plot
	# plotter.title('Letters classifier<-Plot of the reducing error->')
	# plotter.ylabel('Sum square error')
	# plotter.xlabel('Training steps')
	# plotter.plot(errorsList)
	# plotter.show()
	sys.exit()

def least_mean_square(inputs,targets,weights):
	sum1 = 0
	
	# for i in range(len(inputs)):
	# 	for j in range(len(weights)):
	# 		#sum1 += pow((targets[i] - np.dot(inputs, weights)),2)
	# 		sum1 += pow(targets[i] - inputs[i] * weights[j],2)
	for i in range(len(weights)):
		#sum1 += pow((targets[i] - np.dot(inputs, weights)),2)
		dot = inputs*weights[i]

	sum1+=pow(targets - dot,2)
	return sum1

def main():
	EPOCHS = 100
	MIN_FLOAT = 0.1
	withBIAS = 1
	
	#learning rate
	learn_r = 0.03

	numOfWeights = 10
	numOfInputs = 50

	#weights from input to hidden
	weightsIH = np.full(numOfWeights,-0.5 + random.random() % 1)
	
	#weights from hidden to output
	weightsHO = np.full(numOfWeights,-0.5 + random.random() % 1)
	
	#biases
	biases = np.full(numOfWeights,-0.5 + random.random() % 1)
	bias=-0.5 + random.random() % 1
	
	
	inputs = np.full(numOfInputs,0.0)
	targets = np.full(numOfInputs,0.0)
	for i in range(numOfInputs):
		inputs[i] = random.uniform(-2,2)
		targets[i] = fToApproximate(inputs[i])


	
	lms =0
	# traing the network
	for epoch in range(EPOCHS):
		print("Epoch [" + str(epoch) + ']')
		for x in range(numOfInputs):
			outputL1 = np.full(numOfWeights,0.0)
			outputL1_before_sig = np.full(numOfWeights,0.0)
			for i in range(numOfWeights):
				outputL1[i] = logsigmoid(inputs[x]*weightsIH[i]+biases[i])
				outputL1_before_sig[i] = inputs[x]*weightsIH[i]+biases[i]
			outputL2 = forward_propagation(outputL1,weightsHO,bias)
			a = outputL2
		
			#poio einai to error
			error = targets[x] - a
			#print(error)
			
			#currentSumOfErrors += error*error
			
			#lms = least_mean_square(inputs[x],targets[x],weightsIH)
			#errorsList.append(lms)
			# if lms < 0.001:
			# 	print("lms is very small.Exiting...")
			# 	if withBIAS:
			# 		exitApp(inputs[x],weightsIH,weightsHO,error,biases,bias)
			# 	else:
			# 		exitApp(inputs[x],weightsIH,weightsHO,error,biases)
			# 	# if withBIAS == 1:
			# 	# 	print("\tOutput: " + str(a) +", error: "+str(error)+",bias: "+str(bias)+",\n\tweights: ")
			# 	# else:
			# 	# 	print("\tOutput: " + str(a) +", error: "+str(error)+",\n\tweights: ")
				
				
				
			if withBIAS == 1:
				#recalculate bias
				for i in range(len(biases)):
					biases[i] = biases[i] + learn_r*a*error*inputs[x]
				#bias = bias + learn_r * a * error
				#print("\tOutput: " + str(a) +", error: "+str(error)+",bias: "+str(bias)+",\n\tweights: ")
			else:
				pass#print("\tOutput: " + str(a) +", error: "+str(error)+",\n\tweights: ")
			#newWeights = np.random.rand(4,1)
			#recalculate weights

			for i in range(numOfWeights):
				weightsHO[i] = weightsHO[i] + learn_r*error*outputL1_before_sig[i]
				#print(error)

			#return
			for i in range(numOfWeights):
				derror = weightsHO[i] - weightsIH[i]
				weightsIH[i] = weightsIH[i] + learn_r*error*inputs[x]
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
		exitApp(0.24,weightsIH,weightsHO,error,biases,bias)
	else:
		exitApp(inputs[0],weightsIH,weightsHO,error,biases,bias)
if __name__ == "__main__":
	main()
