// herodotus.js
const bunyan = require('@537/bunyan');
const herodotus_transport = require('herodotus-transport');
const up_stream = require('./up_stream');
const pretty_print = require('./pretty_print');

const _loggers = {};

module.exports = function(stream) {
  // since we're required by ../index.js, we need parent.parent
  const pck = require('pkginfo').find(module.parent.parent);
  const name = pck.name;
  const version = pck.version;
  const herodotus_host = process.env.HERODOTUS_ENDPOINT || 'https://herodotus.io/log';

  const logger_key = `${pck.name}@${pck.version}`;

  if (_loggers[logger_key]) {
    return _loggers[logger_key];
  }

  // create the logging stream based on the name of the process
  let loggingStreams = [];

  let std_log_level = process.env.STD_LOG_LEVEL || 'trace';

  if (process.env.UP_STAGE) {
    loggingStreams.push({
      level: std_log_level,
      type: 'raw',
      stream: up_stream()
    });
  } else if (process.env.NODE_ENV === 'development') {
    loggingStreams.push({
      level: std_log_level,
      type: 'raw',
      stream: pretty_print()
    });
  } else {
    loggingStreams.push({
      level: std_log_level,
      stream: process.stdout
    });
  }

  let logLocation = process.env.NODE_LOG_LOCATION ? process.env.NODE_LOG_LOCATION : null;

  if (logLocation) {
    loggingStreams.push({
      level: 'trace',
      type: 'file',
      path: logLocation
    });
  }

  if (process.env.HERODOTUS_TOKEN) {
    const transport = stream ? stream : herodotus_transport;
    loggingStreams.push({
      type: 'raw',
      level: 'trace',
      stream: transport({
        api_token: process.env.HERODOTUS_TOKEN,
        server: herodotus_host
      })
    });
  }

  _loggers[logger_key] = bunyan.createLogger({
    name: name,
    version: version,
    streams: loggingStreams
  });

  return _loggers[logger_key];
};
