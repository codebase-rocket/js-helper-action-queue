// Info: Test Cases
'use strict';
var Lib = {};

// Load Project Dependencies and Configration
Lib.Utils = require('js-helper-utils')
Lib.Debug = require('js-helper-debug')(Lib)
Lib.Instance = require('js-helper-instance')(Lib)
// Lib.aws-sdk = require('aws-sdk')(Lib)
Lib.NoDB = require('js-helper-aws-dynamodb')(Lib, )
Lib.Cache = require('js-helper-cache')(Lib, )



////////////////////////////SIMILUTATIONS//////////////////////////////////////

function output_handler(err, response){ // Err, Result are from previous function

  if(err){ // If error
    console.log('Error Code:', err.code );
    console.log('Error Msg:', err.message );
  }
  else{
    console.log('Response:', response );
  }

  // cleanup instance - close open connections
  Lib.Instance.cleanup(instance);

};

///////////////////////////////////////////////////////////////////////////////


/////////////////////////////STAGE SETUP///////////////////////////////////////

// Initialize Instance Object
var instance = Lib.Instance.initialize();

///////////////////////////////////////////////////////////////////////////////


/////////////////////////////////TESTS/////////////////////////////////////////

// Test setQueueData
// Lib.Debug.log(
//   Lib.Queue.setQueueData(
//     instance, output_handler,
//     // Set Data
//   )
// );


// Test updateQueueData
// Lib.Debug.log(
//   Lib.Queue.updateQueueData(
//     instance, output_handler,
//     // Set Data
//   )
// );


// Test getQueueData
// Lib.Debug.log(
//   Lib.Queue.getQueueData(
//     instance, output_handler,
//     // Set Data
//   )
// );

///////////////////////////////////////////////////////////////////////////////
