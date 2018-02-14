// pretty_print.js
// a pretty printing stream for herodotus
const chalk = require('chalk');
const EventEmitter = require('events').EventEmitter;
const util = require('util');

function pretty_print() {}
util.inherits(pretty_print, EventEmitter);

// bunyan log levels
// var TRACE = 10;
// var DEBUG = 20;
// var INFO = 30;
// var WARN = 40;
// var ERROR = 50;
// var FATAL = 60;

pretty_print.prototype.write = function (rec) {
  let lead;
  if (rec.level <= 10) {
    lead = chalk.gray('[TRACE]');
  } else if (rec.level <= 20) {
    lead = chalk.green('[DEBUG]');
  } else if (rec.level <= 30) {
    lead = chalk.white('[INFO]');
  } else if (rec.level <= 40) {
    lead = chalk.yellow('[WARN]');
  } else {
    lead = chalk.red('[ERROR]');
  }
  let msg = rec.id ? `${rec.id}:${rec.msg}` : rec.msg;
  process.stdout.write(`${lead}:${msg}\n`);
};

module.exports = function() {
  return new pretty_print();
};
