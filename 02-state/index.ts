import { Annotation } from "@langchain/langgraph";

// Definir el estado de nuestra tarea
const TodoState = Annotation.Root({
  // La tarea actual
  task: Annotation<{
    title: string;
    description: string;
  }>,

  // Fecha de creación
  date: Annotation<Date>,

  // Estado de la tarea
  status: Annotation<"pending" | "completed">,

  // Categoría de la tarea
  category: Annotation<"personal" | "trabajo" | "recordatorio">,
});
