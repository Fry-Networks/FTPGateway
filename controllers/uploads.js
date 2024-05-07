'use strict';


var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var cors = require('cors')
var Uploads = require('../models/uploads');
var UploadsController = require('./uploads');
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
//var User = mongoose.model('User');
// const routePath = '/Users/rakshitharodrigo/Downloads/public'
const routePath = '/public'
const SftpClient = require('ssh2-sftp-client');

app.use(cors())
router.use(cors())


const serverConfig = {
  host: 'REDACTED_ROTATE_ME',
  port: 22,
  username: 'fryscrypto',
  password: 'REDACTED_ROTATE_ME'
};

function getRemotePath(type) {
  var remotePath = ""

  switch (type) {
      case "Satellite_Miner_indoor":
        remotePath = "/home/fryscrypto/indoor_gnss";
          break;
      case "Satellite_Miner_outdoor":
        remotePath = "/home/fryscrypto/outdoor_gnss";
          break;
      case "Decibel_Miner_indoor":
        remotePath = "/home/fryscrypto/indoor_decibel";
          break;
      case "Decibel_Miner_outdoor":
        remotePath = "/home/fryscrypto/outdoor_decibel";
          break;
      case "Bandwidth_Speed_Miner":
        remotePath = "/home/fryscrypto/bandwidth_speed";
          break;
      default:
        remotePath = "/home/fryscrypto/apitests";
          break;
  }

  return remotePath;
}

async function uploadFileToSftpServer(localFilePath, remoteFilePath, serverConfig) {
  const { host, port, username, password } = serverConfig;

  const sftp = new SftpClient();

  try {
      await sftp.connect({
          host,
          port,
          username,
          password
      });

      await sftp.put(localFilePath, remoteFilePath);
      console.log(`File uploaded successfully to ${remoteFilePath}`);
  } catch (err) {
      console.error(`Error uploading file: ${err.message}`);
  } finally {
      await sftp.end();
  }
}

/**
 * 
 * const localFilePath = '/path/to/local/file.txt';
 * const remoteFilePath = '/path/to/remote/file.txt';
 * uploadFileToSftpServer(localFilePath, remoteFilePath, serverConfig);
 * 
 */





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


exports.uploads = function(req, res){
  console.log("###### user ######");
  res.json({status: 'RM RODRIGO - Hey! | W E L C O M E | Stranger ! | You are on PRIVATE PROPERTY! --'});
};


/* Get uploadList list*/
exports.uploadList = function(req, res){
  console.log("###### get uploadList ######");
  Uploads.find({})
  .exec(function (err, users) {
    if (err) {
      console.log('####### error occured' + err);
      // logger.error(err)
      res.send('error');
    } else {
      if (users !== null) {
        console.log("####################### not an null data : uploadList already exist ##########################");
          res.json({ status: 'success', details: "uploadList available", message: "uploadList retrived successfully!", content: users });
      } else {
        console.log("####################### null data ##########################");
        res.json({ status: 'failed', details: "uploadList list not existed", message: "uploadList retriving failed!" });
      }
    }
  })
};

/* ### uploadFile / Register ### */
exports.uploadFile = function(req, res){
  console.log("###### uploadFile register ######");
  console.log(req.body);
  Client.findOne({ 'macAddress': req.body.macAddress})
  .exec(function (err, client) {
    if (err) {
      console.log('####### error occured' + err);
      // logger.error(err)
      res.send('error');
    } else {
      if (client !== null) {
        console.log("####################### not an null data : Client already exist ##########################");

          Uploads.findOne({ 'uploadFileName': req.body.uploadFileName})
          .exec(function (err, files) {
            if (err) {
              console.log('####### error occured' + err);
              // logger.error(err)
              res.send('error');
            } else {
              if (files !== null) {
                console.log("####################### not an null data : Uploads already exist ##########################");
                  res.json({ status: 'failed', details: "files already registered!", message: "files upload failed!" });
                  
              } else {
                console.log("####################### no existing file on this name ##########################");
                // console.log(users);
                // res.json({ status: 'failed', details: "file not Existed!", message: "file not Existed" });
                var upload = new Uploads();
                
                  upload.macAddress = req.body.macAddress;
                  upload.uploadTime = req.body.uploadTime;
                  upload.uploadFileName = req.body.uploadFileName;
                  upload.uploadFileData = req.body.uploadFileData;
                  upload.type = req.body.type;
                
          
                  upload.save(function (err) {
                    if (err) {
                      console.log('#################### error occured #######################');
                      console.log(err);
                      res.send(err);
                    } else {
                      upload.password = undefined;

                      var currentDateTime = Date.now()
                      var newValues = {
                        $set: {
                          lastUploadedTime: currentDateTime
                        }
                      }

                      
                      

                    Client.findByIdAndUpdate(client._id, newValues, function (err, result) {
                      if (err) {
                        console.log(err)
                        throw err;
                      } else {
                        Client.findById(client._id)
                          .exec(function (err, client) {
                            if (err) {
                              console.log('error occured');
                              console.log(err)
                            } else {
                              console.log('client profile updated successfully');
                              // res.json({ status: 'success', details: "client profile updated successfully", message: "client profile updated successfully!", content: client, token: jwt.sign({ macAddress: client.macAddress, ipAddress: client.ipAddress, _id: client._id}, 'REDACTED_ROTATE_ME') });
                            }
                          });
                        }
                      });

                      res.json({ status: 'success', details: "File Uploaded successfully", message:"File Uploaded successfully!", content: upload});
                    }
                  });
              }
            }
          });

      } else {
        console.log("####################### no existing user on this email ##########################");
        // console.log(users);
        res.json({ status: 'failed', details: "Client not Existed!", message: "Client not Existed" });
      }
    }
  });
};




exports.loginRequired = function(req, res, next){
  console.log("###### login required ######");
  console.log(req.headers)
  if(req.user){
    next()
  } else {
    return res.status(401).json({ message: 'Unauthorized user!' });
  }
};
