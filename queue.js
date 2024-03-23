// Info: Communication management SDK. Send, Track and Manage- sms, email, push-notification
'use strict';

// Shared Dependencies (Managed by Loader)
var Lib = {};


// Exclusive Dependencies
var CONFIG = require('./config'); // Loader can override it with Custom-Config


/////////////////////////// Module-Loader START ////////////////////////////////

  /********************************************************************
  Load dependencies and configurations

  @param {Set} shared_libs - Reference to libraries already loaded in memory by other modules
  @param {Set} config - Custom configuration in key-value pairs

  @return nothing
  *********************************************************************/
  const loader = function(shared_libs, config){

    // Shared Dependencies (Must be loaded in memory already)
    Lib.Utils = shared_libs.Utils;
    Lib.Debug = shared_libs.Debug;
    Lib.DynamoDB = shared_libs.DynamoDB;
    Lib.Instance = shared_libs.Instance;

    // Override default configuration
    if( !Lib.Utils.isNullOrUndefined(config) ){
      Object.assign(CONFIG, config); // Merge custom configuration with defaults
    }

  };

//////////////////////////// Module-Loader END /////////////////////////////////



///////////////////////////// Module Exports START /////////////////////////////
module.exports = function(shared_libs, config){

  // Run Loader
  loader(shared_libs, config);

  // Return
  return Queue;

};//////////////////////////// Module Exports END //////////////////////////////



