#c:/python37
from flask import Flask, render_template, jsonify, request, session, Response
from flask import send_file
from datetime import datetime
import shutil

##import sys
##sys.path.insert(0, 'C:/Work/Python/Keras')

##import os
##import sys
##sys.path.append(os.path.abspath(os.path.dirname(__file__) + '/' + 'C:/Work/Python/Keras'))
##import Neural

import time
import os 
import sys
import json
import logging
import shutil
from werkzeug.utils import secure_filename
from flask_cors import CORS, cross_origin
#import cgi
#import cgitb
#cgitb.enable()
#form = cgi.FieldStorage()
#set_dir = form.getvalue('d')
import mysql.connector
from mysql.connector import Error

mas = [] # глобальная переменная которая содержит слои сети

logging.basicConfig(level=logging.INFO)

logger = logging.getLogger('HELLO WORLD')

# Содержит путь к папке главного файла tensorshow.py
dirTensorPath =  os.path.abspath(os.path.dirname(sys.argv[0]))
conf_file = dirTensorPath + '/tensorshow.conf'

# директория пользователя с сохр данными обучения
directory = ""
# директория где лежат файля для работы с НС
directoryPython = dirTensorPath + "/../../PythonFiles/"
# процент обучения
trainPer = 0;
# кол-во передаваемых файлов
filesLen = 0
# индекс
i = 0
# количество для тренировки
iTrain = 0
# количество для валидации
iVal = 0
# количество для тестов
iTest = 0
# название класса
className = ""
# путь, где лежит файл для теста
fileTestPath = ''
# путь к самому файлу
fileTestPath1 = ''
# Содержит в себе название классов
massClass = []

Position = 1

with open(conf_file, 'r') as f:
    data = json.loads(f.read())
directory = data["directory"]
#print("data-- %s" % data)
os.chdir(directory)
curr_dir = directory
home_dir = directory
f.close()

app = Flask(__name__, static_folder="./static/dist", template_folder="../public")
app.secret_key = os.urandom(24)

def replacer(str):
  return str.replace("%20", " ")

def KMGTbytes(b):
  if b < 1024:
    return ("%sB" % b)
  if b < 1048576:
    return ("%.1fkB" % ( b/1024 ))
  if b < 1073741824:
    return ("%.1fMB" % ( b/1048576 ))
  if b < 1099511627776:
    return ("%.1fGB" % ( b/1073741824 ))

def lsDir(dir):
  d = {}
  m = []
  for entry in os.scandir(replacer(dir)):
    timestamp = os.stat(entry.name).st_mtime
    dt = datetime.fromtimestamp(timestamp) 
    df = "{:%Y %b %d, %H:%M:%S}".format(dt)
    if entry.is_dir():
       d = { "checked": bool(), "type": "dir", "name": entry.name, "date": df }
    if entry.is_file():
       filesize  = os.stat(entry.name).st_size
       d = { "checked": bool(), "type": "file", "name": entry.name, "date": df, "size": KMGTbytes(filesize) }
    m.append(d)
  return jsonify(m)
#  return json.dumps(m)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/hello")
def hello():
    return "Hello World!"

@app.route("/ls", methods=["GET", "POST"])
def ls():
    return lsDir(curr_dir)

@app.route("/cd", methods=["GET", "POST"])
def cd():
    curr_dir = os.getcwd() + '/' + request.args['dir']
    os.chdir(replacer(curr_dir))
    return lsDir(curr_dir)

@app.route("/pwd", methods=["GET", "POST"])
def pwd():
    return os.getcwd()

@app.route("/home", methods=["GET", "POST"])
def home():
    os.chdir(replacer(home_dir))
    return lsDir(home_dir)

@app.route("/back", methods=["GET", "POST"])
def back():
    if len(os.getcwd()) > len(directory):
      os.chdir("..")
      curr_dir = os.getcwd()
      return lsDir(curr_dir)
    else:
      return lsDir(home_dir)

@app.route("/connect")
def connect():
    """ Connect to MySQL database """
    try:
        global CONN
        CONN = mysql.connector.connect(host='localhost', database='tensor', user='root', password='')
        if CONN.is_connected():
            print('Connected to MySQL database')
            return('OK')
    except Error as e:
        print(e)
    finally:
        print('Connection to %s closed' % CONN)
#        conn.close()

@app.route("/login")
def login():
    query="SELECT id FROM `users` WHERE `name`=%s AND `password`=%s"
    password = request.args['password']
    username = request.args['user']
    args = (username, password)
    try:
        cursor = CONN.cursor()
        cursor.execute(query, args)
        row = cursor.fetchone()
#        while row is not None:
#            row = cursor.fetchone()
#            return(row)

    except Error as e:
        print(e)

    finally:
#        cursor.close()
        if row is None:
           return('Error')
        else:
           return str(row[0])  

@app.route("/adduser")
def adduser():
    query = "INSERT INTO `users` (`name`, `password`) VALUES(%s, %s)"
    password = request.args['password']
    username = request.args['user']
    args = (username, password)
    user_id = 0 

    try:
        cursor = CONN.cursor()
        cursor.execute(query, args)

        if cursor.lastrowid:
            print('last insert id', cursor.lastrowid)
            user_id = cursor.lastrowid
        else:
            print('last insert id not found')

        CONN.commit()
    except Error as error:
        print(error)

    finally:
#        cursor.close()
        return str(user_id)


