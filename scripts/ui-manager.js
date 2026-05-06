var UiManager = pc.createScript('uiManager');

UiManager.attributes.add('htmlAsset', { type: 'asset', assetType: 'html', title: 'Archivo HTML' });
UiManager.attributes.add('cssAsset', { type: 'asset', assetType: 'css', title: 'Archivo CSS' });

UiManager.prototype.initialize = function() {
    // 1. Inyectar el CSS
    if (this.cssAsset) {
        var style = document.createElement('style');
        style.innerHTML = this.cssAsset.resource;
        document.head.appendChild(style);
    }

    // 2. Inyectar el HTML
    if (this.htmlAsset) {
        var div = document.createElement('div');
        div.innerHTML = this.htmlAsset.resource;
        document.body.appendChild(div);

        // 3. Conectar los botones del HTML con PlayCanvas
        this.bindButtons(div);
    }
};

UiManager.prototype.bindButtons = function(container) {
    var self = this;

    // Buscar botones por clase (definidas en el HTML)
    var btnForward = container.querySelector('.btn-move');
    var btnLeft = container.querySelectorAll('.btn-turn')[1]; // El segundo botón de giro
    var btnRight = container.querySelectorAll('.btn-turn')[0]; // El primer botón de giro
    var btnAction = container.querySelector('.btn-action');

    if (btnForward) {
        btnForward.addEventListener('click', function() {
            self.app.fire('robot:move', 'forward');
            console.log('Evento: Avanzar');
        });
    }

    if (btnLeft) {
        btnLeft.addEventListener('click', function() {
            self.app.fire('robot:turn', 'left');
            console.log('Evento: Izquierda');
        });
    }

    if (btnRight) {
        btnRight.addEventListener('click', function() {
            self.app.fire('robot:turn', 'right');
            console.log('Evento: Derecha');
        });
    }

    if (btnAction) {
        btnAction.addEventListener('click', function() {
            self.app.fire('robot:action');
            console.log('Evento: Acción');
        });
    }
};
