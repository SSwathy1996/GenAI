// IMcpAdapter.ts
// Interface for Model Context Protocol (MCP) adapter

export interface IMcpAdapter {
  generateTestScript(params: any): Promise<any>;
  getModelInfo(): Promise<any>;
  // Add more methods as needed for MCP integration
}
