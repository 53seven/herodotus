// stream.js
const async = require('async');
const request = require('request');
const url = require('url');

function httpStream(opts) {

  this.endpoint = opts.server;

  console.log(this.endpoint);

  this.cargo = async.cargo((task, callback) =>{
    let form = {
      api_token: process.env.HERODOTUS_TOKEN,
      logs: task
    };

    request.post(this.endpoint, {form: form}, (err, res, body) => {
      if (res.statusCode !== 200) {
        console.error('ERROR LOGGING TO HERODOTUS', body);
      }
      callback();
    });
  }, 10);

  this.write = (log) => {
    this.cargo.push(log);
  };

}

let stream;
module.exports = function(opts) {
  if (!stream) {
    stream = new httpStream(opts);
  }
  return stream;
};
