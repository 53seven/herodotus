/* global describe, it, beforeEach */
const pck = require('../package.json');
const herodotus = require('../');
const chai = require('chai');
const _ = require('lodash');
const expect = chai.expect;

describe('herodotus', () => {

  let minor_count = 0;

  beforeEach(() => {
    delete process.env.HERODOTUS_TOKEN;
    delete process.env.NODE_LOG_LOCATION;
    pck.version = `0.0.${minor_count}`;
    minor_count++;
  });

  it('should create a logging instance w/o any config', () => {
    const logger = herodotus(pck);
    // check that it has the function we want
    expect(_.isFunction(logger.info)).to.be.true;
    expect(_.isFunction(logger.trace)).to.be.true;
    expect(_.isFunction(logger.debug)).to.be.true;
    expect(_.isFunction(logger.warn)).to.be.true;
    expect(_.isFunction(logger.error)).to.be.true;
    expect(_.isFunction(logger.child)).to.be.true;

    // check that it has two streams, stdout and file
    //console.log(logger.streams);
    expect(logger.streams).to.have.lengthOf(2);
    expect(_.map(logger.streams, 'type')).to.include('stream', 'file');
  });

  it('should be able to change file log location via NODE_LOG_LOCATION', () => {
    process.env.NODE_LOG_LOCATION = '/whimmy/wham/wazzle';
    const logger = herodotus(pck);
    const stream = _.find(logger.streams, {type: 'file'});
    expect(stream).to.have.property('path');
    expect(stream.path).to.contain(process.env.NODE_LOG_LOCATION);
  });

  it('should be able to pass in a custom stream', () => {
    process.env.HERODOTUS_TOKEN = 'a token';
    const transport = (opts) => {
      expect(opts).to.have.property('api_token', process.env.HERODOTUS_TOKEN);
      expect(opts).to.have.property('server', 'https://herodotus.io/log');
    };
    herodotus(pck, transport);
  });

  it('should keep loggers as singletons for same package.json', () => {
    const logger1 = herodotus(pck);
    const logger2 = herodotus(pck);
    expect(logger1).to.be.equal(logger2);
  });

  it('should require a version number', () => {
    expect(() => {
      herodotus({name: 'foo'});
    }).to.throw();
  });

  it('should create a herodotus-transport stream if a HERODOTUS_TOKEN is present', () => {
    process.env.HERODOTUS_TOKEN = 'a token';
    const logger = herodotus(pck);
    expect(logger.streams).to.have.lengthOf(3);
    expect(_.map(logger.streams, 'type')).to.include('stream', 'file', 'raw');
  });

});