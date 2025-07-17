import { Annotation, START, StateGraph, END } from "@langchain/langgraph";

export const handler = async () => {
  const exampleState = Annotation.Root({
    tex1: Annotation<string>,
    tex2: Annotation<string>,
    user_input: Annotation<string>,
    graph_output: Annotation<string>,
  });

  const node1 = (state: typeof exampleState.State) => {
    return {
      tex1: state.user_input + " name",
    };
  };

  const node2 = (state: typeof exampleState.State) => {
    return {
      tex2: state.tex1 + " is",
    };
  };

  const node3 = (state: typeof exampleState.State) => {
    return {
      graph_output: state.tex2 + " Derian",
    };
  };

  const graph = new StateGraph(exampleState)
    .addNode("node1", node1)
    .addNode("node2", node2)
    .addNode("node3", node3)
    .addEdge(START, "node1")
    .addEdge("node1", "node2")
    .addEdge("node2", "node3")
    .addEdge("node3", END)
    .compile();

  const result = await graph.invoke({ user_input: "My" });

  // Output:
  // { graph_output: "My name is Derian" }
  console.log(result);
};