@app.route("/addDirPer")
def addDirPer():
    dataName = request.args["dataName"];
    trainPersent = request.args["trainPersent"]
    user_id = request.args["user_id"]

    global trainPer
    global i
    global dirTensorPath
    i = 1
    
    trainPer = int(trainPersent)
    print ("TRAIN PER-------", trainPer)
    
##    print('dataname------------' + dataName)

    create_dir_path = dirTensorPath + "/../../UserLoadData/"
    if (os.path.exists(create_dir_path)):
      print('This dir exists!')
    else:   
      os.mkdir(create_dir_path)
    create_dir_path = dirTensorPath + "/../../UserLoadData/" + user_id
    if (os.path.exists(create_dir_path)):
      print('This dir exists!')
    else:   
      os.mkdir(create_dir_path)
    
    global directory
    directory = dirTensorPath + "/../../UserLoadData/" + user_id + "/" + dataName
##    global trainPer
##    trainPer = int(trainPersent)
    os.mkdir(directory)
    os.mkdir(directory + "/train")
    os.mkdir(directory + "/test")
    os.mkdir(directory + "/val")
    print('DirCreated')

    return "Good"

@app.route("/addDirDataClassName")
def addDirDataClassName():
    className1 = request.args["className"]
    dataName1 = request.args["dataName"]
    user_id1 = request.args["user_id"]
    
    global className
    global massClass
    massClass.append(className1)
    className = className1
    
    global i
    i = 1
    
    global directory
    global dirTensorPath
    directory1 = ''
    directory1 = dirTensorPath + "/../../UserLoadData/" + user_id1 + "/" + dataName1 + "/"
##    directory = directory1 + className
##    os.mkdir(directory)
    os.mkdir(directory1 + "/train/" + className)
    os.mkdir(directory1 + "/test/" + className)
    os.mkdir(directory1 + "/val/" + className)
    print('DirClassNameCreated')

    return "Good"

@app.route("/addFileLength")
def addFileLength():
    fileLength = request.args["fileLength"]

    global fileLen
    global iTrain
    global iVal
    global iTest
    fileLen = int(fileLength)
    print ("FILE LENGTH--------", fileLen)

    coeff = trainPer/100
    iTrain = int(fileLen*coeff)
    iVal = iTrain + int((fileLen-iTrain)/2)
    iTest = int((fileLen-iTrain)/2)
    
    return "Good"

# Загрузка файлов в директорию train
@app.route('/upload', methods=['POST','GET'])
def fileUpload():
    target=os.getcwd()
    if not os.path.isdir(target):
       os.mkdir(target)
    global directory
    global trainPer
    global fileLen
    global i
    global iTrain
    global iVal
    global Position
    global className
    Position = 1
##    print('TRAIN--------------', iTrain)
##    print('VAL--------------', iVal)
##    print('I--------------', i)
    
    curr_dir = target
    file = request.files['file'] 
    filename = file.filename
#    filename = secure_filename(file.filename)
##    destination="/".join([target, filename])
    destination=directory + "/"
    logger.info("welcome to upload - %s" % filename)
##    print('dest--------------------------' + destination)
##    file.save(destination)

##    file.save(os.path.join(destination, filename))
##    session['uploadFilePath']=destination
##    data={"Pischaeff": filename}
##    js = json.dumps(data)
##    resp = Response(js, status=200, mimetype='application/json')
    
    destination = destination + "train/" + className + "/"
    file.save(os.path.join(destination, filename))
    session['uploadFilePath']=destination
    data={"Pischaeff": filename}
    js = json.dumps(data)
    print('HERE WORKING I1111   !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', i)
    print('dest--------------------------' + destination)
    i+=1
    resp = Response(js, status=200, mimetype='application/json')
    return resp

# Создание пути файла для тестирования
@app.route('/uploadTestPath', methods=['POST','GET'])
def uploadTestPath():
    user_id = request.args['user_id']

    global fileTestPath
    global dirTensorPath
    fileTestPath = dirTensorPath + "/../../UserLoadData/" + user_id + "/ForTesting/"

    return 'good'
# Загрузка файла для тестирования
@app.route('/uploadTest', methods=['POST','GET'])
def uploadTest():
    file = request.files['file']
    
    filename = file.filename
    global fileTestPath
    global fileTestPath1
    fileTestPath1 = fileTestPath + filename
    print ("fileTestPath1----" , fileTestPath1)
    file.save(os.path.join(fileTestPath, filename))
    
    return filename
  
# Тестирование работы НС
@app.route('/uploadTestWork', methods=['POST','GET'])
def uploadTestWork():
    global fileTestPath
    global fileTestPath1
    global massClass

    image_width = int(request.args['image_width'])
    image_heigth = int(request.args['image_height'])
    user_id = request.args['user_id']
    classCount = int(request.args['classCount'])

    if (classCount == 2):
        loss1 = 'binary_crossentropy'
    else:
        loss1 = 'categorical_crossentropy'

##    import sys
##    sys.path.append('C:/Work/Python/Keras/')
##    import DataTest

##    print("TESTING DataLearn!!!!")
##    result = DataTest.userDataTest(fileTestPath,image_width,image_heigth,user_id)


    import os
    import os.path
    import numpy as np
    import tensorflow as tf
    import keras
    from keras.preprocessing import image
    from keras.utils import CustomObjectScope
    from keras.initializers import glorot_uniform
    from keras.models import model_from_json
    from keras import backend as K

    K.clear_session()
    
    print ("fileTestPath1----" , fileTestPath1)
    img = image.load_img(fileTestPath1, target_size=(image_width, image_heigth))
    print("img = image.load_img(fileTestPath1, target_size=(image_width, image_heigth))")
      
    x = image.img_to_array(img)
    print("x = image.img_to_array(img)")
    x /= 255
    print("x /= 255")
    x = np.expand_dims(x, axis=0)
    print("x = np.expand_dims(x, axis=0)")

