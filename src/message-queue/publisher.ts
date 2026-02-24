import type { MessageQueue } from './message-queue';

/**
 * Publisher that sends messages to a queue.
 * Already implemented – do not change unless the interface changes.
 */
export class Publisher<T> {
  constructor(private readonly queue: MessageQueue<T>) {}

  /** Publish all messages in order. */
  async publishAll(messages: T[]): Promise<void> {
    for (const msg of messages) {
      await this.queue.publish(msg);
    }
  }
}
