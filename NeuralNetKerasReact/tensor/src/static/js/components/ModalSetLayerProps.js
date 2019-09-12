import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from '@material-ui/core/Select';

export default class ModalSetLayerProps extends React.Component {

  state = {
	units: "",
	activation: "",
	use_bias: "False",
	use_bias1: false,
	kernel_initializer: "",
	bias_initializer: "",
	kernel_constraint: "",
	bias_constraint: "",
	conv_width: "",
	conv_height: "",
	padding: "",
	openAdditionalLayerProps: true,
	openConv2D: true,
  };
	
  handleCloseCancel = () => {
	this.props.closeWindow();
  };

  handleCloseOK = () => {
	this.props.__setLayerParams(this.props.item, this.state.units, this.state.activation, this.state.use_bias, this.state.kernel_initializer, 
								this.state.bias_initializer, this.state.kernel_constraint, this.state.bias_constraint, this.state.conv_width, this.state.conv_height, this.state.padding);
	this.setState({ units: "", activation: "", use_bias: "False", use_bias1: false, kernel_initializer: "", bias_initializer: "", kernel_constraint: "", bias_constraint: "", conv_width: "", conv_height: "", padding: ""});
	this.props.closeWindow();
  };
  
  handleKeyPress = (e) => {
	if (e.key === 'Enter') {
		this.handleCloseOK();
	}
  }
  
  handleOpen = () => {
	this.setState({ units: this.props.layerProps['units'] });
	this.setState({ activation: this.props.layerProps['activation'] });
	this.setState({ use_bias: this.props.layerProps['use_bias'] });
	(this.props.layerProps['use_bias'] == "True") ? this.setState({use_bias1: true}) : this.setState({use_bias1: false});
	this.setState({ kernel_initializer: this.props.layerProps['kernel_initializer'] });
	this.setState({ bias_initializer: this.props.layerProps['bias_initializer'] });
	this.setState({ kernel_constraint: this.props.layerProps['kernel_constraint'] });
	this.setState({ bias_constraint: this.props.layerProps['bias_constraint'] });
	this.setState({ conv_width: this.props.layerProps['conv_width'] });
	this.setState({ conv_height: this.props.layerProps['conv_height'] });
	this.setState({ padding: this.props.layerProps['padding'] });
	if (this.props.layerProps['type'] == 'свёрточная') 
	{
		this.setState({openConv2D : false})
		if (this.props.layerProps['conv_width'] == '0') this.setState({ conv_width: '3' });
		if (this.props.layerProps['conv_height'] == '0') this.setState({ conv_height: '3' });
	}
	if (this.props.layerProps['type'] == 'полносвязная') this.setState({openConv2D : true})
	console.log('use_bias1--', this.state.use_bias1);
	console.log('layerProps--', this.props.layerProps);
  }
  
  handleUse_Bias = () => {
	  (this.props.layerProps['use_bias'] == "True") ? this.setState({use_bias: "False"}) : this.setState({use_bias: "True"});
	  (this.props.layerProps['use_bias'] == "True") ? this.setState({use_bias1: false}) : this.setState({use_bias1: true});
  }
  
  handleOpenAdditionalLayers = () => {
	  this.setState({openAdditionalLayerProps: !this.state.openAdditionalLayerProps});  
  }
  
