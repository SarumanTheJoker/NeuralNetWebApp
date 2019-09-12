import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default class ModalSignIn extends React.Component {

	state = {
		user: "",
		password: "",
	};

	handleCloseCancel = () => {
		this.setState({ user: "", password: "",});
	};

	handleCloseOK = () => {
		console.log('handleCloseOK');
		this.props._getUserId(this.state.user, this.state.password);
		this.setState({ user: "", password: "",});
	};
  
	handleKeyPress = (e) => {
		if (e.key === 'Enter') {
		// this.handleCloseOK();
		}
	}
  

	render() {
		
		return (
		
			<div>
				<Dialog open={this.props.openWindow} onClose={this.handleCloseCancel}
				aria-labelledby="form-dialog-title">
					<DialogTitle id="form-dialog-title">Регистрация</DialogTitle>
					
					<DialogContent>
						<DialogContentText>
							Введите имя и пароль
						</DialogContentText>
						<TextField
							autoFocus
							margin="dense"
							id="login"
							type="text"
							fullWidth
							value={this.state.user}
							onChange={e => this.setState({ user: e.target.value })}
						/>
						<TextField
							margin="dense"
							id="password"
							type="password"
							fullWidth
							value={this.state.password}
							onChange={e => this.setState({ password: e.target.value })}
						/>
					</DialogContent>
					
					<DialogContent>
						<DialogContentText>
							Подтвердите свой пароль
						</DialogContentText>
						<TextField
							margin="dense"
							id="password"
							type="password"
							fullWidth
							value={this.state.password}
							onChange={e => this.setState({ password: e.target.value })}
						/>
					</DialogContent>
					
					<DialogActions>
						<Button  color="primary" onClick={this.handleCloseCancel} >
							Отмена
						</Button>
						<Button  color="primary" onClick={this.handleCloseOK} onKeyPress={this.handleKeyPress} >
							Ок
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}

