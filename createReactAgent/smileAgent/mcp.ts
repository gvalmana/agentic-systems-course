import { MultiServerMCPClient } from "@langchain/mcp-adapters";

const smileMcpPath = require.resolve("@alegradev/smile-mcp");

const client = new MultiServerMCPClient({
  throwOnLoadError: true,
  prefixToolNameWithServerName: true,
  additionalToolNamePrefix: "",
  useStandardContentBlocks: true,
  mcpServers: {
    smile: {
      transport: "stdio",
      command: "node",
      args: [smileMcpPath],
    },
  },
});

export default client;
