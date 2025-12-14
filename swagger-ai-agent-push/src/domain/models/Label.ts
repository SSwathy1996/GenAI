/**
 * Domain model for a label (used for versioning, tagging, etc.).
 */
export interface Label {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export function createLabel(params: Omit<Label, 'id' | 'createdAt'> & { id?: string; createdAt?: string }): Label {
  return {
    id: params.id || generateId(),
    name: params.name,
    description: params.description,
    createdAt: params.createdAt || new Date().toISOString(),
  };
}

function generateId(): string {
  return 'label-' + Math.random().toString(36).slice(2, 10);
}
