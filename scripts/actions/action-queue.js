// ============================================================
// ACTION-QUEUE.JS - Sistema de Cola de Acciones
// ============================================================
// Este script es el "cerebro" del robot.
// Se encarga de:
//   1. Guardar las acciones que el jugador elige (en un array)
//   2. Ejecutarlas en orden, una por una
//   3. Controlar el tiempo entre cada acción
//   4. Avisar cuando la secuencia termina
//
// CÓMO FUNCIONA (explicación simple):
//   Imagina que tienes una lista de tareas:
//   ["avanzar", "avanzar", "saltar", "girarDerecha"]
//   Este script lee la lista desde el inicio, hace la primera,
//   espera 1 segundo, hace la segunda, espera, y así hasta terminar.
//
// CÓMO SE USA EN PLAYCANVAS:
//   1. Crea una entidad vacía llamada "GameManager" (o usa una existente)
//   2. Agrégale este script como componente
//   3. Este script escucha eventos de la UI para saber qué botón presionó el jugador
// ============================================================

var ActionQueue = pc.createScript('actionQueue');

// --- ATRIBUTOS (se ven en el editor de PlayCanvas) ---
ActionQueue.attributes.add('timeBetweenActions', {
    type: 'number',
    default: 1,
    title: 'Tiempo entre acciones (segundos)',
    description: 'Cuántos segundos espera el robot entre cada acción'
});

// ============================================================
// INITIALIZE - Se ejecuta UNA sola vez cuando el juego arranca
// ============================================================
ActionQueue.prototype.initialize = function() {
    // --- El array donde se guardan las acciones ---
    // Esto es como una lista de compras: vacía al inicio
    this.queue = [];

    // --- Estado: ¿está ejecutando acciones ahora mismo? ---
    this.isExecuting = false;

    // --- Índice actual: ¿en qué acción va? ---
    this.currentIndex = 0;

    // --- Timer interno para controlar el tiempo ---
    this.timer = 0;
    this.waitTime = this.timeBetweenActions;

    // ============================================================
    // EVENTOS QUE ESCUCHA (la UI le manda estos mensajes)
    // ============================================================

    // Cuando el jugador presiona un botón de acción en la UI
    this.app.on('action:add', this.addAction, this);

    // Cuando el jugador presiona "EJECUTAR"
    this.app.on('action:execute', this.executeAll, this);

    // Cuando el jugador presiona "REINICIAR" o "LIMPIAR"
    this.app.on('action:clear', this.clearQueue, this);

    // Cuando se quiere quitar la última acción agregada
    this.app.on('action:undo', this.undoLast, this);

    console.log("[ActionQueue] Sistema de acciones inicializado");
};

// ============================================================
// ADD ACTION - Agrega una acción a la cola
// ============================================================
// Recibe un string como: "avanzar", "saltar", "girarDerecha", etc.
// Es como agregar un paso más a tu lista de instrucciones.
ActionQueue.prototype.addAction = function(actionName) {
    // Solo agregar si NO está ejecutando
    if (this.isExecuting) {
        console.log("[ActionQueue] No puedes agregar acciones mientras se ejecuta");
        return;
    }

    // Validar que la acción sea válida
    var validActions = ['avanzar', 'saltar', 'girarDerecha', 'girarIzquierda', 'esperar', 'cambiarEstado'];

    if (validActions.indexOf(actionName) === -1) {
        console.log("[ActionQueue] Acción no válida: " + actionName);
        return;
    }

    // Agregar al array
    this.queue.push(actionName);
    
    // INTEGRACIÓN HELEN: Detectar si es el primer comando
    if (this.queue.length === 1) {
        this.app.fire('info:detected', {
            type: 'primerComando',
            data: {
                comando: actionName
            }
        });
    }
    
    // INTEGRACIÓN HELEN: Advertir si la secuencia es muy larga
    if (this.queue.length > 20) {
        this.app.fire('error:detected', {
            type: 'secuenciaMuyLarga',
            data: {
                cantidadComandos: this.queue.length,
                limite: 20
            }
        });
    }

    // Avisar a la UI que se agregó (para que muestre la cápsula)
    this.app.fire('queue:updated', this.queue);

    console.log("[ActionQueue] Acción agregada: " + actionName + " | Cola: [" + this.queue.join(", ") + "]");
};

