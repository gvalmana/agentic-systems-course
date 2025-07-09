import {
  StateGraph,
  MessagesAnnotation,
  END,
  START,
} from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { tool } from "@langchain/core/tools";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { z } from "zod";

export const handler = async (
  messages: {
    role: "user";
    content: string;
  }[]
) => {
  const exampleState = MessagesAnnotation;

  const getWeather = tool(
    (input) => {
      //@ts-ignore
      if (["SF"].includes(input.code)) {
        return "It's 60 degrees and foggy.";
      } else {
        return "It's 90 degrees and sunny.";
      }
    },
    {
      name: "get_weather",
      description: "Call to get the current weather.",
      schema: z.object({
        code: z.string().describe("Code of the city to get the weather for."),
      }),
    }
  );

  const getCodeForCities = tool(
    (input) => {
      //@ts-ignore
      if (input && input.city == "San Francisco") return "SF";
      return "NYC";
    },
    {
      name: "get_code_for_cities",
      description: "Get the code of a city",
      schema: z.object({
        city: z.string().describe("City to get the code for."),
      }),
    }
  );

  const modelWithTools = new ChatOpenAI({
    model: "gpt-4o-mini",
    apiKey: process.env.OPENAI_API_KEY,
  }).bindTools([getWeather, getCodeForCities]);

  const toolNode = new ToolNode([getWeather, getCodeForCities]);

  const callModel = async (state: typeof MessagesAnnotation.State) => {
    const { messages } = state;
    const response = await modelWithTools.invoke(messages);
    return { messages: response };
  };

  const shouldContinue = (state: typeof MessagesAnnotation.State) => {
    const { messages } = state;
    const lastMessage = messages[messages.length - 1];
    if (
      "tool_calls" in lastMessage &&
      Array.isArray(lastMessage.tool_calls) &&
      lastMessage.tool_calls?.length
    ) {
      return "tools";
    }
    return END;
  };

  const graph = new StateGraph(exampleState)
    .addNode("agent", callModel)
    .addNode("tools", toolNode)
    .addEdge(START, "agent")
    .addConditionalEdges("agent", shouldContinue, ["tools", END])
    .addEdge("tools", "agent")
    .compile();

  const result = await graph.invoke({ messages });
  console.log(result);
};
