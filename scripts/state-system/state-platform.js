// ============================================================
// STATE-PLATFORM.JS - Plataformas que reaccionan al estado
// ============================================================
// Este script va en las plataformas que aparecen/desaparecen
// según el estado del robot.
//
// EXPLICACIÓN SIMPLE:
//   - Una plataforma AZUL solo es sólida cuando el robot está en modo AZUL
//   - Una plataforma ROJA solo es sólida cuando el robot está en modo ROJO
//   - Si el robot está en el estado equivocado, la plataforma se vuelve
//     transparente y el robot la atraviesa (o se cae)
//
// CÓMO SE USA EN PLAYCANVAS:
//   1. Crea una plataforma (Box con Collision + Rigidbody Static)
//   2. Agrégale este script
//   3. En el Inspector, selecciona qué estado la activa (azul o rojo)
//   4. Opcionalmente asigna materiales para activa/inactiva
// ============================================================

var StatePlatform = pc.createScript('statePlatform');

// --- ATRIBUTOS ---
StatePlatform.attributes.add('activeState', {
    type: 'string',
    default: 'azul',
    title: 'Estado que la activa',
    description: 'En qué estado del robot esta plataforma es sólida',
    enum: [
        { 'Azul': 'azul' },
        { 'Rojo': 'rojo' }
    ]
});

StatePlatform.attributes.add('activeMaterial', {
    type: 'asset',
    assetType: 'material',
    title: 'Material Activa',
    description: 'Cómo se ve la plataforma cuando está activa (sólida)'
});

StatePlatform.attributes.add('inactiveMaterial', {
    type: 'asset',
    assetType: 'material',
    title: 'Material Inactiva',
    description: 'Cómo se ve la plataforma cuando está inactiva (transparente)'
});

StatePlatform.attributes.add('hideWhenInactive', {
    type: 'boolean',
    default: false,
    title: 'Ocultar cuando inactiva',
    description: 'Si es true, la plataforma desaparece completamente cuando está inactiva'
});

// ============================================================
// INITIALIZE
// ============================================================
StatePlatform.prototype.initialize = function() {
    // Escuchar cuando el estado del robot cambia
    this.app.on('state:changed', this.onStateChanged, this);

    // Escuchar reinicio
    this.app.on('robot:reset', this.onReset, this);

    // Guardar referencia a la colisión
    this.collisionComponent = this.entity.collision;
    this.rigidbodyComponent = this.entity.rigidbody;

    // Estado inicial: verificar si debe estar activa o no
    // Por defecto asumimos que empieza en "azul"
    this.isActive = true;

    console.log("[StatePlatform] Plataforma '" + this.entity.name + "' configurada para estado: " + this.activeState);
};

// ============================================================
// ON STATE CHANGED - Cuando el robot cambia de estado
// ============================================================
StatePlatform.prototype.onStateChanged = function(newState) {
    if (newState === this.activeState) {
        this.activate();
    } else {
        this.deactivate();
    }
};

// ============================================================
// ACTIVATE - Hacer la plataforma sólida
// ============================================================
StatePlatform.prototype.activate = function() {
    if (this.isActive) return; // Ya está activa

    this.isActive = true;

    // Mostrar la entidad
    if (this.hideWhenInactive) {
        this.entity.enabled = true;
    }

    // Activar colisión (para que el robot no la atraviese)
    if (this.collisionComponent) {
        this.collisionComponent.enabled = true;
    }
    if (this.rigidbodyComponent) {
        this.rigidbodyComponent.enabled = true;
    }

    // Cambiar material a "activa"
    this.updateMaterial(true);

    console.log("[StatePlatform] " + this.entity.name + " ACTIVADA");
};

// ============================================================
// DEACTIVATE - Hacer la plataforma no-sólida
// ============================================================
StatePlatform.prototype.deactivate = function() {
    if (!this.isActive) return; // Ya está inactiva

    this.isActive = false;

    // Ocultar completamente si está configurado así
    if (this.hideWhenInactive) {
        this.entity.enabled = false;
        return;
    }

    // Desactivar colisión (el robot la atraviesa)
    if (this.collisionComponent) {
        this.collisionComponent.enabled = false;
    }
    if (this.rigidbodyComponent) {
        this.rigidbodyComponent.enabled = false;
    }

    // Cambiar material a "inactiva" (transparente/fantasma)
    this.updateMaterial(false);

    console.log("[StatePlatform] " + this.entity.name + " DESACTIVADA");
};

// ============================================================
// UPDATE MATERIAL - Cambiar la apariencia
// ============================================================
StatePlatform.prototype.updateMaterial = function(active) {
    var modelComponent = this.entity.model || this.entity.render;
    if (!modelComponent) return;

    var material = null;

    if (active && this.activeMaterial) {
        material = this.activeMaterial.resource;
    } else if (!active && this.inactiveMaterial) {
        material = this.inactiveMaterial.resource;
    }

    if (material) {
        var meshInstances = modelComponent.meshInstances;
        if (meshInstances) {
            for (var i = 0; i < meshInstances.length; i++) {
                meshInstances[i].material = material;
            }
        }
    }
};

// ============================================================
// ON RESET - Volver al estado inicial
// ============================================================
StatePlatform.prototype.onReset = function() {
    // Reactivar todas las plataformas al reiniciar
    this.activate();
};

// ============================================================
// CLEANUP
// ============================================================
StatePlatform.prototype.destroy = function() {
    this.app.off('state:changed', this.onStateChanged, this);
    this.app.off('robot:reset', this.onReset, this);
};
