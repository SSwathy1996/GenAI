/**
 * Domain model for a UI or API locator (used for mapping steps).
 */
export interface Locator {
  id: string;
  type: 'css' | 'xpath' | 'text' | 'api' | 'custom';
  value: string;
  description?: string;
  tags?: string[];
}

export function createLocator(params: Omit<Locator, 'id'> & { id?: string }): Locator {
  return {
    id: params.id || generateId(),
    ...params,
  };
}

function generateId(): string {
  return 'locator-' + Math.random().toString(36).slice(2, 10);
}
