import { ExecutionRun } from '../models/ExecutionRun';

/**
 * Interface for ExecutionRun repository (CRUD for execution runs).
 */
export interface ExecutionRunRepository {
  getById(id: string): Promise<ExecutionRun | undefined>;
  getAll(): Promise<ExecutionRun[]>;
  create(run: ExecutionRun): Promise<ExecutionRun>;
  update(run: ExecutionRun): Promise<ExecutionRun>;
  delete(id: string): Promise<void>;
}
