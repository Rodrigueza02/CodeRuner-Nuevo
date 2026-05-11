var SceneManager = pc.createScript('sceneManager');

// IDs de escenas obtenidos desde la URL del editor de PlayCanvas
// https://playcanvas.com/editor/scene/XXXXXXX
var SCENES = {
    menuPrincipal: 'scenes/2489400/scene.json',
    tutorial:      'scenes/2494415/scene.json',
    nivel1:        'scenes/2487258/scene.json'
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

    // Guardar referencia a la jerarquía actual antes de destruirla
    var currentRoot = this.app.root.findByName('Root');

    this.app.scenes.loadSceneHierarchy(sceneUrl, function(err, parent) {
        if (err) {
            console.error('Error al cargar "' + sceneName + '": ' + err);
            return;
        }
        if (currentRoot) {
            currentRoot.destroy();
        }
        console.log('Escena "' + sceneName + '" cargada.');
    });
};
