import { Annotation, END, START, StateGraph } from "@langchain/langgraph"
import { ChatOpenAI } from "@langchain/openai"
import { PromptTemplate } from "@langchain/core/prompts"
import { HumanMessage } from "@langchain/core/messages"

const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    apiKey: process.env.OPENAI_API_KEY,
})

export const handler = async ()=>{
    const exampleState = Annotation.Root({
        user_input: Annotation<string>,
        corrected_text: Annotation<string>,
        final_test: Annotation<boolean>,
    })

    const node1 = async (state: typeof exampleState.State) => {
        const prompt = PromptTemplate.fromTemplate("Revisa el siguiente texto y corrige los errores gramaticales: {input}");
        const formattedPromt = await prompt.format({
            input: state.user_input,
        })
        const humanMessage = new HumanMessage({ content: formattedPromt });

        const result = await model.invoke([humanMessage]);

        const corrected_text = result.content.toString().trim();

        return {
            corrected_text,
        }
    }

    const node2 = async (state: typeof exampleState.State) => {
        const prompt = PromptTemplate.fromTemplate("Revisa el siguiente texto y ajusta el tono para que sea extremadamente formal: {input}");
        const formattedPromt = await prompt.format({
            input: state.corrected_text,
        })
        const humanMessage = new HumanMessage({ content: formattedPromt });

        const result = await model.invoke([humanMessage]);

        const final_text = result.content.toString().trim();

        return {
            final_text,
        }
    }

    const graph = new StateGraph(exampleState)
        .addNode("node1", node1)
        .addNode("node2", node2)
        .addEdge(START, "node1")
        .addEdge("node1", "node2")
        .addEdge("node2", END).compile();

    const result = await graph.invoke({
        user_input: "Qué bolá asere?",
    });

    console.log(result);

    return result;
}