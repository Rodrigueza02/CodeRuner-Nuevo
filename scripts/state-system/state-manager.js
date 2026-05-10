// ============================================================
// STATE-MANAGER.JS - Sistema de Estados del Robot
// ============================================================
// Este script controla los "estados" del robot.
// 
// ¿QUÉ ES UN ESTADO? (explicación simple):
//   Imagina que el robot tiene un "modo":
//   - Modo ROJO: puede romper paredes rojas, pero no puede pasar por puertas azules
//   - Modo AZUL: puede pasar por puertas azules, pero no puede romper paredes rojas
//   
//   El jugador tiene que cambiar de estado en el momento correcto
//   para resolver el puzzle.
//
// CÓMO FUNCIONA:
//   1. El robot empieza en un estado (por defecto: AZUL)
//   2. Cuando el jugador usa el comando "cambiarEstado", el robot
//      cambia al siguiente estado (AZUL → ROJO → AZUL → ...)
//   3. Cada estado cambia el color del robot y activa/desactiva
//      plataformas del mismo color
//
// CÓMO SE USA EN PLAYCANVAS:
//   1. Agrégalo a la entidad del Robot (Playbot)
//   2. Asigna los materiales rojo y azul en el Inspector
//   3. Las plataformas que reaccionan al estado deben tener
//      el script "state-platform.js"
// ============================================================

var StateManager = pc.createScript('stateManager');

// --- ATRIBUTOS ---
StateManager.attributes.add('startState', {
    type: 'string',
    default: 'azul',
    title: 'Estado inicial'
});

StateManager.attributes.add('blueMaterial', {
    type: 'asset',
    assetType: 'material',
    title: 'Material Azul'
});

StateManager.attributes.add('redMaterial', {
    type: 'asset',
    assetType: 'material',
    title: 'Material Rojo'
});

// ============================================================
// INITIALIZE
// ============================================================
StateManager.prototype.initialize = function() {
    // Estado actual del robot
    this.currentState = this.startState;

    // Lista de estados disponibles (fácil de agregar más después)
    this.states = ['azul', 'rojo'];

    // Índice del estado actual en la lista
    this.stateIndex = this.states.indexOf(this.currentState);
    if (this.stateIndex === -1) this.stateIndex = 0;
    
    // INTEGRACIÓN HELEN: Variable para detectar primer cambio de estado
    this.primerCambioRealizado = false;

    // --- ESCUCHAR EVENTOS ---
    // Cuando el action-queue manda "cambiarEstado"
    this.app.on('robot:stateChange', this.changeState, this);

    // Cuando se reinicia el juego
    this.app.on('robot:reset', this.resetState, this);

    // Aplicar el estado inicial
    this.applyState();

    console.log("[StateManager] Sistema de estados inicializado. Estado: " + this.currentState);
};

// ============================================================
// CHANGE STATE - Cambiar al siguiente estado
// ============================================================
StateManager.prototype.changeState = function() {
    // Avanzar al siguiente estado en la lista
    this.stateIndex++;

    // Si llegamos al final, volver al primero (ciclo)
    if (this.stateIndex >= this.states.length) {
        this.stateIndex = 0;
    }

    // Actualizar el estado actual
    var previousState = this.currentState;
    this.currentState = this.states[this.stateIndex];

    console.log("[StateManager] Estado cambiado: " + previousState + " → " + this.currentState);
    
    // INTEGRACIÓN HELEN: Mensaje educativo en el primer cambio de estado
    if (!this.primerCambioRealizado) {
        this.primerCambioRealizado = true;
        this.app.fire('info:detected', {
            type: 'primerCambioEstado',
            data: {
                estadoAnterior: previousState,
                estadoNuevo: this.currentState
            }
        });
    }

    // Aplicar los cambios visuales y de gameplay
    this.applyState();
};

// ============================================================
// APPLY STATE - Aplicar los efectos del estado actual
// ============================================================
StateManager.prototype.applyState = function() {
    // 1. Cambiar el color/material del robot
    this.updateRobotVisual();

    // 2. Avisar a todas las plataformas que el estado cambió
    //    (ellas deciden si activarse o desactivarse)
    this.app.fire('state:changed', this.currentState);

    // 3. Avisar a la UI para que muestre el estado actual
    this.app.fire('ui:stateUpdate', this.currentState);
};

// ============================================================
// UPDATE ROBOT VISUAL - Cambiar la apariencia del robot
// ============================================================
StateManager.prototype.updateRobotVisual = function() {
    // Buscar el componente de render/model del robot
    var modelComponent = this.entity.model || this.entity.render;

    if (!modelComponent) {
        console.log("[StateManager] No se encontró componente de modelo");
        return;
    }

    var material = null;

    if (this.currentState === 'azul' && this.blueMaterial) {
        material = this.blueMaterial.resource;
    } else if (this.currentState === 'rojo' && this.redMaterial) {
        material = this.redMaterial.resource;
    }

    if (material) {
        // Aplicar el material a todos los meshes del modelo
        var meshInstances = modelComponent.meshInstances;
        if (meshInstances) {
            for (var i = 0; i < meshInstances.length; i++) {
                meshInstances[i].material = material;
            }
        }
        console.log("[StateManager] Visual actualizado a: " + this.currentState);
    } else {
        console.log("[StateManager] No hay material asignado para estado: " + this.currentState);
    }
};

// ============================================================
// GET STATE - Obtener el estado actual (para otros scripts)
// ============================================================
StateManager.prototype.getState = function() {
    return this.currentState;
};

// ============================================================
// RESET STATE - Volver al estado inicial
// ============================================================
StateManager.prototype.resetState = function() {
    this.currentState = this.startState;
    this.stateIndex = this.states.indexOf(this.currentState);
    if (this.stateIndex === -1) this.stateIndex = 0;

    this.applyState();
    console.log("[StateManager] Estado reiniciado a: " + this.currentState);
};

// ============================================================
// CLEANUP
// ============================================================
StateManager.prototype.destroy = function() {
    this.app.off('robot:stateChange', this.changeState, this);
    this.app.off('robot:reset', this.resetState, this);
};
