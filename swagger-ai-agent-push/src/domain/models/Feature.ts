/**
 * Domain model for a Gherkin Feature.
 * Represents a feature file and its scenarios.
 */
export interface Step {
  keyword: 'Given' | 'When' | 'Then' | 'And' | 'But';
  text: string;
  line?: number;
}

export interface Scenario {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  steps: Step[];
  line?: number;
}

export interface Feature {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  scenarios: Scenario[];
  sourceFile?: string;
  line?: number;
}

/**
 * Factory to create a new Feature instance.
 */
export function createFeature(params: Omit<Feature, 'id'> & { id?: string }): Feature {
  return {
    id: params.id || generateId(),
    title: params.title,
    description: params.description,
    tags: params.tags || [],
    scenarios: params.scenarios || [],
    sourceFile: params.sourceFile,
    line: params.line,
  };
}

function generateId(): string {
  return 'feature-' + Math.random().toString(36).slice(2, 10);
}
