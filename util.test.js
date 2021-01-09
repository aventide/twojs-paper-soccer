const util = require('./util');

const {getCoordKey} = util;

test('gets proper string', () => {
  expect(getCoordKey(1,2)).toBe("1-2");
});