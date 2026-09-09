/* ============================================
   Sistema de Estadísticas
   ============================================ */

const STATS = {
    /**
     * Registra un acierto
     */
    recordHit(reactionTime) {
        STATE.stats.hits++;
        STATE.stats.reactionTimes.push(reactionTime);
        
        // Actualizar velocidad máxima
        if (reactionTime < STATE.stats.maxSpeed || STATE.stats.maxSpeed === 0) {
            STATE.stats.maxSpeed = reactionTime;
        }

        AUDIO.playSuccess();
        this.updateUI();
    },

    /**
     * Registra un error
     */
    recordError() {
        STATE.stats.errors++;
        AUDIO.playError();
        this.updateUI();
    },

    /**
     * Calcula la precisión
     */
    calculateAccuracy() {
        if (STATE.stats.totalInstructions === 0) return 0;
        return (STATE.stats.hits / STATE.stats.totalInstructions) * 100;
    },

    /**
     * Calcula el tiempo promedio de reacción
     */
    calculateAverageReactionTime() {
        if (STATE.stats.reactionTimes.length === 0) return 0;
        const sum = STATE.stats.reactionTimes.reduce((a, b) => a + b, 0);
        return sum / STATE.stats.reactionTimes.length;
    },

    /**
     * Actualiza la interfaz con estadísticas
     */
    updateUI() {
        const hitsElement = document.getElementById('hits');
        const errorsElement = document.getElementById('errors');

        if (hitsElement) {
            hitsElement.textContent = STATE.stats.hits;
        }

        if (errorsElement) {
            errorsElement.textContent = STATE.stats.errors;
        }
    },

    /**
     * Genera resumen de sesión
     */
    generateSessionSummary() {
        const accuracy = this.calculateAccuracy();
        const avgReactionTime = this.calculateAverageReactionTime();

        return {
            duration: STATE.selectedDuration,
            difficulty: CONFIG.difficulties[STATE.selectedDifficulty].name,
            stimuliType: CONFIG.stimuliTypes[STATE.selectedStimuli],
            totalInstructions: STATE.stats.totalInstructions,
            hits: STATE.stats.hits,
            errors: STATE.stats.errors,
            accuracy: accuracy.toFixed(1),
            averageReactionTime: avgReactionTime,
            maxSpeed: STATE.stats.maxSpeed,
            timestamp: new Date().toISOString()
        };
    },

    /**
     * Guarda la sesión en el historial
     */
    saveSesion() {
        const summary = this.generateSessionSummary();
        
        try {
            let history = JSON.parse(localStorage.getItem('cmtTrainingHistory')) || [];
            history.push(summary);
            
            // Mantener solo las últimas 50 sesiones
            if (history.length > 50) {
                history = history.slice(-50);
            }
            
            localStorage.setItem('cmtTrainingHistory', JSON.stringify(history));
            console.log('✅ Sesión guardada en historial');
            
            return summary;
        } catch (e) {
            console.warn('⚠️ No se pudo guardar la sesión:', e);
            return summary;
        }
    },

    /**
     * Obtiene el historial de sesiones
     */
    getHistory() {
        try {
            return JSON.parse(localStorage.getItem('cmtTrainingHistory')) || [];
        } catch (e) {
            console.warn('⚠️ No se pudo cargar el historial:', e);
            return [];
        }
    },

    /**
     * Obtiene estadísticas generales
     */
    getOverallStats() {
        const history = this.getHistory();
        
        if (history.length === 0) {
            return {
                totalSessions: 0,
                totalInstructions: 0,
                averageAccuracy: 0,
                bestAccuracy: 0,
                bestReactionTime: 0,
                averageReactionTime: 0
            };
        }

        const totalSessions = history.length;
        const totalInstructions = history.reduce((sum, s) => sum + s.totalInstructions, 0);
        const accuracies = history.map(s => parseFloat(s.accuracy));
        const averageAccuracy = accuracies.reduce((a, b) => a + b, 0) / accuracies.length;
        const bestAccuracy = Math.max(...accuracies);
        const reactionTimes = history
            .filter(s => s.averageReactionTime > 0)
            .map(s => s.averageReactionTime);
        const bestReactionTime = reactionTimes.length > 0 ? Math.min(...reactionTimes) : 0;
        const averageReactionTime = reactionTimes.length > 0 
            ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length 
            : 0;

        return {
            totalSessions,
            totalInstructions,
            averageAccuracy: averageAccuracy.toFixed(1),
            bestAccuracy: bestAccuracy.toFixed(1),
            bestReactionTime: bestReactionTime.toFixed(2),
            averageReactionTime: averageReactionTime.toFixed(2)
        };
    },

    /**
     * Limpia el historial de sesiones
     */
    clearHistory() {
        try {
            localStorage.removeItem('cmtTrainingHistory');
            console.log('✅ Historial eliminado');
        } catch (e) {
            console.warn('⚠️ No se pudo limpiar el historial:', e);
        }
    },

    /**
     * Exporta el historial como JSON
     */
    exportHistory() {
        const history = this.getHistory();
        const data = JSON.stringify(history, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cmt-training-history-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
};

/**
 * Muestra las estadísticas en la pantalla de resultados
 */
function displayResults(summary) {
    document.getElementById('resultDuration').textContent = summary.duration + 's';
    document.getElementById('resultDifficulty').textContent = summary.difficulty;
    document.getElementById('resultTotal').textContent = summary.totalInstructions;
    document.getElementById('resultHits').textContent = summary.hits;
    document.getElementById('resultErrors').textContent = summary.errors;
    document.getElementById('resultAccuracy').textContent = summary.accuracy + '%';
    document.getElementById('resultReactionTime').textContent = summary.averageReactionTime.toFixed(2) + 's';
    document.getElementById('resultMaxSpeed').textContent = summary.maxSpeed.toFixed(2) + 's';
}