  render() {
	  
	  console.log("open - ", this.props.openWindow)
    return (
      <div>
        <Dialog
          open={this.props.openWindow}
		  onEnter={this.handleOpen}
		  onClose={this.handleCloseCancel}
          aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Основные параметры слоя</DialogTitle>
          <DialogContent>
		  
            <DialogContentText>
				Введите количество нейронов.
            </DialogContentText>
            <TextField
				autoFocus
				margin="dense"
				id="units"
				type="text"
				fullWidth
				value={this.state.units}
 				onChange={e => this.setState({ units: e.target.value })}
            />
			
			<DialogContentText>
				Выберите функцию активации.
            </DialogContentText>
			<label>
				<select
					value={this.state.activation}
					onChange={e => this.setState({activation: e.target.value})}>
					<option value="None">Функция активации отсутствует</option>
					<option value="relu">Функция активации 'relu'</option>
					<option value="softmax">Функция активации 'softmax'</option>
					<option value="elu">Функция активации 'elu'</option>
					<option value="selu">Функция активации 'selu'</option>
					<option value="softplus">Функция активации 'softplus'</option>
					<option value="softsign">Функция активации 'softsign'</option>
					<option value="tanh">Функция активации 'tanh'</option>
					<option value="sigmoid">Функция активации 'sigmoid'</option>
					<option value="hard_sigmoid">Функция активации 'hard_sigmoid'</option>
					<option value="exponential">Функция активации 'exponential'</option>
					<option value="linear">Функция активации 'linear'</option>
				</select>
			</label>
			
			<form style={this.state.openConv2D ? {display : 'none'} : {}}>
				<DialogContentText>
					Введите ширину карты признаков.
				</DialogContentText>
				<TextField
					autoFocus
					margin="dense"
					id="conv_width"
					type="text"
					fullWidth
					value={this.state.conv_width}
					onChange={e => this.setState({ conv_width: e.target.value })}
				/>
				<DialogContentText>
					Введите высоту карты признаков.
				</DialogContentText>
				<TextField
					autoFocus
					margin="dense"
					id="conv_height"
					type="text"
					fullWidth
					value={this.state.conv_height}
					onChange={e => this.setState({ conv_height: e.target.value })}
				/>
				<DialogContentText>
						Выберите параметр padding.
				</DialogContentText>
				<label>
					<select
						value={this.state.padding}
						onChange={e => this.setState({padding: e.target.value})}>
						<option value="None">Отсутствует</option>
						<option value="Same">Same</option>
						<option value="Valid">Valid</option>
					</select>
				</label>
			</form>
			
			<form>
				<Button color="primary" onClick={this.handleOpenAdditionalLayers}>
					Дополнительные параметры слоя
				</Button>
			</form>
			
			<form style={this.state.openAdditionalLayerProps ? {display: 'none'} : {}}>
				<label>
					Выбран ли параметр Use_Bias:
					<input 
						name="cheackUse_Bias" 
						type="checkbox" 
						checked={this.state.use_bias1} 
						onChange = {this.handleUse_Bias}/>
				</label>

				<DialogContentText>
						Выберите функцию kernel_initializer.
				</DialogContentText>
				<label>
					<select
						value={this.state.kernel_initializer}
						onChange={e => this.setState({kernel_initializer: e.target.value})}>
						<option value="None">Отсутствует</option>
						<option value="Initializer">Initializer</option>
						<option value="Zeros">Zeros</option>
						<option value="Ones">Ones</option>
						<option value="Constant">Constant</option>
						<option value="RandomNormal">RandomNormal</option>
						<option value="RandomUniform">RandomUniform</option>
						<option value="TruncatedNormal">TruncatedNormal</option>
						<option value="VarianceScaling">VarianceScaling</option>
						<option value="Orthogonal">Orthogonal</option>
						<option value="Identity">Identity</option>
						<option value="lecun_uniform">lecun_uniform</option>
						<option value="glorot_normal">glorot_normal</option>
						<option value="glorot_uniform">glorot_uniform</option>
						<option value="he_normal">he_normal</option>
						<option value="lecun_normal">lecun_normal</option>
						<option value="he_uniform">he_uniform</option>
					</select>
				</label>
			
				<DialogContentText>
						Выберите функцию bias_initializer.
				</DialogContentText>
				<label>
					<select
						value={this.state.bias_initializer}
						onChange={e => this.setState({bias_initializer: e.target.value})}>
						<option value="None">Отсутствует</option>
						<option value="Initializer">Initializer</option>
						<option value="Zeros">Zeros</option>
						<option value="Ones">Ones</option>
						<option value="Constant">Constant</option>
						<option value="RandomNormal">RandomNormal</option>
						<option value="RandomUniform">RandomUniform</option>
						<option value="TruncatedNormal">TruncatedNormal</option>
						<option value="VarianceScaling">VarianceScaling</option>
						<option value="Orthogonal">Orthogonal</option>
						<option value="Identity">Identity</option>
						<option value="lecun_uniform">lecun_uniform</option>
						<option value="glorot_normal">glorot_normal</option>
						<option value="glorot_uniform">glorot_uniform</option>
						<option value="he_normal">he_normal</option>
						<option value="lecun_normal">lecun_normal</option>
						<option value="he_uniform">he_uniform</option>
					</select>
				</label>
			
				<DialogContentText>
						Выберите функцию kernel_constraint.
				</DialogContentText>
				<label>
					<select
						value={this.state.kernel_constraint}
						onChange={e => this.setState({kernel_constraint: e.target.value})}>
						<option value="None">Отсутствует</option>
						<option value="MaxNorm">MaxNorm</option>
						<option value="NonNeg">NonNeg</option>
						<option value="UnitNorm">UnitNorm</option>
						<option value="UnitNorm">UnitNorm</option>
					</select>
				</label>
			
				<DialogContentText>
						Выберите функцию bias_constraint.
				</DialogContentText>
				<label>
					<select
						value={this.state.bias_constraint}
						onChange={e => this.setState({bias_constraint: e.target.value})}>
						<option value="None">Отсутствует</option>
						<option value="MaxNorm">MaxNorm</option>
						<option value="NonNeg">NonNeg</option>
						<option value="UnitNorm">UnitNorm</option>
						<option value="UnitNorm">UnitNorm</option>
					</select>
				</label>
			
			</form>
			
		  </DialogContent>
          <DialogActions>
            <Button  color="primary" onClick={this.handleCloseCancel} >
              Cancel
            </Button>
            <Button  color="primary" onClick={this.handleCloseOK} onKeyPress={this.handleKeyPress} >
              OK
            </Button>
          </DialogActions>
        </Dialog>
		
      </div>
    );
  }
}

