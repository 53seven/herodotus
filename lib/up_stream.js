// up_stream.js
const bunyan = require('@537/bunyan');
const EventEmitter = require('events').EventEmitter;
const util = require('util');

function up_stream() {}
util.inherits(up_stream, EventEmitter);

up_stream.prototype.write = function (rec) {
  rec.level = bunyan.nameFromLevel[rec.level];
  rec.message = JSON.stringify(rec);
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(rec));
};

module.exports = function() {
  return new up_stream();
};