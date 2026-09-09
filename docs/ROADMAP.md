# 📅 Roadmap - CMT Training

## 🎯 Visión General

CMT Training evoluciona a través de 3 versiones principales, cada una añadiendo capas de complejidad y características avanzadas para mejorar la experiencia del usuario y expandir casos de uso.

---

## 📌 MVP - v1.0 (Actual)

**Estado:** ✅ **COMPLETADO**

### Características Incluidas

- ✅ Interfaz web responsive
- ✅ Pantalla completa
- ✅ Estímulos visuales (flechas aleatorias)
- ✅ 4 niveles de dificultad
- ✅ Configuración de duración (30s, 60s, 120s, personalizado)
- ✅ Modo visual
- ✅ Audio sincronizado (síntesis de voz)
- ✅ Contador regresivo
- ✅ Estadísticas básicas
- ✅ Historial de sesiones (LocalStorage)
- ✅ Controles por teclado y táctil
- ✅ Soporte para múltiples idiomas

### Técnicas Implementadas

- Vanilla JavaScript (sin frameworks)
- Web Audio API
- Web Speech API
- LocalStorage
- Responsive CSS3
- Animaciones suaves

### Casos de Uso

- Entrenamiento básico de tiempo de reacción
- Mejora de agilidad mental
- Rehabilitación funcional

---

## 🚀 v2.0 - Reconocimiento Inteligente

**Fecha Estimada:** Q3 2026  
**Estado:** 🔄 **EN DISEÑO**

### Nuevas Características

#### 1. Reconocimiento de Movimiento
- 📹 **Cámara Web Integration**
  - Acceso a cámara del dispositivo
  - Streaming de video en tiempo real
  - Visualización del usuario

#### 2. Detección de Movimiento con IA
- 🤖 **ML.js o TensorFlow.js**
  - Pose detection (postura del cuerpo)
  - Gesture recognition (reconocimiento de gestos)
  - Movement tracking (seguimiento de movimiento)
  - Validación automática de respuestas

#### 3. Modo Avanzado
- 🎨 **Colores y Reglas**
  ```
  Flecha Verde → Ejecutar movimiento normal
  Flecha Roja  → Ejecutar movimiento contrario
  ```
- 📊 **Mayor Carga Cognitiva**
  - Múltiples capas de decisión
  - Estímulos contradictorios
  - Combinaciones complejas

#### 4. Modo Auditivo Mejorado
- 🔊 **Reconocimiento de Voz**
  - Web Speech API Recognition
  - Reconocimiento de comandos verbales
  - Feedback de reconocimiento

#### 5. Modo Mixto Avanzado
- 🔀 **Combinaciones**
  - Visual + Auditivo simultáneo
  - Conflictos de información
  - Test de priorización cognitiva

#### 6. Sistema de Puntuación Mejorado
- 📈 **Métricas Avanzadas**
  - Velocidad del movimiento (píxeles/segundo)
  - Amplitud del movimiento
  - Estabilidad de la postura
  - Precisión de movimiento
  - Consistencia

#### 7. Programas de Entrenamiento
- 📋 **Entrenamientos Personalizados**
  - Progresión adaptativa
  - Dificultad dinámica
  - Recomendaciones basadas en rendimiento
  - Planes de 7/14/30 días

#### 8. Dashboard Mejorado
- 📊 **Visualización de Datos**
  - Gráficos de progreso
  - Comparativas de sesiones
  - Análisis de tendencias
  - Hitos y logros

### Stack Técnico

```
Frontend:
- TensorFlow.js (para IA)
- ML Pose Detection
- Gesture Recognition
- Chart.js (gráficos)

Backend Opcional:
- Node.js + Express
- MongoDB (historial en nube)
- WebSocket (datos en tiempo real)
```

### Ejemplos de Implementación

```javascript
// Pseudo-código para v2.0

// 1. Inicializar cámara y pose detection
const camera = await initializeCamera();
const poseDetector = await loadPoseDetectionModel();

// 2. En cada frame, detectar pose
const poses = await poseDetector.estimatePoses(videoElement);
const keypoints = poses[0].keypoints;

// 3. Calcular movimiento
const movement = calculateMovement(keypoints, previousKeypoints);

// 4. Validar respuesta
if (isMovementCorrect(movement, expectedDirection)) {
    STATS.recordHit(reactionTime, movement.speed);
} else {
    STATS.recordError();
}
```

---

## 🌟 v3.0 - Ecosistema Completo

**Fecha Estimada:** Q4 2026 - Q1 2027  
**Estado:** 📋 **PLANIFICACIÓN**

### Nuevas Características

#### 1. Aplicación Móvil
- 📱 **React Native**
  - Aplicación nativa iOS/Android
  - Sincronización con web
  - Acceso a sensores del dispositivo
  - Notificaciones push

#### 2. Backend y Cloud
- ☁️ **Servidor Backend**
  - APIs REST
  - Autenticación de usuarios
  - Sincronización en nube
  - Backup automático

