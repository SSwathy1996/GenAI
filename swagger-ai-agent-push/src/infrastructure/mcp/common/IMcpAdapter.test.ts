import { IMcpAdapter } from './IMcpAdapter';

describe('IMcpAdapter interface', () => {
  it('should define required methods', () => {
    // This is a TypeScript interface, so we just check type compatibility
    const mock: IMcpAdapter = {
      async generateTestScript(params: any) { return {}; },
      async getModelInfo() { return {}; },
    };
    expect(typeof mock.generateTestScript).toBe('function');
    expect(typeof mock.getModelInfo).toBe('function');
  });
});
