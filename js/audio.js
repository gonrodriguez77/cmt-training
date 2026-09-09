/* ============================================
   Sistema de Audio
   ============================================ */

const AUDIO = {
    // Contexto de audio
    audioContext: null,
    
    // Sintetizador de voz
    synth: window.speechSynthesis,
    
    // Sonidos precargados
    sounds: {},

    /**
     * Inicializa el sistema de audio
     */
    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('✅ Sistema de audio inicializado');
        } catch (e) {
            console.warn('⚠️ No se pudo inicializar Web Audio API:', e);
        }
    },

    /**
     * Reproduce un sonido de confirmación
     */
    playSuccess() {
        if (!STATE.soundEnabled) return;
        this.playTone(800, 150);
    },

    /**
     * Reproduce un sonido de error
     */
    playError() {
        if (!STATE.soundEnabled) return;
        this.playTone(400, 300);
    },

    /**
     * Reproduce un sonido de alerta
     */
    playAlert() {
        if (!STATE.soundEnabled) return;
        this.playTone(1000, 200);
    },

    /**
     * Reproduce un tono usando oscilador
     */
    playTone(frequency, duration) {
        if (!this.audioContext) return;

        const now = this.audioContext.currentTime;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration / 1000);

        oscillator.start(now);
        oscillator.stop(now + duration / 1000);
    },

    /**
     * Reproduce secuencia de tonos (arpeggio)
     */
    playArpeggio(ascending = true) {
        if (!STATE.soundEnabled) return;

        const frequencies = ascending 
            ? [523.25, 659.25, 783.99]  // Do, Mi, Sol
            : [783.99, 659.25, 523.25]; // Sol, Mi, Do

        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                this.playTone(freq, 150);
            }, index * 150);
        });
    },

    /**
     * Reproduce comando de voz
     */
    speak(text, language = 'es-ES') {
        if (!STATE.soundEnabled || !this.synth) return;

        // Cancelar cualquier síntesis en curso
        this.synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;

        this.synth.speak(utterance);
    },

    /**
     * Reproduce comando para una dirección
     */
    speakDirection(direction) {
        if (!STATE.soundEnabled) return;

        const directionName = CONFIG.directions[direction].name;
        this.speak(`¡${directionName}!`, 'es-ES');
    },

    /**
     * Reproduce instrucción de inicio
     */
    speakStart() {
        this.speak('¡Preparado! ¡Comienza!', 'es-ES');
    },

    /**
     * Reproduce instrucción de fin
     */
    speakEnd() {
        this.speak('¡Sesión finalizada!', 'es-ES');
    },

    /**
     * Comprueba si el navegador soporta síntesis de voz
     */
    isSpeechSynthesisSupported() {
        return !!this.synth;
    },

    /**
     * Obtiene voces disponibles
     */
    getAvailableVoices() {
        return this.synth ? this.synth.getVoices() : [];
    }
};

// Inicializar audio cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    AUDIO.init();
});

// Escuchar cambios en voces disponibles
if (AUDIO.synth) {
    AUDIO.synth.onvoiceschanged = () => {
        console.log('✅ Voces disponibles actualizadas');
    };
}
