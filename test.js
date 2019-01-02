var mongoose = require('mongoose');
let {Mockgoose} = require('./built/mockmongoose');

let mockgoose = new Mockgoose(mongoose);
mockgoose.prepareStorage().then(() => {
	console.log('prepare storage ok', mongoose.mocked);
	mongoose.connect('mongodb://localhost:27017');
	
	mongoose.connection.on('connected', function () {  
	  console.log('Mongoose open');
	}); 
});
//var MockMongoose = require('./MockMongoose')(mongoose).then(function() {
	

//});
