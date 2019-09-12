import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grain from '@material-ui/icons/Grain';
import Share from '@material-ui/icons/Share';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import blue from '@material-ui/core/colors/blue';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import CloudUpload from '@material-ui/icons/CloudUpload';
import ModalUploadFiles from './ModalUploadFiles';
import Select from '@material-ui/core/Select';

var $ = require('jquery');

export default class LoadUserData extends React.Component {
	
	state = {
		classes: "2",
		trainPersent: "50",
		dataName: null,
		dataPath: null,
		openWindow: false,
		openLoadData: false,
		OpenModalUploadFiles: false,
		openLearnData: false,
		openTestData: false,
		uploadState: {},
		dataClasses: [],
		openClassName: false,
		openClassName1: false,
		openClassName2: false,
		openClassName3: false,
		openClassName4: false,
		openClassName5: false,
		openClassName6: false,
		openClassName7: false,
		openClassName8: false,
		openClassName9: false,
		className: null,
		className1: null,
		className2: null,
		className3: null,
		className4: null,
		className5: null,
		className6: null,
		className7: null,
		className8: null,
		className9: null,
		classCount: 0,
		epochs : null,
		batch_size : null,
		img_width: null,
		img_height: null,
	}
	
	/*
	handleCloseNameCheck = (classCount) => {
		var classes = Number(this.state.classes);		
		this.setState({className : null});
		
		if (classCount < classes) {
			if (classCount == 1) {this.setState({openClassName2: true})}
			else if (classCount == 2) {this.setState({openClassName3: true})}
				else if (classCount == 3) {this.setState({openClassName4: true})}
					else if (classCount == 4) {this.setState({openClassName5: true})}
						else if (classCount == 5) {this.setState({openClassName6: true})}
							else if (classCount == 6) {this.setState({openClassName7: true})}
								else if (classCount == 7) {this.setState({openClassName8: true})}
									else if (classCount == 8) {this.setState({openClassName9: true})}
		}
		//else {this.setState({openLoadData: true})}
	}
	*/
	
	handleCloseNameCheck = () => {
		var classes = Number(this.state.classes);		
		this.setState({className : null});
		
		console.log("handleCloseNameCheck.this.state.classCount = ", this.state.classCount);
		
		$.get(window.location.href + 'fileMove',
			{}, 
			(data) => {
				console.log("FILESMOVED", data);
			}
		);
		
		if (this.state.classCount < classes) {
			console.log('CONTINIUE');
			this.setState({openClassName: true})
		}
		else {
			this.handleFileMove();
		}
		/*
			if (this.state.classCount == 1) {this.setState({openClassName2: true})}
			else if (this.state.classCount == 2) {this.setState({openClassName3: true})}
				else if (this.state.classCount == 3) {this.setState({openClassName4: true})}
					else if (this.state.classCount == 4) {this.setState({openClassName5: true})}
						else if (this.state.classCount == 5) {this.setState({openClassName6: true})}
							else if (this.state.classCount == 6) {this.setState({openClassName7: true})}
								else if (this.state.classCount == 7) {this.setState({openClassName8: true})}
									else if (this.state.classCount == 8) {this.setState({openClassName9: true})}
		}
		*/
		//else {this.setState({openLoadData: true})}
	}
	
	handleFileMove = () => {
		console.log('ENDING');
	}
	
	handleCloseName = () => {
		var classes = Number(this.state.classes);
		var classCount = this.state.classCount;
		var mass = this.state.dataClasses;
		mass.push(this.state.className);
		
		this.setState({ dataClasses: mass});
		this.setState({ classCount : this.state.classCount + 1});		
		
		classCount += 1;
		//this.setState({openClassName1: false});	
		console.log("dataClasses---", this.state.dataClasses);
		console.log("this.state.classCount---", this.state.classCount);
		console.log("mass---", mass);
		console.log("this.state.className", this.state.className)
		console.log("classCount---", classCount);
		
		this.setState({openClassName: false})
		//this.handleCloseNameCheck(classCount);
		
		$.get(window.location.href + 'addDirDataClassName',
			{ "className": this.state.className,
			  "user_id" : this.props._user_id,
			  "dataName" : this.state.dataName,
			}, 
			(data) => {
				console.log("dataDirNAMEDCLASSCREATED");
				this.setState({openLoadData: true})
				}
		);
		
		//this.setState({openLoadData: true})
		
		/*
		if (classCount == classes) {	
			this.setState({openClassName1: false});
		}
		else {
			console.log('openClassName1');
			this.setState({openClassName1: false});	
			this.setState({openClassName2: true});
		}
		*/
	}
	
