# Algorithm Interview

TypeScript + Jest. Three tasks with tests that **fail initially**. Implement or fix the code so all tests pass. Do not modify the test files.

## Setup

```bash
npm install
npm test
```

## Tasks

1. **Partition with reduce** – `src/partition.ts`  
   Implement `partitionByReduce(array, predicate)` using only `array.reduce`. It should return `[matched[], rest[]]`.

2. **Fibonacci** – `src/fibonacci.ts`  
   The recursive implementation throws "Maximum call stack size exceeded" for large `n`. Fix it so `fib(n)` works for at least `n` up to 70 (e.g. iterative or memoization).

3. **Message queue (point-to-point)** – `src/message-queue/`  
   Implement `createMessageQueue()` so that `publish`/`consume` deliver each message to exactly one consumer (FIFO). Each delivery has `ack()` (message done) and `nack()` (redeliver). Optional `messageTtlMs`: messages expire if not consumed in time; hold when no consumer, deliver when one subscribes within TTL.

See **APPLICANT.md** for detailed instructions.
