var SceneManager = pc.createScript('sceneManager');

// ============================================================
// INSTRUCCIONES PARA CONFIGURAR:
// En PlayCanvas, cada escena tiene un URL en el panel Assets.
// Click en la escena (.json) → panel derecho → copia el "URL"
// Ejemplo: "scenes/123456/scene.json"
// Reemplaza los valores de abajo con los URLs reales.
// ============================================================

SceneManager.attributes.add('tutorialSceneUrl', {
    type: 'string',
    default: '',
    title: 'URL Escena Tutorial',
    description: 'URL de la escena Tutorial (ej: scenes/123456/scene.json)'
});

SceneManager.attributes.add('mainMenuSceneUrl', {
    type: 'string',
    default: '',
    title: 'URL Escena Menú Principal',
    description: 'URL de la escena del Menú Principal'
});

SceneManager.attributes.add('level1SceneUrl', {
    type: 'string',
    default: '',
    title: 'URL Escena Nivel 1',
    description: 'URL de la primera escena de juego real'
});

SceneManager.prototype.initialize = function() {
    var self = this;

    // Desde el menú principal: ir al tutorial (Nivel 0 - DESPERTAR)
    this.app.on('menu:loadTutorial', function() {
        self.loadScene(self.tutorialSceneUrl, 'Tutorial');
    });

    // Desde el tutorial: botón COMENZAR MISIÓN → ir al Nivel 1
    this.app.on('menu:startGame', function() {
        self.loadScene(self.level1SceneUrl, 'Nivel 1');
    });

    // Volver al menú principal desde cualquier escena
    this.app.on('menu:backToMain', function() {
        self.loadScene(self.mainMenuSceneUrl, 'Menú Principal');
    });
};

SceneManager.prototype.loadScene = function(sceneUrl, sceneName) {
    if (!sceneUrl || sceneUrl === '') {
        console.error(
            'SceneManager: URL de escena vacío para "' + sceneName + '". ' +
            'Configura el atributo en el editor de PlayCanvas.'
        );
        return;
    }

    console.log('Cargando escena: ' + sceneName + ' (' + sceneUrl + ')');

    // Destruir la escena actual
    var oldHierarchy = this.app.root.findByName('Root');

    this.app.scenes.loadScene(sceneUrl, function(err, scene) {
        if (err) {
            console.error('Error cargando escena "' + sceneName + '": ' + err);
            return;
        }

        // Destruir la jerarquía anterior después de cargar la nueva
        if (oldHierarchy) {
            oldHierarchy.destroy();
        }

        console.log('Escena "' + sceneName + '" cargada correctamente.');
    });
};
