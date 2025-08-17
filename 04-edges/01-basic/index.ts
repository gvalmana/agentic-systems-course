import { Annotation, StateGraph, START, END } from "@langchain/langgraph";

export const handler = async () => {
  const exampleState = Annotation.Root({
    text1: Annotation<string>,
    text2: Annotation<string>,
    user_input: Annotation<string>,
    graph_output: Annotation<string>,
  });

  const node1 = (state: typeof exampleState.State) => {
    return {
      text1: state.user_input + " name",
    };
  };

  const node2 = (state: typeof exampleState.State) => {
    return {
      text2: state.text1 + " is",
    };
  };

  const node3 = (state: typeof exampleState.State) => {
    return {
      graph_output: state.text2 + " John",
    };
  };
  const exampleGraph = new StateGraph(exampleState)
    .addNode("node1", node1)
    .addNode("node2", node2)
    .addNode("node3", node3)
    .addEdge(START, "node1")
    .addEdge("node1", "node2")
    .addEdge("node2", "node3")
    .addEdge("node3", END)
    .compile();

  const result = await exampleGraph.invoke({
    user_input: "My",
  });

  console.log(result);
};
