var RobotMovement = pc.createScript('robotMovement');

// Atributos para ajustar la velocidad desde el editor
RobotMovement.attributes.add('moveSpeed', { type: 'number', default: 1, title: 'Velocidad de Movimiento' });
RobotMovement.attributes.add('turnSpeed', { type: 'number', default: 90, title: 'Velocidad de Giro' });

RobotMovement.prototype.initialize = function() {
    // ESCUCHAR la secuencia completa desde la UI
    this.app.on('robot:executeSequence', this.executeSequence, this);
    this.app.on('robot:reset', this.resetPosition, this);
    
    this.moveSpeed = 1;
    this.isExecuting = false;
    
    // Guardar la posición inicial para el reinicio
    this.initialPosition = this.entity.getPosition().clone();
    this.initialRotation = this.entity.getRotation().clone();
};

RobotMovement.prototype.resetPosition = function() {
    console.log("Reiniciando posición del robot...");
    this.isExecuting = false;
    this.entity.setPosition(this.initialPosition);
    this.entity.setRotation(this.initialRotation);
    
    // Si Daniel añade animaciones luego, aquí las detendríamos
    // if (this.entity.anim) this.entity.anim.setInteger('state', 0);
};

RobotMovement.prototype.executeSequence = function(queue) {
    if (this.isExecuting) return;
    
    console.log("Iniciando ejecución de " + queue.length + " comandos");
    this.isExecuting = true;
    this.runNextCommand(queue, 0);
};

RobotMovement.prototype.runNextCommand = function(queue, index) {
    if (index >= queue.length) {
        this.isExecuting = false;
        console.log("Secuencia completada");
        return;
    }

    var command = queue[index];
    var self = this;

    console.log("Ejecutando: " + command);

    if (command === 'move') {
        this.entity.translateLocal(0, 0, this.moveSpeed);
    } else if (command === 'turn') {
        this.entity.rotateLocal(0, -90, 0); // Giro de 90 grados a la derecha
    } else if (command === 'jump') {
        this.jump();
    } else if (command === 'wait') {
        console.log("Robot esperando...");
        // El robot no hace nada durante este segundo
    } else if (command === 'state') {
        this.changeState();
    }
    // El comando 'wait' simplemente deja pasar el tiempo

    // Esperar 1 segundo antes del siguiente comando
    setTimeout(function() {
        self.runNextCommand(queue, index + 1);
    }, 1000);
};

RobotMovement.prototype.jump = function() {
    var self = this;
    this.entity.translateLocal(0, 1, 0);
    setTimeout(function() {
        self.entity.translateLocal(0, -1, 0);
    }, 500);
};

RobotMovement.prototype.changeState = function() {
    console.log("Cambiando estado emocional del robot...");
    // Aquí podrías cambiar el color de una luz o material
    // Por ahora, lanzamos un mensaje visual en la consola
    this.app.fire('ui:log', "Sincronización emocional detectada.");
};

// Limpiar eventos cuando se destruye la entidad
RobotMovement.prototype.onBeforeDestroy = function() {
    this.app.off('robot:move', this.onMove, this);
    this.app.off('robot:turn', this.onTurn, this);
    this.app.off('robot:action', this.onAction, this);
};
