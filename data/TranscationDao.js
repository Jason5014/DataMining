var Transcation = require('./Transcation');

var TranscationDao = function(){};

TranscationDao.prototype.add = function(data, callback){
    var transcation = new Transcation(data);
    transcation.save(function(err){
        console.log(err);
        callback();
    });
};

TranscationDao.prototype.getList = function(callback){
    Transcation.find({}, {items: true, _id: false}, function(err, obj){
        callback(err, obj);
    });
};

module.exports = new TranscationDao();