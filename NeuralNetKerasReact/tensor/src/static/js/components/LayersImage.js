import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default class LayersImage extends React.Component {
	
	state = {
		dialog: {
			width: '100%',
			height: '100%',
			top: '0%',
			left: '0%',
		},
		startX: 20,
		startY: 20,
		length: 0,
		massImage: [],
		massLength: [],
		mass: [],
		maxLength: 0,
		maxHeight: 0,
	}
	
	handleClose = () => {
		this.props.closeWindow();
	}
	
	handleOpen = () => {
		console.log("log");
		var Length;
		var mass1 = [];
		const { layersIm } = this.props;
		var varMaxHeigth = 0;
		
		const Name = layersIm.map((item, i) =>
		{
					this.setState({massLength: this.state.massLength.concat(Number(item.units))});
					console.log('MassLength', this.state.massLength);
					
					
					//Length = Number(item.units);
					mass1.push(Number(item.units));
					console.log('Length--------', Length);
					console.log('item--------', item);
					console.log('i--------', i);
					//this.createLayer(Length);
					this.setState({length: i + 1});
					this.setState({maxLength: i + 5});
					if (Number(item.units) > varMaxHeigth)
					{						
						varMaxHeigth = Number(item.units);
					}
		}
		)
		
		this.setState({maxHeight: varMaxHeigth});
		this.setState({mass: mass1})
	}
	
	createLayer = (length) => {	
		var mass1 = [];
		var StartX = 10;
		var StartY = 10;
		
		console.log('length-', length);
		mass1.push(length);
		//this.setState({mass: mass1});	
	}
	
	drawLayer = (item, i) => {
		var mass1 = [];
		
		for (var j = 0; j < item; j++)
		{
			mass1.push(<circle cx={String(this.state.startX + 50*i)} cy={String(this.state.startY + 50*j)} r='5' fill='red'/>);
			mass1.push(<line 
							x1={this.state.startX + 50*i + 5} 
							y1={this.state.startY + 50*j} 
							x2={this.state.startX + 50*i + 55}
							y2={this.state.startY + 50*j}
							stroke="black"
							strokeWidth={2}/>);
		}
		
		for (var j = 0; j < item - 1; j++)
		console.log('mass1----', mass1);
		console.log('MassLength', this.state.massLength);
		return mass1;
	}
	
	drawLayer1 = () => {
		var mass1 = [];
		var varStartY = 0;	//Начальное положение по оси Y нейрона.
		var varStartY1 = 0;	//Начальное положение по оси Y связи нейрона, начало которой на первом слое.
		var varStartY2 = 0;	//Начальное положение по оси Y связи нейрона, конец которой на следующем слое.
		
		// отрисовка самих нейронов
		for (var j = 0; j < this.state.length; j++)
		{
			varStartY = ((this.state.maxHeight - this.state.mass[j])/2)*100 + 10;
			for (var i = 0; i < this.state.mass[j]; i++)
			{
				mass1.push(<circle cx={String(this.state.startX + 100*j)} cy={String(varStartY + 100*i)} r='10' fill='red'/>);
				console.log('m[j]----', this.state.mass[j]);
			}
		}
		
		// отрисовка связей нейронов
		for (var k = 0; k < this.state.length - 1; k++)	// номер слоя, с которого идёт соединение (первый слой)
		{
			for (var j = 0; j < this.state.mass[k]; j++)	// номер нейрона, из первого слоя, который будет соединяться со всеми нейронами следующего слоя
			{
				for (var i = 0; i < this.state.mass[k+1]; i++)	//	номер нейрона из следующего слоя
				{
					varStartY1 = ((this.state.maxHeight - this.state.mass[k])/2)*100 + 10;
					varStartY2 = ((this.state.maxHeight - this.state.mass[k+1])/2)*100 + 10;
					
					mass1.push(<line 
								x1={this.state.startX + 100*k + 10} 
								y1={varStartY1 + 100*j} 
								x2={this.state.startX + 100*(k+1) - 10}
								y2={varStartY2 + 100*i}
								stroke="black"
								strokeWidth={0.5}/>);
				}
			}
		}
		
		{/*
		mass1.push(<line 
							x1={50} 
							y1={50} 
							x2={100}
							y2={50}
							stroke="black"
							strokeWidth={5}/>);
		*/}
		
		console.log("mass--------", this.state.mass);
		console.log('mass1----', mass1);
		console.log('Length----', this.state.length);
		console.log('maxLength----------------------------', this.state.maxLength);
		console.log('maxHeight----------------------------', this.state.maxHeight);		
		return mass1;
	}
	
	//const newImage = (this.state.mass.map((item1, i) => {return(this.drawLayer(item1, i));}))
	
	render () {
		
		console.log("openImage1 - ", this.props.openWindow);
		console.log("mass--------", this.state.mass);
		console.log("startX-", this.state.startX);
		console.log("startY-", this.state.startY);
		const { layersIm } = this.props;
		
		const newImage = this.drawLayer1();

		return (
			<div>
				<Dialog
					fullScreen
					open={this.props.openWindow}
					onEnter={this.handleOpen}
					onClose={this.handleClose}
					aria-labelledby="form-dialog-title"
					style={this.state.dialog}>
					
					<DialogTitle id="form-dialog-title">Изображение НС</DialogTitle>
					<DialogContent>
					
						<DialogActions>
							<Button variant="outlined" onClick={this.handleClose}>
								Закрыть
							</Button>
						</DialogActions>
					
						<svg	
							variant="outlined"
							version="1.1"
							baseProfile="full"
							width={String(this.state.maxLength * 100)} height={String(this.state.maxHeight * 100)}
							xmlns="http://www.w3.org/2000/svg">
								
								{newImage}
						
						</svg>
					
					</DialogContent>
					
				</Dialog>
			</div>
		)
	}
}