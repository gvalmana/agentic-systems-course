# 🔄 Nodos en LangGraph

## 📝 ¿Qué es un Nodo?

Imagina una línea de mensajeros, donde cada mensajero es un experto en modificar un mensaje de una manera específica:

- 📝 Primer mensajero: Experto en poner nombres en mayúsculas
- ✨ Segundo mensajero: Experto en añadir emojis
- 📢 Tercer mensajero: Experto en añadir signos de exclamación

Cada mensajero (nodo):

- Recibe un mensaje
- Hace su trabajo específico
- Pasa el resultado al siguiente

Definición:
Un nodo en LangGraph es una función que:

1. Recibe un estado tipado (StateType)
2. Realiza una transformación específica sobre ese estado
3. Retorna un objeto con las actualizaciones al estado (UpdateType)
4. Opera de forma independiente, siguiendo el principio de responsabilidad única

## 🔍 Ejemplo Simple

```typescript
import { Annotation } from "@langchain/langgraph";

// El estado que pasará por los nodos
const MessageState = Annotation.Root({
  text: Annotation<string>,
});

// Nodo 1: Experto en mayúsculas
function convertToUppercase(state: typeof MessageState.type) {
  return {
    ...state,
    text: state.text.toUpperCase(),
  };
}

// Nodo 2: Experto en emojis
function addEmoji(state: typeof MessageState.type) {
  return {
    ...state,
    text: "✨ " + state.text + " ✨",
  };
}

// Nodo 3: Experto en exclamaciones
function addExclamation(state: typeof MessageState.type) {
  return {
    ...state,
    text: state.text + "!!!",
  };
}

// Mensaje inicial
const message = {
  text: "hola mundo",
};

// Paso por cada nodo
const uppercased = convertToUppercase(message); // "HOLA MUNDO"
const withEmoji = addEmoji(uppercased); // "✨ HOLA MUNDO ✨"
const final = addExclamation(withEmoji); // "✨ HOLA MUNDO ✨!!!"
```

## 🎯 Reglas Importantes

1. **Cada Nodo es Experto en UNA Cosa**:

   ```typescript
   // ❌ MAL: Un nodo haciendo muchas cosas
   function nodoConfundido(state) {
     return {
       ...state,
       text: state.text.toUpperCase() + "!!!" + "✨", // ¡Demasiadas responsabilidades!
     };
   }

   // ✅ BIEN: Un nodo, una responsabilidad
   function nodoExperto(state) {
     return {
       ...state,
       text: state.text.toUpperCase(), // Solo hace mayúsculas
     };
   }
   ```

## 🎓 Reto

Imagina que tienes un mensaje que dice "buen día". Crea tres nodos diferentes que transformen este mensaje. ¿Qué haría cada nodo?

Por ejemplo:

- Un nodo podría añadir la hora
- Otro nodo podría añadir el nombre del usuario
- Otro nodo podría traducirlo a otro idioma
