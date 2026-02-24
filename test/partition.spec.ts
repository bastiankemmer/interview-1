import { partitionByReduce } from '../src/partition';

describe('partitionByReduce', () => {
  it('partitions numbers by even/odd', () => {
    const nums = [1, 2, 3, 4, 5, 6];
    const [evens, odds] = partitionByReduce(nums, (n) => n % 2 === 0);
    expect(evens).toEqual([2, 4, 6]);
    expect(odds).toEqual([1, 3, 5]);
  });

  it('partitions by predicate (strings by length)', () => {
    const words = ['a', 'ab', 'abc', 'd', 'ef'];
    const [long, short] = partitionByReduce(words, (s) => s.length >= 2);
    expect(long).toEqual(['ab', 'abc', 'ef']);
    expect(short).toEqual(['a', 'd']);
  });

  it('returns two empty arrays for empty input', () => {
    const [a, b] = partitionByReduce([], () => true);
    expect(a).toEqual([]);
    expect(b).toEqual([]);
  });

  it('puts all in first array when predicate always true', () => {
    const [yes, no] = partitionByReduce([1, 2, 3], () => true);
    expect(yes).toEqual([1, 2, 3]);
    expect(no).toEqual([]);
  });

  it('puts all in second array when predicate always false', () => {
    const [yes, no] = partitionByReduce([1, 2, 3], () => false);
    expect(yes).toEqual([]);
    expect(no).toEqual([1, 2, 3]);
  });

  it('must use reduce (single pass) - order preserved', () => {
    const input = [3, 1, 4, 1, 5];
    const [a, b] = partitionByReduce(input, (n) => n < 4);
    expect(a).toEqual([3, 1, 1]);
    expect(b).toEqual([4, 5]);
  });
});
