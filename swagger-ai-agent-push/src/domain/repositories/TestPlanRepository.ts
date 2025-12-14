import { TestPlan } from '../models/TestPlan';

/**
 * Interface for TestPlan repository (CRUD for test plans).
 */
export interface TestPlanRepository {
  getById(id: string): Promise<TestPlan | undefined>;
  getAll(): Promise<TestPlan[]>;
  create(plan: TestPlan): Promise<TestPlan>;
  update(plan: TestPlan): Promise<TestPlan>;
  delete(id: string): Promise<void>;
}
