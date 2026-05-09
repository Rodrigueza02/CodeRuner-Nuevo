// ============================================================
// ROBOT-CONTROLLER.JS - Controlador de Movimiento del Robot
// ============================================================
// Este script son las "piernas" del robot.
// Se encarga de:
//   1. Escuchar qué acción le manda el cerebro (action-queue.js)
//   2. Mover el robot físicamente en la escena
//   3. Hacer las animaciones de cada acción
//
// CÓMO FUNCIONA (explicación simple):
//   El cerebro (action-queue) le dice "avanzar" y este script
//   mueve al robot hacia adelante. Le dice "saltar" y este
//   script lo hace brincar. Así de simple.
//
// CÓMO SE USA EN PLAYCANVAS:
//   1. Selecciona la entidad del Robot (el modelo 3D)
//   2. Agrégale este script como componente
//   3. Ajusta la velocidad y distancia en el Inspector
// ============================================================

var RobotController = pc.createScript('robotController');

// --- ATRIBUTOS (se ven en el editor de PlayCanvas) ---
RobotController.attributes.add('moveDistance', {
    type: 'number',
    default: 2,
    title: 'Distancia de movimiento',
    description: 'Cuántas unidades avanza el robot con cada "avanzar"'
});

RobotController.attributes.add('jumpHeight', {
    type: 'number',
    default: 2,
    title: 'Altura del salto',
    description: 'Qué tan alto salta el robot'
});

RobotController.attributes.add('turnAngle', {
    type: 'number',
    default: 90,
    title: 'Ángulo de giro',
    description: 'Cuántos grados gira el robot (normalmente 90)'
});

RobotController.attributes.add('moveSpeed', {
    type: 'number',
    default: 4,
    title: 'Velocidad de movimiento',
    description: 'Qué tan rápido se mueve el robot (unidades por segundo)'
});

// ============================================================
// INITIALIZE - Se ejecuta UNA sola vez al inicio
// ============================================================
RobotController.prototype.initialize = function() {
    // Guardar posición y rotación inicial (para reiniciar)
    this.startPosition = this.entity.getPosition().clone();
    this.startRotation = this.entity.getEulerAngles().clone();

    // --- Estado de movimiento ---
    this.isMoving = false;       // ¿Se está moviendo ahora?
    this.targetPosition = null;  // ¿A dónde va?
    this.targetRotation = null;  // ¿A qué ángulo gira?
    this.isJumping = false;      // ¿Está saltando?
    this.jumpPhase = 0;          // Fase del salto (subir/bajar)
    this.jumpStartY = 0;        // Desde dónde empezó el salto

    // ============================================================
    // EVENTO PRINCIPAL: Escucha las órdenes del cerebro
    // ============================================================
    this.app.on('robot:doAction', this.onAction, this);

    // Evento para reiniciar posición
    this.app.on('robot:reset', this.resetPosition, this);

    console.log("[RobotController] Robot listo en posición: " +
        this.startPosition.x.toFixed(1) + ", " +
        this.startPosition.y.toFixed(1) + ", " +
        this.startPosition.z.toFixed(1));
};

// ============================================================
// ON ACTION - Recibe una orden y la ejecuta
// ============================================================
RobotController.prototype.onAction = function(action) {
    console.log("[RobotController] Recibí orden: " + action);

    switch (action) {
        case 'avanzar':
            this.doMove();
            break;
        case 'saltar':
            this.doJump();
            break;
        case 'girarDerecha':
            this.doTurn(-this.turnAngle); // Negativo = derecha
            break;
        case 'girarIzquierda':
            this.doTurn(this.turnAngle); // Positivo = izquierda
            break;
        case 'esperar':
            this.doWait();
            break;
        case 'cambiarEstado':
            this.doChangeState();
            break;
        default:
            console.log("[RobotController] Acción desconocida: " + action);
    }
};

// ============================================================
// DO MOVE - Mover hacia adelante
// ============================================================
// El robot avanza en la dirección a la que está mirando.
// Usa translateLocal para moverse relativo a su propia orientación.
RobotController.prototype.doMove = function() {
    // Calcular la posición destino
    // translateLocal(0, 0, -distance) = avanzar hacia donde mira
    // En PlayCanvas, el eje Z negativo local es "hacia adelante"
    var forward = this.entity.forward.clone();
    var currentPos = this.entity.getPosition().clone();
    var targetPos = new pc.Vec3();

    targetPos.add2(currentPos, forward.mulScalar(this.moveDistance));

    this.targetPosition = targetPos;
    this.isMoving = true;

    console.log("[RobotController] Avanzando hacia: " +
        targetPos.x.toFixed(1) + ", " +
        targetPos.y.toFixed(1) + ", " +
        targetPos.z.toFixed(1));
};

