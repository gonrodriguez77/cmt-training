/* ============================================
   Sistema de Estímulos
   ============================================ */

const STIMULI = {
    // Almacena el estímulo actual
    currentStimulus: null,
    currentDirection: null,
    stimulusStartTime: null,

    /**
     * Genera un nuevo estímulo aleatorio
     */
    generate() {
        // Evitar repetir la misma dirección dos veces seguidas
        let direction = this.getRandomDirection();
        while (direction === STATE.stats.lastDirection) {
            direction = this.getRandomDirection();
        }

        STATE.stats.lastDirection = STATE.stats.currentDirection;
        STATE.stats.currentDirection = direction;
        this.currentDirection = direction;
        this.currentStimulus = {
            direction: direction,
            timestamp: Date.now(),
            type: STATE.selectedStimuli
        };

        return this.currentStimulus;
    },

    /**
     * Obtiene una dirección aleatoria
     */
    getRandomDirection() {
        const directions = Object.keys(CONFIG.directions);
        return directions[Math.floor(Math.random() * directions.length)];
    },

    /**
     * Muestra el estímulo visual
     */
    displayVisual(direction) {
        const arrow = document.getElementById('arrow');
        const visualStimulus = document.getElementById('visualStimulus');
        const audioIndicator = document.getElementById('audioIndicator');

        if (!arrow) return;

        // Ocultar indicador de audio
        if (audioIndicator) {
            audioIndicator.classList.add('hidden');
        }

        // Mostrar flecha
        arrow.textContent = CONFIG.directions[direction].symbol;
        visualStimulus.style.display = 'flex';

        // Actualizar instrucción
        this.updateInstructionText(direction, 'visual');

        console.log(`📍 Estímulo visual: ${direction}`);
    },

    /**
     * Muestra el estímulo auditivo
     */
    displayAudio(direction) {
        const audioIndicator = document.getElementById('audioIndicator');
        const audioText = document.getElementById('audioText');
        const visualStimulus = document.getElementById('visualStimulus');

        // Ocultar visual
        if (visualStimulus) {
            visualStimulus.style.display = 'none';
        }

        // Mostrar indicador de audio
        if (audioIndicator) {
            audioIndicator.classList.remove('hidden');
        }

        // Actualizar texto
        if (audioText) {
            audioText.textContent = CONFIG.directions[direction].name;
        }

        // Reproducir comando de voz
        AUDIO.speakDirection(direction);

        // Actualizar instrucción
        this.updateInstructionText(direction, 'audio');

        console.log(`🔊 Estímulo auditivo: ${direction}`);
    },

    /**
     * Muestra estímulo mixto (aleatorio: visual o auditivo)
     */
    displayMixed(direction) {
        const isMixed = Math.random() > 0.5;

        if (isMixed) {
            this.displayAudio(direction);
        } else {
            this.displayVisual(direction);
        }

        console.log(`🔀 Estímulo mixto: ${direction} (${isMixed ? 'audio' : 'visual'})`);
    },

    /**
     * Muestra el estímulo según su tipo
     */
    display(direction) {
        const type = STATE.selectedStimuli;

        switch (type) {
            case 'visual':
                this.displayVisual(direction);
                break;
            case 'audio':
                this.displayAudio(direction);
                break;
            case 'mixed':
                this.displayMixed(direction);
                break;
            default:
                this.displayVisual(direction);
        }

        // Marcar tiempo de inicio del estímulo
        this.stimulusStartTime = Date.now();
    },

    /**
     * Actualiza el texto de instrucción
     */
    updateInstructionText(direction, type) {
        const instructionText = document.getElementById('instructionText');
        if (!instructionText) return;

        const directionName = CONFIG.directions[direction].name;
        instructionText.textContent = `${type === 'audio' ? '🔊' : '👁️'} ${directionName}`;
    },

    /**
     * Oculta el estímulo actual
     */
    hide() {
        const visualStimulus = document.getElementById('visualStimulus');
        const audioIndicator = document.getElementById('audioIndicator');

        if (visualStimulus) {
            visualStimulus.style.display = 'none';
        }

        if (audioIndicator) {
            audioIndicator.classList.add('hidden');
        }

        this.currentStimulus = null;
        this.currentDirection = null;
    },

    /**
     * Calcula el tiempo de reacción desde el estímulo
     */
    calculateReactionTime() {
        if (!this.stimulusStartTime) return 0;
        return Date.now() - this.stimulusStartTime;
    },

    /**
     * Genera próximo estímulo con intervalo basado en dificultad
     */
    scheduleNext() {
        // Limpiar timer anterior
        if (STATE.timers.stimuliTimer) {
            clearTimeout(STATE.timers.stimuliTimer);
        }

        const interval = getNextStimuliInterval();

        STATE.timers.stimuliTimer = setTimeout(() => {
            if (STATE.isGameRunning && !STATE.isPaused) {
                const stimulus = this.generate();
                this.display(stimulus.direction);
                STATE.stats.totalInstructions++;

                // Programar el siguiente
                this.scheduleNext();
            }
        }, interval);
    }
};
