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

        this.container = div;
        
        // DETECTAR QUÉ INTERFAZ ESTAMOS CARGANDO
        if (div.querySelector('.menu-container')) {
            console.log("Detectado: Menú Principal");
            this.bindMainMenuButtons();
        } else if (div.querySelector('.terminal-interface')) {
            console.log("Detectado: Terminal de Juego");
            this.queueElement = div.querySelector('#queue');
            this.emptyMsg = div.querySelector('#empty-msg');
            this.logDisplay = div.querySelector('#log-display');
            this.bindTerminalButtons();
            this.startEmotionalLogs();
        }
    }
};

UiManager.prototype.bindMainMenuButtons = function() {
    var self = this;
    var btnStart = this.container.querySelector('.menu-btn.red');
    var btnLevels = this.container.querySelector('.menu-btn.blue');

    if (btnStart) {
        btnStart.addEventListener('click', function() {
            console.log("Iniciando Protocolo...");
            // Aquí puedes disparar un evento para cambiar de escena
            self.app.fire('menu:start');
        });
    }

    if (btnLevels) {
        btnLevels.addEventListener('click', function() {
            var selector = self.container.querySelector('#level-selector');
            if (selector) {
                selector.style.display = (selector.style.display === 'flex') ? 'none' : 'flex';
            }
        });
    }
};

UiManager.prototype.bindTerminalButtons = function() {
    var self = this;
    var btnMove = this.container.querySelector('#btn-move');
    var btnTurn = this.container.querySelector('#btn-turn');
    var btnJump = this.container.querySelector('#btn-jump');
    var btnWait = this.container.querySelector('#btn-wait');
    var btnState = this.container.querySelector('#btn-state');
    var btnResetSmall = this.container.querySelector('#btn-reset-small');
    var btnExecute = this.container.querySelector('#btn-execute');
    var btnReset = this.container.querySelector('#btn-reset');

    if (btnMove) btnMove.addEventListener('click', function() { self.addToQueue('MOVER', '🚀', 'move'); });
    if (btnTurn) btnTurn.addEventListener('click', function() { self.addToQueue('GIRAR', '↪️', 'turn'); });
    if (btnJump) btnJump.addEventListener('click', function() { self.addToQueue('SALTAR', '⭐', 'jump'); });

    if (btnExecute) {
        btnExecute.addEventListener('click', function() {
            if (self.queue.length > 0) {
                self.app.fire('robot:executeSequence', [...self.queue]);
                self.updateLog("Iniciando secuencia...");
                setTimeout(function() { self.clearQueue(); }, 1000);
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