##    json_file = open("C:/Work/Python/Keras/model" + user_id + ".json", "r")
##    print("json_file = open(\"C:/Work/Python/Keras/model\" + user_id + \".json\", \"r\")")
##    print("C:/Work/Python/Keras/model" + user_id + ".json")
##    loaded_model_json = json_file.read()
##    print("loaded_model_json = json_file.read()")
##    json_file.close()
##    print("json_file.close()")
##    loaded_model = model_from_json(loaded_model_json)
##    print("loaded_model = model_from_json(loaded_model_json)")
##    loaded_model.load_weights("C:/Work/Python/Keras/model" + user_id + ".h5")
##    print("loaded_model.load_weights(\"C:/Work/Python/Keras/model\" + user_id + \.h5\")")
##    print("C:/Work/Python/Keras/model" + user_id + ".h5")
##    loaded_model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])
##    print("loaded_model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])")
    with CustomObjectScope({'GlorotUniform': glorot_uniform()}):
        json_file = open("C:/Work/Python/Keras/model" + user_id + ".json", "r")
        print("json_file = open(\"C:/Work/Python/Keras/model\" + user_id + \".json\", \"r\")")
        print("C:/Work/Python/Keras/model" + user_id + ".json")
        loaded_model_json = json_file.read()
        print("loaded_model_json = json_file.read()")
        json_file.close()
        print("json_file.close()")
        loaded_model = model_from_json(loaded_model_json)
        print("loaded_model = model_from_json(loaded_model_json)")
        loaded_model.load_weights("C:/Work/Python/Keras/model" + user_id + ".h5")
        print("loaded_model.load_weights(\"C:/Work/Python/Keras/model\" + user_id + \.h5\")")
        print("C:/Work/Python/Keras/model" + user_id + ".h5")
        loaded_model.compile(loss=loss1, optimizer='adam', metrics=['accuracy'])
        print("loaded_model.compile(loss=" + loss1 + ", optimizer='adam', metrics=['accuracy'])")

    prediction = loaded_model.predict(x)
    
    classes=massClass

    print(classes[np.argmax(prediction)])
    result = classes[np.argmax(prediction)]

    K.clear_session()
    
    return result
##    return result
    
# Перенос файлов в директории test и vault
@app.route('/fileMove', methods=['POST','GET'])
def fileMove():
  
    global directory
    global iTest
    global iTrain
    global Position
    global className
    destinationTrain = directory + "/" + "train/" + className + "/"
    destinationTest =  directory + "/" + "test/" + className + "/"
    destinationVal =  directory + "/" + "val/" + className + "/"
    print("destinationTrain",destinationTrain)
    print("destinationTest",destinationTest)
    print("destinationVal",destinationVal)

    files = os.listdir(destinationTrain)
    files.sort()

    print('iTrain', iTrain)
    print('iTest', iTest)
    
    for f in files:
      if (Position<=iTest):
        src = destinationTrain+f
        dst = destinationTest+f
        print("Position",Position)
        print('TEST')
        shutil.move(src, dst)
        Position += 1
      elif ((Position>iTest)and(Position<=iTrain)):
        src = destinationTrain+f
        dst = destinationVal+f
        print("Position",Position)
        print('VAL')
        shutil.move(src, dst)
        Position += 1
      elif (Position>iTrain):
        print("Position",Position)
        break
    return "Good"

#Сохранение пути к данным пользователя в БД
@app.route('/DataSave', methods=['POST','GET'])
def DataSave():

    global directiory

    user_id = request.args['user_id']
    dataName = request.args['dataName']

    print("DIRECTORY-----", directory)
    print("user_id-----", user_id)
    print("dataName-----", dataName)
    CONN = mysql.connector.connect(host='localhost', database='tensor', user='root', password='')
    query = "INSERT INTO `data` (`user_id`, `data_path`, `data_name`) VALUES(%s, %s, %s)"
    args = (user_id, directory, dataName)

    
    cursor = CONN.cursor()
    cursor.execute(query,args)
    CONN.commit()

    cursor.close()
    return "Good"

#Получение списка всех сохраненных данных пользователя
@app.route('/DataList', methods=['POST','GET'])
def DataList():
    user_id = request.args['user_id']
    
    CONN = mysql.connector.connect(host='localhost', database='tensor', user='root', password='')
    query = "SELECT data_path, data_name FROM `data` WHERE `user_id` = %s" % user_id
    args = (user_id)

    print ('1')
    
    cursor = CONN.cursor()
    cursor.execute(query)
    rows = cursor.fetchall()

    print (rows)
    
#    print('Total Row(s):', cursor.rowcount)
#    for row in rows:
#      print(row)

#    cursor.close()
    if rows is None:
      return('Error')
    else:
      return jsonify(rows)

# Получение списка всех сохраненных сетей пользователя    
@app.route("/listnet")
def listnet():

    user_id = request.args['user_id']
    
    CONN = mysql.connector.connect(host='localhost', database='tensor', user='root', password='')
    query = "SELECT id, netname FROM `neuronet` WHERE `user_id` = %s" % user_id
    args = (user_id)

    print ('1')
    
    cursor = CONN.cursor()
    cursor.execute(query)
    rows = cursor.fetchall()

    print (rows)
    
