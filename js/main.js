/* ============================================
   Archivo Principal - Inicialización y Eventos
   ============================================ */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 CMT Training cargado');
    
    // Inicializar
    initializeApp();
});

/**
 * Inicializa la aplicación
 */
function initializeApp() {
    // Cargar estado previo si existe
    loadStateFromStorage();

    // Configurar eventos de configuración
    setupConfigurationEvents();

    // Configurar eventos del juego
    setupGameEvents();

    // Configurar eventos de pausa
    setupPauseEvents();

    // Configurar eventos de resultados
    setupResultsEvents();

    console.log('✅ Aplicación inicializada');
}

/**
 * Configura eventos de la pantalla de configuración
 */
function setupConfigurationEvents() {
    const startBtn = document.getElementById('startBtn');
    const durationBtns = document.querySelectorAll('.duration-btn');
    const difficultyBtns = document.querySelectorAll('.difficulty-btn');
    const stimuliBtns = document.querySelectorAll('.stimuli-btn');
    const soundToggle = document.getElementById('soundToggle');
    const durationInput = document.getElementById('duration');

    // Botones de duración
    durationBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remover selección anterior
            durationBtns.forEach(b => b.removeAttribute('data-selected'));
            
            // Marcar como seleccionado
            btn.setAttribute('data-selected', 'true');

            const value = btn.getAttribute('data-value');
            if (value === 'custom') {
                durationInput.classList.remove('hidden');
                STATE.selectedDuration = parseInt(durationInput.value);
            } else {
                durationInput.classList.add('hidden');
                STATE.selectedDuration = parseInt(value);
            }

            console.log('⏱️ Duración seleccionada:', STATE.selectedDuration);
        });
    });

    // Botones de dificultad
    difficultyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remover selección anterior
            difficultyBtns.forEach(b => b.removeAttribute('data-selected'));
            
            // Marcar como seleccionado
            btn.setAttribute('data-selected', 'true');

            const value = btn.getAttribute('data-value');
            STATE.selectedDifficulty = value;

            console.log('🎯 Dificultad seleccionada:', value);
        });
    });

    // Botones de estímulo
    stimuliBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remover selección anterior
            stimuliBtns.forEach(b => b.removeAttribute('data-selected'));
            
            // Marcar como seleccionado
            btn.setAttribute('data-selected', 'true');

            const value = btn.getAttribute('data-value');
            STATE.selectedStimuli = value;

            console.log('📢 Tipo de estímulo seleccionado:', value);
        });
    });

    // Toggle de sonido
    soundToggle.addEventListener('change', (e) => {
        STATE.soundEnabled = e.target.checked;
        console.log('🔔 Sonido:', STATE.soundEnabled ? 'Habilitado' : 'Deshabilitado');
    });

    // Input de duración personalizada
    durationInput.addEventListener('change', (e) => {
        STATE.selectedDuration = parseInt(e.target.value);
        console.log('⏱️ Duración personalizada:', STATE.selectedDuration);
    });

    // Botón de inicio
    startBtn.addEventListener('click', () => {
        // Validar configuración
        if (STATE.selectedDuration <= 0) {
            alert('Por favor selecciona una duración válida');
            return;
        }

        // Guardar estado
        saveStateToStorage();

        // Iniciar juego
        GAME.init();
    });
}

/**
 * Configura eventos del juego
 */
function setupGameEvents() {
    const pauseBtn = document.getElementById('pauseBtn');

    pauseBtn.addEventListener('click', () => {
        GAME.pause();
    });
}

/**
 * Configura eventos de pausa
 */
function setupPauseEvents() {
    const resumeBtn = document.getElementById('resumeBtn');
    const quitBtn = document.getElementById('quitBtn');

    resumeBtn.addEventListener('click', () => {
        GAME.resume();
    });

    quitBtn.addEventListener('click', () => {
        GAME.quit();
    });
}

/**
 * Configura eventos de resultados
 */
function setupResultsEvents() {
    const retryBtn = document.getElementById('retryBtn');
    const homeBtn = document.getElementById('homeBtn');

    retryBtn.addEventListener('click', () => {
        // Reintentar con misma configuración
        GAME.init();
    });

    homeBtn.addEventListener('click', () => {
        // Volver a configuración
        switchScreen('configScreen');
    });
}

