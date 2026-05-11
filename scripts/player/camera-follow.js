// ============================================================
// CAMERA-FOLLOW.JS — Cámara lateral que sigue al robot
// ============================================================
// VERSIÓN SIMPLIFICADA — sin cálculos de offset relativo.
// La cámara se posiciona exactamente en:
//   robot.position + (offsetX, offsetY, offsetZ)
// y apunta al robot.
// ============================================================

var CameraFollow = pc.createScript('cameraFollow');

CameraFollow.attributes.add('target', {
    type: 'entity',
    title: 'Robot (Target)',
    description: 'Entidad Playbot.'
});

CameraFollow.attributes.add('offsetX', {
    type: 'number',
    default: 3,
    title: 'Offset X',
    description: 'Desplazamiento lateral. Positivo = derecha del robot.'
});

CameraFollow.attributes.add('offsetY', {
    type: 'number',
    default: 4,
    title: 'Offset Y (altura)',
    description: 'Altura sobre el robot. BAJA ESTE VALOR si el robot se ve pequeño.'
});

CameraFollow.attributes.add('offsetZ', {
    type: 'number',
    default: 7,
    title: 'Offset Z (distancia)',
    description: 'Distancia de la cámara. BAJA ESTE VALOR si el robot se ve pequeño.'
});

CameraFollow.attributes.add('smoothSpeed', {
    type: 'number',
    default: 5,
    title: 'Velocidad de seg...',
    description: 'Suavidad (1=lento, 10=inmediato).'
});

CameraFollow.attributes.add('followX', {
    type: 'boolean',
    default: true,
    title: 'Seguir en X'
});

CameraFollow.attributes.add('followZ', {
    type: 'boolean',
    default: false,
    title: 'Seguir en Z'
});

// ── Initialize ───────────────────────────────────────────────
CameraFollow.prototype.initialize = function () {
    this._pos = new pc.Vec3();

    if (!this.target) {
        this.target = this.app.root.findByName('Playbot') ||
                      this.app.root.findByName('Robot')   ||
                      this.app.root.findByName('robot');
    }

    if (!this.target) {
        console.warn('[CameraFollow] Robot no encontrado.');
        return;
    }

    // Snap inmediato
    var rp = this.target.getPosition();
    this._pos.set(rp.x + this.offsetX, rp.y + this.offsetY, rp.z + this.offsetZ);
    this.entity.setPosition(this._pos);
    this.entity.lookAt(rp);

    console.log('[CameraFollow] OK — robot: ' + rp.x.toFixed(1) + ',' + rp.y.toFixed(1) + ',' + rp.z.toFixed(1) +
                ' | cam: ' + this._pos.x.toFixed(1) + ',' + this._pos.y.toFixed(1) + ',' + this._pos.z.toFixed(1));
};

// ── Update ───────────────────────────────────────────────────
CameraFollow.prototype.update = function (dt) {
    if (!this.target) return;
    var rp = this.target.getPosition();

    var tx = this.followX ? rp.x + this.offsetX : this._pos.x;
    var ty = rp.y + this.offsetY;
    var tz = this.followZ ? rp.z + this.offsetZ : this._pos.z;

    var f = Math.min(this.smoothSpeed * dt, 1);
    this._pos.x = pc.math.lerp(this._pos.x, tx, f);
    this._pos.y = pc.math.lerp(this._pos.y, ty, f);
    this._pos.z = pc.math.lerp(this._pos.z, tz, f);

    this.entity.setPosition(this._pos);
    this.entity.lookAt(new pc.Vec3(rp.x + this.offsetX * 0.3, rp.y + 0.5, rp.z));
};

CameraFollow.prototype.swap = function (old) {
    this.target = old.target;
    this._pos   = old._pos ? old._pos.clone() : new pc.Vec3();
};
