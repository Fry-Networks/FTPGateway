var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var UploadsSchema = Schema({
    macAddress: { type: String, required: true, unique: false, default: 'N/A' },
    uploadTime: { type: String, required: true, unique: false, default: 'N/A' },
    uploadFileName: { type: String, required: true, unique: false },
    uploadFileData: [{ type: String, required: false, unique: false }],
    type: { type: String, required: true, unique: false, default:'Satellite_Miner_indoor', enum:['Satellite_Miner_indoor', 'Satellite_Miner_outdoor', 'Decibel_Miner_indoor', 'Decibel_Miner_outdoor', 'Bandwidth_Speed_Miner']},
    recordedTime:  { type: Date, required: true, unique: false, default: Date.now}
});

module.exports = mongoose.model('Uploads', UploadsSchema);
