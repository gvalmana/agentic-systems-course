import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { z } from "zod";

import client from "./mcp";

const prompt = `
Explicame como funciona el SModal
`;

export const handler = async () => {
  const messages = [
    {
      role: "user",
      content: prompt,
    },
  ];

  const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    apiKey: process.env.OPENAI_API_KEY,
  });

  const tools = await client.getTools();

  const agent = createReactAgent({
    llm: model,
    tools,
    responseFormat: {
      prompt: `El title y description deben ser en español en un todo extremadamente formal`,
      schema: z.object({
        title: z.string().describe("Titulo del codigo"),
        description: z.string().describe("Descripcion del codigo"),
        code: z.string().describe("Codigo"),
      }),
    },
  });

  const result = await agent.invoke({
    messages,
  });

  const responseAgent = result.structuredResponse;

  console.log(responseAgent);

  return responseAgent;
};
