// ============================================================
// EJEMPLOS DE INTEGRACIÓN - Para Daniel
// ============================================================
// Este archivo contiene ejemplos de código que Daniel puede
// copiar y pegar en sus scripts para disparar eventos de error
// que el sistema de logs narrativos de Helen escuchará.
//
// NO AGREGAR ESTE ARCHIVO A PLAYCANVAS - Solo es referencia
// ============================================================

// ============================================================
// EJEMPLO 1: PHYSICS-CONTROLLER.JS
// ============================================================
// Agregar detección de caída al método update

PhysicsController.prototype.update = function(dt) {
    // ... código existente ...
    
    // NUEVO: Detectar si el robot cayó muy abajo
    var pos = this.entity.getPosition();
    if (pos.y < -10) {
        console.log("[PhysicsController] ¡Robot cayó al vacío!");
        
        // DISPARAR EVENTO PARA HELEN
        this.app.fire('error:detected', {
            type: 'caida',
            data: {
                posicion: pos.clone(),
                altura: pos.y
            }
        });
        
        // Reiniciar posición
        this.resetPosition();
    }
    
    // NUEVO: Detectar si el robot salió de los límites del mapa
    var limiteX = 50;
    var limiteZ = 50;
    if (Math.abs(pos.x) > limiteX || Math.abs(pos.z) > limiteZ) {
        console.log("[PhysicsController] ¡Robot fuera de límites!");
        
        // DISPARAR EVENTO PARA HELEN
        this.app.fire('error:detected', {
            type: 'fueraDeLimites',
            data: {
                posicion: pos.clone(),
                limites: { x: limiteX, z: limiteZ }
            }
        });
        
        // Reiniciar posición
        this.resetPosition();
    }
    
    // ... resto del código existente ...
};

// ============================================================
// EJEMPLO 2: PHYSICS-CONTROLLER.JS - Detección de colisiones
// ============================================================
// Modificar el método onCollisionStart

PhysicsController.prototype.onCollisionStart = function(result) {
    var otherEntity = result.other;
    
    // NUEVO: Detectar colisión con obstáculos
    if (otherEntity.tags && otherEntity.tags.has('obstaculo')) {
        console.log("[PhysicsController] ¡Colisión con obstáculo!");
        
        // DISPARAR EVENTO PARA HELEN
        this.app.fire('error:detected', {
            type: 'colision',
            data: {
                obstaculo: otherEntity.name,
                posicion: this.entity.getPosition().clone()
            }
        });
    }
    
    // ... código existente de detección de suelo ...
    for (var i = 0; i < result.contacts.length; i++) {
        var contact = result.contacts[i];
        if (contact.normal.y > 0.5) {
            this.groundContacts++;
            this.isGrounded = true;
            break;
        }
    }
};

// ============================================================
// EJEMPLO 3: ACTION-QUEUE.JS - Validación de secuencia vacía
// ============================================================
// Modificar el método executeAll

ActionQueue.prototype.executeAll = function() {
    // NUEVO: Validar que la cola no esté vacía
    if (this.queue.length === 0) {
        console.log("[ActionQueue] La cola está vacía");
        
        // DISPARAR EVENTO PARA HELEN
        this.app.fire('error:detected', {
            type: 'secuenciaVacia',
            data: {
                mensaje: 'El jugador intentó ejecutar sin comandos'
            }
        });
        
        return; // No continuar
    }

    // ... resto del código existente ...
    
    console.log("[ActionQueue] === INICIANDO EJECUCIÓN ===");
    this.isExecuting = true;
    this.currentIndex = 0;
    this.timer = 0;
    this.app.fire('queue:executionStarted');
    this.executeCurrentAction();
};

// ============================================================
// EJEMPLO 4: ACTION-QUEUE.JS - Validación de secuencia muy larga
// ============================================================
// Modificar el método addAction

ActionQueue.prototype.addAction = function(actionName) {
    if (this.isExecuting) {
        console.log("[ActionQueue] No puedes agregar acciones mientras se ejecuta");
        return;
    }

    var validActions = ['avanzar', 'saltar', 'girarDerecha', 'girarIzquierda', 'esperar', 'cambiarEstado'];
    if (validActions.indexOf(actionName) === -1) {
        console.log("[ActionQueue] Acción no válida: " + actionName);
        return;
    }

    // Agregar al array
    this.queue.push(actionName);
    
    // NUEVO: Detectar si es el primer comando (para mensaje educativo)
    if (this.queue.length === 1) {
        this.app.fire('info:detected', {
            type: 'primerComando',
            data: {
                comando: actionName
            }
        });
    }
    
    // NUEVO: Advertir si la secuencia es muy larga
    if (this.queue.length > 20) {
        this.app.fire('error:detected', {
            type: 'secuenciaMuyLarga',
            data: {
                cantidadComandos: this.queue.length,
                limite: 20
            }
        });
    }

    this.app.fire('queue:updated', this.queue);
    console.log("[ActionQueue] Acción agregada: " + actionName);
};

// ============================================================
// EJEMPLO 5: ACTION-QUEUE.JS - Nivel completado
// ============================================================
// Agregar al método finishExecution

