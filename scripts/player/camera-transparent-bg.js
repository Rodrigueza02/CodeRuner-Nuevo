// ============================================================
// CAMERA-TRANSPARENT-BG.JS
// ============================================================
// Hace que el fondo del canvas de PlayCanvas sea transparente
// para que el fondo HTML (espacio animado) se vea detrás.
//
// CÓMO USAR:
//   1. Selecciona la entidad Camera en PlayCanvas
//   2. Agrega este script como componente
//   3. En la entidad Camera, componente Camera:
//      - Clear Color: R=0, G=0, B=0, A=0  (alpha = 0 = transparente)
//      - Clear Color Buffer: true
// ============================================================

var CameraTransparentBg = pc.createScript('cameraTransparentBg');

CameraTransparentBg.prototype.initialize = function () {
    // 1. Poner el clearColor de la cámara en transparente
    if (this.entity.camera) {
        this.entity.camera.clearColor = new pc.Color(0, 0, 0, 0);
    }

    // 2. Hacer el canvas de WebGL transparente
    var canvas = this.app.graphicsDevice.canvas;
    if (canvas) {
        canvas.style.background = 'transparent';
        canvas.style.backgroundColor = 'transparent';
    }

    // 3. El contexto WebGL también necesita alpha
    // (esto ya debe estar configurado en PlayCanvas con preserveDrawingBuffer)
    console.log('[CameraTransparentBg] Fondo transparente activado');
};

CameraTransparentBg.prototype.swap = function (old) {};
