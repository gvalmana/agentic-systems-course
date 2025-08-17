import { Annotation } from "@langchain/langgraph";

const todoState = Annotation.Root({
  task: Annotation<{
    title: string;
    description: string;
  }>,
  date: Annotation<Date>,
  category: Annotation<"personal" | "work" | "other">,
});