#    print('Total Row(s):', cursor.rowcount)
#    for row in rows:
#      print(row)

#    cursor.close()
    if rows is None:
      return('Error')
    else:
      return jsonify(rows)

## Удаление временного файла весов H5 и хранения моделей Json
@app.route("/DeleteH5", methods=["GET", "POST"])
def DeleteH5():
  import os
  import os.path

  global dirTensorPath
  global directoryPython
  
  user_id = request.args['user_id']
  if (os.path.exists(directoryPython + "model" + user_id + ".h5")):
    os.remove(directoryPython + "model" + user_id + ".h5")
  if (os.path.exists(directoryPython + "model" + user_id + ".json")):
    os.remove(directoryPython + "model" + ".json")
    
  return "File removed"

## Обучение нейронной сети
@app.route("/netLearn", methods=["GET", "POST"])
def netLearn():

    global mas
  
    lengthStr = request.args['length']
    iStr = request.args['i']
    
    units = int(request.args['units'])    
    activation = request.args['activation']  
    use_bias = request.args['use_bias']    
    kernel_initializer = request.args['kernel_initializer']  
    bias_initializer = request.args['bias_initializer']    
    kernel_constraint = request.args['kernel_constraint']    
    bias_constraint = request.args['bias_constraint']
    
    i = int(iStr)
    length = int(lengthStr)

    if (i==0) :
      mas = []

    d = dict()

    if (activation != "None"):
      d['activation']=activation
    d['use_bias'] = use_bias
    if (kernel_initializer != "None"):
      d['kernel_initializer'] = kernel_initializer
    if (bias_initializer != "None"):
      d['bias_initializer'] = bias_initializer
    if (kernel_constraint != "None"):
      d['kernel_constraint'] = kernel_constraint
    if (bias_constraint != "None"):
      d['bias_constraint'] = bias_constraint
    
    mas.append([])  # заносим пустую строку в матрицу
    # записываем в строку под номером i параметры слоя
    mas[i].append(request.args['type'])
    mas[i].append(int(request.args['units']))
    mas[i].append(d)
    
    return "Good"

@app.route("/neuralTraining", methods=["GET", "POST"])
def neuralTraining():

  import sys
  global directoryPython
  sys.path.append(directoryPython)
  import MnistLearn

  global mas

  user_id = request.args['user_id']

  print("Learning!!!!")
  result = MnistLearn.NeuralLearnMnist(mas,user_id,directoryPython)
  return result

## Обучение нейронной сети на загруженных данных
@app.route("/netLearnData", methods=["GET", "POST"])
def netLearnData():

    global mas
  
    lengthStr = request.args['length']
    iStr = request.args['i']
    
    units = int(request.args['units'])    
    activation = request.args['activation']  
    use_bias = request.args['use_bias']    
    kernel_initializer = request.args['kernel_initializer']  
    bias_initializer = request.args['bias_initializer']    
    kernel_constraint = request.args['kernel_constraint']    
    bias_constraint = request.args['bias_constraint']
    
    i = int(iStr)
    length = int(lengthStr)

    if (i==0) :
      mas = []

    d = dict()

    if (activation != "None"):
      d['activation']=activation
    d['use_bias'] = use_bias
    if (kernel_initializer != "None"):
      d['kernel_initializer'] = kernel_initializer
    if (bias_initializer != "None"):
      d['bias_initializer'] = bias_initializer
    if (kernel_constraint != "None"):
      d['kernel_constraint'] = kernel_constraint
    if (bias_constraint != "None"):
      d['bias_constraint'] = bias_constraint
    
    mas.append([])  # заносим пустую строку в матрицу
    # записываем в строку под номером i параметры слоя
    mas[i].append(request.args['type'])
    mas[i].append(int(request.args['units']))
    mas[i].append(d)
    
    return "Good"

@app.route("/neuralTrainingData", methods=["GET", "POST"])
def neuralTrainingData():

  import sys
  global directoryPython
  sys.path.append(directoryPython)
  import DataLearn

  global mas
  global directory
  global iTrain
  global iTest
  global iVal
  global fileLen
  
  test_path = directory + "/test/"
  train_path = directory + "/train/"
  val_path = directory + "/val/"

  iVal = int((fileLen-iTrain)/2)
  iTest = int((fileLen-iTrain)/2)
  
  user_id = request.args['user_id']
  classCount = int(request.args['classCount'])
  epochs = int(request.args['epochs'])
  batch_size = int(request.args['batch_size'])
  img_width = int(request.args['img_width'])
  img_height = int(request.args['img_height'])
  
  print("Learning!!!!")
  result = DataLearn.NeuralDataLearn(mas,user_id,classCount,train_path,val_path,test_path,iTrain,iVal,iTest,epochs,batch_size,img_width,img_height,directoryPython)
  return result

## Сохранение Нейронной сети
@app.route("/netSave", methods=["GET", "POST"])
def netSave():

    global mas
