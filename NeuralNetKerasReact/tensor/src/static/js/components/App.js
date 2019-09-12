import React, { Component } from 'react';
import LeftMenu from './LeftMenu'
import TopMenu from './TopMenu'
import AppWindow from './AppWindow'
import RegAut from './RegAut'
import SaveNet from './SaveNet'
import ModalLogin from './ModalLogin'
import ModalSignIn from './ModalSignIn'
import Grid from '@material-ui/core/Grid';
import LeftBottom from './LeftBottom'
import LearnNet from './LearnNet';
import LoadUserData from './LoadUserData';
import NeuralList from './NeuralList';
import Button from '@material-ui/core/Button';
import DataList from './DataList'

var $ = require('jquery');

class App extends Component {
	state = {
		layer: [],
		neuronet: [],
		dataLoads: [],
		isAut: false,
		user_id: null,
		ModalLogin: true,
		ModalSignIn: false,
		net_id: null,
		UserLoadDataPath: null,
		LoadDataWindow: false,
	};

	//при монтировании компонента коннектимся к базе данных
	componentWillMount = () => {
		console.log('componentWillMount--');
		$.get(window.location.href + 'connect', (data) => {
				console.log('connected--', data);
			});
		}
  
	componentDidMount = () => {
		console.log('componentDidMount--');
	}
  
	// Открываем окно регистрации
		_openSignIn = () => {
		this.setState({ ModalLogin: false }, 
			() => this.setState({ ModalSignIn: true }));
	}

	// Удаление временного файла, который содержит в себе веса обучаемой сети
	deleteH5File = (id) => {
		$.get(window.location.href + 'DeleteH5',
			{ "user_id": id},
			(data) => {
				console.log('H5', data);
			}
		);
	}
	
	// Авторизация
	setUserId = (user, password) => {
		$.get(window.location.href + 'login',
			{ "user": user, "password": password }, 
			(data) => {
				if (data == 'Error')	//если пользователя нет, то выводим предупреждение о окно не закрываем
					alert('Неправильное имя пользователя или пароль');
				else {		
					alert('Добро пожаловать!');//закрываем окно, если пользователь есть в базе, читаем его список сетей
					this.setState({ user_id: data }, () => this.listNeuronet())//, () => this.DataList());	//, () => this.listNeuronet());
					this.setState({ ModalLogin: false });
					this.deleteH5File(data);
					this.listData();
					//this.listNeuronet();
				}
			}
		);
	}

	// Регистрация
	getUserId = (user, password) => {
		$.get(window.location.href + 'adduser',
			{ "user": user, "password": password }, 
			(data) => {					//получаем user_id нового пользователя и закрываем окно
				this.setState({ user_id: data });
				this.setState({ ModalSignIn: false });
				this.deleteH5File(data);
			}
		);
	}
	
	newNet = () => {
		this.deleteH5File(this.state.user_id);
		this.setState({layer: []});
	}
	
	addLayer = (type, 
					units, activation, use_bias, 
					kernel_initializer, bias_initializer, 
					kernel_constraint, bias_constraint, 
					conv_width, conv_height, padding) => {
		var obj = {};
		var mass = this.state.layer;
		(type == 'свёрточная') ? obj['icon'] = 0 : obj['icon'] = 1;
		obj['type'] = type;
		obj['units'] = units;
		obj['activation'] = activation;
		obj['use_bias'] = use_bias;
		obj['kernel_initializer'] = kernel_initializer;
		obj['bias_initializer'] = bias_initializer;
		obj['kernel_constraint'] = kernel_constraint;
		obj['bias_constraint'] = bias_constraint;
		obj['conv_width'] = conv_width;
		obj['conv_height'] = conv_height;
		obj['padding'] = padding;
		mass.push(obj);
		console.log('addLayer--', obj, mass);
		this.setState({ layer: mass });
	}

