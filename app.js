var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongodb  = require('mongodb');
var nodemailer = require('nodemailer');
var https = require('https');
var http = require('http');
var fs = require('fs');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.set('strictQuery', true);
const smpp = require('smpp');

const routePath = '/public'

const fileUpload = require('express-fileupload');

//routers
var client = require('./routes/client');
var uploads = require('./routes/uploads');

//Models
var Client = require('./models/client');
var Uploads = require('./models/uploads');

var jsonwebtoken = require('jsonwebtoken');
var app = express();
app.use(fileUpload());
var cors = require('cors');
app.use(cors());
// app.use(express.static('/public'));
// app.use('/public', express.static('/public'));
app.use(express.static(routePath));
app.use(routePath, express.static(routePath));

var portSelected = 8480;
var dbe = 'mongodb://localhost/frycrypto';
app.listen(portSelected, function() {
  console.log('Fry Crypto API Gateway running on ' + portSelected);
});
mongoose.connect(dbe);
// mongoose.connect(uri);

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(morgan('Nexzent-core-log'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



//Token middleware
app.use(function(req, res, next){
  if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'frycrypto_api'){
    jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'REDACTED_ROTATE_ME', function(err, decode){
      if(err) req.user = undefined;
      req.user = decode;
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
});


/* Routes */
app.use('/', client);
app.use('/client', client);
app.use('/uploads', uploads);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
next(err);
});
//enable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
