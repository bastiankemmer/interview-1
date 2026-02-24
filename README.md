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

2. **Result type** – `src/result.ts`  
   Implement `safeParsePositiveInt` and `safeParsePositiveIntAsync` to return `Ok(value)` or `Err(message)` instead of throwing. Works for both sync and async.

3. **Fibonacci** – `src/fibonacci.ts`  
   The recursive implementation throws "Maximum call stack size exceeded" for large `n`. Fix it so `fib(n)` works for at least `n` up to 70 (e.g. iterative or memoization).

4. **Message queue (point-to-point)** – `src/message-queue/`  
   Implement the `MessageQueueImpl` class so that `publish`/`consume` deliver each message to exactly one consumer (FIFO). Each delivery has `ack()` (message done) and `nack()` (redeliver). Optional `messageTtlMs` and `maxSize` (backpressure). `createMessageQueue()` returns a new instance.

See **APPLICANT.md** for detailed instructions.
