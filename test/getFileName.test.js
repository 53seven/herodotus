/* global describe, it */
const getRootName = require('../lib/getRootName');
const chai = require('chai');
const expect = chai.expect;

describe('herodotus.getRootName', () => {

  describe('herodotus.getRootName.main', () => {
    it('should be able to read the package off of require.main', () => {
      // since we are spun up in a mocha instance, this has to equal mocha
      expect(getRootName.main(require.main)).to.equal('mocha');
    });
  });

  describe('herodotus.getRootName.sanitizeName', () => {

    it('should leave normal names along', () => {
      const name = 'herodotus';
      expect(getRootName.sanitizeName(name)).to.equal('herodotus');
    });

    it('should split file names', () => {
      const path = 'this/is/a/package/path';
      expect(getRootName.sanitizeName(path)).to.equal('this-is-a-package-path');
    });

    it('should drop @ from scoped packages', () => {
      const name = '@foo/bar';
      expect(getRootName.sanitizeName(name)).to.equal('bar');
    });

  });

});