// ============================================================
// EXECUTE ALL - Empieza a ejecutar toda la cola
// ============================================================
ActionQueue.prototype.executeAll = function() {
    // Si la cola está vacía, no hacer nada
    if (this.queue.length === 0) {
        console.log("[ActionQueue] La cola está vacía, nada que ejecutar");
        
        // INTEGRACIÓN HELEN: Disparar evento de secuencia vacía
        this.app.fire('error:detected', {
            type: 'secuenciaVacia',
            data: {
                mensaje: 'El jugador intentó ejecutar sin comandos'
            }
        });
        
        return;
    }

    // Si ya está ejecutando, no hacer nada
    if (this.isExecuting) {
        console.log("[ActionQueue] Ya se está ejecutando una secuencia");
        return;
    }

    console.log("[ActionQueue] === INICIANDO EJECUCIÓN ===");
    console.log("[ActionQueue] Acciones a ejecutar: [" + this.queue.join(", ") + "]");

    this.isExecuting = true;
    this.currentIndex = 0;
    this.timer = 0;

    // Avisar que empezó la ejecución
    this.app.fire('queue:executionStarted');

    // Ejecutar la primera acción inmediatamente
    this.executeCurrentAction();
};

// ============================================================
// EXECUTE CURRENT ACTION - Ejecuta la acción actual
// ============================================================
ActionQueue.prototype.executeCurrentAction = function() {
    if (this.currentIndex >= this.queue.length) {
        // Ya terminó todas las acciones
        this.finishExecution();
        return;
    }

    var action = this.queue[this.currentIndex];

    console.log("[ActionQueue] Ejecutando [" + (this.currentIndex + 1) + "/" + this.queue.length + "]: " + action);

    // Avisar al robot qué acción hacer
    // El script robot-controller.js escucha este evento
    this.app.fire('robot:doAction', action);

    // Avisar a la UI qué acción se está ejecutando (para resaltarla)
    this.app.fire('queue:actionExecuting', this.currentIndex);
};

// ============================================================
// UPDATE - Se ejecuta CADA FRAME (60 veces por segundo)
// ============================================================
ActionQueue.prototype.update = function(dt) {
    // Si no está ejecutando, no hacer nada
    if (!this.isExecuting) return;

    // Sumar el tiempo que ha pasado
    this.timer += dt;

    // Si ya pasó el tiempo de espera, pasar a la siguiente acción
    if (this.timer >= this.waitTime) {
        this.timer = 0;
        this.currentIndex++;
        this.executeCurrentAction();
    }
};

// ============================================================
// FINISH EXECUTION - Cuando termina toda la secuencia
// ============================================================
ActionQueue.prototype.finishExecution = function() {
    this.isExecuting = false;
    this.currentIndex = 0;

    console.log("[ActionQueue] === SECUENCIA COMPLETADA ===");

    // Avisar que terminó
    this.app.fire('queue:executionFinished');
};

// ============================================================
// CLEAR QUEUE - Limpia toda la cola
// ============================================================
ActionQueue.prototype.clearQueue = function() {
    if (this.isExecuting) {
        console.log("[ActionQueue] No puedes limpiar mientras se ejecuta");
        return;
    }

    this.queue = [];
    this.currentIndex = 0;

    // Avisar a la UI
    this.app.fire('queue:updated', this.queue);

    console.log("[ActionQueue] Cola limpiada");
};

// ============================================================
// UNDO LAST - Quita la última acción agregada
// ============================================================
ActionQueue.prototype.undoLast = function() {
    if (this.isExecuting) return;
    if (this.queue.length === 0) return;

    var removed = this.queue.pop();
    this.app.fire('queue:updated', this.queue);

    console.log("[ActionQueue] Acción removida: " + removed);
};

// ============================================================
// GET QUEUE - Devuelve la cola actual (útil para debug)
// ============================================================
ActionQueue.prototype.getQueue = function() {
    return this.queue.slice(); // Devuelve una copia, no el original
};

// ============================================================
// CLEANUP - Limpia eventos cuando se destruye
// ============================================================
ActionQueue.prototype.destroy = function() {
    this.app.off('action:add', this.addAction, this);
    this.app.off('action:execute', this.executeAll, this);
    this.app.off('action:clear', this.clearQueue, this);
    this.app.off('action:undo', this.undoLast, this);
};
