import { Annotation, START, StateGraph, END } from "@langchain/langgraph";
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

    return {
      sentiment,
    };
  };

  // Nodo para procesar texto positivo
  const processPositive = async (state: typeof stateSchema.State) => {
    const prompt = PromptTemplate.fromTemplate(
      "Genera una respuesta entusiasta y alentadora a: {text}"
    );

    const formattedPrompt = await prompt.format({ text: state.user_input });
    const message = new HumanMessage({ content: formattedPrompt });
    const response = await model.invoke([message]);

    return {
      positive_response: response.content.toString().trim(),
      graph_output: response.content.toString().trim(),
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

    return {
      negative_response: response.content.toString().trim(),
      graph_output: response.content.toString().trim(),
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

    return {
      neutral_response: response.content.toString().trim(),
      graph_output: response.content.toString().trim(),
    };
  };

  // Función condicional para el enrutamiento
  const routeBySentiment = (state: typeof stateSchema.State) => {
    switch (state.sentiment) {
      case "positive":
        return "ROUTE_TO_POSITIVE";
      case "negative":
        return "ROUTE_TO_NEGATIVE";
      default:
        return "ROUTE_TO_NEUTRAL";
    }
  };

  // Crear y configurar el grafo
  const graph = new StateGraph(stateSchema)
    .addNode("analyze_sentiment", analyzeSentiment)
    .addNode("process_positive", processPositive)
    .addNode("process_negative", processNegative)
    .addNode("process_neutral", processNeutral)
    .addEdge(START, "analyze_sentiment")
    .addConditionalEdges("analyze_sentiment", routeBySentiment, {
      // Mapeo de rutas a nodos destino
      ROUTE_TO_POSITIVE: "process_positive", // La ruta ROUTE_TO_POSITIVE lleva al nodo process_positive
      ROUTE_TO_NEGATIVE: "process_negative", // La ruta ROUTE_TO_NEGATIVE lleva al nodo process_negative
      ROUTE_TO_NEUTRAL: "process_neutral", // La ruta ROUTE_TO_NEUTRAL lleva al nodo process_neutral
    })
    .addEdge("process_positive", END)
    .addEdge("process_negative", END)
    .addEdge("process_neutral", END)
    .compile();

  // Ejecutar el grafo
  const result = await graph.invoke({ user_input: text });
  console.log(result);
};
