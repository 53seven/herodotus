// herodotus.js
const path = require('path');
const bunyan = require('bunyan');
const pkginfo = require('pkginfo');
const herodotus_stream = require('./stream');

let loggers = {};

// figure out what our main module is so that we can know the correct file name to use
let baseName;
if (!require.main) {
  console.warn('No main module, not logging to a file');
} else {
  baseName = getFileName(require.main);
}

module.exports = function(pck) {
  const name = pck.name;
  const version = pck.version;
  const herodotus_host = pck.herodotus_host || 'http://herodotus.io/log';

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

  if (baseName) {
    let logLocation = process.env.NODE_LOG_LOCATION ? process.env.NODE_LOG_LOCATION : './';

    loggingStreams.push({
      level: 'trace',
      path: path.join(logLocation, baseName + '.log')
    });

    if (process.env.HERODOTUS_TOKEN) {
      loggingStreams.push({
        type: 'raw',
        stream: herodotus_stream({
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


function getFileName(module) {
  let pkg = pkginfo.read(module);
  let name = (pkg && pkg.package && pkg.package.name) ? pkg.package.name : path.basename(require.main.filename);
  return sanitizeName(name);
}

function sanitizeName(name) {
  let parts = name.split('/');
  if (parts.length === 1) {
    // normal name
    return parts[0];
  } else {
    // we have a scoped module, drop the first part
    if (parts[0].indexOf('@') === 0) {
      parts.shift();
    }
    return parts.join('-');
  }
}