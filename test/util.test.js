import { expect } from '@esm-bundle/chai';
import { areCoordsEqual, getCoordKey, getLineSegments } from '../util';

it('getCoordKey', () => {
  expect(getCoordKey({ x: 1, y: 2 })).to.equal("1-2");
});

it('areCoordsEqual - equal', () => {
  expect(areCoordsEqual({ x: 1, y: 2 }, { x: 1, y: 2 })).to.equal(true)
})

it('areCoordsEqual - not equal', () => {
  expect(areCoordsEqual({ x: 1, y: 0 }, { x: 1, y: 2 })).to.equal(false)
})

// test getLineSegments

const ascendingLine = [
  { x: 2, y: 1 },
  { x: 2, y: 5 },
];

const ascendingLineResult = [
  { x: 2, y: 1 },
  { x: 2, y: 2 },
  { x: 2, y: 3 },
  { x: 2, y: 4 },
  { x: 2, y: 5 },
];

const descendingLine = [
  { x: 2, y: 5 },
  { x: 2, y: 3 }
];

const descendingLineResult = [
  { x: 2, y: 5 },
  { x: 2, y: 4 },
  { x: 2, y: 3 },
]

const ascendingLineHoriz = [
  { x: 1, y: 3 },
  { x: 5, y: 3 }
]

const ascendingLineHorizResult = [
  { x: 1, y: 3 },
  { x: 2, y: 3 },
  { x: 3, y: 3 },
  { x: 4, y: 3 },
  { x: 5, y: 3 }
]

const descendingLineHoriz = [
  { x: 8, y: 3 },
  { x: 3, y: 3 }
]

const descendingLineHorizResult = [
  { x: 8, y: 3 },
  { x: 7, y: 3 },
  { x: 6, y: 3 },
  { x: 5, y: 3 },
  { x: 4, y: 3 },
  { x: 3, y: 3 }
]

it('getLineSegments ascending vertical line', () => {
  expect(getLineSegments(ascendingLine[0], ascendingLine[1])).to.eql(
    ascendingLineResult
  );
})

it('getLineSegments descending vertical line', () => {
  expect(getLineSegments(descendingLine[0], descendingLine[1])).to.eql(
    descendingLineResult
  );
})

it('getLineSegments ascending horizontal line', () => {
  expect(getLineSegments(ascendingLineHoriz[0], ascendingLineHoriz[1])).to.eql(
    ascendingLineHorizResult
  );
})

it('getLineSegments descending horizontal line', () => {
  expect(getLineSegments(descendingLineHoriz[0], descendingLineHoriz[1])).to.eql(
    descendingLineHorizResult
  );
})