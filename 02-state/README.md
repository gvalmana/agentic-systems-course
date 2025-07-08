# Estado en LangGraph JS: La Base de Todo

## 🧠 ¿Qué es el Estado?

Imagina una pizarra mágica que:

- 📝 Guarda toda la información importante
- 🔄 Se actualiza cuando necesitamos
- 📋 Tiene secciones bien organizadas
- ✨ Nunca pierde información

En LangGraph JS, el Estado es como esta pizarra: un lugar donde guardamos toda la información que necesitamos recordar.

## 📊 Tipos de Anotaciones

### 1. Anotaciones Simples

```typescript
const MiEstado = Annotation.Root({
  nombre: Annotation<string>, // Para texto
  edad: Annotation<number>, // Para números
  activo: Annotation<boolean>, // Para verdadero/falso
});
```

Es como tener diferentes tipos de etiquetas en nuestra pizarra:

- 📝 Texto para nombres
- 🔢 Números para cantidades
- ✅ Casillas para marcar sí/no

### 2. Anotaciones de Objetos

```typescript
const EstadoPersona = Annotation.Root({
  usuario: Annotation<{
    nombre: string;
    edad: number;
  }>,
});
```

## 📝 Puntos Clave

1. **El Estado es como una Pizarra**

   - Guarda información
   - Está organizado
   - Es visible para todos

2. **Las Anotaciones son como Etiquetas**

   - Definen qué tipo de información guardamos
   - Nos ayudan a evitar errores
   - Hacen el código más seguro

3. **La Inmutabilidad es Importante**
   - Siempre creamos nuevos estados
   - No modificamos directamente
   - Mantenemos la historia

## 🚀 En el Próximo Módulo

Aprenderemos sobre los Nodos, que son como trabajadores que:

- Leen el estado
- Hacen su trabajo
- Crean nuevo estado

Pero por ahora, ¡enfoquémonos en dominar el concepto de Estado!
