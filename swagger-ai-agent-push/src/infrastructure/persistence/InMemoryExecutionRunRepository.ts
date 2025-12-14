import { ExecutionRun } from '../../../domain/models/ExecutionRun';
import { ExecutionRunRepository } from '../../../domain/repositories/ExecutionRunRepository';

/**
 * In-memory implementation of ExecutionRunRepository (for dev/testing).
 */
export class InMemoryExecutionRunRepository implements ExecutionRunRepository {
  private runs = new Map<string, ExecutionRun>();

  async getById(id: string): Promise<ExecutionRun | undefined> {
    return this.runs.get(id);
  }

  async getAll(): Promise<ExecutionRun[]> {
    return Array.from(this.runs.values());
  }

  async create(run: ExecutionRun): Promise<ExecutionRun> {
    this.runs.set(run.id, run);
    return run;
  }

  async update(run: ExecutionRun): Promise<ExecutionRun> {
    this.runs.set(run.id, run);
    return run;
  }

  async delete(id: string): Promise<void> {
    this.runs.delete(id);
  }
}

export default InMemoryExecutionRunRepository;