import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { z } from "zod";

import client from "./mcp";

const prompt = `
  Eres un agente de IA que responde preguntas sobre el codigo de Smile UI

  Tienes que responder en español.
  El lenguaje de programacion es typescript.
  El framework es Vue3.
`;

export const handler = async () => {
  const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    apiKey: process.env.OPENAI_API_KEY,
  });

  const tools = await client.getTools();

  const agent = createReactAgent({
    llm: model,
    tools,
    responseFormat: {
      prompt:
        "El title y description deben ser en ingles en un todo extremadamente formal",
      schema: z.object({
        title: z.string().describe("Titulo del componente"),
        description: z.string().describe("Descripcion del componente"),
        code: z.string().describe("Codigo del componente"),
      }),
    },
  });

  const systemMessage = new SystemMessage({
    content: prompt,
  });

  const message = new HumanMessage({
    content: "Explica el componente SButton",
  });

  const result = await agent.invoke({
    messages: [systemMessage, message],
  });

  const responseFormatter = result.structuredResponse;

  await client.close();

  console.log(responseFormatter);
};
