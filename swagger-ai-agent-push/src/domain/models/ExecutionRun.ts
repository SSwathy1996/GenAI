/**
 * Domain model for an execution run (result of a test plan execution).
 */
export interface ExecutionRun {
  id: string;
  testPlanId: string;
  startedAt: string;
  finishedAt?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  scenarioResults: ScenarioResult[];
  error?: string;
}

export interface ScenarioResult {
  scenarioId: string;
  status: 'passed' | 'failed' | 'skipped';
  logs?: string;
  error?: string;
}

export function createExecutionRun(params: Omit<ExecutionRun, 'id' | 'startedAt' | 'status'> & { id?: string; status?: ExecutionRun['status']; startedAt?: string }): ExecutionRun {
  return {
    id: params.id || generateId(),
    testPlanId: params.testPlanId,
    startedAt: params.startedAt || new Date().toISOString(),
    status: params.status || 'pending',
    scenarioResults: params.scenarioResults || [],
    finishedAt: params.finishedAt,
    error: params.error,
  };
}

function generateId(): string {
  return 'run-' + Math.random().toString(36).slice(2, 10);
}