##    f.write("" + "\n")
    lengthStr = request.args['length']
    iStr = request.args['i']
    
    neural_type = request.args['type']
    units = int(request.args['units'])   
    activation = request.args['activation']
    use_bias = request.args['use_bias']    
    kernel_initializer = request.args['kernel_initializer']    
    bias_initializer = request.args['bias_initializer']  
    kernel_constraint = request.args['kernel_constraint']   
    bias_constraint = request.args['bias_constraint']

    i = int(iStr)
    length = int(lengthStr)

    d = dict()

    if (activation != "None"):
      d['activation']=activation
    d['use_bias'] = use_bias
    if (kernel_initializer != "None"):
      d['kernel_initializer'] = kernel_initializer
    if (bias_initializer != "None"):
      d['bias_initializer'] = bias_initializer
    if (kernel_constraint != "None"):
      d['kernel_constraint'] = kernel_constraint
    if (bias_constraint != "None"):
      d['bias_constraint'] = bias_constraint
    
    mas.append([])  # заносим пустую строку в матрицу
    # записываем в строку под номером i параметры слоя
    mas[i].append(request.args['type'])
    mas[i].append(int(request.args['units']))
    mas[i].append(d)

##  создаём матрицу слоёв
##  если только первый слой, то объявляем матрицу 
##    if (i==0) :
##      mas = []
##
##    mas.append([])  # заносим пустую строку в матрицу
##    # записываем в строку под номером i параметры слоя
##    mas[i].append(request.args['type'])
##    mas[i].append(request.args['units'])
##    mas[i].append(request.args['activation'])
##    mas[i].append(request.args['use_bias'])
##    mas[i].append(request.args['kernel_initializer'])
##    mas[i].append(request.args['bias_initializer'])
##    mas[i].append(request.args['kernel_constraint'])
##    mas[i].append(request.args['bias_constraint'])

    return "Worked!"

@app.route("/neuralSave", methods=["GET", "POST"])
def neuralSave():

  import sys
  global directoryPython
  sys.path.append(directoryPython)
  import NeuralSave

  global mas
  
  user_id = request.args['user_id']
  netname = request.args['netname']

  print("neuralSavePython")
    
  result = NeuralSave.modelSave(user_id,netname,mas,directoryPython)

  CONN = mysql.connector.connect(host='localhost', database='tensor', user='root', password='')
  # создаем запрос в базу данных
  query = "INSERT INTO `layers` (`net_id`, `type`, `units`, `activation`,`use_bias`,`kernel_initializer`,`bias_initializer`,`kernel_constraint`,`bias_constraint`) VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s)"
  args_net_id = result

  print("neuralSavePython")
  
  for i in range(len(mas)):
    args_type = mas[i][0]
    args_unints = mas[i][1]
    args_activation = mas[i][2]['activation']
    args_use_bias = mas[i][2]['use_bias']
    if ('kernel_initializer' in mas[i][2]):
      args_kernel_initializer = mas[i][2]['kernel_initializer']
    else:
      args_kernel_initializer = 'None'
    if ('bias_initializer' in mas[i][2]):
      args_bias_initializer = mas[i][2]['bias_initializer']
    else:
      args_bias_initializer = 'None'
    if ('kernel_constraint' in mas[i][2]):
      args_kernel_constraint = mas[i][2]['kernel_constraint']
    else:
      args_kernel_constraint = 'None'
    if ('bias_constraint' in mas[i][2]):
      args_bias_constraint = mas[i][2]['bias_constraint']
    else:
      args_bias_constraint = 'None'
    args = (args_net_id, args_type, args_unints, args_activation, args_use_bias, args_kernel_initializer, args_bias_initializer, args_kernel_constraint, args_bias_constraint)
    cursor = CONN.cursor()
    cursor.execute(query, args)
    CONN.commit()

##  neuralList(result)
##  CONN = mysql.connector.connect(host='localhost', database='tensor', user='root', password='')
##  query = "SELECT type FROM `layers` WHERE `net_id`=%s" % args_net_id
##  cursor = CONN.cursor()
##  cursor.execute(query)
##  row = cursor.fetchone()
##  
##  for item in row:
##    print('FROM DATA BASE--------------' + item)
       
  cursor.close()
  return result

def neuralList(net_id):

  CONN = mysql.connector.connect(host='localhost', database='tensor', user='root', password='')
  query = "SELECT units, activation FROM `layers` WHERE `net_id`=%s" % net_id
  cursor = CONN.cursor()
  cursor.execute(query)
  row = cursor.fetchall()
  
##  for item in row:
##    print('FROM DATA BASE--------------' + str(item))

  print('FROM DATA BASE--------------' + str(row[0][0]))
  print('FROM DATA BASE--------------' + str(row[1][1]))
  print('FROM DATA BASE--------------' + str(row[2][0]))
  
  cursor.close()
  
  return "Good"
@app.route("/rmdir", methods=["GET", "POST"])
def rmdir():
    curr_dir = os.getcwd()
    curr_dir1 = curr_dir  + '/' + replacer(request.args['dir'])
    for root, dirs, files in os.walk(curr_dir1, topdown=False):
      for name in files:
        os.remove(os.path.join(root, name))
      for name in dirs:
        os.rmdir(os.path.join(root, name))
    os.rmdir(curr_dir1)
    return lsDir(curr_dir)
	
@app.route("/rmfile", methods=["GET", "POST"])
def rmfile():
    curr_dir = os.getcwd()
    filename = replacer(request.args['file'])
    if os.path.exists(filename): 
       os.remove(filename)
    else:
        print("Can not delete the %s as it doesn't exists" % filename)
    try:
       os.remove(filename)
    except:
        print("Error while deleting %s " % filename)
    return lsDir(curr_dir)

@app.route('/download', methods=["GET", "POST"])
def fileDownload():
    #For windows you need to use drive name [ex: F:/Example.pdf]
    source=os.getcwd()
    data = request.data.decode('utf8')
    print("data-- %s" % request.data)
    data2 = json.loads(data)
    #data = request.form.to_dict()
    print("request-- %s" % data2['item'])
    filename = replacer(data2['item'])
    path="/".join([source, filename])
    print("path for download %s" % path)
    return send_file(path, as_attachment=True, attachment_filename=filename)
	
