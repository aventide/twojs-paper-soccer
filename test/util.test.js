import { expect } from '@esm-bundle/chai';
import { getCoordKey } from '../util';

it('gets proper string', () => {
  expect(getCoordKey({x: 1, y: 2})).to.equal("1-2");
});