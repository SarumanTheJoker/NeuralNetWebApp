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

const neurons = ['fully-connected', 'convolutional'];
const icons = [<Share />, <Grain />];
const styles = {
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
};

class NeuralList extends React.Component {
	
	handleListItemClick = value => {
		this.props.onClose(value);
	};
	
	render() {
		
		const {_neuronet} = this.props
		
		return (
			<div>
			
				<List>
					{_neuronet.map((n, i) => (
						<ListItem button onClick={() => this.handleListItemClick(n[0])} key={n}>
							<ListItemAvatar>
								<Avatar>
									<BlurOn />
								</Avatar>
							</ListItemAvatar>
							<ListItemText primary={n[1]} />
						</ListItem>
					))}
				</List>
			
			</div>
		)
	}
}

export default NeuralList