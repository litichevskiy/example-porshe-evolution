const serverApi = require('./serverApi');

const storage = ( () => {
	let _data;

	return{

		init() {
			return serverApi.getAppData()
			.then( ( response ) => {
				_data = response;
				return _data;
			})
			.catch( ( error ) => { console.error( error ) });
		},

		getPage( key ) {
			return new Promise( ( resolve, reject ) => {
				if( _data ) resolve( _data['pages'][ key ] );
				else{
					this.init()
					.then( ( response ) => {
						resolve( response['pages'][ key ] );
					})
					.catch((error) => reject( error ));
				}
			});
		},

		getNavPanel() {
			return new Promise((resolve, reject) => {
				if( _data ) resolve( _data['navPanel'] );
				else{
					this.init()
					.then( ( response ) => {
						resolve( response['navPanel'] );
					})
					.catch((error) => reject( error ));
				}
			});
		},
	}

})();

module.exports = storage;