##@app.route('/upload1', methods=['POST','GET'])
def fileUpload1():
    target=os.getcwd()
    if not os.path.isdir(target):
       os.mkdir(target)
    global curr_dir 
    curr_dir = target
    file = request.files['file'] 
    filename = file.filename
#    filename = secure_filename(file.filename)
    destination="/".join([target, filename])
    logger.info("welcome to upload - %s" % filename)
    file.save(destination)
    session['uploadFilePath']=destination
    data={"Pischaeff": filename}
    js = json.dumps(data)
    resp = Response(js, status=200, mimetype='application/json')
    return resp

@app.route("/rename", methods=["GET", "POST"])
def rename():
    newfile = request.args['newname']
    oldfile = request.args['oldname']
    curr_dir = os.getcwd()
    if newfile:
       os.rename(oldfile, newfile)
    return lsDir(curr_dir)

@app.route("/paste", methods=["GET", "POST"])
def paste():
    destination = os.getcwd()
    filename = request.args['name']
    filepath = request.args['path']
    fileact = request.args['act']
    source = "/".join([filepath, filename])
    dst = "/".join([destination, filename])
    tmp = source + ".tmp"
#    print("copy  file %s to %s, %s" % (source, destination, tmp))
    if (fileact=='copy'):
       if os.path.isdir(source):
          shutil.copytree(source, tmp, False, None)
          os.rename(tmp, dst)  
       else:
          shutil.copy2(source, destination)
    if (fileact=='move'):
          os.rename(source, dst)  
    return lsDir(destination)

if __name__ == "__main__":
    app.run(debug=True)

#print('Content-type: text/html\r\n\r')
#print("<p>hello world!</p>")
#print("I can view this in my browser yay!!")
#for i in os.listdir(directory):
#     print(i)


#### Обучение нейронной сети
@app.route("/netLearn1", methods=["GET", "POST"])
def netLearn1():

    global mas
  
    lengthStr = request.args['length']
    iStr = request.args['i']

    user_id = request.args['user_id']
    
    units = int(request.args['units'])
    
    activation = request.args['activation']
    if (activation == "None"):
      activation = ", activation=\"" + activation + "\""
    else:
      activation = ""
    
    use_bias = request.args['use_bias']
    use_bias = ", use_bias=\"" + use_bias + "\""
    
    kernel_initializer = request.args['kernel_initializer']
    if (kernel_initializer != "None"):
      kernel_initializer = ", kernel_initializer=\"" + kernel_initializer + "\""
    else:
      kernel_initializer = ""
    
    bias_initializer = request.args['bias_initializer']
    if (bias_initializer != "None"):
      bias_initializer = ", bias_initializer=\"" + bias_initializer + "\""
    else:
      bias_initializer = ""
    
    kernel_constraint = request.args['kernel_constraint']
    if (kernel_constraint != "None"):
      kernel_constraint = ", kernel_constraint=\"" + kernel_constraint + "\""
    else:
      kernel_constraint = ""
    
    bias_constraint = request.args['bias_constraint']
    if (bias_constraint != "None"):
      bias_constraint = ", bias_constraint=\"" + bias_constraint + "\""
    else:
      bias_constraint = ""
    
    imageHeight = 28
    imageWidth = 28
    imageForDenseInputInt = imageHeight * imageWidth
    imageForDenseInput = str(imageForDenseInputInt)
    i = int(iStr)
    length = int(lengthStr)
    print ("length = " + lengthStr + "; i = " + iStr)
    result = ""

    if (i==0) :
      mas = []

    d = dict()

    if (activation != "None"):
      d['activation']=activation
    d['use_bias'] = use_bias
    if (kernel_initializer != "None"):
      d['kernel_initializer'] = kernel_initializer
    if (bias_initializer != "None"):
      d['bias_initializer'] = bias_initializer
    if (kernel_constraint != "None"):
      d['kernel_constraint'] = kernel_constraint
    if (bias_constraint != "None"):
      d['bias_constraint'] = bias_constraint
    
    mas.append([])  # заносим пустую строку в матрицу
    # записываем в строку под номером i параметры слоя
    mas[i].append(request.args['type'])
    mas[i].append(int(request.args['units']))
    mas[i].append(d)
    
    if (i==0) :
      if (os.path.exists("C:/Work/Python/Keras/NeuralLearn.py")):
        os.remove("C:/Work/Python/Keras/NeuralLearn.py")
      f = open('C:/Work/Python/Keras/NeuralLearn.py', 'w')
      f.write("import os" + "\n")
      f.write("import os.path" + "\n")
      f.write("import numpy" + "\n")
      f.write("import keras" + "\n")
      f.write("from keras.datasets import cifar10" + "\n")
      f.write("from keras.models import Sequential" + "\n")
      f.write("from keras.layers import Dense, Flatten, Activation" + "\n")
      f.write("from keras.layers import Dropout" + "\n")
      f.write("from keras.layers.convolutional import Conv2D, MaxPooling2D" + "\n")
      f.write("from keras.utils import np_utils" + "\n")
      f.write("from keras.optimizers import SGD" + "\n")
      f.write("from keras.datasets import mnist" + "\n")
      f.write("def modelFit(batch_size_Enter, epochs_Enter, validation_split_Enter, user_id):" + "\n")
      f.write("  numpy.random.seed(42)" + "\n")
      f.write("  (X_train, y_train), (X_test, y_test) = mnist.load_data()" + "\n")
      f.write("  X_train = X_train.reshape(60000, " + imageForDenseInput + ")" + "\n")
      f.write("  X_test = X_test.reshape(10000, " + imageForDenseInput + ")" + "\n")
      f.write("  X_train = X_train.astype('float32')" + "\n")
      f.write("  X_test = X_test.astype('float32')" + "\n")
      f.write("  X_train /= 255" + "\n")
      f.write("  X_test /= 255" + "\n")
      f.write("  Y_train = np_utils.to_categorical(y_train, 10)" + "\n")
      f.write("  Y_test = np_utils.to_categorical(y_test, 10)" + "\n")
      f.write("  model = Sequential()" + "\n")
      f.write("  model.add(Dense(" + units + ", input_dim=" + imageForDenseInput + activation + use_bias + kernel_initializer + bias_initializer + kernel_regularizer + bias_regularizer + activity_regularizer + kernel_constraint + bias_constraint + "))" + "\n")
      print("in I0!!!!!!!!")
      f.close()
    if ((i!=0)and(i!=(length-1))) :
      f = open('C:/Work/Python/Keras/NeuralLearn.py', 'a')
      f.write("  model.add(Dense(" + units + activation + use_bias + kernel_initializer + bias_initializer + kernel_regularizer + bias_regularizer + activity_regularizer + kernel_constraint + bias_constraint + "))" + "\n")
      print("in I!!!!!!!!")
      f.close()
    if (i==(length-1)):
      f = open('C:/Work/Python/Keras/NeuralLearn.py', 'a')
      f.write("  model.add(Dense(10" + activation + use_bias + kernel_initializer + bias_initializer + kernel_regularizer + bias_regularizer + activity_regularizer + kernel_constraint + bias_constraint + "))" + "\n")
      f.write("  if (os.path.exists(\"C:/Work/Python/Keras/model\" + user_id + \".h5\")):" + "\n")
      f.write("    model.load_weights(\"C:/Work/Python/Keras/model\" + user_id + \".h5\")" + "\n")
      f.write("  model.compile(loss=\"categorical_crossentropy\", optimizer=\"SGD\", metrics=[\"accuracy\"])" + "\n")
      f.write("  print(model.summary())" + "\n")
      f.write("  model.fit(X_train, Y_train, batch_size=batch_size_Enter, epochs=epochs_Enter, validation_split=validation_split_Enter, verbose=2)" + "\n")
      f.write("  scores = model.evaluate(X_test, Y_test, verbose=0)" + "\n")
      f.write("  model.save_weights(\"C:/Work/Python/Keras/model\" + user_id + \".h5\")" + "\n")
      f.write("  return (\"accuracy: %.2f%%\"" + " % (scores[1]*100))" + "\n")
      print("in ILast!!!!!!!!")
      f.close()
      result = neuralTraining(user_id)
    return "Good"


