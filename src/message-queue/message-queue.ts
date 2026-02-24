/**
 * Point-to-point message queue: one or more consumers compete for messages;
 * each message is delivered to exactly one consumer.
 * Supports ack/nack (message only done after ack; nack redelivers) and
 * optional message TTL (hold when no consumer, expire after a specific time).
 *
 * Implement the interface and createMessageQueue so the tests pass.
 * Stub methods below do not deliver messages.
 */
export interface Delivery<T> {
  message: T;
  ack(): Promise<void>;
  nack(): Promise<void>;
}

export interface MessageQueue<T> {
  /** Add a message to the queue. Waiting consumers (if any) may receive it. */
  publish(message: T): Promise<void>;

  /** Returns the next delivery. Resolves when a message is available (FIFO). Consumer must ack or nack. */
  consume(): Promise<Delivery<T>>;
}

export interface CreateMessageQueueOptions {
  /** If set, messages not consumed within this many ms are expired and no longer delivered. */
  messageTtlMs?: number;
  /** If set, at most this many messages can be buffered. When full, publish() does not resolve until a consumer frees a slot (backpressure). */
  maxSize?: number;
}

/**
 * Create a new message queue instance.
 * TODO: implement so that publish/consume/ack/nack and TTL behave as tested.
 */
export function createMessageQueue<T>(
  _options: CreateMessageQueueOptions = {}
): MessageQueue<T> {
  return {
    async publish(_message: T): Promise<void> {
      // Stub: drop message
    },
    async consume(): Promise<Delivery<T>> {
      // Stub: applicant must implement waiting + FIFO + Delivery with ack/nack
      return Promise.reject(new Error('MessageQueue not implemented'));
    },
  };
}