	setLayerParams = (i, 
						units, activation, use_bias, 
						kernel_initializer, bias_initializer, 
						kernel_constraint, bias_constraint, 
						conv_width, conv_height, padding) => {
		var mass = this.state.layer;
		var obj = mass[i];
		obj['units'] = units;
		obj['activation'] = activation;
		obj['use_bias'] = use_bias
		obj['kernel_initializer'] = kernel_initializer;
		obj['bias_initializer'] = bias_initializer;
		obj['kernel_constraint'] = kernel_constraint;
		obj['bias_constraint'] = bias_constraint;
		obj['conv_width'] = conv_width;
		obj['conv_height'] = conv_height;
		obj['padding'] = padding;
		this.setState({ layer: mass });
		console.log('setLayerParams--', obj, mass);
	}
	
	// Сохранение данных, загруженных пользователем
	DataSave = (dataName) => {
		$.get(window.location.href + 'DataSave',
			{'user_id': this.state.user_id, 'dataName': dataName},
			(data) => {
				console.log('DataSave data_id ------', data);
				alert('Данные успешно сохранены!');
				this.listData();
				//this.listNeuronet();
			}
		)
	}
	
	// Создание файла Py при вызове которого НС сохраняется в БД
	NetSave = (netname) => {
		var count = 1;
		
		for (var i = 0; i < this.state.layer.length; i++){
			var a = this.state.layer[i];
			$.get(window.location.href + 'netSave', 	// параметры GET
			{ "length" : this.state.layer.length,
			  "i" : i,
			  "type": a['type'],
			  "units": a['units'],
			  "activation": a['activation'],
			  "use_bias": a['use_bias'],
			  "kernel_initializer": a['kernel_initializer'],
			  "bias_initializer": a['bias_initializer'],
			  "kernel_constraint": a['kernel_constraint'],
			  "bias_constraint": a['bias_constraint'],
			  "user_id": this.state.user_id,
			  "netname": netname,
			},		// параметры GET
    		//console.log('WORKING'),
			(data) => {							// data это результат работы
				console.log("NetSave-----", data);
				count = count + 1;
				if (count == this.state.layer.length) {
					alert('НС успешно сохранена');
					this.NeuralSave(netname);
				}
			});
		}
		
		console.log("NetSave!!!!!!!!");
		//this.NeuralSave(netname);	// Вызов функции, которая вызывает файл Py
	}
	
	// Создание файла Py при вызове которого НС обучается и сохраняется во временном файле H5
	NetLearn = () => {
		var count = 1;
		
		for (var i = 0; i < this.state.layer.length; i++){
			var a = this.state.layer[i];
			$.get(window.location.href + 'netLearn', 	// параметры GET
			{ "length" : this.state.layer.length,
			  "i" : i,
			  "type": a['type'],
			  "units": a['units'],
			  "activation": a['activation'],
			  "use_bias": a['use_bias'],
			  "kernel_initializer": a['kernel_initializer'],
			  "bias_initializer": a['bias_initializer'],
			  "kernel_constraint": a['kernel_constraint'],
			  "bias_constraint": a['bias_constraint'],
			  "user_id": this.state.user_id,
			},		// параметры GET
    		//console.log('WORKING'),
			(data) => {							// data это результат работы
				console.log("NetLearn-----", data);
				count = count + 1;
				if (count == this.state.layer.length) {
					alert("НС успешно обучена!", data);
					this.NeuralLearn();
				}
			});
		}
		
		//this.NeuralSave(netname);	// Вызов функции, которая вызывает файл Py
	}
	
	//Функция которая вызывает файл Py для сохранения НС в БД, и получает Id ключ этой НС
	NeuralSave = (netname) => {
		$.get(window.location.href + 'neuralSave',
			{'user_id': this.state.user_id, 'netname': netname},
			(data) => {
				console.log('NeuralSave net_id ------', data);
				this.listNeuronet();
			}
		)
	}

	// Функция которая вызывает файл Py для обучения НС
	NeuralLearn = () => {
		$.get(window.location.href + 'neuralTraining',
			{'user_id': this.state.user_id},
			(data) => {
				console.log('NeuralSave net_id ------', data);
			}
		)
	}
	
	//Получение списка сохранённых сетей данного пользователя
	listNeuronet = () => {
		$.get(window.location.href + 'listnet',
			{ "user_id": this.state.user_id }, 
			(data) => {
				//получаем список сетей данного пользователя
				this.setState({ neuronet: data });
				console.log("neuronets------------------------------------------", data);
				}
		);
	}	
	
