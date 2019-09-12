import os
import os.path
import numpy
import keras
import mysql.connector
from mysql.connector import Error
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

def modelSave(user_id, netname, mas, directory):

  K.clear_session()
  
  numpy.random.seed(42)
  
  model = Sequential()

  for i in range(len(mas)):
        if (i==0):
            model.add(Dense(mas[i][1], input_dim=784, **mas[i][2]))
            print("2222222222222222222222222222222222222222")
        if ((i!=0)and(i!=len(mas)-1)):
            model.add(Dense(mas[i][1], **mas[i][2]))
            print("3333333333333333333333333333333333333333")
        if (i==(len(mas)-1)):
            model.add(Dense(mas[i][1], **mas[i][2]))
            print("4444444444444444444444444444444444444444")
            
  model.compile(loss="categorical_crossentropy", optimizer="SGD", metrics=["accuracy"])
  model_json = model.to_json()
  json_file = open(directory + "model" + user_id + netname + ".json", "w")
  json_file.write(model_json)
  json_file.close()

  if (os.path.exists(directory + "model" + user_id + ".h5")):
        print("55555555555555555555555555555555555555555555555")
        model.load_weights(directory + "model" + user_id + ".h5")
        
  model.save_weights(directory + "model" + user_id + netname + ".h5")
  CONN = mysql.connector.connect(host='localhost', database='tensor', user='root', password='')
  query = "INSERT INTO `neuronet` (`user_id`, `netname`, `json_path`, `h5_path`) VALUES(%s , %s, %s, %s)"
  args_json = directory + "model" + user_id + netname + ".json"
  args_h5 = directory + "model" + user_id + netname + ".h5"
  args = (user_id, netname, args_json, args_h5)
  id = 0
  cursor = CONN.cursor()
  cursor.execute(query, args)
  id = cursor.lastrowid
  CONN.commit()
  cursor.close()

  K.clear_session()
  
  return str(id)