- 🗄️ **Base de Datos**
  - Historial de sesiones
  - Perfiles de usuario
  - Programas de entrenamiento
  - Análisis agregados

#### 3. Modos Especializados

**Deportes:**
```
⬅️ Pase izquierda
➡️ Pase derecha
⬆️ Avance
⬇️ Retroceso
```

**Fitness:**
```
⬆️ Salto
⬅️ Burpee
➡️ Sentadilla
⬇️ Plancha
```

**Rehabilitación:**
```
⬅️ Extensión izquierda
➡️ Extensión derecha
⬆️ Elevación
⬇️ Flexión
```

#### 4. Multiplayer y Competición
- 👥 **Modo Multijugador**
  - Competencia en tiempo real
  - Torneos
  - Leaderboards globales y locales

- 🏆 **Sistema de Logros**
  - Medallas y badges
  - Niveles de usuario
  - Rastreador de hitos
  - Compartir logros en redes

#### 5. Dashboard Avanzado
- 📊 **Analytics Completo**
  - Gráficos detallados
  - Exportación de datos
  - Comparativas con otros usuarios
  - Predicciones de progreso

#### 6. Integración de Wearables
- ⌚ **Dispositivos Portátiles**
  - Smartwatch support
  - Monitoring de frecuencia cardíaca
  - Datos biométricos
  - Correlación con rendimiento

#### 7. AI Coaching
- 🤖 **Asistente Inteligente**
  - Recomendaciones personalizadas
  - Análisis de patrones
  - Predicción de lesiones
  - Planes de entrenamiento adaptativos

---

## 📊 Comparativa de Versiones

| Característica | v1.0 | v2.0 | v3.0 |
|---|:---:|:---:|:---:|
| Estímulos Visuales | ✅ | ✅ | ✅ |
| Estímulos Auditivos | ✅ | ✅ | ✅ |
| Modo Mixto | ✅ | ✅ | ✅ |
| Cámara Web | ❌ | ✅ | ✅ |
| Detección de Movimiento | ❌ | ✅ | ✅ |
| Modo Avanzado (Colores) | ❌ | ✅ | ✅ |
| Reconocimiento de Voz | ❌ | ✅ | ✅ |
| Programas Personalizados | ❌ | ✅ | ✅ |
| Aplicación Móvil | ❌ | ❌ | ✅ |
| Backend/Cloud | ❌ | ❌ | ✅ |
| Multiplayer | ❌ | ❌ | ✅ |
| Wearables | ❌ | ❌ | ✅ |
| AI Coaching | ❌ | ❌ | ✅ |

---

## 🎯 Hitos Principales

### Q3 2026
- [ ] Completar v2.0 alpha
- [ ] Testing con usuarios
- [ ] Optimización de detección de movimiento
- [ ] Beta privada

### Q4 2026
- [ ] Lanzamiento v2.0 oficial
- [ ] Modos especializados beta
- [ ] Comienza desarrollo de app móvil

### Q1 2027
- [ ] Lanzamiento app móvil beta
- [ ] Backend en producción
- [ ] Sistema de logros funcional

### Q2 2027
- [ ] v3.0 completo
- [ ] Multiplicador de usuarios
- [ ] Partnerships deportivos

---

## 🔧 Próximos Pasos Inmediatos (Post v1.0)

### Corto Plazo (1-2 semanas)
- [ ] Testing beta con usuarios
- [ ] Recolectar feedback
- [ ] Optimizaciones de rendimiento
- [ ] Documentación de usuario

### Mediano Plazo (3-4 semanas)
- [ ] Iniciar desarrollo de v2.0
- [ ] Integración de TensorFlow.js
- [ ] Prototipo de detección de movimiento
- [ ] Diseño de modos avanzados

### Largo Plazo (5-8 semanas)
- [ ] v2.0 alfa completada
- [ ] Testing con deportistas
- [ ] Iteración basada en feedback
- [ ] Preparar lanzamiento

---

## 💡 Ideas Futuras

### Características Exploratorias
- 🎮 Gamification avanzada (questlines, eventos)
- 🌍 Comunidad global (foros, grupos)
- 🎓 Programas educativos certificados
- 🏥 Integración con profesionales de salud
- 📡 Telemedicina para rehabilitación
- 🎯 VR/AR integration
- 🤖 Biofeedback en tiempo real
- 📈 Predictive analytics

### Potenciales Integraciones
- Spotify (música personalizada según ritmo)
- Strava (sincronización de entrenamientos)
- Apple Health / Google Fit
- Zoom (sesiones grupales)
- Discord (comunidad)

---

## 📝 Notas

- Todas las fechas son estimadas y sujetas a cambios
- El feedback de usuarios puede acelerar/retrasar prioridades
- Cada versión es completamente retro-compatible
- Enfoque en calidad sobre velocidad

---

**Última actualización:** 2026-09-09  
**Versión del Roadmap:** 1.0
