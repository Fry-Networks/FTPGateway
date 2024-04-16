'use strict';


var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var cors = require('cors')
var Uploads = require('../models/uploads');
var UploadsController = require('../controllers/uploads');
var Client = require('../models/client');
var ClientController = require('./client');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var cryptoHandler = ('../controllers/cryptoHandler');
app.use(cors())
router.use(cors())
var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var jsonwebtoken = require('jsonwebtoken');
//var client = mongoose.model('client');

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


exports.client = function(req, res){
  console.log("###### client ######");
  res.json({status: 'Hey! | W E L C O M E | Stranger ! | You are on PRIVATE PROPERTY! KEEP OUT!'});
};


/* Get clientList list*/
exports.clientList = function(req, res){
  console.log("###### get clientList ######");
  Client.find({})
  .exec(function (err, clients) {
    if (err) {
      console.log('####### error occured' + err);
      // logger.error(err)
      res.send('error');
    } else {
      if (clients !== null) {
        console.log("####################### not an null data : clientList already exist ##########################");
          res.json({ status: 'success', details: "clientList available", message: "clientList retrived successfully!", content: clients });
      } else {
        console.log("####################### null data ##########################");
        res.json({ status: 'failed', details: "clientList list not existed", message: "clientList retriving failed!" });
      }
    }
  })
};


/* ### Signup / Register ### */
exports.register = function(req, res){
  console.log("###### client register ######");
  console.log(req.body);
  Client.findOne({ 'macAddress': req.body.macAddress })
  .exec((err, clients) => {
    if (err) {
      console.log('####### error occured' + err);
      // logger.error(err)
      res.send('error');
    } else {
      if (clients !== null) {
        console.log("####################### not an null data : clients already exist ##########################");
        // res.json({ status: 'failed', details: "macAddress already registered!", message: "Sign up failed!" });
        // Update
        var currentDate = Date.now();
        var newValues = {
          $set: {
            lastContactedTime: currentDate
          }
        };
        Client.findByIdAndUpdate(clients._id, newValues, function (err, result) {
          if (err) {
            console.log(err);
            throw err;
          } else {
            Client.findById(clients._id)
              .exec(function (err, client) {
                if (err) {
                  console.log('error occured');
                  console.log(err)
                } else {
                  res.json({ status: 'success', details: "client profile updated successfully", message: "client profile updated successfully!", content: client, token: jwt.sign({ macAddress: client.macAddress, ipAddress: client.ipAddress, _id: client._id}, 'REDACTED_ROTATE_ME') });
                }
              });
            }
          });
      } else {
        console.log("####################### no existing client on this email ##########################");
        // console.log(clients);
        var client = new Client();
        
        client.macAddress = req.body.macAddress;
        client.userDeviceInfo = req.body.userDeviceInfo;
        client.ipAddress = req.body.ipAddress;
        client.fullName = req.body.fullName;
        
        client.save(function (err) {
          if (err) {
            console.log('#################### error occured #######################');
            console.log(err);
            res.send(err);
          } else {
            client.password = undefined;
            res.json({ status: 'success', details: "Register successfully", message: "Register successfully!", content: client, token: jwt.sign({ macAddress: client.macAddress, ipAddress: client.ipAddress, _id: client._id}, 'REDACTED_ROTATE_ME') });
          }
        });
      }
    }
  });
};


exports.loginRequired = function(req, res, next){
  console.log("###### login required ######");
  console.log(req.headers)
  if(req.client){
    next()
  } else {
    return res.status(401).json({ message: 'Unauthorized client!' });
  }
};