	handleCloseName2 = () => {
		var classes = Number(this.state.classes);
		var classCount = this.state.classCount;
		var mass = this.state.dataClasses;
		mass.push(this.state.className);
		
		this.setState({ dataClasses: mass});
		this.setState({ classCount : this.state.classCount + 1});
		
		classCount += 1;
		//this.setState({openClassName1: false});	
		console.log("dataClasses---", this.state.dataClasses);
		console.log("this.state.classCount---", this.state.classCount);
		console.log("mass---", mass);
		console.log("classCount---", classCount);
		
		this.setState({openClassName2: false})
		//this.handleCloseNameCheck(classCount);
		this.setState({openLoadData: true})
		
		/*
		if (classCount == classes) {	
			this.setState({openClassName2: false});
		}
		else {
			this.setState({openClassName2: false});	
			this.setState({openClassName3: true});
		}
		*/
	}
	
	handleCloseName3 = () => {
		var classes = Number(this.state.classes);
		var classCount = this.state.classCount;
		var mass = this.state.dataClasses;
		mass.push(this.state.className);
		
		this.setState({ dataClasses: mass});
		this.setState({ classCount : this.state.classCount + 1});		
		
		classCount += 1;
		//this.setState({openClassName1: false});	
		console.log("dataClasses---", this.state.dataClasses);
		console.log("this.state.classCount---", this.state.classCount);
		console.log("mass---", mass);
		console.log("classCount---", classCount);
		
		this.setState({openClassName3: false})
		//this.handleCloseNameCheck(classCount);
		
		$.get(window.location.href + 'addDirPer',
			{ "className": this.props.className,
			}, 
			(data) => {
				console.log("dataDirNAMEDCLASSCREATED");
				this.setState({openLoadData: true})
				}
		);
		
		//this.setState({openLoadData: true})
		
		/*		
		if (classCount == classes) {	
			this.setState({openClassName3: false});
		}
		else {
			this.setState({openClassName3: false});	
			//this.setState({openClassName4: true});
		}
		*/
	}
	
	handleCloseCancel = () => {
		this.setState({ openWindow: false });
		this.setState({ openLoadData: false });
	};
	
	// открытие окна обучения данных
	handleDialogOpenLearn = () => {
		//this.setState({ dataName: null });
		this.setState({openLearnData: true});
	}
	
	// открытие окна загрузки данных
	handleDialogOpenLoad = () => {
		this.setState({ dataName: null, dataClasses: [], classCount: 0 });
		this.setState({openWindow: true});
	}
	
	// открытие окна тестирования НС
	handleDialogOpenTest = () => {
		//this.setState({ dataName: null });
		this.setState({openTestData: true});
	}
	
	handleCloseOK = () => {
		var i = 0;
		var classes = Number(this.state.classes);
		console.log('Dataname', this.state.dataName);
		console.log("this.state.classes", this.state.classes);
		console.log("this.state.trainPersent", this.state.trainPersent);
		$.get(window.location.href + 'addDirPer',
			{ "user_id": this.props._user_id,
			  "trainPersent": this.state.trainPersent,
			  "dataName": this.state.dataName,
			}, 
			(data) => {
				this.setState({ openWindow: false });
				console.log(classes);
				//console.log('parseInt(this.state.classes)=', parseInt(this.state.classes, 10));
				for (i = 0; i < classes; i++) {
					this.setState({ openClassName:true });
					console.log("Opened", i);
					//alert('HERE');
				}
				//this.setState({openLoadData: true});
				console.log("dataDirNAMED");
				}
		);
	}
	
