import {
  Annotation,
  START,
  StateGraph,
  END,
  Command,
} from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { HumanMessage } from "@langchain/core/messages";

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  apiKey: process.env.OPENAI_API_KEY,
});

export const handler = async (text: string) => {
  // Define el esquema del estado
  const stateSchema = Annotation.Root({
    user_input: Annotation<string>,
    sentiment: Annotation<string>,
    positive_response: Annotation<string>,
    negative_response: Annotation<string>,
    neutral_response: Annotation<string>,
    graph_output: Annotation<string>,
  });

  // Nodo para analizar el sentimiento
  const analyzeSentiment = async (state: typeof stateSchema.State) => {
    const prompt = PromptTemplate.fromTemplate(
      "Analiza el sentimiento de este texto y responde con EXACTAMENTE una palabra - ya sea 'positive', 'negative', o 'neutral': {text}"
    );

    const formattedPrompt = await prompt.format({ text: state.user_input });
    const message = new HumanMessage({ content: formattedPrompt });
    const response = await model.invoke([message]);
    const sentiment = response.content.toString().trim().toLowerCase();

    const nodes = {
      positive: "process_positive" as const,
      negative: "process_negative" as const,
      neutral: "process_neutral" as const,
    };

    return new Command({
      update: { sentiment: sentiment },
      goto: nodes[sentiment as keyof typeof nodes],
    });
  };

  // Nodo para procesar texto positivo
  const processPositive = async (state: typeof stateSchema.State) => {
    const prompt = PromptTemplate.fromTemplate(
      "Genera una respuesta entusiasta y alentadora a: {text}"
    );

    const formattedPrompt = await prompt.format({ text: state.user_input });
    const message = new HumanMessage({ content: formattedPrompt });
    const response = await model.invoke([message]);
    const responseText = response.content.toString().trim();

    return {
      positive_response: responseText,
      graph_output: responseText,
    };
  };

  // Nodo para procesar texto negativo
  const processNegative = async (state: typeof stateSchema.State) => {
    const prompt = PromptTemplate.fromTemplate(
      "Genera una respuesta empática y comprensiva a: {text}"
    );

    const formattedPrompt = await prompt.format({ text: state.user_input });
    const message = new HumanMessage({ content: formattedPrompt });
    const response = await model.invoke([message]);
    const responseText = response.content.toString().trim();

    return {
      negative_response: responseText,
      graph_output: responseText,
    };
  };

  // Nodo para procesar texto neutral
  const processNeutral = async (state: typeof stateSchema.State) => {
    const prompt = PromptTemplate.fromTemplate(
      "Genera una respuesta equilibrada y objetiva a: {text}"
    );

    const formattedPrompt = await prompt.format({ text: state.user_input });
    const message = new HumanMessage({ content: formattedPrompt });
    const response = await model.invoke([message]);
    const responseText = response.content.toString().trim();

    return {
      neutral_response: responseText,
      graph_output: responseText,
    };
  };

  // Crear y configurar el grafo
  const graph = new StateGraph(stateSchema)
    .addNode("analyze_sentiment", analyzeSentiment, {
      ends: ["process_positive", "process_negative", "process_neutral"],
    })
    .addNode("process_positive", processPositive)
    .addNode("process_negative", processNegative)
    .addNode("process_neutral", processNeutral)
    .addEdge(START, "analyze_sentiment")
    .compile();

  // Ejecutar el grafo
  const result = await graph.invoke({ user_input: text });
  console.log(result);
};
