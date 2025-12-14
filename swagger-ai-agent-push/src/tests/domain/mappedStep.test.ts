import { createMappedStep, MappedStep } from '../../../src/domain/models/MappedStep';

describe('MappedStep domain model', () => {
  it('should create a MappedStep with default id', () => {
    const mappedStep = createMappedStep({
      featureId: 'feature-1',
      scenarioId: 'scenario-1',
      stepIndex: 0,
      keyword: 'Given',
      text: 'the user is logged in',
      mappedTo: 'loginAction',
    });
    expect(mappedStep.id).toMatch(/^mappedstep-/);
    expect(mappedStep.featureId).toBe('feature-1');
    expect(mappedStep.keyword).toBe('Given');
    expect(mappedStep.mappedTo).toBe('loginAction');
    expect(mappedStep.status).toBeUndefined();
  });

  it('should create a MappedStep with provided id and status', () => {
    const mappedStep = createMappedStep({
      id: 'mappedstep-123',
      featureId: 'feature-2',
      scenarioId: 'scenario-2',
      stepIndex: 1,
      keyword: 'When',
      text: 'the user clicks submit',
      mappedTo: 'submitAction',
      status: 'mapped',
      parameters: { foo: 'bar' },
    });
    expect(mappedStep.id).toBe('mappedstep-123');
    expect(mappedStep.status).toBe('mapped');
    expect(mappedStep.parameters).toEqual({ foo: 'bar' });
  });
});