	// Получение списка сохранённых данных пользователя
	listData = () => {
		$.get(window.location.href + 'DataList',
			{ "user_id": this.state.user_id }, 
			(data) => {
				//получаем список сетей данного пользователя
				this.setState({ dataLoads: data });
				console.log("dataLoads------------------------------------------", data);
				}
		);
	}
	
	// Создание файла Py при вызове которого НС обучается на данных пользователя и сохраняется во временном файле H5
	NetLearnData = (classCount,epochs,batch_size,img_width,img_height) => {
		var count = 1;
		
		for (var i = 0; i < this.state.layer.length; i++){
			var a = this.state.layer[i];
			$.get(window.location.href + 'netLearnData', 	// параметры GET
			{ "length" : this.state.layer.length,
			  "i" : i,
			  "type": a['type'],
			  "units": a['units'],
			  "activation": a['activation'],
			  "use_bias": a['use_bias'],
			  "kernel_initializer": a['kernel_initializer'],
			  "bias_initializer": a['bias_initializer'],
			  "kernel_constraint": a['kernel_constraint'],
			  "bias_constraint": a['bias_constraint'],
			  "user_id": this.state.user_id,
			},		// параметры GET
    		//console.log('WORKING'),
			(data) => {							// data это результат работы
				console.log("NetLearn-----", data);
				count = count + 1;
				if (count == this.state.layer.length) {
					alert("НС успешно обучена!", data);
					this.NeuralLearnData(classCount,epochs,batch_size,img_width,img_height);
				}
			});
		}
		
		//this.NeuralSave(netname);	// Вызов функции, которая вызывает файл Py
	}
	
	// Функция которая вызывает файл Py для обучения НС на данных пользователя
	NeuralLearnData = (classCount,epochs,batch_size,img_width,img_height) => {
		$.get(window.location.href + 'neuralTrainingData',
			{'user_id': this.state.user_id,
			 'classCount': classCount,
			 'epochs': epochs,
			 'batch_size': batch_size,
			 'img_width': img_width,
			'img_height': img_height,
			},
			(data) => {
				console.log('NeuralSave net_id ------', data);
			}
		)
	}
	
	render() {

		console.log ('isAut = ', this.state.isAut)
		
		return (
			<div>

				<Grid container direction="row">
			
					<Grid item style={{width:"20%"}} >
						
						<Grid>
							<Button variant="outlined" color="primary" style={{margin: "1%", width:"90%"}} onClick={this.newNet}>
								Создать новую НС
							</Button>
							
							<LeftMenu _neuronet={this.state.neuronet} _addLayer={this.addLayer}/>
							<SaveNet _NetSave={this.NetSave} _NeuralSave={this.NeuralSave}/>
							<LearnNet _NetLearn={this.NetLearn}/>
						
							<LeftBottom layers={this.state.layer}/>
						</Grid>
						
						<Grid>
							<NeuralList _neuronet={this.state.neuronet}/>
						</Grid>
						
						
						
					</Grid>

					<Grid item style={{width:"60%"}} >
						<Grid container direction="column" >
							<Grid item style={{height:"10%"}} >
								<TopMenu layers={this.state.layer} _setLayerParams={this.setLayerParams}/>
							</Grid>

							<Grid item style={{height:"70%"}} >
								<AppWindow />
							</Grid>

							
						</Grid>
					</Grid>
					
					<Grid item style={{width:"20%"}}>
						<LoadUserData _user_id={this.state.user_id} _DataSave={this.DataSave} _NetLearnData={this.NetLearnData}/>
						
						<Grid>
							<DataList _dataLoads={this.state.dataLoads}/>
						</Grid>
						
					</Grid>
				
					<ModalLogin openWindow={this.state.ModalLogin}  _setUserId={this.setUserId} openSignIn={this._openSignIn}/>   
					<ModalSignIn openWindow={this.state.ModalSignIn}  _getUserId={this.getUserId} />
				
				</Grid>
			</div>
		)
	}
}

export default App;
