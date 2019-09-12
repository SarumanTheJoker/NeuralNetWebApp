import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Grain from '@material-ui/icons/Grain';
import Share from '@material-ui/icons/Share';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import blue from '@material-ui/core/colors/blue';
import BlurOn from '@material-ui/icons/BlurOn';

const neurons = ['полносвязная', 'свёрточная'];
const icons = [<Share />, <Grain />];
const styles = {
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
};

class ChooseNeuronDialog extends React.Component {
	
  handleClose = () => {
    this.props.onClose(this.props.selectedValue);
  };

  handleListItemClick = value => {
    this.props.onClose(value);
  };

  render() {
    const { classes, onClose, selectedValue, ...other } = this.props;

    return (
      <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" {...other}>
        <DialogTitle id="simple-dialog-title">Выберите слой</DialogTitle>
        <div>
          <List>
            {neurons.map((neuron, i) => (
              <ListItem button onClick={() => this.handleListItemClick(neuron)} key={neuron}>
                <ListItemAvatar>
                  <Avatar className={classes.avatar}>
					  {icons[i]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={neuron} />
              </ListItem>
            ))}
          </List>
        </div>
      </Dialog>
    );
  }
}

ChooseNeuronDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  selectedValue: PropTypes.string,
};

const ChooseNeuronDialogWrapped = withStyles(styles)(ChooseNeuronDialog);

class LeftMenu extends React.Component {
  state = {
	openImage: false,
    open: false,
    selectedValue: neurons[1],
  };
  
  handleClickOpen = () => {
    this.setState({ open: true, });
  };

  handleClose = value => {
    this.setState({ selectedValue: value, open: false });
		console.log("value--", this.state.selectedValue, neurons, value);
					 // (value, untis, activation, use_bias, kernel_initializer, bias_initializer, kernel_constraint, bias_constraint, conv_width, conv_height, padding)	
	this.props._addLayer(value, '10' , 'relu'    , 'False' , 'None'            , 'None'          , 'None'           , 'None'         , '0'       , '0'        , 'same');
  };

  render() {
	  
	const {_neuronet} = this.props
	  
    return (
      <div>
        <Button variant="outlined" color="primary" style={{margin: "1%", width:"90%"}} onClick={this.handleClickOpen}>
          Добавить слой
        </Button>
		
        <ChooseNeuronDialogWrapped
          selectedValue={this.state.selectedValue}
          open={this.state.open}
          onClose={this.handleClose}
        />
		
      </div>
    );
  }
}

export default LeftMenu;


