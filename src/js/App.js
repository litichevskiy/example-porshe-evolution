import React, { Component } from 'react';
import $ from 'jquery';
import Section from './components/Section';
import NavPanel from './components/NavPanel';
import ButtonOpenClose from './components/ButtonOpenClose';
const storage = require('./storage');
const pubsub = new ( require('./utils/PubSub') );
const TIME_ANIMATION_SCROLL = 1000; // ms
const HEIGHT_SECTION_IN_VIEWPORT = 50; // in procent
const HOME = 'Home'; // key code
const END = 'End' // key code

class App extends Component {

	constructor( props ) {
  		super( props );

  		this.sectionsCoord = [];
  		this.sections;
        this.indexSection = 0;
  		this.viewportHeight;

        this._animationScroll = this._animationScroll.bind( this );
        pubsub.subscribe('selected-new-index', this._animationScroll );
    }

    componentDidMount() {
        this._init();
    }

    _init() {
        let positionScroll = window.scrollY;
        let lengthSectionsCoord;
        this.sections = document.querySelectorAll('.section');
        this.viewportHeight = document.body.clientHeight;
        this._setCoord();
        this._getIndexCurrentSection();
        lengthSectionsCoord = this.sectionsCoord.length - 1;

        window.addEventListener('resize', ( event ) => {
            if( this.viewportHeight !== document.body.clientHeight ) {
                this._setCoord();
                this._getIndexCurrentSection();
            }
        });

        window.addEventListener('scroll', ( event ) => {
            let curentScroll = window.scrollY;
            if( curentScroll >= positionScroll ) this._scrollDown( curentScroll )
            else this._scrollUp( curentScroll )
            positionScroll = curentScroll;
        });

        window.addEventListener('keydown', ( event ) => {
            let code = event.code;
            if( code === HOME ) this._animationScroll({index: 0});
              else
                if( code === END ) this._animationScroll({index: lengthSectionsCoord});
        });
    }

    _scrollUp( curentScroll ) {
        let result = this._getPositionSection('up');

        if( result >= curentScroll ) {
            this.indexSection -= 1;
            pubsub.publish('changed-active-index', {index: this.indexSection });
        }
    }

    _scrollDown( curentScroll ) {
        let result = this._getPositionSection('down');

        if( result <= curentScroll ) {
            this.indexSection += 1;
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
        let sectionsList = storage.getNavPanel();

    	return (
      		<div ref="container" className="containerSections">
                <NavPanel />
                <ButtonOpenClose />
                {sectionsList.map( ( item, index ) => {
                    return <Section name={item} key={index} />
                })}
     	 	</div>
    	);
  	}
}

export default App;