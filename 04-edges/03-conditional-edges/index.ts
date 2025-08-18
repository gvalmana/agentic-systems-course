import { Annotation, END, START, StateGraph } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { HumanMessage } from "@langchain/core/messages";

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  apiKey: process.env.OPENAI_API_KEY,
});

export const handler = async (text: string) => {
  //STATE
  const exampleState = Annotation.Root({
    user_input: Annotation<string>,
    sentimient: Annotation<string>,
    positive_text: Annotation<string>,
    negative_text: Annotation<string>,
    neutral_textl: Annotation<string>,
    graph_output: Annotation<string>,
  });
  //NODES
  // analiza el sentimiento del texto
  const nodoAnalizta = async (state: typeof exampleState.State) => {
    const promt = PromptTemplate.fromTemplate(
      "Analiza le sentimiento del texto y responde EXACTAMENTE con una palabra - ya sea 'positive','negative' o 'neutral"
    );
    const formattedPromt = await promt.format({ text: state.user_input });
    const message = new HumanMessage({ content: formattedPromt });
    const result = await model.invoke([message]);
    const sentiment = result.content.toString().trim();
    return { sentiment };
  };

  const nodoAlentador = async (state: typeof exampleState.State) => {
    const promt = PromptTemplate.fromTemplate(
      "Genera una respuesta entusiasta y alentadora a: {text}"
    );
    const formattedPromt = await promt.format({ text: state.user_input });
    const message = new HumanMessage({ content: formattedPromt });
    const result = await model.invoke([message]);
    const positive_text = result.content.toString().trim();
    return { positive_text, graph_output: positive_text };
  };

  const nodoEmpatico = async (state: typeof exampleState.State) => {
    const promt = PromptTemplate.fromTemplate(
      "Genera una respuesta empática y positiva a: {text}"
    );
    const formattedPromt = await promt.format({ text: state.user_input });
    const message = new HumanMessage({ content: formattedPromt });
    const result = await model.invoke([message]);
    const negative_text = result.content.toString().trim();
    return { negative_text, graph_output: negative_text };
  };

  const nodoNeutral = async (state: typeof exampleState.State) => {
    const promt = PromptTemplate.fromTemplate(
      "Genera una respuesta equilibrada y objetiva a: {text}"
    );
    const formattedPromt = await promt.format({ text: state.user_input });
    const message = new HumanMessage({ content: formattedPromt });
    const result = await model.invoke([message]);
    const neutral_text = result.content.toString().trim();
    return { neutral_text, graph_output: neutral_text };
  };

  const routeBySentiment = (state: typeof exampleState.State) => {
    switch (state.sentimient) {
      case "positive":
        return "ROUTE_TO_POSITIVE";
      case "negative":
        return "ROUTE_TO_NEGATIVE";
      default:
        return "ROUTE_TO_NEUTRAL";
    }
  };
  //EDGES
  const graph = new StateGraph(exampleState)
    .addNode("analyze_sentimient", nodoAnalizta)
    .addNode("process_positive", nodoAlentador)
    .addNode("process_negative", nodoEmpatico)
    .addNode("process_neutral", nodoNeutral)
    .addEdge(START, "analyze_sentimient")
    .addConditionalEdges("analyze_sentimient", routeBySentiment, {
      ROUTE_TO_POSITIVE: "process_positive",
      ROUTE_TO_NEGATIVE: "process_negative",
      ROUTE_TO_NEUTRAL: "process_neutral",
    })
    .addEdge("process_positive", END)
    .addEdge("process_negative", END)
    .addEdge("process_neutral", END)
    .compile();

  const result = await graph.invoke({ user_input: text });
  console.log(result);
};
