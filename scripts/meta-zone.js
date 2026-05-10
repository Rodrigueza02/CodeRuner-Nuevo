// ============================================================
// META-ZONE.JS - Zona de Meta del Nivel
// ============================================================
// Este script detecta cuando el robot llega a la meta y
// dispara eventos de éxito para el sistema de logs narrativos.
//
// CÓMO SE USA EN PLAYCANVAS:
//   1. Crea una entidad en la posición de la meta
//   2. Agrégale un componente COLLISION (tipo: Box, Trigger: ON)
//   3. Agrégale este script como componente
//   4. Cuando el robot entre en la zona, se dispara el evento
//
// INTEGRACIÓN CON SISTEMA DE LOGS (Helen):
//   - Dispara 'success:detected' con type 'objetivoAlcanzado'
//   - Dispara 'success:detected' con type 'nivelCompletado'
//
// CREADO POR: Daniel (con integración de Helen)
// ============================================================

var MetaZone = pc.createScript('metaZone');

// --- ATRIBUTOS ---
MetaZone.attributes.add('mostrarMensajeCompletado', {
    type: 'boolean',
    default: true,
    title: 'Mostrar mensaje de nivel completado',
    description: 'Si está activado, muestra el mensaje de nivel completado al llegar a la meta'
});

MetaZone.attributes.add('desactivarDespuesDeUso', {
    type: 'boolean',
    default: true,
    title: 'Desactivar después de uso',
    description: 'Si está activado, la meta solo se puede activar una vez'
});

// ============================================================
// INITIALIZE
// ============================================================
MetaZone.prototype.initialize = function() {
    // Estado
    this.yaActivada = false;
    this.tiempoInicio = Date.now();
    
    // Verificar que tiene componente de colisión
    if (!this.entity.collision) {
        console.error("[MetaZone] ERROR: La entidad no tiene componente Collision!");
        console.error("[MetaZone] Agrega un componente Collision (tipo: Box, Trigger: ON)");
        return;
    }
    
    // Verificar que está configurado como trigger
    if (!this.entity.collision.type === 'trigger') {
        console.warn("[MetaZone] ADVERTENCIA: El collision debería ser tipo 'trigger'");
    }
    
    // Escuchar cuando algo entra en la zona
    this.entity.collision.on('triggerenter', this.onTriggerEnter, this);
    
    console.log("[MetaZone] Zona de meta inicializada");
};

// ============================================================
// ON TRIGGER ENTER - Cuando algo entra en la zona
// ============================================================
MetaZone.prototype.onTriggerEnter = function(entity) {
    // Verificar que es el robot
    if (entity.name !== 'Playbot' && !entity.tags.has('robot')) {
        return; // No es el robot, ignorar
    }
    
    // Si ya fue activada y está configurado para desactivar, no hacer nada
    if (this.yaActivada && this.desactivarDespuesDeUso) {
        return;
    }
    
    console.log("[MetaZone] ¡Robot llegó a la meta!");
    
    // Marcar como activada
    this.yaActivada = true;
    
    // Calcular tiempo transcurrido
    var tiempoTranscurrido = (Date.now() - this.tiempoInicio) / 1000; // en segundos
    
    // INTEGRACIÓN HELEN: Disparar evento de objetivo alcanzado
    this.app.fire('success:detected', {
        type: 'objetivoAlcanzado',
        data: {
            posicion: entity.getPosition().clone(),
            tiempo: tiempoTranscurrido.toFixed(2)
        }
    });
    
    // INTEGRACIÓN HELEN: Disparar evento de nivel completado (si está activado)
    if (this.mostrarMensajeCompletado) {
        // Esperar un momento antes de mostrar el mensaje de nivel completado
        var self = this;
        setTimeout(function() {
            self.app.fire('success:detected', {
                type: 'nivelCompletado',
                data: {
                    tiempo: tiempoTranscurrido.toFixed(2)
                }
            });
        }, 500); // Esperar 0.5 segundos
    }
    
    // Disparar evento genérico para otros sistemas
    this.app.fire('level:completed', {
        tiempo: tiempoTranscurrido
    });
};

// ============================================================
// RESET - Reiniciar la zona de meta
// ============================================================
MetaZone.prototype.reset = function() {
    this.yaActivada = false;
    this.tiempoInicio = Date.now();
    console.log("[MetaZone] Zona de meta reiniciada");
};

// ============================================================
// CLEANUP
// ============================================================
MetaZone.prototype.destroy = function() {
    if (this.entity.collision) {
        this.entity.collision.off('triggerenter', this.onTriggerEnter, this);
    }
};
