import { Annotation, StateGraph } from "@langchain/langgraph";

const BurgerState = Annotation.Root({
  bread: Annotation<boolean>,
  meat: Annotation<boolean>,
  vegetables: Annotation<boolean>,
});

const prepareBread = (state: typeof BurgerState.State) => {
  return {
    bread: true,
  };
};

const prepareMeat = (state: typeof BurgerState.State) => {
  return {
    meat: true,
  };
};

const prepareVegetables = (state: typeof BurgerState.State) => {
  return {
    vegetables: true,
  };
};

const hamburgerStateGraph = new StateGraph(BurgerState);

hamburgerStateGraph.addNode("prepareBread", prepareBread);
hamburgerStateGraph.addNode("prepareMeat", prepareMeat);
hamburgerStateGraph.addNode("prepareVegetables", prepareVegetables);
