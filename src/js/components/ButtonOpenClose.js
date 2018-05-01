import React, { Component } from 'react';
const pubsub = new ( require('../utils/PubSub') );

class ButtonOpenClose extends Component {

	constructor( props ) {
		super( props );

		this.state = {
			isOpen: false,
		}
	}

	openCloseNavPanel() {
		let isOpen = !this.state.isOpen;
		this.setState({ isOpen: isOpen });
		pubsub.publish('changed-state-btn-open-close', { open: isOpen });
	}

	render() {
		let className = (this.state.isOpen) ? 'containerBtnOpenClose open' : 'containerBtnOpenClose';
		return(
			<div className={className} onClick={() => this.openCloseNavPanel()}>
				<img className="iconClose" src="./src/images/icon-close.png" alt="" />
				<img className="iconOpen" src="./src/images/icon-menu.png" alt="" />
			</div>
		)
	}
}

export default ButtonOpenClose;