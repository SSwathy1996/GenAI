import { TestPlan } from '../../../domain/models/TestPlan';
import { TestPlanRepository } from '../../../domain/repositories/TestPlanRepository';

/**
 * In-memory implementation of TestPlanRepository (for dev/testing).
 */
export class InMemoryTestPlanRepository implements TestPlanRepository {
  private plans = new Map<string, TestPlan>();

  async getById(id: string): Promise<TestPlan | undefined> {
    return this.plans.get(id);
  }

  async getAll(): Promise<TestPlan[]> {
    return Array.from(this.plans.values());
  }

  async create(plan: TestPlan): Promise<TestPlan> {
    this.plans.set(plan.id, plan);
    return plan;
  }

  async update(plan: TestPlan): Promise<TestPlan> {
    this.plans.set(plan.id, plan);
    return plan;
  }

  async delete(id: string): Promise<void> {
    this.plans.delete(id);
  }
}

export default InMemoryTestPlanRepository;