ActionQueue.prototype.finishExecution = function() {
    this.isExecuting = false;
    this.currentIndex = 0;

    console.log("[ActionQueue] === SECUENCIA COMPLETADA ===");
    this.app.fire('queue:executionFinished');
    
    // NUEVO: Verificar si el robot llegó a la meta
    // (esto requiere que tengas una forma de detectar si está en la meta)
    // Por ejemplo, podrías tener una variable global o un evento
    if (this.robotEnMeta) {
        this.app.fire('success:detected', {
            type: 'nivelCompletado',
            data: {
                comandosUsados: this.queue.length,
                tiempo: this.tiempoTotal
            }
        });
    }
};

// ============================================================
// EJEMPLO 6: STATE-MANAGER.JS - Cambio de estado
// ============================================================
// Modificar el método changeState

StateManager.prototype.changeState = function() {
    this.stateIndex++;
    if (this.stateIndex >= this.states.length) {
        this.stateIndex = 0;
    }

    var previousState = this.currentState;
    this.currentState = this.states[this.stateIndex];

    console.log("[StateManager] Estado cambiado: " + previousState + " → " + this.currentState);

    // NUEVO: Mensaje educativo en el primer cambio de estado
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

    this.applyState();
};

// NUEVO: Agregar esta variable en el initialize
StateManager.prototype.initialize = function() {
    // ... código existente ...
    
    this.primerCambioRealizado = false; // AGREGAR ESTA LÍNEA
    
    // ... resto del código ...
};

// ============================================================
// EJEMPLO 7: STATE-PLATFORM.JS - Plataforma inactiva
// ============================================================
// Si tienes un script de plataforma que detecta cuando el robot
// intenta pararse en una plataforma del estado incorrecto

StatePlatform.prototype.onTriggerEnter = function(entity) {
    if (entity.name === 'Playbot' || entity.tags.has('robot')) {
        var robotState = entity.script.stateManager.getState();
        
        // NUEVO: Verificar si el estado es correcto
        if (robotState !== this.platformState) {
            console.log("[StatePlatform] Estado incorrecto");
            
            // DISPARAR EVENTO PARA HELEN
            this.app.fire('error:detected', {
                type: 'estadoIncorrecto',
                data: {
                    estadoRobot: robotState,
                    estadoPlataforma: this.platformState
                }
            });
        }
    }
};

// ============================================================
// EJEMPLO 8: ZONA DE META - Detectar objetivo alcanzado
// ============================================================
// Crear un nuevo script para la zona de meta

var MetaZone = pc.createScript('metaZone');

MetaZone.prototype.initialize = function() {
    // Escuchar cuando el robot entra en la zona
    this.entity.collision.on('triggerenter', this.onTriggerEnter, this);
};

MetaZone.prototype.onTriggerEnter = function(entity) {
    if (entity.name === 'Playbot' || entity.tags.has('robot')) {
        console.log("[MetaZone] ¡Robot llegó a la meta!");
        
        // DISPARAR EVENTO DE ÉXITO PARA HELEN
        this.app.fire('success:detected', {
            type: 'objetivoAlcanzado',
            data: {
                posicion: entity.getPosition().clone(),
                tiempo: Date.now() - this.tiempoInicio
            }
        });
        
        // Opcional: Disparar también el evento de nivel completado
        this.app.fire('success:detected', {
            type: 'nivelCompletado',
            data: {
                tiempo: Date.now() - this.tiempoInicio
            }
        });
    }
};

// ============================================================
// EJEMPLO 9: ROBOT-CONTROLLER.JS - Detección de errores
// ============================================================
// Si usas robot-controller.js en lugar de physics-controller.js

RobotController.prototype.update = function(dt) {
    // ... código existente de movimiento ...
    
    // NUEVO: Detectar caída (similar a physics-controller)
    var pos = this.entity.getPosition();
    if (pos.y < -10) {
        this.app.fire('error:detected', {
            type: 'caida',
            data: { posicion: pos.clone() }
        });
        this.resetPosition();
    }
};

/*
ERRORES:
- 'caida' - Robot cae al vacío
- 'colision' - Robot choca con obstáculo
- 'fueraDeLimites' - Robot sale del área
- 'secuenciaVacia' - No hay comandos
- 'secuenciaMuyLarga' - Demasiados comandos
- 'estadoIncorrecto' - Estado equivocado
- 'plataformaInactiva' - Plataforma no activa

ÉXITOS:
- 'nivelCompletado' - Nivel completado
- 'objetivoAlcanzado' - Robot llegó a la meta

INFO:
- 'primerComando' - Primer comando agregado
- 'primerCambioEstado' - Primer cambio de estado

FORMATO PARA DISPARAR:
this.app.fire('error:detected', {
    type: 'nombreDelTipo',
    data: { ... datos opcionales ... }
});

this.app.fire('success:detected', {
    type: 'nombreDelTipo',
    data: { ... datos opcionales ... }
});

this.app.fire('info:detected', {
    type: 'nombreDelTipo',
    data: { ... datos opcionales ... }
});
*/
