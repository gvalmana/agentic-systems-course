import { MultiServerMCPClient } from "@langchain/mcp-adapters";

const smileMcpPath = require.resolve("@alegradev/smile-mcp");

const client = new MultiServerMCPClient({
  throwOnLoadError: true,
  prefixToolNameWithServerName: true,
  additionalToolNamePrefix: "",
  mcpServers: {
    smile: {
      transport: "stdio",
      command: "node",
      args: [smileMcpPath],
    },
    // alegra: {
    //   transport: "sse",
    //   url: "https://mcp-bills.derianrosadonavarrete.workers.dev/sse",
    //   headers: {
    //     Authorization: `Bearer ${process.env.ALEGRA_API_KEY}`,
    //   },
    // },
  },
});

export default client;
