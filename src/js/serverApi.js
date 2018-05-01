module.exports = {

	getAppData() {
		return new Promise((resolve, reject) => {
	  		setTimeout(() => {
				return fetch('./src/appData/data.json')
		  		.then( ( response ) => {
		  			if( response.ok ) resolve( response.json() ); //return response.json();
		  			else reject(); //new Error({message: response.statusText})
		   		})
		  		.catch( ( error ) => { console.log( error ) });
	  		}, 0 );
		});
	}
}