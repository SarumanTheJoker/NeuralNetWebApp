import os
import os.path
import numpy
import keras
import tensorflow as tf
from keras.datasets import cifar10
from keras.models import Sequential
from keras.layers import Dense, Flatten, Activation
from keras.layers import Dropout
from keras.layers.convolutional import Conv2D, MaxPooling2D
from keras.utils import np_utils
from keras.optimizers import SGD
from keras.datasets import mnist
from keras.models import model_from_json
from keras import backend as K

def NeuralLearnMnist(mas, user_id, directory):

    K.clear_session()
    
    numpy.random.seed(42)
    (X_train, y_train), (X_test, y_test) = mnist.load_data()
    X_train = X_train.reshape(60000, 784)
    X_test = X_test.reshape(10000, 784)
    X_train = X_train.astype('float32')
    X_test = X_test.astype('float32')
    X_train /= 255
    X_test /= 255
    Y_train = np_utils.to_categorical(y_train, 10)
    Y_test = np_utils.to_categorical(y_test, 10)
    
    model = Sequential()
##    print(mas[0][1], mas[0][2])
##    print(mas[1][1], mas[1][2])
##    print(mas[2][1], mas[2][2])
##    print(mas[3][1], mas[3][2])
##    print(mas[4][1], mas[4][2])
##    print("111111111111111111111111111111111111")
    
    for i in range(len(mas)):
        if (i==0):
            model.add(Dense(mas[i][1], input_dim=784, **mas[i][2]))
            print("2222222222222222222222222222222222222222")
        if ((i!=0)and(i!=len(mas)-1)):
            model.add(Dense(mas[i][1], **mas[i][2]))
            print("3333333333333333333333333333333333333333")
        if (i==(len(mas)-1)):
            model.add(Dense(10, **mas[i][2]))
            print("4444444444444444444444444444444444444444")

    if (os.path.exists(directory + "model" + user_id + ".h5")):
        print("55555555555555555555555555555555555555555555555")
        model.load_weights(directory + "model" + user_id + ".h5")
    
    global graph
    graph = tf.get_default_graph() 

    with graph.as_default():                  
        model.compile(loss="categorical_crossentropy", optimizer="SGD", metrics=["accuracy"])
        print(model.summary())

        model.fit(X_train, Y_train, batch_size=200, epochs=5, validation_split=0.2, verbose=2)
    scores = model.evaluate(X_test, Y_test, verbose=0)
    model.save_weights(directory + "model" + user_id + ".h5")

    print ("accuracy: %.2f%%" % (scores[1]*100))

    K.clear_session()
                      
    return ("accuracy: %.2f%%" % (scores[1]*100))

