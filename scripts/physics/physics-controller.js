// ============================================================
// PHYSICS-CONTROLLER.JS - Sistema de Físicas del Robot
// ============================================================
// Este script reemplaza al robot-controller.js cuando quieres
// que el robot use FÍSICAS REALES (gravedad, colisiones, etc.)
//
// DIFERENCIA CON ROBOT-CONTROLLER.JS:
//   robot-controller.js → mueve al robot "teletransportándolo" (setPosition)
//   physics-controller.js → mueve al robot con FUERZAS (como en la vida real)
//
// EXPLICACIÓN SIMPLE:
//   Imagina que empujas una pelota:
//   - Si la empujas fuerte, va rápido
//   - Si hay una pared, se detiene (colisión)
//   - Si está en el aire, cae (gravedad)
//   Eso es lo que hace este script con el robot.
//
// REQUISITOS EN PLAYCANVAS:
//   La entidad del robot DEBE tener:
//   1. Componente RIGIDBODY (tipo: Dynamic)
//   2. Componente COLLISION (tipo: Box o Capsule)
//   Las plataformas DEBEN tener:
//   1. Componente RIGIDBODY (tipo: Static)
//   2. Componente COLLISION (tipo: Box)
//
// CÓMO SE USA:
//   1. Agrégalo a la entidad del Robot (Playbot)
//   2. DESACTIVA robot-controller.js (ponlo en OFF)
//   3. Ajusta los valores en el Inspector
// ============================================================

var PhysicsController = pc.createScript('physicsController');

// --- ATRIBUTOS (se ven en el editor de PlayCanvas) ---
PhysicsController.attributes.add('moveForce', {
    type: 'number',
    default: 10,
    title: 'Fuerza de movimiento',
    description: 'Qué tan fuerte se empuja al robot para avanzar'
});

PhysicsController.attributes.add('jumpForce', {
    type: 'number',
    default: 8,
    title: 'Fuerza de salto',
    description: 'Qué tan fuerte salta el robot hacia arriba'
});

PhysicsController.attributes.add('turnAngle', {
    type: 'number',
    default: 90,
    title: 'Ángulo de giro',
    description: 'Cuántos grados gira el robot (normalmente 90)'
});

PhysicsController.attributes.add('groundCheckDistance', {
    type: 'number',
    default: 0.6,
    title: 'Distancia detección suelo',
    description: 'Qué tan lejos hacia abajo busca el suelo (ajustar según tamaño del robot)'
});

PhysicsController.attributes.add('maxSpeed', {
    type: 'number',
    default: 5,
    title: 'Velocidad máxima',
    description: 'Límite de velocidad del robot para que no se acelere infinitamente'
});

// ============================================================
// INITIALIZE
// ============================================================
PhysicsController.prototype.initialize = function() {
    // Guardar posición y rotación inicial
    this.startPosition = this.entity.getPosition().clone();
    this.startRotation = this.entity.getEulerAngles().clone();

    // Estado
    this.isGrounded = false;    // ¿Está tocando el suelo?
    this.isMoving = false;      // ¿Se está moviendo?
    this.moveDirection = null;  // Dirección de movimiento actual
    this.moveTarget = null;     // Posición objetivo
    this.hasReachedTarget = true; // ¿Ya llegó al destino?

    // Referencia al rigidbody (el componente de físicas)
    this.rb = this.entity.rigidbody;

    if (!this.rb) {
        console.error("[PhysicsController] ERROR: La entidad no tiene componente Rigidbody!");
        return;
    }

    // Configurar el rigidbody para que no rote solo (evita que se caiga de lado)
    this.rb.angularFactor = new pc.Vec3(0, 0, 0); // No rotar por físicas
    this.rb.linearDamping = 0.5; // Frenar un poco para que no se deslice infinito

    // --- ESCUCHAR EVENTOS ---
    this.app.on('robot:doAction', this.onAction, this);
    this.app.on('robot:reset', this.resetPosition, this);

    // Evento de colisión para detectar suelo
    this.entity.collision.on('collisionstart', this.onCollisionStart, this);
    this.entity.collision.on('collisionend', this.onCollisionEnd, this);

    // Contador de contactos con el suelo
    this.groundContacts = 0;

    console.log("[PhysicsController] Sistema de físicas inicializado");
};

// ============================================================
// ON ACTION - Recibe una orden del action-queue
// ============================================================
PhysicsController.prototype.onAction = function(action) {
    console.log("[PhysicsController] Acción recibida: " + action);

    switch (action) {
        case 'avanzar':
            this.doMove();
            break;
        case 'saltar':
            this.doJump();
            break;
        case 'girarDerecha':
            this.doTurn(this.turnAngle); // Positivo = derecha (ajustado)
            break;
        case 'girarIzquierda':
            this.doTurn(-this.turnAngle); // Negativo = izquierda (ajustado)
            break;
        case 'esperar':
            // No hacer nada
            console.log("[PhysicsController] Esperando...");
            break;
        case 'cambiarEstado':
            this.app.fire('robot:stateChange');
            break;
        default:
            console.log("[PhysicsController] Acción desconocida: " + action);
    }
};

