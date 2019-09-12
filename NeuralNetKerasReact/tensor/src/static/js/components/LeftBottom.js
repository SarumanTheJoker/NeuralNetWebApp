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
import LayersImage from './LayersImage'

class LeftBottom extends React.Component{
	state = {
		openImage: false,
	}
	
	LayersImageOpen = () => {
		this.setState({openImage: true, });
		console.log ('openImage--', this.state.openImage);
	}	
	
	render() {
    return (
		<div>
			<Button variant="outlined" color="primary" style={{margin: "1%", width:"90%"}} onClick={this.LayersImageOpen}>
				Изображение НС
			</Button>
			<LayersImage openWindow = {this.state.openImage}
						 closeWindow = {()=>this.setState({openImage: false, })}
						 layersIm = {this.props.layers} />
		</div>
    );
  }
}

export default LeftBottom;