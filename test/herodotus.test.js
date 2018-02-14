/* global describe, it, beforeEach */
const herodotus = require('../');
const chai = require('chai');
const _ = require('lodash');
const expect = chai.expect;

describe('herodotus', () => {

  beforeEach(() => {
    delete process.env.HERODOTUS_TOKEN;
    delete process.env.NODE_LOG_LOCATION;
    delete process.env.NODE_ENV;
    delete process.env.UP_STAGE;
    delete process.env.STD_LOG_LEVEL;
  });

  it('should create a logging instance w/o any config', () => {
    const logger = herodotus();
    // check that it has the function we want
    expect(_.isFunction(logger.info)).to.be.true;
    expect(_.isFunction(logger.trace)).to.be.true;
    expect(_.isFunction(logger.debug)).to.be.true;
    expect(_.isFunction(logger.warn)).to.be.true;
    expect(_.isFunction(logger.error)).to.be.true;
    expect(_.isFunction(logger.child)).to.be.true;

    // check that it has two streams, stdout and file
    expect(logger.streams).to.have.lengthOf(1);
    expect(_.map(logger.streams, 'type')).to.include('stream');
    expect(_.map(logger.streams, 'level')).to.include(10);
  });

  // moving to @537/bunyan creates some errors with the pretty printing
  it('should create a debug logger when NODE_ENV=development', () => {
    process.env.NODE_ENV = 'development';
    const logger = herodotus();

    // check that it has two streams, stdout and file
    expect(logger.streams).to.have.lengthOf(1);
    expect(_.map(logger.streams, 'type')).to.include('raw');
    expect(_.map(logger.streams, 'level')).to.include(10);

    // run through our log levels for code coverage
    logger.info('plain string');
    logger.trace({id: 'trace'}, 'trace test');
    logger.debug({id: 'debug'}, 'debug test');
    logger.info({id: 'info'}, 'info test');
    logger.warn({id: 'warn'}, 'warn test');
    logger.error({id: 'error'}, 'error test');
  });

  it('should create an `up` stream when UP_STAGE exists', () => {
    process.env.UP_STAGE = 'not null';
    const logger = herodotus();

    // check that it has two streams, stdout and file
    expect(logger.streams).to.have.lengthOf(1);
    expect(_.map(logger.streams, 'type')).to.include('raw');
    expect(_.map(logger.streams, 'level')).to.include(10);

    // run a log statement to make sure the stream does not fail
    logger.info({foo: 'bar', msg: 'test'});
    logger.debug({foo: 'bar', msg: 'test'});
  });

  it('should write to a file when NODE_LOG_LOCATION is set', () => {
    process.env.NODE_LOG_LOCATION = '/whimmy/wham/wazzle';
    const logger = herodotus();
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
    herodotus(transport);
  });

  it.skip('should keep loggers as singletons for same package.json', () => {
    const logger1 = herodotus();
    const logger2 = herodotus();
    expect(logger1).to.be.equal(logger2);
  });

  it.skip('should require a version number', () => {
    expect(() => {
      herodotus({name: 'foo'});
    }).to.throw();
  });

  it('should create a herodotus-transport stream if a HERODOTUS_TOKEN is present', () => {
    process.env.HERODOTUS_TOKEN = 'a token';
    const logger = herodotus();
    expect(logger.streams).to.have.lengthOf(2);
    expect(_.map(logger.streams, 'type')).to.include('stream', 'raw');
  });

  it('should respect STD_LOG_LEVEL for logs sent to stdout', () => {
    process.env.STD_LOG_LEVEL = 'warn';
    const logger = herodotus();
    expect(logger.streams).to.have.lengthOf(1);
    expect(_.map(logger.streams, 'type')).to.include('stream');
    // warn -> log level = 40
    expect(_.map(logger.streams, 'level')).to.include(40);
  });

});