#### Сохранение Нейронной сети
@app.route("/netSave1", methods=["GET", "POST"])
def netSave1():

    global mas
    f.write("" + "\n")
    lengthStr = request.args['length']
    iStr = request.args['i']
    
    neural_type = request.args['type']
    units = int(request.args['units'])
    
    activation = request.args['activation']
    if (activation != "None"):
      activation = ", activation=\"" + activation + "\""
    else:
      activation = ""
    
    use_bias = request.args['use_bias']
    use_bias = ", use_bias=\"" + use_bias + "\""
    
    kernel_initializer = request.args['kernel_initializer']
    if (kernel_initializer != "None"):
      kernel_initializer = ", kernel_initializer=\"" + kernel_initializer + "\""
    else:
      kernel_initializer = ""
    
    bias_initializer = request.args['bias_initializer']
    if (bias_initializer != "None"):
      bias_initializer = ", bias_initializer=\"" + bias_initializer + "\""
    else:
      bias_initializer = ""
    
    kernel_regularizer = request.args['kernel_regularizer']
    if (kernel_regularizer != "None"):
      kernel_regularizer = ", kernel_regularizer=\"" + kernel_regularizer + "\""
    else:
      kernel_regularizer = ""
    
    bias_regularizer = request.args['bias_regularizer']
    if (bias_regularizer != "None"):
      bias_regularizer = ", bias_regularizer=\"" + bias_regularizer + "\""
    else:
      bias_regularizer = ""
    
    activity_regularizer = request.args['activity_regularizer']
    if (activity_regularizer != "None"):
      activity_regularizer = ", activity_regularizer=\"" + activity_regularizer + "\""
    else:
      activity_regularizer = ""
    
    kernel_constraint = request.args['kernel_constraint']
    if (kernel_constraint != "None"):
      kernel_constraint = ", kernel_constraint=\"" + kernel_constraint + "\""
    else:
      kernel_constraint = ""
    
    bias_constraint = request.args['bias_constraint']
    if (bias_constraint != "None"):
      bias_constraint = ", bias_constraint=\"" + bias_constraint + "\""
    else:
      bias_constraint = ""

    print('before user_Id')
    user_id = request.args['user_id']
    netname = request.args['netname']
    print('after user_Id')
    
    imageHeight = 28
    imageWidth = 28
    imageForDenseInputInt = imageHeight * imageWidth
    imageForDenseInput = str(imageForDenseInputInt)
    i = int(iStr)
    length = int(lengthStr)

