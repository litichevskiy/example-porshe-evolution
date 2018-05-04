module.exports = {

	getAppData() {
		return fetch('./src/appData/data.json')
		.then( ( response ) => {
		  	if( response.ok ) return response.json();
		  	else new Error({message: response.statusText});
	 	})
	  	.catch( ( error ) => { console.error( error ) });
	}
};