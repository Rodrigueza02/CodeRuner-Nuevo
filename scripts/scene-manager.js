var SceneManager = pc.createScript('sceneManager');

SceneManager.attributes.add('tutorialSceneUrl', {
    type: 'string',
    default: '',
    title: 'URL Escena Tutorial'
});

SceneManager.attributes.add('mainMenuSceneUrl', {
    type: 'string',
    default: '',
    title: 'URL Escena Menu Principal'
});

SceneManager.attributes.add('level1SceneUrl', {
    type: 'string',
    default: '',
    title: 'URL Escena Nivel 1'
});

SceneManager.prototype.initialize = function() {
    var self = this;

    this.app.on('menu:loadTutorial', function() {
        self.goToScene(self.tutorialSceneUrl, 'Tutorial');
    });

    this.app.on('menu:startGame', function() {
        self.goToScene(self.level1SceneUrl, 'Nivel1');
    });

    this.app.on('menu:backToMain', function() {
        self.goToScene(self.mainMenuSceneUrl, 'MenuPrincipal');
    });
};

SceneManager.prototype.goToScene = function(url, name) {
    if (!url || url.trim() === '') {
        console.error('SceneManager: URL vacio para escena "' + name + '"');
        return;
    }

    console.log('Cambiando a escena: ' + name);

    // Guardar referencia a la jerarquia actual ANTES de cargar
    var currentRoot = this.app.root.findByName('Root');

    // PlayCanvas: cargar jerarquia de la nueva escena
    this.app.scenes.loadSceneHierarchy(url, function(err, parent) {
        if (err) {
            console.error('Error al cargar escena "' + name + '": ' + err);
            return;
        }
        // Destruir la escena anterior
        if (currentRoot) {
            currentRoot.destroy();
        }
        console.log('Escena "' + name + '" lista.');
    });
};
