import { createExecutionRun, ExecutionRun } from '../../../src/domain/models/ExecutionRun';

describe('ExecutionRun domain model', () => {
  it('should create an ExecutionRun with default id and status', () => {
    const run = createExecutionRun({
      testPlanId: 'testplan-1',
      scenarioResults: [],
    });
    expect(run.id).toMatch(/^run-/);
    expect(run.status).toBe('pending');
    expect(run.testPlanId).toBe('testplan-1');
    expect(run.scenarioResults).toEqual([]);
    expect(run.finishedAt).toBeUndefined();
  });

  it('should create an ExecutionRun with provided id, status, and scenarioResults', () => {
    const run = createExecutionRun({
      id: 'run-123',
      testPlanId: 'testplan-2',
      status: 'completed',
      startedAt: '2025-12-14T00:00:00Z',
      finishedAt: '2025-12-14T01:00:00Z',
      scenarioResults: [
        { scenarioId: 'scenario-1', status: 'passed' },
        { scenarioId: 'scenario-2', status: 'failed', error: 'Step failed' },
      ],
      error: 'Some error',
    });
    expect(run.id).toBe('run-123');
    expect(run.status).toBe('completed');
    expect(run.startedAt).toBe('2025-12-14T00:00:00Z');
    expect(run.finishedAt).toBe('2025-12-14T01:00:00Z');
    expect(run.scenarioResults.length).toBe(2);
    expect(run.scenarioResults[1].error).toBe('Step failed');
    expect(run.error).toBe('Some error');
  });
});