// ============================================================
// DO MOVE - Avanzar usando fuerza
// ============================================================
PhysicsController.prototype.doMove = function() {
    if (!this.rb) return;

    // Obtener la dirección "adelante" del robot
    // NOTA: Algunos modelos 3D están orientados al revés,
    // por eso usamos mulScalar NEGATIVO para invertir la dirección.
    // Si el robot va hacia atrás, cambia el signo (quita el negativo).
    var forward = this.entity.forward.clone();

    // Aplicar un IMPULSO (empujón instantáneo) en esa dirección
    var impulse = forward.mulScalar(-this.moveForce);

    this.rb.applyImpulse(impulse);

    // Limitar velocidad máxima
    this.limitSpeed();

    console.log("[PhysicsController] Impulso aplicado hacia adelante");
};

// ============================================================
// DO JUMP - Saltar usando impulso hacia arriba
// ============================================================
PhysicsController.prototype.doJump = function() {
    if (!this.rb) return;

    // Solo saltar si está en el suelo
    if (!this.isGrounded) {
        console.log("[PhysicsController] No puede saltar - no está en el suelo!");
        return;
    }

    // Aplicar impulso hacia ARRIBA
    var jumpImpulse = new pc.Vec3(0, this.jumpForce, 0);
    this.rb.applyImpulse(jumpImpulse);

    // También avanzar un poco mientras salta
    var forward = this.entity.forward.clone();
    var forwardImpulse = forward.mulScalar(-this.moveForce * 0.5);
    this.rb.applyImpulse(forwardImpulse);

    this.isGrounded = false;

    console.log("[PhysicsController] Saltando!");
};

// ============================================================
// DO TURN - Girar el robot
// ============================================================
PhysicsController.prototype.doTurn = function(degrees) {
    if (!this.rb) return;

    // Para girar con rigidbody, necesitamos:
    // 1. Obtener la rotación actual
    // 2. Sumarle los grados
    // 3. Aplicar la nueva rotación

    var currentAngles = this.entity.getEulerAngles().clone();
    currentAngles.y += degrees;

    // Teleportar la rotación (el giro es instantáneo, no necesita físicas)
    this.rb.teleport(
        this.entity.getPosition(),
        new pc.Quat().setFromEulerAngles(currentAngles.x, currentAngles.y, currentAngles.z)
    );

    var direction = degrees > 0 ? "izquierda" : "derecha";
    console.log("[PhysicsController] Girando " + Math.abs(degrees) + "° a la " + direction);
};

// ============================================================
// LIMIT SPEED - Evitar que el robot vaya demasiado rápido
// ============================================================
PhysicsController.prototype.limitSpeed = function() {
    var velocity = this.rb.linearVelocity;
    var speed = velocity.length();

    if (speed > this.maxSpeed) {
        // Normalizar y multiplicar por velocidad máxima
        var limited = velocity.clone().normalize().mulScalar(this.maxSpeed);
        this.rb.linearVelocity = limited;
    }
};

// ============================================================
// DETECCIÓN DE SUELO - Usando colisiones
// ============================================================
PhysicsController.prototype.onCollisionStart = function(result) {
    // Verificar si la colisión es por debajo (suelo)
    for (var i = 0; i < result.contacts.length; i++) {
        var contact = result.contacts[i];
        // Si el punto de contacto normal apunta hacia arriba, es el suelo
        if (contact.normal.y > 0.5) {
            this.groundContacts++;
            this.isGrounded = true;
            break;
        }
    }
};

PhysicsController.prototype.onCollisionEnd = function(entity) {
    this.groundContacts--;
    if (this.groundContacts <= 0) {
        this.groundContacts = 0;
        this.isGrounded = false;
    }
};

// ============================================================
// UPDATE - Cada frame
// ============================================================
PhysicsController.prototype.update = function(dt) {
    // Verificar suelo con raycast (método alternativo más preciso)
    this.checkGroundRaycast();

    // Limitar velocidad continuamente
    this.limitSpeed();
};

// ============================================================
// CHECK GROUND RAYCAST - Detectar suelo con un rayo hacia abajo
// ============================================================
// Un "raycast" es como lanzar un láser invisible hacia abajo.
// Si el láser toca algo, significa que hay suelo debajo.
PhysicsController.prototype.checkGroundRaycast = function() {
    var pos = this.entity.getPosition();
    var start = new pc.Vec3(pos.x, pos.y, pos.z);
    var end = new pc.Vec3(pos.x, pos.y - this.groundCheckDistance, pos.z);

    var result = this.app.systems.rigidbody.raycastFirst(start, end);

    if (result) {
        this.isGrounded = true;
    } else {
        // Solo marcar como no-grounded si no hay contactos
        if (this.groundContacts <= 0) {
            this.isGrounded = false;
        }
    }
};

// ============================================================
// RESET POSITION - Volver al inicio
// ============================================================
PhysicsController.prototype.resetPosition = function() {
    if (!this.rb) return;

    // Detener toda velocidad
    this.rb.linearVelocity = pc.Vec3.ZERO;
    this.rb.angularVelocity = pc.Vec3.ZERO;

    // Teleportar a la posición inicial
    this.rb.teleport(
        this.startPosition,
        new pc.Quat().setFromEulerAngles(
            this.startRotation.x,
            this.startRotation.y,
            this.startRotation.z
        )
    );

    this.isGrounded = false;
    this.groundContacts = 0;

    console.log("[PhysicsController] Robot reiniciado a posición inicial");
};

// ============================================================
// CLEANUP
// ============================================================
PhysicsController.prototype.destroy = function() {
    this.app.off('robot:doAction', this.onAction, this);
    this.app.off('robot:reset', this.resetPosition, this);
};
