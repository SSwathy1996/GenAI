/**
 * Domain model for a mapped Gherkin step to an execution action.
 */
export interface MappedStep {
  id: string;
  featureId: string;
  scenarioId: string;
  stepIndex: number;
  keyword: 'Given' | 'When' | 'Then' | 'And' | 'But';
  text: string;
  mappedTo: string; // e.g., action, endpoint, or adapter
  parameters?: Record<string, any>;
  locatorId?: string;
  status?: 'pending' | 'mapped' | 'failed';
}

export function createMappedStep(params: Omit<MappedStep, 'id'> & { id?: string }): MappedStep {
  return {
    id: params.id || generateId(),
    ...params,
  };
}

function generateId(): string {
  return 'mappedstep-' + Math.random().toString(36).slice(2, 10);
}
