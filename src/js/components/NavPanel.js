import React, { Component } from 'react';
const storage = require('../storage');
const pubsub = new ( require('../utils/PubSub') );

class NavPanel extends Component {

    constructor( props ) {
        super( props );

        this.state = {
            curentIndex: 0,
            isOpen: false,
            listItems: [],
        }

        this._replaseActiveIndex = this._replaseActiveIndex.bind( this );
        this._openCloseNavPanel = this._openCloseNavPanel.bind( this );
        pubsub.subscribe('changed-active-index', this._replaseActiveIndex );
        pubsub.subscribe('changed-state-btn-open-close', this._openCloseNavPanel );
    }

    componentDidMount(){
        storage.getNavPanel()
        .then( ( response ) => {
            this.setState({ listItems: response });
        })
        .catch( ( error ) => console.error( error ));
    }

    _replaseActiveIndex( data ) {
        this.setState({curentIndex: data.index});
    }

    _selectedItem( event ) {
        let index = +event.target.dataset.index;
        pubsub.publish('selected-new-index', { index: index });
    }

    _openCloseNavPanel( data ) {
        this.setState({ isOpen: data.open });
    }

    render() {
        let curentIndex = this.state.curentIndex;
        let classNameNavPanel = ( this.state.isOpen ) ? 'containerNavPanel open' : 'containerNavPanel';
        let itemClassName;
        return (
            <nav className={classNameNavPanel}>
                <ul className="navPanel" onClick={( event ) => this._selectedItem( event )}>
                    {
                        this.state.listItems.map( ( item, index ) => {
                            if( index === curentIndex ) itemClassName = "itemNavPanel active";
                            else itemClassName = "itemNavPanel";
                            return (
                                <li className={itemClassName} key={index} data-index={index} >
                                    {item}
                                </li>
                            )
                        })
                    }
                </ul>
            </nav>
        );
    }
}

export default NavPanel;