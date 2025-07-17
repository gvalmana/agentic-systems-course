import { ChatOpenAI } from "@langchain/openai";
import { StateGraph, Annotation, START, END } from "@langchain/langgraph";
import { PromptTemplate } from "@langchain/core/prompts";
import { HumanMessage } from "@langchain/core/messages";

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  apiKey: process.env.OPENAI_API_KEY,
});

export const handler = async (text: string) => {
  const stateSchema = Annotation.Root({
    user_input: Annotation<string>,
    isCountry: Annotation<boolean>,
    language: Annotation<string>,
    weather: Annotation<string>,
    graph_output: Annotation<string>,
  });

  const nodeA = async (state: typeof stateSchema.State) => {
    const prompt = PromptTemplate.fromTemplate(
      "Is the following text a country: {text}? Return only 'true' or 'false'."
    );

    const formattedPrompt = await prompt.format({ text: state.user_input });
    const message = new HumanMessage({ content: formattedPrompt });

    const response = await model.invoke([message]);
    const isCountry = response.content.toString().trim();

    return { isCountry: isCountry == "true" };
  };

  const nodeB = async (state: typeof stateSchema.State) => {
    console.log("Init node B");

    const prompt = PromptTemplate.fromTemplate(
      "What is the language of the following country: {text}"
    );

    const formattedPrompt = await prompt.format({ text: state.user_input });
    const message = new HumanMessage({ content: formattedPrompt });

    const response = await model.invoke([message]);
    const language = response.content.toString().trim();

    console.log("End node B");

    return {
      language,
    };
  };

  const nodeC = async (state: typeof stateSchema.State) => {
    console.log("Init node C");

    const prompt = PromptTemplate.fromTemplate(
      "What is the weather in the following country: {text}"
    );

    const formattedPrompt = await prompt.format({ text: state.user_input });
    const message = new HumanMessage({ content: formattedPrompt });

    const response = await model.invoke([message]);
    const weather = response.content.toString().trim();

    console.log("End node C");

    return {
      weather,
    };
  };

  const nodeD = async (state: typeof stateSchema.State) => {
    let text = `The country ${state.user_input} is not a country`;

    if (state.isCountry) {
      text = `The language of ${state.user_input} is ${state.language} and the weather is ${state.weather}`;
    }

    return {
      graph_output: text,
    };
  };

  const validateCountry = (state: typeof stateSchema.State) => {
    if (state.isCountry) {
      return ["b", "c"];
    }
    return ["d"];
  };

  const graph = new StateGraph(stateSchema)
    .addNode("a", nodeA)
    .addNode("b", nodeB)
    .addNode("c", nodeC)
    .addNode("d", nodeD)
    .addEdge(START, "a")
    .addConditionalEdges("a", validateCountry, ["b", "c", "d"])
    .addEdge("b", "d")
    .addEdge("c", "d")
    .addEdge("d", END)
    .compile();

  const result = await graph.invoke({ user_input: text });

  console.log(result);
};
