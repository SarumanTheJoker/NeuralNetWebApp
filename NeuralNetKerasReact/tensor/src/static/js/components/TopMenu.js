import React, { Component } from 'react';
import ModalSetLayerProps from './ModalSetLayerProps';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import { withStyles } from '@material-ui/core/styles';
import Grain from '@material-ui/icons/Grain';
import Share from '@material-ui/icons/Share';

const styles = theme => ({
  badge: {
    top: '50%',
    right: -3,
    // The border color match the background color.
    border: `2px solid ${
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[900]
    }`,
  },
});
const icons = [<Grain />, <Share />];

class TopMenu extends Component {
	
  state = {
	layer: 0,
	layerProps: {},
	openLayerProps: false,
  };	
  
  handleClickOpen = (item, i) => {
	 
	//if (item.type == "полносвязная") alert ('ПОЛНОСВЯЗНАЯ');
	//if (item.type == "свёрточная") alert ('СВЕРТОЧНАЯ');
	this.setState({ openLayerProps: true, });
	this.setState({ layer: i, });
	this.setState({ layerProps: item, });
	console.log('i--', i);
  };
  
 
  render() {
  
  const { layers } = this.props;
  const { classes } = this.props;
  
  //console.log('layers--', layers);
  
  const listLayers = layers.map((item, i) =>
			(<IconButton aria-label="Layer" onClick={()=>this.handleClickOpen(item, i)}>
				<Badge badgeContent={i+1} color="primary" classes={{ badge: classes.badge }}>
					{icons[item.icon]}
				</Badge>
			</IconButton>)
		);
  
  return (
	<div>

		{listLayers}
		
		<ModalSetLayerProps openWindow={this.state.openLayerProps} 
							closeWindow={()=>this.setState({ openLayerProps: false, })} 
							__setLayerParams={this.props._setLayerParams}
							item={this.state.layer} 
							layerProps={this.state.layerProps} />
	
	</div>
	);
  }
}

TopMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TopMenu);
