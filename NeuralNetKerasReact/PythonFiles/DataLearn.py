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
from tensorflow.python.keras.preprocessing.image import ImageDataGenerator
from tensorflow.python.keras.models import Sequential
from tensorflow.python.keras.layers import Conv2D, MaxPooling2D
from tensorflow.python.keras.layers import Activation, Dropout, Flatten, Dense

def NeuralDataLearn(mas,user_id,classCount,train_path,val_path,test_path,train_number,val_number,test_number,epochs,batch_size,img_width,img_height,directory): 

    if (classCount == 2):
        classMode = 'binary'
        loss1 = 'binary_crossentropy'
    else:
        classMode = 'categorical'
        loss1 = 'categorical_crossentropy'
    # Каталог с данными для обучения
    train_dir = train_path
    # Каталог с данными для проверки
    val_dir = val_path
    # Каталог с данными для тестирования
    test_dir = test_path

    img_width, img_height = 150, 150
    input_shape = (img_width, img_height, 3)

    print ('classMode = ', classMode)
    print ('loss1 = ', loss1)
    
    # Количество эпох
    epochs = epochs
    # Размер мини-выборки
    batch_size = batch_size
    # Количество изображений для обучения
    nb_train_samples = train_number * classCount
    # Количество изображений для проверки
    nb_validation_samples = val_number * classCount
    # Количество изображений для тестирования
    nb_test_samples = test_number * classCount
    
    model = Sequential()
    model.add(Conv2D(32, (3, 3), input_shape=input_shape, activation='relu'))
    model.add(Flatten())
##    print(mas[0][1], mas[0][2])
##    print(mas[1][1], mas[1][2])
##    print(mas[2][1], mas[2][2])
##    print(mas[3][1], mas[3][2])
##    print(mas[4][1], mas[4][2])
##    print("111111111111111111111111111111111111")
    
    for i in range(len(mas)):
##        if (i==0):
##            model.add(Dense(mas[i][1], input_dim=784, **mas[i][2]))
##            print("2222222222222222222222222222222222222222")
        if ((i!=0)and(i!=len(mas)-1)):
            model.add(Dense(mas[i][1], **mas[i][2]))
            print("3333333333333333333333333333333333333333")
        if (i==(len(mas)-1)):
            model.add(Dense(mas[i][1], **mas[i][2]))
            print("4444444444444444444444444444444444444444")

    if (os.path.exists(directory + "model" + user_id + ".h5")):
        print("55555555555555555555555555555555555555555555555")
        model.load_weights(directory + "model" + user_id + ".h5")
    
##    global graph
##    graph = tf.get_default_graph() 
##    
##    with graph.as_default():                  
##        model.compile(loss="categorical_crossentropy", optimizer="SGD", metrics=["accuracy"])
##        print(model.summary())
##
##        model.fit(X_train, Y_train, batch_size=200, epochs=5, validation_split=0.2, verbose=2)
        
    model.compile(loss=loss1,
              optimizer='adam',
              metrics=['accuracy'])

    datagen = ImageDataGenerator(rescale=1. / 255)

    train_generator = datagen.flow_from_directory(
        train_dir,
        target_size=(img_width, img_height),
        batch_size=batch_size,
        class_mode=classMode)

    val_generator = datagen.flow_from_directory(
        val_dir,
        target_size=(img_width, img_height),
        batch_size=batch_size,
        class_mode=classMode)

    test_generator = datagen.flow_from_directory(
        test_dir,
        target_size=(img_width, img_height),
        batch_size=batch_size,
        class_mode=classMode)

    model.fit_generator(
        train_generator,
        steps_per_epoch=nb_train_samples // batch_size,
        epochs=epochs,
        validation_data=val_generator,
        validation_steps=nb_validation_samples // batch_size)
    
    scores = model.evaluate_generator(test_generator, nb_test_samples // batch_size)
    
    model_json = model.to_json()
    json_file = open(directory + "model" + user_id + ".json", "w")
    json_file.write(model_json)
    json_file.close()
    model.save_weights(directory + "model" + user_id + ".h5")

    print ("accuracy: %.2f%%" % (scores[1]*100))
                      
    return ("accuracy: %.2f%%" % (scores[1]*100))

