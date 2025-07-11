import { ChatOpenAI } from "@langchain/openai";
import { Annotation, START, StateGraph, END } from "@langchain/langgraph";
import { PromptTemplate } from "@langchain/core/prompts";
import { HumanMessage } from "@langchain/core/messages";

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  apiKey: process.env.OPENAI_API_KEY,
});

export const handler = async (text: string) => {
  const stateSchema = Annotation.Root({
    user_input: Annotation<string>,
    gramatical_correction: Annotation<string>,
    graph_output: Annotation<string>,
  });

  const node1 = async (state: typeof stateSchema.State) => {
    const prompt = PromptTemplate.fromTemplate(
      "Correct the following text for grammatical errors: {text}"
    );

    const formattedPrompt = await prompt.format({ text: state.user_input });
    const message = new HumanMessage({ content: formattedPrompt });

    const response = await model.invoke([message]);
    const gramatical_correction = response.content.toString().trim();

    return {
      gramatical_correction,
    };
  };

  const node2 = async (state: typeof stateSchema.State) => {
    const prompt = PromptTemplate.fromTemplate(
      "Adjust the tone of the following text to be more formal: {text}"
    );

    const formattedPrompt = await prompt.format({ text: state.user_input });
    const message = new HumanMessage({ content: formattedPrompt });

    const response = await model.invoke([message]);
    const graph_output = response.content.toString().trim();

    return {
      graph_output,
    };
  };

  const graph = new StateGraph(stateSchema)
    .addNode("node1", node1)
    .addNode("node2", node2)
    .addEdge(START, "node1")
    .addEdge("node1", "node2")
    .addEdge("node2", END)
    .compile();

  const result = await graph.invoke({ user_input: text });

  console.log(result);
};
