import { createMessageQueue, Publisher } from '../../src/message-queue';

describe('MessageQueue (point-to-point)', () => {
  it('delivers one message to a single consumer', async () => {
    const queue = createMessageQueue<number>();
    const publisher = new Publisher(queue);

    const received: number[] = [];
    const consumerDone = (async () => {
      const delivery = await queue.consume();
      received.push(delivery.message);
      await delivery.ack();
    })();

    await publisher.publishAll([42]);
    await consumerDone;

    expect(received).toEqual([42]);
  });

  it('delivers multiple messages FIFO to one consumer', async () => {
    const queue = createMessageQueue<string>();
    const publisher = new Publisher(queue);

    const received: string[] = [];
    const consumerDone = (async () => {
      for (let i = 0; i < 3; i++) {
        const delivery = await queue.consume();
        received.push(delivery.message);
        await delivery.ack();
      }
    })();

    await publisher.publishAll(['a', 'b', 'c']);
    await consumerDone;

    expect(received).toEqual(['a', 'b', 'c']);
  });

  it('each message is received by exactly one consumer (point-to-point)', async () => {
    const queue = createMessageQueue<number>();
    const publisher = new Publisher(queue);

    const consumer1 = queue.consume();
    const consumer2 = queue.consume();
    const consumer3 = queue.consume();

    await publisher.publishAll([1, 2, 3]);

    const [d1, d2, d3] = await Promise.all([consumer1, consumer2, consumer3]);
    await d1.ack();
    await d2.ack();
    await d3.ack();
    const results = [d1.message, d2.message, d3.message].sort((a, b) => a - b);
    expect(results).toEqual([1, 2, 3]);
  });

  it('consumer waiting when queue is empty receives message after publish', async () => {
    const queue = createMessageQueue<string>();
    const publisher = new Publisher(queue);

    const consumerPromise = queue.consume();
    await new Promise((r) => setTimeout(r, 20));
    await publisher.publishAll(['late']);
    const delivery = await consumerPromise;
    expect(delivery.message).toBe('late');
    await delivery.ack();
  });
});

describe('MessageQueue (ack/nack)', () => {
  it('after ack message is gone and not redelivered', async () => {
    const queue = createMessageQueue<number>();
    const publisher = new Publisher(queue);
    await publisher.publishAll([1]);

    const d1 = await queue.consume();
    expect(d1.message).toBe(1);
    await d1.ack();

    const afterAck = Promise.race([
      queue.consume(),
      new Promise<never>((_, rej) =>
        setTimeout(() => rej(new Error('timeout')), 50)
      ),
    ]);
    await expect(afterAck).rejects.toThrow('timeout');
  });

  it('after nack message is redelivered', async () => {
    const queue = createMessageQueue<string>();
    const publisher = new Publisher(queue);
    await publisher.publishAll(['retry-me']);

    const first = await queue.consume();
    expect(first.message).toBe('retry-me');
    await first.nack();

    const second = await queue.consume();
    expect(second.message).toBe('retry-me');
    await second.ack();
  });

  it('double ack is safe (idempotent)', async () => {
    const queue = createMessageQueue<number>();
    await queue.publish(1);
    const d = await queue.consume();
    await d.ack();
    await d.ack();
    await d.ack();
  });
});

describe('MessageQueue (hold when no consumer, TTL)', () => {
  it('holds message when no consumer and delivers when consumer subscribes within TTL', async () => {
    const queue = createMessageQueue<number>({ messageTtlMs: 200 });
    const publisher = new Publisher(queue);

    await publisher.publishAll([99]);
    await new Promise((r) => setTimeout(r, 30));
    const delivery = await queue.consume();
    expect(delivery.message).toBe(99);
    await delivery.ack();
  });

  it('message expired after TTL is not delivered', async () => {
    const queue = createMessageQueue<string>({ messageTtlMs: 50 });
    await queue.publish('expire-me');
    await new Promise((r) => setTimeout(r, 60));

    const result = Promise.race([
      queue.consume().then((d) => d.message),
      new Promise<string>((_, rej) =>
        setTimeout(() => rej(new Error('timeout')), 30)
      ),
    ]);
    await expect(result).rejects.toThrow('timeout');
  });

  it('message still available within TTL', async () => {
    const queue = createMessageQueue<number>({ messageTtlMs: 100 });
    await queue.publish(42);
    await new Promise((r) => setTimeout(r, 30));
    const delivery = await queue.consume();
    expect(delivery.message).toBe(42);
    await delivery.ack();
  });

  it('only expired messages are dropped; unexpired are delivered', async () => {
    const queue = createMessageQueue<number>({ messageTtlMs: 50 });
    await queue.publish(1);
    await new Promise((r) => setTimeout(r, 60));
    await queue.publish(2);
    const delivery = await queue.consume();
    expect(delivery.message).toBe(2);
    await delivery.ack();
  });
});

describe('MessageQueue (bonus: backpressure / throttling)', () => {
  it('when maxSize is set, publish() blocks until a consumer frees a slot', async () => {
    const queue = createMessageQueue<number>({ maxSize: 2 });

    await queue.publish(1);
    await queue.publish(2);

    const thirdPublishPromise = queue.publish(3);
    const stillPending = Promise.race([
      thirdPublishPromise.then(() => 'resolved'),
      new Promise<string>((resolve) =>
        setTimeout(() => resolve('pending'), 50)
      ),
    ]);
    expect(await stillPending).toBe('pending');

    const delivery = await queue.consume();
    expect(delivery.message).toBe(1);
    await delivery.ack();

    await thirdPublishPromise;

    const d2 = await queue.consume();
    expect(d2.message).toBe(2);
    await d2.ack();
    const d3 = await queue.consume();
    expect(d3.message).toBe(3);
    await d3.ack();
  });
});
