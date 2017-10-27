var mongoose = require('./db'),
    Schema = mongoose.Schema;

var TranscationSchema = new Schema({
    items: [String]
});

var Transcation = mongoose.model('Transcation', TranscationSchema);

module.exports = Transcation;