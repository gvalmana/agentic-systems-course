# Introducción a LangGraph JS

## ¿Qué es LangGraph?

Imagina que estás organizando una cadena de montaje en una fábrica. En esta fábrica, tienes:

- 👥 **Trabajadores** que realizan tareas específicas
- 🛣️ **Cintas transportadoras** que mueven el producto entre trabajadores
- 📋 **Hojas de seguimiento** que acompañan al producto

LangGraph JS es exactamente eso, pero para crear flujos de trabajo con IA:

- Los **Nodos** son como los trabajadores (realizan tareas)
- Los **Edges** son como las cintas transportadoras (conectan los nodos)
- El **Estado** es como la hoja de seguimiento (mantiene la información)

## Componentes Principales

### 1. Nodos (Nodes)

Imagina un trabajador en la fábrica. Cada trabajador tiene una tarea específica:

- Puede ser simple (como empaquetar)
- Puede ser compleja (como control de calidad)
- Puede tomar decisiones

```typescript
// Un nodo es simplemente una función que procesa información
const empaquetador = (estado: Estado) => {
  // Hace algo con el estado
  return nuevoEstado;
};
```

### 2. Bordes (Edges)

Son como las señales en un cruce de caminos:

- Indican a dónde ir después
- Pueden tener condiciones ("si el producto está defectuoso, enviar a revisión")
- Conectan los nodos entre sí

```typescript
// Un edge decide el siguiente paso
graph.addEdge("empaquetador", "controlCalidad");
```

### 3. Estado (State)

Como una hoja de seguimiento que:

- Viaja con el "producto"
- Se actualiza en cada paso
- Mantiene toda la información importante

```typescript
// Definimos qué información queremos seguir
const Estado = Annotation.Root({
  producto: Annotation<string>,
  calidad: Annotation<number>,
  empaquetado: Annotation<boolean>,
});
```

## Un Ejemplo de la Vida Real

Piensa en un restaurante:

1. El **mesero** toma la orden (Nodo 1)
2. La orden va a la **cocina** (Edge 1)
3. El **chef** prepara la comida (Nodo 2)
4. La comida va al **área de servicio** (Edge 2)
5. El **mesero** entrega la comida (Nodo 3)

La **comanda** (el papel con la orden) es el Estado que viaja por todo el proceso.

## Ejercicio Mental

Antes de continuar, piensa en algún proceso de tu vida diaria y trata de identificar:

- ¿Cuáles serían los nodos (trabajadores)?
- ¿Cuáles serían los edges (conexiones)?
- ¿Qué información necesitarías en el estado?

Por ejemplo, piensa en hacer un café:

- Nodos: Moler café, Calentar agua, Preparar filtro, Verter agua
- Edges: Las conexiones entre cada paso
- Estado: Temperatura del agua, Cantidad de café, Tiempo de preparación
