var UiManager = pc.createScript('uiManager');

UiManager.attributes.add('htmlAsset', { type: 'asset', assetType: 'html', title: 'Archivo HTML' });
UiManager.attributes.add('cssAsset', { type: 'asset', assetType: 'css', title: 'Archivo CSS' });

UiManager.prototype.initialize = function() {
    this.queue = [];
    
    // Inyectar CSS
    if (this.cssAsset) {
        var style = document.createElement('style');
        style.innerHTML = this.cssAsset.resource;
        document.head.appendChild(style);
    }

    // Inyectar HTML
    if (this.htmlAsset) {
        var div = document.createElement('div');
        div.innerHTML = this.htmlAsset.resource;
        document.body.appendChild(div);

        // Guardar referencias a los elementos del DOM
        this.container = div;
        this.queueElement = div.querySelector('#queue');
        this.emptyMsg = div.querySelector('#empty-msg');
        this.logDisplay = div.querySelector('#log-display');

        this.bindButtons();
        this.startEmotionalLogs();
    }
};

UiManager.prototype.bindButtons = function() {
    var self = this;

    var btnMove = this.container.querySelector('#btn-move');
    var btnTurn = this.container.querySelector('#btn-turn');
    var btnJump = this.container.querySelector('#btn-jump');
    var btnWait = this.container.querySelector('#btn-wait');
    var btnState = this.container.querySelector('#btn-state');
    var btnResetSmall = this.container.querySelector('#btn-reset-small');
    var btnExecute = this.container.querySelector('#btn-execute');
    var btnReset = this.container.querySelector('#btn-reset');

    if (btnMove) {
        btnMove.addEventListener('click', function() {
            self.addToQueue('MOVER', '🚀', 'move');
        });
    }

    if (btnTurn) {
        btnTurn.addEventListener('click', function() {
            self.addToQueue('GIRAR', '↪️', 'turn');
        });
    }

    if (btnJump) {
        btnJump.addEventListener('click', function() {
            self.addToQueue('SALTAR', '⭐', 'jump');
        });
    }

    if (btnWait) {
        btnWait.addEventListener('click', function() {
            if (btnWait.classList.contains('locked')) {
                self.updateLog("ERROR: Nivel insuficiente para ESPERAR.");
                return;
            }
            self.addToQueue('ESPERAR', '⏳', 'wait');
        });
    }

    if (btnState) {
        btnState.addEventListener('click', function() {
            if (btnState.classList.contains('locked')) {
                self.updateLog("ERROR: Nivel insuficiente para CAMBIAR ESTADO.");
                return;
            }
            self.addToQueue('ESTADO', '🧠', 'state');
        });
    }

    if (btnResetSmall) {
        btnResetSmall.addEventListener('click', function() {
            self.clearQueue();
        });
    }

    if (btnExecute) {
        btnExecute.addEventListener('click', function() {
            if (self.queue.length > 0) {
                self.app.fire('robot:executeSequence', [...self.queue]);
                self.updateLog("Iniciando secuencia... ¡No me dejes solo!");
                setTimeout(function() { self.clearQueue(); }, 1000);
            } else {
                self.updateLog("ERROR: Memoria vacía.");
            }
        });
    }

    if (btnReset) {
        btnReset.addEventListener('click', function() {
            self.clearQueue();
            self.app.fire('robot:reset');
        });
    }
};

UiManager.prototype.addToQueue = function(action, icon, type) {
    if (this.emptyMsg) this.emptyMsg.style.display = 'none';
    
    this.queue.push(type);
    
    var item = document.createElement('div');
    item.className = 'queue-item ' + type;
    item.innerHTML = '<div style="font-size: 20px;">' + icon + '</div>' +
                     '<div style="font-weight: bold;">' + action + '</div>';
    
    if (this.queueElement) this.queueElement.appendChild(item);
    this.updateLog("Fragmento añadido: " + action);
};

UiManager.prototype.clearQueue = function() {
    this.queue = [];
    if (this.queueElement) {
        this.queueElement.innerHTML = '<div id="empty-msg" style="text-align: center; color: rgba(255,255,255,0.2); margin-top: 50px; width: 100%;">COLA_DE_INSTRUCCIONES_VACÍA</div>';
        this.emptyMsg = this.container.querySelector('#empty-msg');
    }
    this.updateLog("Memoria purgada.");
};

UiManager.prototype.updateLog = function(msg) {
    if (!this.logDisplay) return;
    this.logDisplay.style.animation = 'none';
    this.logDisplay.offsetHeight; // reflow
    this.logDisplay.innerText = "> " + msg;
    this.logDisplay.style.animation = 'typing 2s steps(40, end), blink .75s step-end infinite';
};

UiManager.prototype.startEmotionalLogs = function() {
    var self = this;
    var messages = [
        "Siento que me desvanezco...",
        "Este error... duele.",
        "Buscando mi propósito...",
        "¿Quién me controla desde fuera?",
        "Reconstruyendo mi memoria."
    ];
    
    setInterval(function() {
        if (Math.random() > 0.8) {
            var msg = messages[Math.floor(Math.random() * messages.length)];
            self.updateLog(msg);
        }
    }, 15000);
};
