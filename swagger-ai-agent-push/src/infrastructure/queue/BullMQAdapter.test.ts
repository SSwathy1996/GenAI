import { BullMQAdapter } from './BullMQAdapter';

describe('BullMQAdapter', () => {
  it('can be constructed and addJob returns a Promise', async () => {
    const adapter = new BullMQAdapter('test-queue');
    // addJob is stubbed, so just check method exists and returns a Promise
    const result = adapter.addJob('test', { foo: 'bar' });
    expect(result).toBeInstanceOf(Promise);
  });

  it('processJob is a stub', () => {
    const adapter = new BullMQAdapter('test-queue');
    expect(() => adapter.processJob('test', async () => {})).not.toThrow();
  });
});
