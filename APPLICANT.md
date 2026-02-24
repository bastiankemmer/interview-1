# Applicant Instructions

Run `npm test`. All tests are written to **fail** until you implement or fix the code. Your goal is to make every test pass by changing **only** the source files under `src/`. Do not modify any file under `test/`.

---

## 1. Partition with reduce

**File:** `src/partition.ts`

Implement `partitionByReduce(array, predicate)` using **only** `Array.prototype.reduce`. No `filter`, `forEach`, or manual loops. The function should return a tuple `[matched, rest]`: elements for which `predicate(item)` is true go in the first array, the rest in the second. Preserve original order in each array.

---

## 2. Result type (instead of throwing)

**File:** `src/result.ts`

Implement a **Result type** (Ok | Err) and use it instead of throwing exceptions. You design the type and the API yourself. It must work for both sync and async (sync returns `Result<T, E>`, async returns `Promise<Result<T, E>>`).

- **Define your own Result type** – e.g. a discriminated union with `ok: true` and `value`, or `ok: false` and `error`. Add any helpers you need (`ok()`, `err()`, type guards, etc.).
- **`safeParsePositiveInt(s: string)`** – Parse the string to a positive integer (≥ 0). Return your Ok variant with the number on success, or your Err variant with a message for invalid input (negative, non-numeric, empty, etc.). **Never throw.**
- **`safeParsePositiveIntAsync(s: string)`** – Same contract as above, but async. Return a Promise that resolves to Ok or Err. **Never throw; never reject the Promise.**

Tests expect Ok to have shape `{ ok: true, value: number }` and Err to have `{ ok: false, error: string }`.

---

## 3. Fibonacci (fix stack overflow)

**File:** `src/fibonacci.ts`

The current implementation is recursive and blows the call stack for large `n`. Fix it so that `fib(n)` returns the correct value for at least `n` up to 70 without throwing "Maximum call stack size exceeded". You can use an iterative solution, memoization, or another approach that avoids deep recursion (tail call optimization in javascript).

---

## 4. Message queue (point-to-point) (Bonus points)

**Folder:** `src/message-queue/`

Implement the message queue used by the publisher and consumers. The queue is implemented as the **class** `MessageQueueImpl<T>` in `message-queue.ts`; it has stub methods that do not deliver messages. You must implement `MessageQueueImpl` (and may keep `createMessageQueue` as a factory that returns `new MessageQueueImpl(options)`) so that:

- **Publish / consume:** `publish(message)` adds the message to the queue. `consume()` returns a Promise that resolves with a **Delivery** `{ message, ack(), nack() }` (FIFO). **One call to `consume()` = one message**; there is no long-lived subscription. To process more messages, the consumer must call `consume()` again (e.g. in a loop). If the queue is empty, `consume()` waits until a message is published. Each message is delivered to **exactly one** consumer (point-to-point).
- **Ack:** When the consumer calls `delivery.ack()`, the message is considered done and must not be redelivered. Double ack is safe (no-op).
- **Nack:** When the consumer calls `delivery.nack()`, the message is put back on the queue and may be delivered to another consumer (or the same one on a later `consume()`).
- **TTL (optional):** `createMessageQueue({ messageTtlMs })` – if set, messages not consumed within that many milliseconds are expired and must not be delivered. When no consumer is available at publish time, the message is held and delivered as soon as a consumer subscribes, but only if still within TTL.
- **Bonus – backpressure/throttling:** `createMessageQueue({ maxSize })` – if set, at most `maxSize` messages may be buffered. When the queue is full, `publish(message)` must not resolve until a consumer has freed a slot (e.g. by consuming and acking). There is a bonus test for this; implement it to pass.

The publisher (`src/message-queue/publisher.ts`) is already implemented. Implement only the `MessageQueueImpl` class in `src/message-queue/message-queue.ts`.

**Bonus questions:**

1. What is happening when a consumer is unable to keep up with the rate of messages produced by a producer?
2. How can you throttle the producer?
3. How could you apply backpressure so the producer slows down when the queue is full?
4. What happens to memory if messages are published much faster than they are consumed, and how could you limit that?
5. When would you add more consumers instead of a larger queue, and what are the trade-offs?

---

## Allowed

- Changing only `src/partition.ts`, `src/result.ts`, `src/fibonacci.ts`, and `src/message-queue/message-queue.ts` (implement the `MessageQueueImpl` class).

## Not allowed

- Modifying any file under `test/`.

Good luck.
