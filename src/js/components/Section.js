import React, { Component } from 'react';
const storage = require('../storage');

class Section extends Component {

	constructor( props ) {
		super( props );

		this.data = storage.getPage( this.props.name );
		this.bg_src = this.data['bg_img'];
	}

	render() {
		let data = this.data;
		//style={ { backgroundImage: `url(${this.bg_src})` } }
		return (
			<section className="section" >
				{/*<div className="bg_layer" style={ { backgroundImage: `url(${this.bg_src})` } } ></div>*/}
				<div className="containerContent">
					<h2>{data.header}</h2>
					<span className="separator"></span>
					<p className="description">
						<strong className="shortDescription">{data.shortDescription}</strong>
						{data.description}
					</p>
				</div>
				<img className="background_section" src={this.bg_src} alt="" />
			</section>
		);
	}
}

export default Section;