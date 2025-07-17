import { Annotation, StateGraph } from "@langchain/langgraph";

// Define el estado de la hamburguesa
const BurgerState = Annotation.Root({
  bread: Annotation<boolean>,
  meat: Annotation<boolean>,
  vegetables: Annotation<boolean>,
});

// Define el tipo de estado de la hamburguesa

// Nodo: Pan de la hamburguesa
function prepareBread(state: typeof BurgerState.State) {
  return {
    bread: true,
  };
}

// Nodo: Cocción de la carne
function cookMeat(state: typeof BurgerState.State) {
  return {
    meat: true,
  };
}

// Nodo: Preparación de las verduras
function prepareVegetables(state: typeof BurgerState.State) {
  return {
    vegetables: true,
  };
}

const graph = new StateGraph(BurgerState);

graph.addNode("prepareBread", prepareBread);
graph.addNode("cookMeat", cookMeat);
graph.addNode("prepareVegetables", prepareVegetables);
