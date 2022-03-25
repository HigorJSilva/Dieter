import { expect } from 'chai';

describe('Initial Test', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
        let array = [1, 2, 3].indexOf(4)
        expect(array).to.equal(-1)
    });
  });
});