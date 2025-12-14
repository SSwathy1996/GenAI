// BullMQAdapter.ts
// Skeleton for BullMQ queue adapter

import { Queue, Job, QueueOptions } from 'bullmq';

export interface IQueueAdapter {
  addJob(name: string, data: any): Promise<Job<any, any, string>>;
  processJob(name: string, processor: (job: Job) => Promise<any>): void;
}

export class BullMQAdapter implements IQueueAdapter {
  private queue: Queue;

  constructor(queueName: string, options?: QueueOptions) {
    this.queue = new Queue(queueName, options);
  }

  async addJob(name: string, data: any) {
    return this.queue.add(name, data);
  }

  processJob(name: string, processor: (job: Job) => Promise<any>) {
    // Stub: In real use, would use Worker from bullmq
    // Example: new Worker(this.queue.name, processor)
  }
}
