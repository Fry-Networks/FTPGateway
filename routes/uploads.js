'use strict'

var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var cors = require('cors')
var http = require('http');
var url = require('url');
var fs = require('fs');
var Uploads = require('../models/uploads');
var UploadController = require('../controllers/uploads')
app.use(cors())
router.use(cors())



//support on x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.get('/', UploadController.loginRequired, UploadController.uploads);
router.get('/filelist', UploadController.loginRequired, UploadController.uploadList);
router.post('/file', UploadController.loginRequired, UploadController.uploadFile);



module.exports = router;
