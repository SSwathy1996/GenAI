/**
 * Domain model for a test plan (a set of scenarios to execute).
 */
export interface TestPlan {
  id: string;
  featureId: string;
  scenarioIds: string[];
  environment: string;
  createdAt: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  runId?: string;
  description?: string;
}

export function createTestPlan(params: Omit<TestPlan, 'id' | 'createdAt' | 'status'> & { id?: string; status?: TestPlan['status']; createdAt?: string }): TestPlan {
  return {
    id: params.id || generateId(),
    featureId: params.featureId,
    scenarioIds: params.scenarioIds,
    environment: params.environment,
    createdAt: params.createdAt || new Date().toISOString(),
    status: params.status || 'pending',
    runId: params.runId,
    description: params.description,
  };
}

function generateId(): string {
  return 'testplan-' + Math.random().toString(36).slice(2, 10);
}
