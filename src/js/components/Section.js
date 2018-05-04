import React, { Component } from 'react';
import $ from 'jquery';
import waitforimages from 'jquery.waitforimages';
const storage = require('../storage');
const pubsub = new ( require('../utils/PubSub') );

class Section extends Component {

	constructor( props ) {
		super( props );

		this.data = storage.getPage( this.props.name )
		.then( ( response ) => {
			this.setState({
				bg_src: response['bg_img'],
				pageData: response

			});

			$(this.refs.bg_layer)
			.waitForImages(() => {
			    pubsub.publish('background-loaded', {});
			});
		})
		.catch((error) => console.log(error));

		this.state = {
			pageData : {},
			bg_src: '',
			contentShow: false
		}

		// this.showContent = this.showContent.bind( this );
		// this.hideContent = this.hideContent.bind( this );
		// pubsub.subscribe(`hide-text ${props.name}`, this.hideContent );
		// pubsub.subscribe(`show-text ${props.name}`, this.showContent );
	}

	hideContent() {
		this.setState({ contentShow: false });
	}

	showContent() {
		this.setState({ contentShow: true });
	}

	render() {
		let data = this.state.pageData;
		let contentClassName = `containerContent ${data.color}`;
		// contentClassName += ( this.state.contentShow ) ? ` show` : ` hide`;

		return (
			<section className="section" >
				<div
					ref="bg_layer"
					className="bg_layer"
					style={ { backgroundImage: `url(${this.state.bg_src})` } } >
				</div>
				<div className={contentClassName} >
					<h2 className="header">{data.header}</h2>
					<p className="description">
						<strong className="shortDescription">{data.shortDescription}</strong>
						{data.description}
					</p>
				</div>
			</section>
		);
	}
}

export default Section;