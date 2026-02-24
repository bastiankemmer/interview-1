import { fib } from '../src/fibonacci';

describe('fib', () => {
  it('returns 0 for n=0, 1 for n=1', () => {
    expect(fib(0)).toBe(0);
    expect(fib(1)).toBe(1);
  });

  it('returns correct values for small n', () => {
    expect(fib(2)).toBe(1);
    expect(fib(3)).toBe(2);
    expect(fib(4)).toBe(3);
    expect(fib(5)).toBe(5);
    expect(fib(10)).toBe(55);
  });

  it('works for n=50 without stack overflow', () => {
    expect(fib(50)).toBe(12_586_269_025);
  });

  it('works for large n without stack overflow (recursive impl blows stack)', () => {
    // Stack depth is O(n); naive recursion overflows around 10k–20k. Iterative/memo must handle this.
    expect(fib(15_000)).toBeGreaterThan(0);
  });
});