// ============================================================
// DO JUMP - Saltar
// ============================================================
// El robot sube y luego baja. También avanza un poco hacia adelante.
RobotController.prototype.doJump = function() {
    this.isJumping = true;
    this.jumpPhase = 0; // 0 = subiendo, 1 = bajando
    this.jumpStartY = this.entity.getPosition().y;

    // También avanzar mientras salta
    var forward = this.entity.forward.clone();
    var currentPos = this.entity.getPosition().clone();
    this.targetPosition = new pc.Vec3();
    this.targetPosition.add2(currentPos, forward.mulScalar(this.moveDistance));
    this.targetPosition.y = currentPos.y; // Mantener la misma altura final

    console.log("[RobotController] Saltando!");
};

// ============================================================
// DO TURN - Girar
// ============================================================
// Recibe grados positivos (izquierda) o negativos (derecha)
RobotController.prototype.doTurn = function(degrees) {
    // Rotar inmediatamente (simple y efectivo)
    this.entity.rotateLocal(0, degrees, 0);

    var direction = degrees > 0 ? "izquierda" : "derecha";
    console.log("[RobotController] Girando " + Math.abs(degrees) + "° a la " + direction);
};

// ============================================================
// DO WAIT - Esperar (no hacer nada)
// ============================================================
RobotController.prototype.doWait = function() {
    console.log("[RobotController] Esperando...");
    // No hace nada, simplemente deja pasar el tiempo
    // El action-queue se encarga de esperar el tiempo configurado
};

// ============================================================
// DO CHANGE STATE - Cambiar estado del robot
// ============================================================
RobotController.prototype.doChangeState = function() {
    // Esto se conectará con el sistema de estados (punto 3)
    // Por ahora solo dispara el evento
    this.app.fire('robot:stateChange');
    console.log("[RobotController] Solicitando cambio de estado...");
};

// ============================================================
// UPDATE - Se ejecuta cada frame (para movimiento suave)
// ============================================================
RobotController.prototype.update = function(dt) {
    // --- Movimiento suave hacia el destino ---
    if (this.isMoving && this.targetPosition) {
        var currentPos = this.entity.getPosition();
        var newPos = new pc.Vec3();

        // Lerp = mover suavemente de un punto a otro
        var speed = this.moveSpeed * dt;
        newPos.lerp(currentPos, this.targetPosition, Math.min(speed, 1));

        this.entity.setPosition(newPos);

        // ¿Ya llegó? (distancia menor a 0.05)
        var distance = currentPos.distance(this.targetPosition);
        if (distance < 0.05) {
            this.entity.setPosition(this.targetPosition);
            this.isMoving = false;
            this.targetPosition = null;
        }
    }

    // --- Salto ---
    if (this.isJumping) {
        var pos = this.entity.getPosition();
        var jumpSpeed = this.moveSpeed * dt;

        if (this.jumpPhase === 0) {
            // Subiendo
            var newY = pos.y + jumpSpeed * 2;
            if (newY >= this.jumpStartY + this.jumpHeight) {
                newY = this.jumpStartY + this.jumpHeight;
                this.jumpPhase = 1; // Empezar a bajar
            }
            this.entity.setPosition(pos.x, newY, pos.z);
        } else {
            // Bajando
            var newY = pos.y - jumpSpeed * 2;
            if (newY <= this.jumpStartY) {
                newY = this.jumpStartY;
                this.isJumping = false; // Terminó el salto
            }
            this.entity.setPosition(pos.x, newY, pos.z);
        }

        // Mover hacia adelante durante el salto
        if (this.targetPosition) {
            var currentPos2 = this.entity.getPosition();
            var targetXZ = new pc.Vec3(this.targetPosition.x, currentPos2.y, this.targetPosition.z);
            var newPosXZ = new pc.Vec3();
            newPosXZ.lerp(currentPos2, targetXZ, Math.min(jumpSpeed, 1));
            this.entity.setPosition(newPosXZ.x, currentPos2.y, newPosXZ.z);

            if (Math.abs(currentPos2.x - this.targetPosition.x) < 0.05 &&
                Math.abs(currentPos2.z - this.targetPosition.z) < 0.05) {
                this.targetPosition = null;
            }
        }
    }
};

// ============================================================
// RESET POSITION - Volver al inicio
// ============================================================
RobotController.prototype.resetPosition = function() {
    this.entity.setPosition(this.startPosition);
    this.entity.setEulerAngles(this.startRotation);
    this.isMoving = false;
    this.isJumping = false;
    this.targetPosition = null;

    console.log("[RobotController] Robot reiniciado a posición inicial");
};

// ============================================================
// CLEANUP - Limpia eventos cuando se destruye
// ============================================================
RobotController.prototype.destroy = function() {
    this.app.off('robot:doAction', this.onAction, this);
    this.app.off('robot:reset', this.resetPosition, this);
};
