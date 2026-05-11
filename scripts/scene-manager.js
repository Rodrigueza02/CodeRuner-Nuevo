var SceneManager = pc.createScript('sceneManager');

// Formato correcto para PlayCanvas: solo "ID.json"
// IDs obtenidos desde la URL del editor:
// https://playcanvas.com/editor/scene/XXXXXXX
var SCENES = {
    menuPrincipal: '2489400.json',
    tutorial:      '2494415.json',
    nivel1:        '2487258.json'
};

SceneManager.prototype.initialize = function() {
    var self = this;

    // Menú Principal → click Nivel 0 → cargar Tutorial
    this.app.on('menu:loadTutorial', function() {
        self.goToScene(SCENES.tutorial, 'Tutorial');
    });

    // Tutorial → COMENZAR MISIÓN → cargar Nivel 1
    this.app.on('menu:startGame', function() {
        self.goToScene(SCENES.nivel1, 'Nivel 1');
    });

    // Cualquier escena → volver al Menú Principal
    this.app.on('menu:backToMain', function() {
        self.goToScene(SCENES.menuPrincipal, 'Menu Principal');
    });
};

SceneManager.prototype.goToScene = function(sceneUrl, sceneName) {
    console.log('Cargando escena: ' + sceneName + ' (' + sceneUrl + ')');

    // 1. Limpiar TODO el HTML inyectado por uiManager del DOM
    //    para que no quede el menú visible debajo del tutorial
    var injected = document.querySelectorAll('body > div');
    for (var i = 0; i < injected.length; i++) {
        injected[i].remove();
    }

    // 2. Guardar referencia a la jerarquía 3D actual
    var currentRoot = this.app.root.findByName('Root');

    // 3. Cargar la nueva escena
    this.app.scenes.loadSceneHierarchy(sceneUrl, function(err, parent) {
        if (err) {
            console.error('Error al cargar "' + sceneName + '": ' + err);
            return;
        }
        // 4. Destruir la jerarquía 3D anterior
        if (currentRoot) {
            currentRoot.destroy();
        }
        console.log('Escena "' + sceneName + '" cargada.');
    });
};