	openWindowLoadData = () => {
		console.log("here");
		this.setState({openLoadData: true});
	}
	
	uploadFile = (file) => {
		this.setState({openLoadData: !this.state.openLoadData});
		this.setState({OpenModalUploadFiles: !this.state.OpenModalUploadFiles});
		const data1 = new FormData();
		var i = 0;
		$.get(window.location.href + 'addFileLength',
			{ "fileLength": file.files.length,
			}, 
			(data) => {
				console.log("DATAFILELENGTH", data);
				for (i = 0; i < file.files.length; i++) {
					data1.set('file', file.files[i]);
					//this.chkFormData(data1);
					this.getPostXHR(data1, file.files[i]['name'] );
				}
				if (i == file.files.length) { this.handleCloseNameCheck();}
			}
		);
		/*
		for (var i = 0; i < file.files.length; i++) {
			data.set('file', file.files[i]);
			//this.chkFormData(data);
			this.getPostXHR(data, file.files[i]['name'] );
		}
		*/
		//alert("Good!");
	}
	
	// СОздание директории для тестового файла
	uploadFileTestPath = (file) => {
		
		$.get(window.location.href + 'uploadTestPath',
			{ "user_id": this.props._user_id,
			}, 
			(data) => {
				this.uploadFileTest(file);
			}
		);
		
	}
	
	// Загрузка файла для тестов
	uploadFileTest = (file) => {
		this.setState({openTestData: false});
		const data1 = new FormData();
		
		data1.set('file', file.files[0]);
		/*
		$.send(window.location.href + 'uploadTest',
			{ "file": data1,
			}, 
			(data) => {
				alert ('Файл загружен! Его название - ', data);
			}
		);
		*/
		
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "/uploadTest", true);
		xhr.send(data1);
		
		this.uploadFileTestWork();
		
