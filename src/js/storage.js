const serverApi = require('./serverApi');

const storage = ( () => {
	let _data = {};

	return{
		initDate() {
			return serverApi.getAppData()
			.then( ( response ) => {
				_data = response;
				return { isInit: true };
			})
			.catch( ( error ) => { console.error( error ) })
		},

		getPage( key ) {
			return _data['pages'][ key ];
		},

		getNavPanel() {
			return _data['navPanel'];
		},
	}

})();

module.exports = storage;