import { createTestPlan, TestPlan } from '../../../src/domain/models/TestPlan';

describe('TestPlan domain model', () => {
  it('should create a TestPlan with default id and status', () => {
    const plan = createTestPlan({
      featureId: 'feature-1',
      scenarioIds: ['scenario-1', 'scenario-2'],
      environment: 'qa',
    });
    expect(plan.id).toMatch(/^testplan-/);
    expect(plan.status).toBe('pending');
    expect(plan.environment).toBe('qa');
    expect(plan.scenarioIds.length).toBe(2);
  });

  it('should create a TestPlan with provided id, status, and runId', () => {
    const plan = createTestPlan({
      id: 'testplan-123',
      featureId: 'feature-2',
      scenarioIds: ['scenario-3'],
      environment: 'prod',
      status: 'completed',
      runId: 'run-1',
      description: 'Smoke test',
    });
    expect(plan.id).toBe('testplan-123');
    expect(plan.status).toBe('completed');
    expect(plan.runId).toBe('run-1');
    expect(plan.description).toBe('Smoke test');
  });
});