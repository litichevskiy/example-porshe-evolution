import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
const storage = require('./storage');

storage.initDate()
.then( ( response ) => {
	if( response.isInit ) {
		ReactDOM.render(<App />, document.querySelector('.containerApp'));
	}
})
.catch( ( error ) => { console.error( error ) });