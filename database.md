# v1.0 #

------------
AWS DynamoDB
------------


---------------------
Create table - action-Queue
---------------------
Action-Queue

* Table Name: test_action_queue
* Partition Key: p [string]
* Sort Key: id [string]

* After Table is Created-

* Secondary Index: [NONE]
* Read/write capacity mode: On-demand

Table Structure
---------------
* p (String)            -> [Partition Key]
* id (String)           -> [Sort Key]
* retry_count (String   -> Retry-Count + '-' + p + id
* payload (Set)         -> Payload-data
* action (String)       -> Action. Ex- 'update_deployment', 'update_assembly'
* in_progress (Boolean) -> True in case sync is in progress
* toc (Number)          -> [UNIXTIME] Time-Of-Creation
* tolm (Number)         -> [UNIXTIME] Time-Of-Last-Modified
