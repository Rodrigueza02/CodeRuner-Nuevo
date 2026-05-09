// ============================================================
// UI-BRIDGE.JS - Puente entre la UI de Maria y el sistema de Daniel
// ============================================================
// Este script es un "traductor".
// La UI de Maria usa nombres en inglés: 'move', 'turn', 'jump'
// El sistema de Daniel usa nombres en español: 'avanzar', 'girarDerecha', 'saltar'
//
// Este script escucha lo que dice la UI y lo traduce para que
// el action-queue lo entienda.
//
// CÓMO SE USA EN PLAYCANVAS:
//   Agrégalo a la misma entidad GameManager (donde está actionQueue)
//   O a cualquier entidad vacía. No importa dónde, solo necesita existir.
// ============================================================

var UiBridge = pc.createScript('uiBridge');

// ============================================================
// INITIALIZE
// ============================================================
UiBridge.prototype.initialize = function() {
    
    // --- TRADUCCIÓN: UI vieja → Sistema nuevo ---
    // La UI de Maria dispara 'robot:executeSequence' con un array
    // Nosotros lo convertimos a llamadas individuales de 'action:add' + 'action:execute'
    this.app.on('robot:executeSequence', this.onOldExecute, this);
    
    // La UI de Maria dispara 'robot:reset' para reiniciar
    // Lo pasamos directo porque el robot-controller ya lo escucha
    // (No necesita traducción)

    // --- MAPA DE TRADUCCIÓN ---
    // Inglés (UI de Maria) → Español (sistema de Daniel)
    this.translationMap = {
        'move': 'avanzar',
        'turn': 'girarDerecha',
        'jump': 'saltar',
        'wait': 'esperar',
        'state': 'cambiarEstado',
        'turnLeft': 'girarIzquierda',
        'turnRight': 'girarDerecha'
    };

    console.log("[UiBridge] Puente UI inicializado - traduciendo eventos");
};

// ============================================================
// ON OLD EXECUTE - Cuando la UI vieja manda una secuencia completa
// ============================================================
// La UI de Maria manda todo junto: ['move', 'move', 'jump']
// Nosotros lo traducimos y lo pasamos al action-queue
UiBridge.prototype.onOldExecute = function(queue) {
    console.log("[UiBridge] Recibida secuencia de UI: [" + queue.join(", ") + "]");
    
    var self = this;
    
    // Primero limpiar la cola actual
    this.app.fire('action:clear');
    
    // Traducir cada acción y agregarla
    for (var i = 0; i < queue.length; i++) {
        var originalAction = queue[i];
        var translatedAction = this.translationMap[originalAction];
        
        if (translatedAction) {
            this.app.fire('action:add', translatedAction);
        } else {
            console.log("[UiBridge] Acción no reconocida: " + originalAction);
        }
    }
    
    // Ejecutar la secuencia
    this.app.fire('action:execute');
};

// ============================================================
// CLEANUP
// ============================================================
UiBridge.prototype.destroy = function() {
    this.app.off('robot:executeSequence', this.onOldExecute, this);
};
