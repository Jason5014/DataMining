var mongoose = require('mongoose'),
    db = 'Data-Mining',
    url = 'mongodb://localhost/'+db;

mongoose.Promise = global.Promise;

mongoose.connect(url);

mongoose.connection.on('connected', function(){
    console.log('Mongoose connection open to '+url);
});

mongoose.connection.on('error', function(err){
    console.log('Mongoose connection error: '+err);
});

mongoose.connection.on('disconnected', function(){
    console.log('Mongoose connected disconnected.');
});

module.exports = mongoose;

