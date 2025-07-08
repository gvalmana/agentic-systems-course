# 🛣️ Edges en LangGraph

## 📝 ¿Qué es un Edge?

Imagina que estás usando un GPS para llegar a tu destino 🗺️:

- Los lugares son los nodos (tu casa, el supermercado, el trabajo)
- El GPS es el edge (decide qué camino tomar)
- Tú y tu coche son el estado (llevan la información de dónde estás y qué necesitas)

En cada intersección, el GPS (edge) toma decisiones basadas en:

- ¿Hay tráfico en esta ruta?
- ¿Es hora pico?
- ¿Necesitas pasar por la gasolinera?

Así funciona un edge en LangGraph:

1. Recibe información del estado actual
2. Toma una decisión basada en esa información
3. Te dice a qué nodo ir después
