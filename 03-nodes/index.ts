import { Annotation } from "@langchain/langgraph";

// Define our burger state
const BurgerState = Annotation.Root({
  bread: Annotation<boolean>,
  meat: Annotation<boolean>,
  vegetables: Annotation<boolean>,
});

// Define our state type
type BurgerStateType = {
  bread: boolean;
  meat: boolean;
  vegetables: boolean;
};

// Node: Bread preparation station
function prepareBread(state: BurgerStateType): BurgerStateType {
  return {
    ...state,
    bread: true,
  };
}

// Node: Meat cooking station
function cookMeat(state: BurgerStateType): BurgerStateType {
  return {
    ...state,
    meat: true,
  };
}

// Node: Vegetable preparation station
function prepareVegetables(state: BurgerStateType): BurgerStateType {
  return {
    ...state,
    vegetables: true,
  };
}

// Initial burger state
const initialBurger: BurgerStateType = {
  bread: false,
  meat: false,
  vegetables: false,
};

// Process burger through stations
const withBread = prepareBread(initialBurger);
const withMeat = cookMeat(withBread);
const finalBurger = prepareVegetables(withMeat);

console.log("Final Burger State:", finalBurger);
