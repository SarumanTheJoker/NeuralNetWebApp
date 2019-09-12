import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default class AdditionalLayerProps extends React.Component {
	
	handleClose = () => {
		this.props.closeWindow();
	}
	
	render() {
		
		return (
			<div>
				<DialogActions>
					<Button onClick={this.handleClose}>
						Ок
					</Button>
				</DialogActions>
			</div>
		)
	}
	
}