		//alert ('Файл загружен!');
	}
	
	// Тестирование НС
	uploadFileTestWork = () => {
		var result;
		$.get(window.location.href + 'uploadTestWork',
			{ "user_id": this.props._user_id,
			  "image_width": this.state.img_width,
			  "image_height": this.state.img_height,
			  "classCount": this.state.classCount,
			}, 
			(data) => {
				result = data;
				console.log ('result -----', result);
				this.showResult(data);
				//alert ('Изображение принадлежит к классу под названием ', result)
				//alert ('Изображение принадлежит к классу под названием ', data);
			}
		);
		//alert ('Изображение принадлежит к классу под названием ' + result);
	}
	
	showResult = (result) => {
		alert ('Изображение принадлежит к классу под названием Cats', result)
	}
	
	isNotEmpty(obj){
		for (var key in obj)
			return true;
		return false;
	}
	
	getPostXHR = (data, file) => {
		var obj = this.state.uploadState;
		var xhr = new XMLHttpRequest();
		var status = false;
		xhr.open("POST", "/upload", true);
		xhr.onload = (e) => {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {

					delete this.state.uploadState[file];

					if (!this.isNotEmpty(this.state.uploadState)) {
						this.setState({OpenModalUploadFiles: false});
						//this.setState({openClassName2: true})
						//this.handleCloseNameCheck();
					}

					//this.getDirList();
					//console.log("Uploaded file--", file, this.state.items);
					status = true;
				} else {
					console.error(xhr.statusText);
				}
			}
		};
		xhr.onerror = (e) => {
			console.error(xhr.statusText);
		};
		xhr.upload.onprogress = (event) => {
			obj[file] = ~~((+event.loaded / +event.total) * 100);
			this.setState({ uploadState: obj});
		}
		xhr.send(data);
	}
	
	openSaveData = () => {
		this.props._DataSave(this.state.dataName);
		this.setState({ dataName: null });
	}
	
	handleLearnData = () => {
		this.props._NetLearnData(this.state.classCount, this.state.epochs, this.state.batch_size, this.state.img_width, this.state.img_height);
		this.setState({ openLearnData : false });
	}
	
	render() {
		
		return (
		
			<div>
			
				<Button variant="outlined" color="primary" style={{margin: "1%", width:"90%"}} onClick={this.handleDialogOpenLoad}>
					Загрузить данные для обучения НС
				</Button>				
				
				<Button variant="outlined" color="primary" style={{margin: "1%", width:"90%"}} onClick={this.handleDialogOpenLearn}>
					Обучить НС на загруженных данных
				</Button>
				
				<Button variant="outlined" color="primary" style={{margin: "1%", width:"90%"}} onClick={this.openSaveData}>
					Сохранить загруженные данные
				</Button>
				
				<Button variant="outlined" color="primary" style={{margin: "1%", width:"90%"}} onClick={this.handleDialogOpenTest}>
					Выполнить тестирование НС
				</Button>
				
				<Dialog
					open={this.state.openWindow}
					onEnter={this.handleOpen}
					onClose={this.handleCloseCancel}
					aria-labelledby="form-dialog-title">
					<DialogTitle id="form-dialog-title">Параметры загружемых данных</DialogTitle>
					<DialogContent>
					
						<DialogContentText>
							Введите название данных.
						</DialogContentText>
						<TextField
							autoFocus
							margin="dense"
							id="units"
							type="text"
							fullWidth
							value={this.state.dataName}
							onChange={e => this.setState({ dataName: e.target.value })}
						/>
						
						<DialogContentText>
							Выберите количество классов обучения.
						</DialogContentText>
						<label>
							<select
								value={this.state.classes}
								onChange={e => this.setState({classes: e.target.value})}>
								<option value="2">2</option>
								<option value="3">3</option>
								<option value="4">4</option>
								<option value="5">5</option>
								<option value="6">6</option>
								<option value="7">7</option>
								<option value="8">8</option>
								<option value="9">9</option>
								<option value="10">10</option>
							</select>
						</label>
						
						<DialogContentText>
							Какой процент данных будет использоваться для обучения?.
						</DialogContentText>
						<label>
							<select
								value={this.state.trainPersent}
								onChange={e => this.setState({trainPersent: e.target.value})}>
								<option value="50">50</option>
								<option value="55">55</option>
								<option value="60">60</option>
								<option value="65">65</option>
								<option value="70">70</option>
								<option value="75">75</option>
								<option value="80">80</option>
								<option value="85">85</option>
								<option value="90">90</option>
								<option value="95">95</option>
							</select>
						</label>
						
					</DialogContent>
					
					<DialogActions>
						<Button  color="primary" onClick={this.handleCloseCancel} >
						  Cancel
						</Button>
						<Button  color="primary" onClick={this.handleCloseOK}>
						  OK
						</Button>
					</DialogActions>
				</Dialog>
				
				<Dialog
					open={this.state.openLoadData}
					onEnter={this.handleOpen}
					onClose={this.handleCloseCancel}
					aria-labelledby="form-dialog-title">
					<DialogTitle id="form-dialog-title">Выберите изображения для обучения</DialogTitle>
					<DialogContent>
						<Tooltip title="Загрузить">
							<Fab size="small" variant="contained" color="primary" component="label" style={{marginLeft:"45%"}}>
								<CloudUpload />
								<input 	type="file" multiple
										style={{ display: "none" }}
										onChange={(e)=>{this.uploadFile(e.currentTarget)}}/>
							</Fab>
						</Tooltip >
					</DialogContent>
				</Dialog>
				
				<ModalUploadFiles openWindow={this.state.OpenModalUploadFiles} 
								  state={this.state.uploadState} />
				
				<Dialog
					open={this.state.openTestData}
					onEnter={this.handleOpen}
					onClose={this.handleCloseCancel}
					aria-labelledby="form-dialog-title">
					<DialogTitle id="form-dialog-title">Выберите изображения для тестирования</DialogTitle>
					<DialogContent>
						<Tooltip title="Загрузить">
							<Fab size="small" variant="contained" color="primary" component="label" style={{marginLeft:"45%"}}>
								<CloudUpload />
								<input 	type="file"
										style={{ display: "none" }}
										onChange={(e)=>{this.uploadFileTestPath(e.currentTarget)}}/>
							</Fab>
						</Tooltip >
					</DialogContent>
				</Dialog>
				
				<Dialog
					open={this.state.openLearnData}
					onEnter={this.handleOpen}
					onClose={this.handleCloseCancel}
					aria-labelledby="form-dialog-title">
					<DialogTitle id="form-dialog-title">Введите параметры обучения</DialogTitle>
					
					<DialogContentText>
							Введите размер выборки.
					</DialogContentText>
					<DialogContent>
						<TextField
							autoFocus
							margin="dense"
							id="units"
							type="text"
							fullWidth
							value={this.state.batch_size}
							onChange={e => this.setState({ batch_size: e.target.value })}
						/>
					</DialogContent>
					
					<DialogContentText>
							Введите количество эпох обучения.
					</DialogContentText>
					<DialogContent>
						<TextField
							autoFocus
							margin="dense"
							id="units"
							type="text"
							fullWidth
							value={this.state.epochs}
							onChange={e => this.setState({ epochs: e.target.value })}
						/>
					</DialogContent>
					
					<DialogContentText>
							Введите ширину изображений.
					</DialogContentText>
					<DialogContent>
						<TextField
							autoFocus
							margin="dense"
							id="units"
							type="text"
							fullWidth
							value={this.state.img_width}
							onChange={e => this.setState({ img_width: e.target.value })}
						/>
					</DialogContent>
					
					<DialogContentText>
							Введите высоту изображений.
					</DialogContentText>
					<DialogContent>
						<TextField
							autoFocus
							margin="dense"
							id="units"
							type="text"
							fullWidth
							value={this.state.img_height}
							onChange={e => this.setState({ img_height: e.target.value })}
						/>
					</DialogContent>
					
					<DialogActions>
						<Button  color="primary" onClick={this.handleLearnData}>
						  OK
						</Button>
					</DialogActions>
					
				</Dialog>
				
				
				<Dialog
					open={this.state.openClassName}
					onEnter={this.handleOpen}
					onClose={this.handleCloseCancel}
					aria-labelledby="form-dialog-title">
					<DialogTitle id="form-dialog-title">Введите название класса</DialogTitle>
					<DialogContent>
						<TextField
							autoFocus
							margin="dense"
							id="units"
							type="text"
							fullWidth
							value={this.state.className}
							onChange={e => this.setState({ className: e.target.value })}
						/>
					</DialogContent>
					
					<DialogActions>
						<Button  color="primary" onClick={this.handleCloseName}>
						  OK
						</Button>
					</DialogActions>
					
				</Dialog>
				
				<Dialog
					open={this.state.openClassName2}
					onEnter={this.handleOpen}
					onClose={this.handleCloseCancel}
					aria-labelledby="form-dialog-title">
					<DialogTitle id="form-dialog-title">Введите название класса</DialogTitle>
					<DialogContent>
						<TextField
							autoFocus
							margin="dense"
							id="units"
							type="text"
							fullWidth
							value={this.state.className}
							onChange={e => this.setState({ className: e.target.value })}
						/>
					</DialogContent>
					
					<DialogActions>
						<Button  color="primary" onClick={this.handleCloseName2}>
						  OK
						</Button>
					</DialogActions>
					
				</Dialog>

				<Dialog
					open={this.state.openClassName3}
					onEnter={this.handleOpen}
					onClose={this.handleCloseCancel}
					aria-labelledby="form-dialog-title">
					<DialogTitle id="form-dialog-title">Введите название класса</DialogTitle>
					<DialogContent>
						<TextField
							autoFocus
							margin="dense"
							id="units"
							type="text"
							fullWidth
							value={this.state.className}
							onChange={e => this.setState({ className: e.target.value })}
						/>
					</DialogContent>
					
					<DialogActions>
						<Button  color="primary" onClick={this.handleCloseName3}>
						  OK
						</Button>
					</DialogActions>
					
				</Dialog>	
			</div>
			
		);
		
	}
	
}