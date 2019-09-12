import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default class RegAut extends React.Component {
    state = {
        name : '',
        password: '',
    }

    handleCloseOK = () => {
        if (this.state.name != '') {
            this.props.closeWindow()
        };
    };

    render() {

        return (
            <div>
                <Dialog
                    open = {!this.props._isAut}
                    onClose={this.handleCloseCancel}
                    aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Авторизируйтесь</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Введите своё имя.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="param1"
                            type="text"
                            fullWidth
                            value={this.state.name}
                            onChange={e => this.setState({ name: e.target.value })}
                        />
                        <DialogContentText>
                            Введите свой пароль.
                        </DialogContentText>
                        <TextField
                            margin="dense"
                            id="param2"
                            type="text"
                            fullWidth
                            value={this.state.password}
                            onChange={e => this.setState({ password: e.target.value })}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button  color="primary" onClick={this.handleCloseOK}>
                            Ок
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}