/**
 * Domain model for an artifact (e.g., logs, screenshots, reports).
 */
export interface Artifact {
  id: string;
  runId: string;
  type: 'log' | 'screenshot' | 'trace' | 'report' | 'spec' | 'other';
  path: string;
  createdAt: string;
  description?: string;
}

export function createArtifact(params: Omit<Artifact, 'id' | 'createdAt'> & { id?: string; createdAt?: string }): Artifact {
  return {
    id: params.id || generateId(),
    runId: params.runId,
    type: params.type,
    path: params.path,
    createdAt: params.createdAt || new Date().toISOString(),
    description: params.description,
  };
}

function generateId(): string {
  return 'artifact-' + Math.random().toString(36).slice(2, 10);
}
