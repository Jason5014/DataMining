var Transcation = require('./../data/TranscationDao');

exports.add = function(req, res){
    var data = req.body.data.split(',');
    Transcation.add({
        items: data
    }, function(err){
        res.send({ success: true});
    });
};

exports.getList = function(req, res){
    Transcation.getList(function(err, obj){
        res.send(obj);
    });
};