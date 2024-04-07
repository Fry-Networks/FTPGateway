var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var bcrypt = require('bcrypt')
var Schema = mongoose.Schema;

var ClientSchema = Schema({
    macAddress: { type: String, required: true, unique: false },
    userDeviceInfo: { type: String, required: true, unique: false },
    ipAddress: { type: String, required: true, unique: false },
    lastContactedTime: { type: Date, required: true, unique: false, default: Date.now},
    lastUploadedTime: { type: Date, required: true, unique: false, default: Date.now},
    recordedTime:  { type: Date, required: true, unique: false, default: Date.now}
});

module.exports = mongoose.model('Client', ClientSchema);