##  создаём матрицу слоёв
##  если только первый слой, то объявляем матрицу 
    if (i==0) :
      mas = []

    mas.append([])  # заносим пустую строку в матрицу
    # записываем в строку под номером i параметры слоя
    mas[i].append(request.args['type'])
    mas[i].append(request.args['units'])
    mas[i].append(request.args['activation'])
    mas[i].append(request.args['use_bias'])
    mas[i].append(request.args['kernel_initializer'])
    mas[i].append(request.args['bias_initializer'])
    mas[i].append(request.args['kernel_regularizer'])
    mas[i].append(request.args['bias_regularizer'])
    mas[i].append(request.args['activity_regularizer'])
    mas[i].append(request.args['kernel_constraint'])
    mas[i].append(request.args['bias_constraint'])
    
    if (i==0) : 
      f = open('C:/Work/Python/Keras/NeuralSave.py', 'w')
      f.write("import os" + "\n")
      f.write("import numpy" + "\n")
      f.write("import keras" + "\n")
      f.write("import mysql.connector" + "\n")
      f.write("from mysql.connector import Error" + "\n")
      f.write("from keras.datasets import cifar10" + "\n")
      f.write("from keras.models import Sequential" + "\n")
      f.write("from keras.layers import Dense, Flatten, Activation" + "\n")
      f.write("from keras.layers import Dropout" + "\n")
      f.write("from keras.layers.convolutional import Conv2D, MaxPooling2D" + "\n")
      f.write("from keras.utils import np_utils" + "\n")
      f.write("from keras.optimizers import SGD" + "\n")
      f.write("from keras.datasets import mnist" + "\n")
      f.write("from keras.models import model_from_json" + "\n")
      f.write("def modelSave(batch_size_Enter, epochs_Enter, validation_split_Enter, user_id, netname):" + "\n")
      f.write("  numpy.random.seed(42)" + "\n")
      f.write("  (X_train, y_train), (X_test, y_test) = mnist.load_data()" + "\n")
      f.write("  X_train = X_train.reshape(60000, " + imageForDenseInput + ")" + "\n")
      f.write("  X_test = X_test.reshape(10000, " + imageForDenseInput + ")" + "\n")
      f.write("  X_train = X_train.astype('float32')" + "\n")
      f.write("  X_test = X_test.astype('float32')" + "\n")
      f.write("  X_train /= 255" + "\n")
      f.write("  X_test /= 255" + "\n")
      f.write("  Y_train = np_utils.to_categorical(y_train, 10)" + "\n")
      f.write("  Y_test = np_utils.to_categorical(y_test, 10)" + "\n")
      f.write("  model = Sequential()" + "\n")
      f.write("  model.add(Dense(" + units + ", input_dim=" + imageForDenseInput + activation + use_bias + kernel_initializer + bias_initializer + kernel_regularizer + bias_regularizer + activity_regularizer + kernel_constraint + bias_constraint + "))" + "\n")
      print("i0")
      f.close()
    if ((i!=0)and(i!=(length-1))) :
      f = open('C:/Work/Python/Keras/NeuralSave.py', 'a')
      f.write("  model.add(Dense(" + units + activation + use_bias + kernel_initializer + bias_initializer + kernel_regularizer + bias_regularizer + activity_regularizer + kernel_constraint + bias_constraint + "))" + "\n")
      print("i")
      f.close()
    if (i==(length-1)):
      f = open('C:/Work/Python/Keras/NeuralSave.py', 'a')
      f.write("  model.add(Dense(10" + activation + use_bias + kernel_initializer + bias_initializer + kernel_regularizer + bias_regularizer + activity_regularizer + kernel_constraint + bias_constraint + "))" + "\n")
      f.write("  model.compile(loss=\"categorical_crossentropy\", optimizer=\"SGD\", metrics=[\"accuracy\"])" + "\n")
      f.write("  print(model.summary())" + "\n")
      f.write("  model.fit(X_train, Y_train, batch_size=batch_size_Enter, epochs=epochs_Enter, validation_split=validation_split_Enter, verbose=2)" + "\n")
      f.write("  scores = model.evaluate(X_test, Y_test, verbose=0)" + "\n")
      f.write("  model_json = model.to_json()" + "\n")
      f.write("  json_file = open(\"C:/Work/Python/Keras/model\" + user_id + netname + \".json\", \"w\")" + "\n")
      f.write("  json_file.write(model_json)" + "\n")
      f.write("  json_file.close()" + "\n")
      f.write("  model.save_weights(\"C:/Work/Python/Keras/model\" + user_id + netname + \".h5\")" + "\n")
      f.write("  CONN = mysql.connector.connect(host='localhost', database='tensor', user='root', password='')" + "\n")
      f.write("  query = \"INSERT INTO `neuronet` (`user_id`, `netname`, `json_path`, `h5_path`) VALUES(%s , %s, %s, %s)\"" + "\n")
      f.write("  args_json = \"C:/Work/Python/Keras/model\" + user_id + netname + \".json\"" + "\n")
      f.write("  args_h5 = \"C:/Work/Python/Keras/model\" + user_id + netname + \".h5\"" + "\n")
      f.write("  args = (user_id, netname, args_json, args_h5)" + "\n")
      f.write("  id = 0" + "\n")
      f.write("  cursor = CONN.cursor()" + "\n")
      f.write("  cursor.execute(query, args)" + "\n")
      f.write("  id = cursor.lastrowid" + "\n")
      f.write("  CONN.commit()" + "\n")
      f.write("  cursor.close()" + "\n")
      f.write("  return str(id)" + "\n")
      print("iLength")
      f.close()

    return "Worked!"