/**
 * Maneja la visibilidad del documento
 */
document.addEventListener('visibilitychange', () => {
    if (document.hidden && STATE.isGameRunning && !STATE.isPaused) {
        console.log('⚠️ Ventana oculta - Pausando juego');
        GAME.pause();
    }
});

/**
 * Maneja el evento beforeunload
 */
window.addEventListener('beforeunload', (e) => {
    if (STATE.isGameRunning) {
        e.preventDefault();
        e.returnValue = '¿Deseas salir? Se perderá la sesión actual.';
        return '¿Deseas salir? Se perderá la sesión actual.';
    }
});

/**
 * Detección de orientación del dispositivo
 */
window.addEventListener('orientationchange', () => {
    console.log('📱 Cambio de orientación:', window.orientation);
    if (STATE.isGameRunning) {
        console.log('⚠️ Orientación cambiada - Pausando juego');
        GAME.pause();
    }
});

/**
 * Manejo de errores global
 */
window.addEventListener('error', (e) => {
    console.error('❌ Error:', e.error);
});

/**
 * Promise rejection handler
 */
window.addEventListener('unhandledrejection', (e) => {
    console.error('❌ Promise rechazada:', e.reason);
});

/* ============================================
   Controles por Toque (Touch)
   ============================================ */

// Detectar gestos de deslizamiento
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
    if (!STATE.isGameRunning || STATE.isPaused) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    // Umbral mínimo de deslizamiento (50px)
    const threshold = 50;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Movimiento horizontal
        if (diffX > threshold) {
            GAME.checkResponse('right');
        } else if (diffX < -threshold) {
            GAME.checkResponse('left');
        }
    } else {
        // Movimiento vertical
        if (diffY > threshold) {
            GAME.checkResponse('down');
        } else if (diffY < -threshold) {
            GAME.checkResponse('up');
        }
    }
});

/* ============================================
   Botones de Juego por Pantalla (Opcional)
   ============================================ */

// Crear botones de respuesta virtuales para dispositivos táctiles
if ('ontouchstart' in window) {
    console.log('📱 Dispositivo táctil detectado');
    
    // Los botones virtuales se pueden añadir si es necesario
    // Por ahora usamos gestos de deslizamiento
}

/* ============================================
   Debug/Consola de Desarrollo
   ============================================ */

// Exponer funciones globales para debugging
window.DEBUG = {
    stats: () => {
        console.table(STATE.stats);
        return STATE.stats;
    },
    history: () => {
        console.table(STATS.getHistory());
        return STATS.getHistory();
    },
    overallStats: () => {
        console.table(STATS.getOverallStats());
        return STATS.getOverallStats();
    },
    endGame: () => {
        GAME.endGame();
    },
    skipStimulus: () => {
        GAME.nextStimulus();
    },
    exportHistory: () => {
        STATS.exportHistory();
    },
    clearHistory: () => {
        if (confirm('¿Estás seguro? Esto no se puede deshacer.')) {
            STATS.clearHistory();
            console.log('✅ Historial eliminado');
        }
    },
    setState: (key, value) => {
        STATE[key] = value;
        console.log(`✅ ${key} = ${value}`);
    },
    getState: () => {
        console.table(STATE);
        return STATE;
    }
};

console.log('%c🎮 CMT Training - Modo Desarrollo', 'font-size: 16px; color: #6366f1; font-weight: bold;');
console.log('%cEscribe DEBUG.help() para ver comandos disponibles', 'color: #818cf8;');

DEBUG.help = () => {
    const commands = {
        'DEBUG.stats()': 'Ver estadísticas actuales',
        'DEBUG.history()': 'Ver historial de sesiones',
        'DEBUG.overallStats()': 'Ver estadísticas generales',
        'DEBUG.endGame()': 'Finalizar juego actual',
        'DEBUG.skipStimulus()': 'Saltar al siguiente estímulo',
        'DEBUG.exportHistory()': 'Descargar historial como JSON',
        'DEBUG.clearHistory()': 'Eliminar todo el historial',
        'DEBUG.setState(key, value)': 'Cambiar estado',
        'DEBUG.getState()': 'Ver estado completo'
    };
    console.table(commands);
};
