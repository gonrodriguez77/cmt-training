/* ============================================
   Motor del Juego - Game Engine
   ============================================ */

const GAME = {
    // Controla si hay un estímulo activo esperando respuesta
    isWaitingForResponse: false,
    responseTimeout: null,

    /**
     * Inicializa el juego
     */
    init() {
        console.log('🎮 Inicializando juego...');
        resetStats();
        STATE.isGameRunning = true;
        STATE.isPaused = false;
        STATE.sessionStartTime = Date.now();
        STATE.timeRemaining = STATE.selectedDuration;

        // Cambiar a pantalla de juego
        switchScreen('gameScreen');

        // Solicitar pantalla completa
        if (CONFIG.ui.fullscreen) {
            requestFullscreen();
        }

        // Reproducir sonido de inicio
        AUDIO.speakStart();
        AUDIO.playArpeggio(true);

        // Iniciar timer
        this.startGameTimer();

        // Programar primer estímulo
        setTimeout(() => {
            this.nextStimulus();
        }, 1000);

        console.log('✅ Juego iniciado');
    },

    /**
     * Maneja el timer del juego
     */
    startGameTimer() {
        if (STATE.timers.gameTimer) {
            clearInterval(STATE.timers.gameTimer);
        }

        STATE.timers.gameTimer = setInterval(() => {
            if (!STATE.isPaused) {
                STATE.timeRemaining--;
                this.updateTimer();

                if (STATE.timeRemaining <= 0) {
                    this.endGame();
                }
            }
        }, 1000);
    },

    /**
     * Actualiza la visualización del timer
     */
    updateTimer() {
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.textContent = STATE.timeRemaining + 's';
        }
    },

    /**
     * Genera el próximo estímulo
     */
    nextStimulus() {
        if (!STATE.isGameRunning || STATE.isPaused) return;

        const stimulus = STIMULI.generate();
        STIMULI.display(stimulus.direction);

        this.isWaitingForResponse = true;
        STATE.stats.totalInstructions++;

        // Timeout de respuesta (si no responde en 5 segundos, es un error)
        if (this.responseTimeout) {
            clearTimeout(this.responseTimeout);
        }

        this.responseTimeout = setTimeout(() => {
            if (this.isWaitingForResponse) {
                STATS.recordError();
                this.isWaitingForResponse = false;
                console.log('⚠️ Timeout - No se respondió a tiempo');
                this.scheduleNextStimulus();
            }
        }, 5000);
    },

    /**
     * Programa el siguiente estímulo
     */
    scheduleNextStimulus() {
        const interval = getNextStimuliInterval();

        if (STATE.timers.stimuliTimer) {
            clearTimeout(STATE.timers.stimuliTimer);
        }

        STATE.timers.stimuliTimer = setTimeout(() => {
            if (STATE.isGameRunning && !STATE.isPaused) {
                this.nextStimulus();
            }
        }, interval);
    },

    /**
     * Verifica si la respuesta del usuario es correcta
     */
    checkResponse(direction) {
        if (!this.isWaitingForResponse) {
            console.log('❌ Respuesta fuera de tiempo');
            return;
        }

        const currentDirection = STIMULI.currentDirection;
        const reactionTime = STIMULI.calculateReactionTime();

        if (direction === currentDirection) {
            console.log('✅ Respuesta correcta:', direction);
            STATS.recordHit(reactionTime);
        } else {
            console.log('❌ Respuesta incorrecta. Esperado:', currentDirection, 'Recibido:', direction);
            STATS.recordError();
        }

        this.isWaitingForResponse = false;

        if (this.responseTimeout) {
            clearTimeout(this.responseTimeout);
        }

        STIMULI.hide();
        this.scheduleNextStimulus();
    },

    /**
     * Pausa el juego
     */
    pause() {
        if (!STATE.isGameRunning) return;

        STATE.isPaused = true;

        // Ocultar estímulo
        STIMULI.hide();

        // Limpiar timers
        if (STATE.timers.stimuliTimer) {
            clearTimeout(STATE.timers.stimuliTimer);
        }

        // Mostrar pantalla de pausa
        const pauseScreen = document.getElementById('pauseScreen');
        if (pauseScreen) {
            pauseScreen.classList.remove('hidden');
            pauseScreen.classList.add('active');
            
            // Actualizar estadísticas de pausa
            document.getElementById('pauseTime').textContent = 
                (STATE.selectedDuration - STATE.timeRemaining) + 's';
            document.getElementById('pauseHits').textContent = STATE.stats.hits;
            document.getElementById('pauseErrors').textContent = STATE.stats.errors;
        }

        console.log('⏸️ Juego pausado');
    },

    /**
     * Reanuda el juego
     */
    resume() {
        STATE.isPaused = false;

        // Ocultar pantalla de pausa
        const pauseScreen = document.getElementById('pauseScreen');
        if (pauseScreen) {
            pauseScreen.classList.add('hidden');
            pauseScreen.classList.remove('active');
        }

        // Reanudar próximo estímulo
        this.scheduleNextStimulus();

        console.log('▶️ Juego reanudado');
    },

    /**
     * Finaliza el juego
     */
    endGame() {
        STATE.isGameRunning = false;
        STATE.isPaused = false;

        // Limpiar timers
        clearInterval(STATE.timers.gameTimer);
        if (STATE.timers.stimuliTimer) {
            clearTimeout(STATE.timers.stimuliTimer);
        }
        if (STATE.responseTimeout) {
            clearTimeout(this.responseTimeout);
        }

        // Ocultar estímulo
        STIMULI.hide();

        // Reproducir sonido de fin
        AUDIO.playArpeggio(false);
        AUDIO.speakEnd();

        // Guardar sesión y mostrar resultados
        const summary = STATS.saveSesion();
        displayResults(summary);

        // Cambiar a pantalla de resultados
        switchScreen('resultsScreen');

        // Salir de pantalla completa
        exitFullscreen();

        console.log('✅ Juego finalizado');
        console.log('📊 Resumen:', summary);
    },

    /**
     * Abandona el juego sin terminar
     */
    quit() {
        STATE.isGameRunning = false;
        STATE.isPaused = false;

        // Limpiar timers
        clearInterval(STATE.timers.gameTimer);
        if (STATE.timers.stimuliTimer) {
            clearTimeout(STATE.timers.stimuliTimer);
        }
        if (this.responseTimeout) {
            clearTimeout(this.responseTimeout);
        }

        // Ocultar estímulo
        STIMULI.hide();

        // Salir de pantalla completa
        exitFullscreen();

        // Volver a configuración
        switchScreen('configScreen');

        console.log('❌ Juego abandonado');
    }
};

/**
 * Cambia de pantalla
 */
function switchScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });

    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
}

/**
 * Maneja las teclas presionadas
 */
document.addEventListener('keydown', (e) => {
    if (!STATE.isGameRunning || STATE.isPaused) return;

    const directionMap = {
        'ArrowLeft': 'left',
        'ArrowRight': 'right',
        'ArrowUp': 'up',
        'ArrowDown': 'down'
    };

    if (directionMap[e.key]) {
        e.preventDefault();
        GAME.checkResponse(directionMap[e.key]);
    }
});