///////////////////////////Public Functions START//////////////////////////////
const Queue = { // Public functions accessible by other modules

  /********************************************************************
  Set Queue data from database

  @param {reference} instance - Request Instance object reference
  @param {Function} cb - Callback function to be invoked once async execution of this function is finished

  @param {String} parition_key - Partition Key ( Combination of Resource-ID )
  @param {String} sort_key - Sort Key ( Combination of Resource-ID )
  @param {Set} payload -  Payload-Data
  @param {String} action -  Action
  @param {Number} time_of_last_modified - [UNIXTIME] Time-Of-Last-Modified
  @param {String} request_id - Request-Id

  @return - Thru Callback

  @callback(err, is_success) - Request Callback.
  * @callback {Error} err - Database Error
  * @callback {Boolean} is_success -  True if record created
  *********************************************************************/
  setQueueData: function(
    instance, cb,
    parition_key, sort_key,
    payload, action,
    time_of_last_modified,
    request_id
  ){

    // Override Last Modified
    time_of_last_modified = Lib.Utils.fallback(time_of_last_modified, instance['time']);

    // NO-DB Record ID
    var db_record = {
      'p': parition_key, // Partition Key
      'id': sort_key + '.' + time_of_last_modified, // Sort Key
      'retry_count': ( 0 + '-' + parition_key + '-' + (sort_key + '.' + time_of_last_modified) ),
      'payload': payload,
      'action': action, // Partition Key
      'l_id': request_id, // Request ID
      'toc': instance['time'],
      'tolm': Lib.Utils.fallback(time_of_last_modified, instance['time']),
    };


    // Add data from dynamodb
    Lib.DynamoDB.addRecord(
      instance,
      cb, // Return as-it-is,
      CONFIG.DB_SOURCE, // Table Name
      db_record
    );

  },


  /********************************************************************
  Update Queue data in database

  @param {reference} instance - Request Instance object reference
  @param {Function} cb - Callback function to be invoked once async execution of this function is finished

  @param {String} parition_key - Partition Key ( Combination of Resource-ID )
  @param {String} sort_key - Sort Key ( Combination of Resource-ID )
  @param {Number} retry_count - Retry Count
  @param {Boolean} in_progress -  True in case action is in progress

  @return - Thru Callback

  @callback(err, is_success) - Request Callback.
  * @callback {Error} err - Database Error
  * @callback {Boolean} is_success -  True if record updated
  *********************************************************************/
  updateQueueData: function(
    instance, cb,
    parition_key, sort_key,
    retry_count, in_progress
  ){

    // NO-DB Record ID
    var record_id = {
      'p': parition_key, // Partition Key
      'id': sort_key, // Sort Key
    };

    // Record-Data
    var db_record = {
      'retry_count': (retry_count + '-' + parition_key + '-' + sort_key),
      'in_progress': in_progress
    };


    // Add data from dynamodb
    Lib.DynamoDB.updateRecord(
      instance,
      cb, // Return as-it-is,
      CONFIG.DB_SOURCE, // Table Name
      record_id,
      db_record
    );

  },


  /********************************************************************
  Get Queue data from database

  @param {reference} instance - Request Instance object reference
  @param {Function} cb - Callback function to be invoked once async execution of this function is finished

  @param {String} parition_key - Partition Key ( Combination of Resource-ID )
  @param {String} sort_key - Sort Key ( Combination of Resource-ID )

  @return - Thru Callback

  @callback(err, response) - Request Callback.
  * @callback {Error} err - Database Error
  * @callback {Response} response_data -  Action-Queue-data
  *********************************************************************/
  getQueueData : function (instance, cb, parition_key, sort_key){

    // NO-DB Record ID
    var record_id = {
      'p': parition_key, // Partition Key
      'id': sort_key, // Sort Key
    };

    // Get data from dynamodb
    Lib.DynamoDB.getRecord(
      instance,
      cb, // Return as-it-is,
      CONFIG.DB_SOURCE, // Table Name
      record_id
    );

  },


  /********************************************************************
  Get Action-Queues-list from database

  @param {reference} instance - Request Instance object reference
  @param {Function} cb - Callback function to be invoked once async execution of this function is finished

  @param {String} parition_key - Partition Key ( Combination of Resource-ID )
  @param {String} operator - Sort Key ( Combination of Resource-ID )
  @param {String} key - Sort Key ( Combination of Resource-ID )

  @return - Thru Callback

  @callback(err, response_list) - Request Callback.
  * @callback {Error} err - Database Error
  * @callback {Response} response_list -  Action-Queues-list
  *********************************************************************/
  getQueuesData : function (instance, cb, parition_key, operator, key){

    // Conditions
    var condition = {
      'operator': operator, // Partition Key
      'key': 'id', // Sort Key
      'value': key, // Sort Value
    };

    // Get data-list from dynamodb
    Lib.DynamoDB.queryRecords(
      instance,
      cb, // Return as-it-is,
      CONFIG.DB_SOURCE, // Table Name
      null, // Secondary Index
      'p', // Partition Key
      parition_key, // Partition ID
      null, // get all fields
      null, // No Pagination
      condition
    );

  },


  /********************************************************************
  Delete Queue data from database

  @param {reference} instance - Request Instance object reference
  @param {Function} cb - Callback function to be invoked once async execution of this function is finished

  @param {String} parition_key - Partition Key ( Combination of Resource-ID )
  @param {String} sort_key - Sort Key ( Combination of Resource-ID )

  @return - Thru Callback

  @callback(err, is_success) - Request Callback.
  * @callback {Error} err - Database Error
  * @callback {Response} is_success -  True in case deleted successfully
  *********************************************************************/
  deleteQueueData : function (instance, cb, parition_key, sort_key){

    // NO-DB Record ID
    var record_id = {
      'p': parition_key, // Partition Key
      'id': sort_key, // Sort Key
    };

    // Get data from dynamodb
    Lib.DynamoDB.deleteRecord(
      instance,
      cb, // Return as-it-is,
      CONFIG.DB_SOURCE, // Table Name
      record_id
    );

  },


  /********************************************************************
  Delete Queues data from database

  @param {reference} instance - Request Instance object reference
  @param {Function} cb - Callback function to be invoked once async execution of this function is finished

  @param {Set[]} data_items - Data items

  @return - Thru Callback

  @callback(err, is_success) - Request Callback.
  * @callback {Error} err - Database Error
  * @callback {Response} is_success -  True in case deleted successfully
  *********************************************************************/
  deleteQueuesData : function (instance, cb, data_items){

    // Get data from dynamodb
    Lib.DynamoDB.deleteBatchRecords(
      instance,
      cb, // Return as-it-is,
      [CONFIG.DB_SOURCE], // Table Name
      [data_items]
    );

  },

};///////////////////////////Public Functions END//////////////////////////////



//////////////////////////Private Functions START//////////////////////////////
const _Queue = { // Private functions accessible within this modules only
// None
};//////////////////////////Private Functions END//////////////////////////////
