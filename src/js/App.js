import React, { Component } from 'react';
import $ from 'jquery';
import Section from './components/Section';
import NavPanel from './components/NavPanel';
import ButtonOpenClose from './components/ButtonOpenClose';
const storage = require('./storage');
const pubsub = new ( require('./utils/PubSub') );
const TIME_ANIMATION_SCROLL = 1000; // ms
const ANIMATION_REMOVE_LOADIN = 1200; // ms
const HEIGHT_SECTION_IN_VIEWPORT = 50; // in procent
const HOME = 'Home'; // key code
const END = 'End' // key code

class App extends Component {

    constructor( props ) {
        super( props );

        this.viewportHeight = document.body.clientHeight;
        this.sectionsCoord = [];
        this.sections;
        this.indexSection = 0;
        this.viewportHeight;
        this.lengthSectionsCoord;
        this.countSectionBg = 0;
        this.state = {
            sectionsList: [],
            isHide: true,
        }

        this._animationScroll = this._animationScroll.bind( this );
        this._checkLoadingSectionBackgroung = this._checkLoadingSectionBackgroung.bind( this );
        pubsub.subscribe('selected-new-index', this._animationScroll );
        pubsub.subscribe('background-loaded', this._checkLoadingSectionBackgroung );
    }

    componentDidMount() {
        let positionScroll = window.scrollY;

        storage.getNavPanel()
        .then( ( response ) => {
            this.setState({ sectionsList: response });
            this.sections = document.querySelectorAll('.section');
            this.lengthSectionsCoord = this.sections.length - 1;
        })
        .catch( ( error ) => console.error( error ));

        window.addEventListener('resize', ( event ) => {
            if( this.viewportHeight !== document.body.clientHeight ) {
                this._setCoord();
                this._getIndexCurrentSection();
            }
        });

        window.addEventListener('scroll', ( event ) => {
            let curentScroll = window.scrollY;
            if( curentScroll >= positionScroll ) this._scrollDown( curentScroll );
            else this._scrollUp( curentScroll )
            positionScroll = curentScroll;
        });

        window.addEventListener('keydown', ( event ) => {
            let code = event.code;
            if( code === HOME ) this._animationScroll({index: 0});
              else
                if( code === END ) this._animationScroll({index: this.lengthSectionsCoord});
        });
    }

    _checkLoadingSectionBackgroung( data ) {
        if( this.countSectionBg === this.lengthSectionsCoord ) {
            hideLoading();
            this.setState({isHide: false});

            this.sections = document.querySelectorAll('.section');
            this._setCoord();
            this._getIndexCurrentSection();
            this.lengthSectionsCoord = this.sectionsCoord.length - 1;
            pubsub.publish(`show-text ${this.state.sectionsList[this.indexSection]}`, {} );
        }
        else this.countSectionBg += 1;
    }

    _scrollUp( curentScroll ) {
        let result = this._getPositionSection('up');

        if( result >= curentScroll ) {
            pubsub.publish(`hide-text ${this.state.sectionsList[this.indexSection]}`, {} );
            this.indexSection -= 1;
            pubsub.publish(`show-text ${this.state.sectionsList[this.indexSection]}`, {} );
            pubsub.publish('changed-active-index', {index: this.indexSection });
        }
    }

    _scrollDown( curentScroll ) {
        let result = this._getPositionSection('down');

        if( result <= curentScroll ) {
            pubsub.publish(`hide-text ${this.state.sectionsList[this.indexSection]}`, {} );
            this.indexSection += 1;
            pubsub.publish(`show-text ${this.state.sectionsList[this.indexSection]}`, {} );
            pubsub.publish('changed-active-index', {index: this.indexSection });
        }
    }

    _getPositionSection( direction ) {
        let { start, end } = this.sectionsCoord[this.indexSection];
        let total, result;

        if( direction === 'up' ) {
            result = ( end - start );
            total = start - ( ( result / 100 )* HEIGHT_SECTION_IN_VIEWPORT );
        }

        else{
            result = ( end - start );
            total = start + ( ( result / 100 ) * HEIGHT_SECTION_IN_VIEWPORT );
        }

        return total;
    }

    _animationScroll( data ) {
        let scrollTo = this.sectionsCoord[ data.index ].start;
        $('body, html').animate({ scrollTop: scrollTo }, TIME_ANIMATION_SCROLL );
    }

  	_setCoord() {
  		let start = 1;
  		let end = 0;
  		this.sectionsCoord = [];

  		for( let item of this.sections ) {
  			end = start + item.clientHeight;
  			this.sectionsCoord.push({ start: start, end: end });
  			start = end;
  		}
  		this.viewportHeight = document.body.clientHeight;
  	}

    _getIndexCurrentSection() {
        let curentScroll = window.scrollY;

        this.sectionsCoord.some( ( item, index ) => {
            let {start, end} = item;

            if( curentScroll > start && curentScroll < end ) {
                this.indexSection = index;

                let result = ( end - start );
                let center = ( start + ( result / 2 ) )

                if( curentScroll >= center ) this.indexSection += 1;
                return true;
            }

            else return false;
        });

        pubsub.publish('changed-active-index', {index: this.indexSection});
    }

  	render() {
        let className = ( this.state.isHide ) ? 'containerSections hide' : 'containerSections';
    	return (
      		<div ref="container" className={className} >
                <NavPanel />
                <ButtonOpenClose />
                {this.state.sectionsList.map( ( item, index ) => {
                    return <Section name={item} key={index} />
                })}
                <div className="containerRotateIcon">
                    <img className="rotateIcon" src="./src/images/rotate_icon.png" alt="" />
                    <p className="userMessage">
                        <strong>Please rotate your device...</strong>
                    </p>
                </div>
            </div>
        );
    }
}

function hideLoading() {
    let loading = document.querySelector('.containerLoading');
    $(loading).slideUp(ANIMATION_REMOVE_LOADIN, () => $(loading).remove() );
};

export default App;