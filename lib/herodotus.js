// herodotus.js
const path = require('path');
const bunyan = require('bunyan');
const herodotus_transport = require('herodotus-transport');
const getRootName = require('./getRootName');

let loggers = {};

// figure out what our main module is so that we can know the correct file name to use
let baseName;
/* istanbul ignore else */
// literally no way to test this with mocha
if (require.main) {
  baseName = getRootName.main(require.main);
}

module.exports = function(pck, stream) {
  const name = pck.name;
  const version = pck.version;
  const herodotus_host = pck.herodotus_host || 'https://herodotus.io/log';

  const loggerKey = name + '@' + version;

  if (loggers[loggerKey]) {
    return loggers[loggerKey];
  }

  // force a version if the logger has not been created yet
  if (!version) {
    throw new Error('Creating a new logger, but no package version was supplied');
  }

  // create the logging stream based on the name of the process
  let loggingStreams = [{
    level: 'info',
    stream: process.stdout
  }];

  /* istanbul ignore else */
  // again, literally no way to test this
  if (baseName) {
    let logLocation = process.env.NODE_LOG_LOCATION ? process.env.NODE_LOG_LOCATION : './';

    loggingStreams.push({
      level: 'trace',
      path: path.join(logLocation, baseName + '.log')
    });

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

  }

  loggers[loggerKey] = bunyan.createLogger({
    name: name,
    version: version,
    streams: loggingStreams
  });

  return loggers[loggerKey];
};
