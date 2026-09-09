# 🏗️ Arquitectura Técnica - CMT Training

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Estructura de Carpetas](#estructura-de-carpetas)
3. [Arquitectura del Sistema](#arquitectura-del-sistema)
4. [Módulos Principales](#módulos-principales)
5. [Flujo de Datos](#flujo-de-datos)
6. [APIs y Funciones](#apis-y-funciones)

## 🎯 Descripción General

CMT Training es una aplicación web vanilla JavaScript que implementa un sistema de entrenamiento cognitivo-motor interactivo. La arquitectura está diseñada para ser:

- **Modular**: Cada aspecto (audio, estímulos, estadísticas) está separado
- **Escalable**: Fácil de añadir nuevas características
- **Performante**: Optimizado para dispositivos móviles
- **Accesible**: Soporta múltiples formas de interacción

## 📁 Estructura de Carpetas

```
cmt-training/
├── index.html              # Punto de entrada HTML
├── css/
│   └── styles.css          # Estilos globales
├── js/
│   ├── config.js           # Configuración global
│   ├── audio.js            # Sistema de audio
│   ├── stimuli.js          # Generador de estímulos
│   ├── stats.js            # Sistema de estadísticas
│   ├── game.js             # Motor del juego
│   └── main.js             # Inicialización y eventos
├── docs/
│   ├── ARCHITECTURE.md     # Este archivo
│   ├── API.md              # Documentación de API
│   └── ROADMAP.md          # Plan de desarrollo
└── README.md               # Información general
```

## 🔌 Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────┐
│                        HTML / DOM                        │
└─────────────────────────────────────────────────────────┘
                            ▲
                            │
┌─────────────────────────────────────────────────────────┐
│                      MAIN.JS (Events)                    │
│  ├─ setupConfigurationEvents()                          │
│  ├─ setupGameEvents()                                   │
│  ├─ setupPauseEvents()                                  │
│  ├─ setupResultsEvents()                                │
│  └─ Touch/Keyboard handlers                             │
└─────────────────────────────────────────────────────────┘
        │              │              │              │
        ▼              ▼              ▼              ▼
    ┌────────┐    ┌────────┐    ┌────────┐    ┌────────┐
    │ GAME   │    │STIMULI │    │ AUDIO  │    │ STATS  │
    │Engine  │    │Manager │    │System  │    │System  │
    └────────┘    └────────┘    └────────┘    └────────┘
        │              │              │              │
        └──────────────┼──────────────┼──────────────┘
                       ▼
            ┌─────────────────────┐
            │   CONFIG + STATE    │
            │   Global Objects    │
            └─────────────────────┘
                       │
                       ▼
            ┌─────────────────────┐
            │   LocalStorage      │
            │   Persistence       │
            └─────────────────────┘
```

## 📦 Módulos Principales

### 1. **config.js** - Configuración Global
```javascript
CONFIG = {
    durations: { 30, 60, 120, custom },
    difficulties: { easy, medium, hard, extreme },
    stimuliTypes: { visual, audio, mixed },
    directions: { left, right, up, down },
    audio: { enabled, language, useSystemTTS },
    ui: { fullscreen, showCenterCircle, arrowSize }
}

STATE = {
    selectedDuration: number,
    selectedDifficulty: string,
    selectedStimuli: string,
    soundEnabled: boolean,
    isGameRunning: boolean,
    isPaused: boolean,
    stats: { ... },
    timers: { ... }
}
```

**Responsabilidades:**
- Almacenar configuración global
- Mantener estado de la aplicación
- Funciones de utilidad
- Gestión de pantalla completa

### 2. **audio.js** - Sistema de Audio
```javascript
AUDIO = {
    audioContext: AudioContext,
    synth: SpeechSynthesis,
    sounds: {},
    
    init()
    playSuccess()
    playError()
    playTone(frequency, duration)
    speak(text, language)
    speakDirection(direction)
}
```

**Responsabilidades:**
- Reproducir tonos (éxito, error, alerta)
- Síntesis de voz para comandos
- Control de volumen
- Soporte de múltiples idiomas

### 3. **stimuli.js** - Generador de Estímulos
```javascript
STIMULI = {
    currentStimulus: {},
    currentDirection: string,
    stimulusStartTime: timestamp,
    
    generate()
    display(direction)
    displayVisual(direction)
    displayAudio(direction)
    displayMixed(direction)
    hide()
    calculateReactionTime()
    scheduleNext()
}
```

**Responsabilidades:**
- Generar estímulos aleatorios
- Evitar repetición consecutiva
- Mostrar/ocultar estímulos
- Calcular tiempos de reacción

### 4. **stats.js** - Sistema de Estadísticas
```javascript
STATS = {
    recordHit(reactionTime)
    recordError()
    calculateAccuracy()
    calculateAverageReactionTime()
    updateUI()
    generateSessionSummary()
    saveSesion()
    getHistory()
    getOverallStats()
    clearHistory()
    exportHistory()
}
```

**Responsabilidades:**
- Registrar aciertos y errores
- Calcular métricas
- Guardar en localStorage
- Mostrar resultados
- Gestionar historial

### 5. **game.js** - Motor del Juego
```javascript
GAME = {
    isWaitingForResponse: boolean,
    responseTimeout: timer,
    
    init()
    startGameTimer()
    updateTimer()
    nextStimulus()
    scheduleNextStimulus()
    checkResponse(direction)
    pause()
    resume()
    endGame()
    quit()
}
```

**Responsabilidades:**
- Controlar flujo del juego
- Gestionar timers
- Validar respuestas
- Manejar pausas/reanudas
- Finalizar sesiones

### 6. **main.js** - Inicialización y Eventos
```javascript
initializeApp()
setupConfigurationEvents()
setupGameEvents()
setupPauseEvents()
setupResultsEvents()
switchScreen(screenId)
```

**Responsabilidades:**
- Inicializar la aplicación
- Configurar manejadores de eventos
- Gestionar cambios de pantalla
- Manejar entrada de usuario (teclado, táctil)
- Debug y consola

## 🔄 Flujo de Datos

### Inicialización del Juego
```
setupConfiguration
    ↓
selectDuration + selectDifficulty + selectStimuli
    ↓
GAME.init()
    ↓
resetStats()
    ↓
startGameTimer()
    ↓
scheduleNextStimulus()
```

### Ciclo de Estímulo-Respuesta
```
GAME.nextStimulus()
    ↓
STIMULI.generate()
    ↓
STIMULI.display()
    ↓
[Esperar respuesta del usuario]
    ↓
GAME.checkResponse()
    ↓
¿Respuesta correcta?
├─ Sí → STATS.recordHit()
└─ No → STATS.recordError()
    ↓
STIMULI.hide()
    ↓
scheduleNextStimulus()
    ↓
[Repetir]
```

### Finalización de Sesión
```
Timer = 0
    ↓
GAME.endGame()
    ↓
STATS.saveSesion()
    ↓
displayResults()
    ↓
switchScreen('resultsScreen')
```

## 📡 APIs y Funciones

### CONFIG API

```javascript
// Obtener configuración de dificultad
getDifficultyConfig() → {name, interval, label}

// Obtener intervalo de próximo estímulo
getNextStimuliInterval() → number (ms)

// Obtener dirección aleatoria
getRandomDirection() → string

// Obtener dirección opuesta
getOppositeDirection(direction) → string

// Persistencia
saveStateToStorage()
loadStateFromStorage()

// Utilidades
resetStats()
formatTime(ms) → string
requestFullscreen()
exitFullscreen()
checkBrowserSupport() → object
```

### AUDIO API

```javascript
// Inicialización
init()
isSpeechSynthesisSupported() → boolean
getAvailableVoices() → array

// Reproducción de tonos
playTone(frequency, duration)
playArpeggio(ascending)
playSuccess()
playError()
playAlert()

// Síntesis de voz
speak(text, language)
speakDirection(direction)
speakStart()
speakEnd()
```

### STIMULI API

```javascript
// Generación
generate() → {direction, timestamp, type}
getRandomDirection() → string

// Visualización
display(direction)
displayVisual(direction)
displayAudio(direction)
displayMixed(direction)
hide()
updateInstructionText(direction, type)

// Timing
calculateReactionTime() → number (ms)
scheduleNext()
```

### STATS API

```javascript
// Registro de eventos
recordHit(reactionTime)
recordError()

// Cálculos
calculateAccuracy() → number (%)
calculateAverageReactionTime() → number (ms)
generateSessionSummary() → object

// Persistencia
saveSesion() → object
getHistory() → array
getOverallStats() → object
clearHistory()
exportHistory()

// UI
updateUI()
```

### GAME API

```javascript
// Ciclo de vida
init()
endGame()
quit()

// Control de juego
startGameTimer()
updateTimer()
nextStimulus()
scheduleNextStimulus()
checkResponse(direction)

// Pausas
pause()
resume()
```

## 🎮 Estados del Juego

```
┌────────────┐
│ INIT       │  (Configuración)
└────────────┘
      │
      ▼
┌────────────┐
│ RUNNING    │  (Juego activo)
└────────────┘
      │
      ├─► ┌────────────┐
      │   │ PAUSED     │  (Pausado)
      │   └────────────┘
      │         │
      │         ▼
      │   [Resume]
      │         │
      ▼         ▼
┌────────────┐
│ FINISHED   │  (Resultados)
└────────────┘
```

## 💾 Almacenamiento Local

### LocalStorage Keys

```javascript
cmtTrainingState = {
    selectedDuration,
    selectedDifficulty,
    selectedStimuli,
    soundEnabled,
    stats: {}
}

cmtTrainingHistory = [
    {
        duration,
        difficulty,
        stimuliType,
        totalInstructions,
        hits,
        errors,
        accuracy,
        averageReactionTime,
        maxSpeed,
        timestamp
    },
    ...
]
```

## 🔧 Configuración de Dificultad

| Nivel | Intervalo | Variación | Propósito |
|-------|-----------|-----------|-----------|
| **Fácil** | 3000ms | Predecible | Familiarización |
| **Medio** | 2000ms | Normal | Entrenamiento estándar |
| **Difícil** | 1000ms | Rápido | Desafío |
| **Extremo** | 500-1500ms | Aleatorio | Máximo desafío |

## 🎨 Paleta de Colores

```css
--primary: #6366f1           /* Azul Indigo */
--secondary: #10b981         /* Verde Esmeralda */
--danger: #ef4444            /* Rojo */
--warning: #f59e0b           /* Ámbar */
--arrow-left: #ff6b6b         /* Rojo */
--arrow-right: #4ecdc4        /* Turquesa */
--arrow-up: #ffe66d           /* Amarillo */
--arrow-down: #95e1d3         /* Verde Menta */
```

## 📱 Responsividad

- **Desktop** (>1024px): Pantalla completa óptima
- **Tablet** (768px - 1024px): Layout adaptado
- **Mobile** (<768px): Gestos táctiles, interfaz compacta

## ⚡ Optimizaciones

1. **Rendimiento**
   - Reutilización de elementos DOM
   - Memoización de cálculos
   - Throttling de eventos

2. **Accesibilidad**
   - Soporte de teclado
   - Gestos táctiles
   - Síntesis de voz

3. **Persistencia**
   - LocalStorage para estado
   - Historial de sesiones
   - Exportación de datos

## 🚀 Futuras Mejoras

- [ ] Reconocimiento de cámara (v2)
- [ ] Detección de movimiento con IA (v2)
- [ ] Modo avanzado (colores + reglas) (v2)
- [ ] Backend para sincronización en nube (v3)
- [ ] Multiplayer/Competición (v3)
- [ ] Dashboard de progreso (v3)
