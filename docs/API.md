# 📚 API Documentation - CMT Training

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [CONFIG - Configuración Global](#config)
3. [STATE - Estado de la Aplicación](#state)
4. [AUDIO - Sistema de Audio](#audio)
5. [STIMULI - Generador de Estímulos](#stimuli)
6. [STATS - Sistema de Estadísticas](#stats)
7. [GAME - Motor del Juego](#game)
8. [Funciones Globales](#funciones-globales)

---

## Introducción

CMT Training utiliza una arquitectura modular basada en objetos globales. Cada módulo expone una API pública para interactuar con otros módulos y con el DOM.

### Convenciones

- Todas las funciones que comienzan con `_` son privadas
- Los objetos globales son: `CONFIG`, `STATE`, `AUDIO`, `STIMULI`, `STATS`, `GAME`
- Los tiempos se expresan en milisegundos (ms) a menos que se especifique
- Las direcciones son: `'left'`, `'right'`, `'up'`, `'down'`

---

## CONFIG

### Objeto Global

```javascript
CONFIG = {
    durations: Object,
    difficulties: Object,
    stimuliTypes: Object,
    directions: Object,
    audio: Object,
    ui: Object
}
```

### Propiedades

#### `CONFIG.durations`
```javascript
{
    30: 30,          // 30 segundos
    60: 60,          // 60 segundos
    120: 120,        // 120 segundos
    custom: null     // Personalizado
}
```

#### `CONFIG.difficulties`
```javascript
{
    easy: {
        name: 'Fácil',
        interval: 3000,      // ms entre estímulos
        label: '3s'
    },
    medium: {
        name: 'Medio',
        interval: 2000,
        label: '2s'
    },
    hard: {
        name: 'Difícil',
        interval: 1000,
        label: '1s'
    },
    extreme: {
        name: 'Extremo',
        interval: 'random',
        min: 500,            // Mínimo ms
        max: 1500,           // Máximo ms
        label: '0.5-1.5s'
    }
}
```

#### `CONFIG.directions`
```javascript
{
    left: {
        symbol: '⬅️',
        name: 'Izquierda',
        code: 'ArrowLeft',
        angle: 180
    },
    right: {
        symbol: '➡️',
        name: 'Derecha',
        code: 'ArrowRight',
        angle: 0
    },
    up: {
        symbol: '⬆️',
        name: 'Adelante',
        code: 'ArrowUp',
        angle: 270
    },
    down: {
        symbol: '⬇️',
        name: 'Atrás',
        code: 'ArrowDown',
        angle: 90
    }
}
```

### Funciones Públicas

#### `getDifficultyConfig()`
Obtiene la configuración de dificultad actual.

```javascript
const difficulty = getDifficultyConfig();
// → {name: 'Medio', interval: 2000, label: '2s'}
```

#### `getNextStimuliInterval()`
Obtiene el intervalo para el próximo estímulo en ms.

```javascript
const interval = getNextStimuliInterval();
// → 2000 (o valor aleatorio en modo extremo)
```

#### `getRandomDirection()`
Retorna una dirección aleatoria.

```javascript
const dir = getRandomDirection();
// → 'left' | 'right' | 'up' | 'down'
```

#### `getOppositeDirection(direction)`
Retorna la dirección opuesta.

```javascript
getOppositeDirection('left');   // → 'right'
getOppositeDirection('up');     // → 'down'
```

#### `saveStateToStorage()`
Guarda el estado actual en localStorage.

```javascript
saveStateToStorage();
```

#### `loadStateFromStorage()`
Carga el estado previamente guardado desde localStorage.

```javascript
loadStateFromStorage();
```

#### `resetStats()`
Reinicia todas las estadísticas.

```javascript
resetStats();
```

#### `formatTime(ms)`
Convierte milisegundos a formato legible.

```javascript
formatTime(1200);      // → '1.20s'
formatTime(500);       // → '500ms'
```

#### `requestFullscreen()`
Solicita modo pantalla completa.

```javascript
requestFullscreen();
```

#### `exitFullscreen()`
Sale del modo pantalla completa.

```javascript
exitFullscreen();
```

---

## STATE

### Objeto Global

```javascript
STATE = {
    // Configuración
    selectedDuration: number,
    selectedDifficulty: string,
    selectedStimuli: string,
    soundEnabled: boolean,
    
    // Estado de sesión
    isGameRunning: boolean,
    isPaused: boolean,
    sessionStartTime: timestamp,
    timeElapsed: number,
    timeRemaining: number,
    
    // Estadísticas
    stats: Object,
    
    // Timers
    timers: Object
}
```

### Propiedades

#### `STATE.stats`
```javascript
{
    totalInstructions: 0,
    hits: 0,
    errors: 0,
    reactionTimes: [],          // Array de tiempos en ms
    currentDirection: string,    // Dirección actual
    lastDirection: string,       // Dirección anterior
    accuracy: 0,                 // Porcentaje
    averageReactionTime: 0,      // ms
    maxSpeed: 0                  // ms (más rápido = menor)
}
```

#### `STATE.timers`
```javascript
{
    gameTimer: number | null,        // setInterval ID
    stimuliTimer: number | null,     // setTimeout ID
    reactionTimer: number | null     // setTimeout ID
}
```

---

## AUDIO

### Objeto Global

```javascript
AUDIO = {
    audioContext: AudioContext | null,
    synth: SpeechSynthesis,
    sounds: Object
}
```

### Funciones Públicas

#### `init()`
Inicializa el sistema de audio.

```javascript
AUDIO.init();
```

#### `playTone(frequency, duration)`
Reproduce un tono de frecuencia específica.

```javascript
AUDIO.playTone(800, 150);    // 800Hz durante 150ms
AUDIO.playTone(1000, 200);   // 1000Hz durante 200ms
```

**Parámetros:**
- `frequency` (number): Frecuencia en Hz
- `duration` (number): Duración en ms

#### `playSuccess()`
Reproduce sonido de confirmación (éxito).

```javascript
AUDIO.playSuccess();
```

#### `playError()`
Reproduce sonido de error.

```javascript
AUDIO.playError();
```

#### `playAlert()`
Reproduce sonido de alerta.

```javascript
AUDIO.playAlert();
```

#### `playArpeggio(ascending)`
Reproduce una secuencia de tonos (arpeggio).

```javascript
AUDIO.playArpeggio(true);   // Ascendente: Do, Mi, Sol
AUDIO.playArpeggio(false);  // Descendente: Sol, Mi, Do
```

**Parámetros:**
- `ascending` (boolean): Dirección de los tonos

#### `speak(text, language)`
Sintetiza y reproduce texto hablado.

```javascript
AUDIO.speak('Hola mundo', 'es-ES');
AUDIO.speak('Hello world', 'en-US');
```

**Parámetros:**
- `text` (string): Texto a pronunciar
- `language` (string): Código de idioma (ej: 'es-ES', 'en-US')

#### `speakDirection(direction)`
Pronuncia el nombre de una dirección.

```javascript
AUDIO.speakDirection('left');   // Pronuncia "¡Izquierda!"
AUDIO.speakDirection('up');     // Pronuncia "¡Adelante!"
```

#### `speakStart()`
Pronuncia instrucción de inicio.

```javascript
AUDIO.speakStart();  // "¡Preparado! ¡Comienza!"
```

#### `speakEnd()`
Pronuncia instrucción de finalización.

```javascript
AUDIO.speakEnd();  // "¡Sesión finalizada!"
```

#### `isSpeechSynthesisSupported()`
Verifica si el navegador soporta síntesis de voz.

```javascript
if (AUDIO.isSpeechSynthesisSupported()) {
    AUDIO.speak('Hola');
}
```

**Retorna:** `boolean`

#### `getAvailableVoices()`
Obtiene lista de voces disponibles.

```javascript
const voices = AUDIO.getAvailableVoices();
console.log(voices);  // Array de voces del sistema
```

**Retorna:** `Array<SpeechSynthesisVoice>`

---

## STIMULI

### Objeto Global

```javascript
STIMULI = {
    currentStimulus: Object | null,
    currentDirection: string | null,
    stimulusStartTime: number | null
}
```

### Funciones Públicas

#### `generate()`
Genera un nuevo estímulo aleatorio.

```javascript
const stimulus = STIMULI.generate();
// → {direction: 'left', timestamp: 1234567890, type: 'visual'}
```

**Retorna:** `{direction, timestamp, type}`

#### `display(direction)`
Muestra el estímulo según su tipo configurado.

```javascript
STIMULI.display('left');
STIMULI.display('up');
```

**Parámetros:**
- `direction` (string): 'left', 'right', 'up', 'down'

#### `displayVisual(direction)`
Muestra solo estímulo visual (flecha).

```javascript
STIMULI.displayVisual('right');
```

#### `displayAudio(direction)`
Muestra solo estímulo auditivo (voz).

```javascript
STIMULI.displayAudio('down');
```

#### `displayMixed(direction)`
Muestra estímulo mixto (aleatorio: visual o auditivo).

```javascript
STIMULI.displayMixed('up');
```

#### `hide()`
Oculta el estímulo actual.

```javascript
STIMULI.hide();
```

#### `calculateReactionTime()`
Calcula tiempo desde que apareció el estímulo.

```javascript
const reactionTime = STIMULI.calculateReactionTime();
// → 850 (ms)
```

**Retorna:** `number` (milisegundos)

#### `scheduleNext()`
Programa el siguiente estímulo con intervalo basado en dificultad.

```javascript
STIMULI.scheduleNext();
```

---

## STATS

### Objeto Global

```javascript
STATS = {
    // Métodos de registro
    recordHit(reactionTime),
    recordError(),
    
    // Cálculos
    calculateAccuracy(),
    calculateAverageReactionTime(),
    
    // Persistencia
    saveSesion(),
    getHistory(),
    getOverallStats(),
    clearHistory(),
    exportHistory()
}
```

### Funciones Públicas

#### `recordHit(reactionTime)`
Registra un acierto.

```javascript
STATS.recordHit(850);  // Acierto con tiempo de 850ms
```

**Parámetros:**
- `reactionTime` (number): Tiempo de reacción en ms

#### `recordError()`
Registra un error.

```javascript
STATS.recordError();
```

#### `calculateAccuracy()`
Calcula precisión como porcentaje.

```javascript
const accuracy = STATS.calculateAccuracy();
// → 92.5 (92.5%)
```

**Retorna:** `number` (0-100)

#### `calculateAverageReactionTime()`
Calcula tiempo promedio de reacción.

```javascript
const avgTime = STATS.calculateAverageReactionTime();
// → 850.25 (ms)
```

**Retorna:** `number` (milisegundos)

#### `generateSessionSummary()`
Genera resumen de la sesión actual.

```javascript
const summary = STATS.generateSessionSummary();
/*
{
    duration: 60,
    difficulty: 'Medio',
    stimuliType: 'Visual',
    totalInstructions: 42,
    hits: 39,
    errors: 3,
    accuracy: '92.9',
    averageReactionTime: 850,
    maxSpeed: 450,
    timestamp: '2026-09-09T10:30:00.000Z'
}
*/
```

**Retorna:** `Object`

#### `saveSesion()`
Guarda la sesión actual en historial.

```javascript
const summary = STATS.saveSesion();
```

**Retorna:** `Object` (resumen de sesión)

#### `getHistory()`
Obtiene historial de todas las sesiones.

```javascript
const history = STATS.getHistory();
// → Array de 50 últimas sesiones máximo
```

**Retorna:** `Array<Object>`

#### `getOverallStats()`
Obtiene estadísticas generales de todas las sesiones.

```javascript
const overall = STATS.getOverallStats();
/*
{
    totalSessions: 15,
    totalInstructions: 630,
    averageAccuracy: '91.5',
    bestAccuracy: '96.2',
    bestReactionTime: '0.42',
    averageReactionTime: '0.85'
}
*/
```

**Retorna:** `Object`

#### `clearHistory()`
Elimina todo el historial de sesiones.

```javascript
STATS.clearHistory();
```

#### `exportHistory()`
Descarga el historial como archivo JSON.

```javascript
STATS.exportHistory();
// Descarga: cmt-training-history-2026-09-09.json
```

#### `updateUI()`
Actualiza la interfaz con estadísticas actuales.

```javascript
STATS.updateUI();
```

---

## GAME

### Objeto Global

```javascript
GAME = {
    isWaitingForResponse: boolean,
    responseTimeout: number | null
}
```

### Funciones Públicas

#### `init()`
Inicializa y comienza el juego.

```javascript
GAME.init();
```

#### `startGameTimer()`
Inicia el temporizador del juego.

```javascript
GAME.startGameTimer();
```

#### `updateTimer()`
Actualiza la visualización del temporizador.

```javascript
GAME.updateTimer();
```

#### `nextStimulus()`
Genera y muestra el siguiente estímulo.

```javascript
GAME.nextStimulus();
```

#### `scheduleNextStimulus()`
Programa el siguiente estímulo con intervalo apropiado.

```javascript
GAME.scheduleNextStimulus();
```

#### `checkResponse(direction)`
Valida la respuesta del usuario.

```javascript
GAME.checkResponse('left');   // Usuario respondió "izquierda"
GAME.checkResponse('up');     // Usuario respondió "arriba"
```

**Parámetros:**
- `direction` (string): 'left', 'right', 'up', 'down'

#### `pause()`
Pausa el juego actual.

```javascript
GAME.pause();
```

#### `resume()`
Reanuda el juego pausado.

```javascript
GAME.resume();
```

#### `endGame()`
Finaliza la sesión de juego.

```javascript
GAME.endGame();
```

#### `quit()`
Abandona el juego sin completarlo.

```javascript
GAME.quit();
```

---

## Funciones Globales

### `switchScreen(screenId)`
Cambia la pantalla activa.

```javascript
switchScreen('configScreen');    // Pantalla de configuración
switchScreen('gameScreen');      // Pantalla de juego
switchScreen('resultsScreen');   // Pantalla de resultados
switchScreen('pauseScreen');     // Pantalla de pausa
```

**Parámetros:**
- `screenId` (string): ID de la pantalla

### `displayResults(summary)`
Muestra resultados en la pantalla de resultados.

```javascript
displayResults(STATS.generateSessionSummary());
```

**Parámetros:**
- `summary` (Object): Resumen de sesión

---

## Ejemplos de Uso

### Ejemplo 1: Iniciar Juego
```javascript
// Configurar
STATE.selectedDuration = 60;
STATE.selectedDifficulty = 'medium';
STATE.selectedStimuli = 'visual';
STATE.soundEnabled = true;

// Guardar y iniciar
saveStateToStorage();
GAME.init();
```

### Ejemplo 2: Responder a Estímulo
```javascript
// En handler de evento
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        GAME.checkResponse('left');
    }
});
```

### Ejemplo 3: Ver Historial
```javascript
const history = STATS.getHistory();
const overall = STATS.getOverallStats();

console.log(`Total sesiones: ${overall.totalSessions}`);
console.log(`Precisión promedio: ${overall.averageAccuracy}%`);
```

### Ejemplo 4: Exportar Datos
```javascript
STATS.exportHistory();  // Descarga archivo JSON
```

---

**Última actualización:** 2026-09-09  
**Versión de API:** 1.0
