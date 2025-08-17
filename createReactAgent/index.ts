import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import client from "./mcp";
import { z } from "zod";

export const handler = async () => {
  const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    apiKey: process.env.OPENAI_API_KEY,
  });
  const prompt = `
  Eres un asistente de IA que responde preguntas sobre el código de SmileUI. 
  Tienes que responde en español.
  El lenguaje de programacion es Typescript
  El framwork es Vue3
  `;
  const tools = await client.getTools();
  const systemMessage = new SystemMessage(prompt);
  const humanMessage = new HumanMessage("Explicame el componente SButton");
  const agent = createReactAgent({
    llm: model,
    tools,
    responseFormat: {
      prompt: `Quiero que el title y el description esten en inglés y ademas tengan un tono extremadamente formal`,
      schema: z.object({
        title: z.string().describe("El título del componente"),
        description: z.string().describe("La descripción del componente"),
        code: z.string().describe("El código del componente"),
      }),
    },
  });

  const result = await agent.invoke({
    messages: [systemMessage, humanMessage],
  });
  const formatedResposnse = result.structuredResponse;
  await client.close();
  console.log(formatedResposnse);
};
