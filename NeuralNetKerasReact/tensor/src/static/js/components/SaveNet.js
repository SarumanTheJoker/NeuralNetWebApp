import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

var $ = require('jquery');

export default class SaveNet extends React.Component {
	
	state = {
		netname: "",
		openWindow: false,
	}
	
	handleCloseCancel = () => {
		this.setState({ netname: "" });
		this.setState({ openWindow: false });
	};
	
	handleDialogOpen = () => {
		this.setState({ openWindow: true });
	}
	
	handleCloseOK = () => {
		console.log('_NetSave RIGHT NOW');
		this.props._NetSave(this.state.netname);
		//console.log('_NeuralSave RIGHT NOW');
		//this.props._NeuralSave(netname);
		this.setState ({ netname: "", openWindow: false });
	}
	
	/*
	callbackMkDir1 = (e) => {
		console.log('data1 - ', e);
	}
	
	callbackMkDir = (e) => {
		console.log ('data - ', e);
		$.get(window.location.href + 'neuralTraining', 	// параметры GET
			{},		// параметры GET
    		(data) => {							// data это результат работы
				this.callbackMkDir1(data);
			});
	}
	
	send = () => { this.props.layers.map((item, i) => {
		$.get(window.location.href + 'NetSave', 	// параметры GET
			{ "length" : this.props.layers.length,
			  "i" : i,
			  "units": item['units'],
			  "activation": item['activation'],
			  "use_bias": item['use_bias'],
			  "kernel_initializer": item['kernel_initializer'],
			  "bias_initializer": item['bias_initializer'],
			  "kernel_regularizer": item['kernel_regularizer'],
			  "bias_regularizer": item['bias_regularizer'],
			  "activity_regularizer": item['activity_regularizer'],
			  "kernel_constraint": item['kernel_constraint'],
			  "bias_constraint": item['bias_constraint'],
			},		// параметры GET
    		(data) => {							// data это результат работы
				this.callbackMkDir(data);
			});
	})
	};
	*/
	
	render() {
		
		return (						
			<div>
				
				<Button variant="outlined" color="primary" style={{margin: "1%", width:"90%"}} onClick={this.handleDialogOpen}>
					Сохранить НС
				</Button>
				
				<Dialog 
					open={this.state.openWindow} 
					onClose={this.handleCloseCancel}
					aria-labelledby="form-dialog-title">
					
					<DialogTitle id="form-dialog-title">Netname</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Введите имя НС
						</DialogContentText>

					<TextField
						autoFocus
						margin="dense"
						id="netname"
						type="text"
						fullWidth
						value={this.state.netname}
						onChange={e => this.setState({ netname: e.target.value })}
					/>
					</DialogContent>
					
					<DialogActions>
						<Button  color="primary" onClick={this.handleCloseCancel} >
							Отмена
						</Button>
						<Button  color="primary" onClick={this.handleCloseOK}>
							Ок
						</Button>
					</DialogActions>
				</Dialog>
			</div>
			
		)
	}
}