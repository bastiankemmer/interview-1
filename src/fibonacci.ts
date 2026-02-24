/**
 * Return the n-th Fibonacci number (0-indexed: fib(0)=0, fib(1)=1, fib(2)=1, ...).
 * Current implementation is recursive and will throw "Maximum call stack size exceeded"
 * for large n. Fix it so it works for at least n up to 1000 without blowing the stack.
 */
export function fib(n: number): number {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  return fib(n - 1) + fib(n - 2);
}
