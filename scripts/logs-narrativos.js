// ============================================================
// LOGS-NARRATIVOS.JS - Sistema de Mensajes Narrativos
// ============================================================
// Este script escucha los errores que detecta Daniel y muestra
// mensajes narrativos educativos para el jugador.
//
// FLUJO DE TRABAJO:
//   1. Daniel detecta un error (ej: robot cae al vacío)
//   2. Daniel dispara: this.app.fire('error:detected', { type: 'caida', ... })
//   3. Este script escucha el evento
//   4. Muestra el mensaje narrativo correspondiente
//
// CÓMO SE USA EN PLAYCANVAS:
//   1. Crea una entidad llamada "SistemaLogs" (o usa una existente)
//   2. Agrégale este script como componente
//   3. Configura los mensajes en el Inspector o edítalos aquí
//
// CREADO POR: Helen (Narrativa y QA)
// ============================================================

var LogsNarrativos = pc.createScript('logsNarrativos');

// --- ATRIBUTOS ---
LogsNarrativos.attributes.add('mostrarEnConsola', {
    type: 'boolean',
    default: true,
    title: 'Mostrar en consola',
    description: 'Si está activado, los logs también se muestran en la consola del navegador'
});

LogsNarrativos.attributes.add('mostrarEnUI', {
    type: 'boolean',
    default: true,
    title: 'Mostrar en UI',
    description: 'Si está activado, los logs se muestran en la interfaz del juego'
});

// ============================================================
// INITIALIZE
// ============================================================
LogsNarrativos.prototype.initialize = function() {
    // --- DICCIONARIO DE MENSAJES NARRATIVOS ---
    // Aquí Helen puede agregar/editar los mensajes educativos
    this.mensajes = {
        // Errores de movimiento
        'caida': {
            titulo: '¡Ups! El robot cayó al vacío',
            mensaje: 'Parece que el robot no tenía suelo debajo. Recuerda verificar que haya una plataforma antes de avanzar. ¿Quizás necesitas cambiar de estado para activar una plataforma?',
            tipo: 'error',
            icono: '⚠️'
        },
        'colision': {
            titulo: 'El robot chocó con un obstáculo',
            mensaje: 'Hay algo bloqueando el camino. Intenta girar o cambiar de estado para encontrar otra ruta.',
            tipo: 'advertencia',
            icono: '🚧'
        },
        'fueraDeLimites': {
            titulo: 'El robot salió del área de juego',
            mensaje: 'El robot se alejó demasiado. Revisa tu secuencia de comandos y asegúrate de que los giros sean correctos.',
            tipo: 'error',
            icono: '🗺️'
        },

        // Errores de secuencia
        'secuenciaVacia': {
            titulo: 'No hay comandos para ejecutar',
            mensaje: 'Necesitas agregar al menos un comando antes de presionar EJECUTAR. ¿Qué tal si empiezas con "Avanzar"?',
            tipo: 'info',
            icono: 'ℹ️'
        },
        'secuenciaMuyLarga': {
            titulo: 'Demasiados comandos',
            mensaje: 'Tu secuencia tiene más de 20 comandos. Intenta encontrar una solución más eficiente.',
            tipo: 'advertencia',
            icono: '📏'
        },

        // Errores de estado
        'estadoIncorrecto': {
            titulo: 'Estado incorrecto',
            mensaje: 'El robot está en el estado equivocado para esta plataforma. Usa el comando "Cambiar Estado" para sincronizarte.',
            tipo: 'advertencia',
            icono: '🔄'
        },
        'plataformaInactiva': {
            titulo: 'Plataforma desactivada',
            mensaje: 'Esta plataforma no está activa en tu estado actual. Cambia de estado para activarla.',
            tipo: 'info',
            icono: '🔲'
        },

        // Mensajes de éxito
        'nivelCompletado': {
            titulo: '¡Nivel completado! 🎉',
            mensaje: '¡Excelente trabajo! Has programado al robot correctamente. ¿Listo para el siguiente desafío?',
            tipo: 'exito',
            icono: '✅'
        },
        'objetivoAlcanzado': {
            titulo: '¡Objetivo alcanzado!',
            mensaje: 'El robot llegó a la meta. ¡Bien hecho!',
            tipo: 'exito',
            icono: '🎯'
        },

        // Mensajes educativos
        'primerComando': {
            titulo: 'Primer comando agregado',
            mensaje: 'Genial, agregaste tu primer comando. Puedes seguir agregando más comandos para crear una secuencia completa.',
            tipo: 'info',
            icono: '🎓'
        },
        'primerCambioEstado': {
            titulo: 'Cambio de estado detectado',
            mensaje: 'El robot cambió de estado. Observa cómo algunas plataformas se activan y otras se desactivan.',
            tipo: 'info',
            icono: '💡'
        },

        // Error genérico
        'errorGenerico': {
            titulo: 'Algo salió mal',
            mensaje: 'Ocurrió un error inesperado. Intenta reiniciar el nivel.',
            tipo: 'error',
            icono: '❌'
        }
    };

    // --- ESCUCHAR EVENTOS DE ERROR DE DANIEL ---
    // Daniel dispara estos eventos cuando detecta problemas
    this.app.on('error:detected', this.onErrorDetected, this);
    this.app.on('success:detected', this.onSuccessDetected, this);
    this.app.on('info:detected', this.onInfoDetected, this);

    // --- EVENTOS ESPECÍFICOS (para compatibilidad) ---
    this.app.on('robot:caida', this.onRobotCaida, this);
    this.app.on('robot:colision', this.onRobotColision, this);
    this.app.on('robot:fueraDeLimites', this.onRobotFueraDeLimites, this);
    this.app.on('queue:secuenciaVacia', this.onSecuenciaVacia, this);
    this.app.on('state:estadoIncorrecto', this.onEstadoIncorrecto, this);
    this.app.on('level:completado', this.onNivelCompletado, this);

    console.log("[LogsNarrativos] Sistema de logs narrativos inicializado por Helen");
    console.log("[LogsNarrativos] Escuchando " + Object.keys(this.mensajes).length + " tipos de eventos");
};

// ============================================================
// ON ERROR DETECTED - Evento genérico de error
// ============================================================
// Daniel puede disparar: this.app.fire('error:detected', { type: 'caida', data: {...} })
LogsNarrativos.prototype.onErrorDetected = function(errorData) {
    var tipoError = errorData.type || 'errorGenerico';
    this.mostrarLog(tipoError, errorData.data);
};

// ============================================================
// ON SUCCESS DETECTED - Evento de éxito
// ============================================================
LogsNarrativos.prototype.onSuccessDetected = function(successData) {
    var tipoExito = successData.type || 'objetivoAlcanzado';
    this.mostrarLog(tipoExito, successData.data);
};

// ============================================================
// ON INFO DETECTED - Evento informativo
// ============================================================
LogsNarrativos.prototype.onInfoDetected = function(infoData) {
    var tipoInfo = infoData.type || 'primerComando';
    this.mostrarLog(tipoInfo, infoData.data);
};

// ============================================================
// EVENTOS ESPECÍFICOS - Para compatibilidad con código existente
// ============================================================
LogsNarrativos.prototype.onRobotCaida = function(data) {
    this.mostrarLog('caida', data);
};

LogsNarrativos.prototype.onRobotColision = function(data) {
    this.mostrarLog('colision', data);
};

LogsNarrativos.prototype.onRobotFueraDeLimites = function(data) {
    this.mostrarLog('fueraDeLimites', data);
};

LogsNarrativos.prototype.onSecuenciaVacia = function(data) {
    this.mostrarLog('secuenciaVacia', data);
};

LogsNarrativos.prototype.onEstadoIncorrecto = function(data) {
    this.mostrarLog('estadoIncorrecto', data);
};

LogsNarrativos.prototype.onNivelCompletado = function(data) {
    this.mostrarLog('nivelCompletado', data);
};

// ============================================================
// MOSTRAR LOG - Función principal que muestra el mensaje
// ============================================================
LogsNarrativos.prototype.mostrarLog = function(tipoMensaje, datosAdicionales) {
    var mensaje = this.mensajes[tipoMensaje];

    if (!mensaje) {
        console.warn("[LogsNarrativos] Tipo de mensaje no encontrado: " + tipoMensaje);
        mensaje = this.mensajes['errorGenerico'];
    }

    // --- MOSTRAR EN CONSOLA ---
    if (this.mostrarEnConsola) {
        var estilo = this.getEstiloConsola(mensaje.tipo);
        console.log(
            "%c" + mensaje.icono + " " + mensaje.titulo,
            estilo.titulo
        );
        console.log(
            "%c" + mensaje.mensaje,
            estilo.mensaje
        );
        if (datosAdicionales) {
            console.log("[LogsNarrativos] Datos adicionales:", datosAdicionales);
        }
    }

    // --- MOSTRAR EN UI ---
    if (this.mostrarEnUI) {
        // Disparar evento para que la UI lo muestre
        this.app.fire('ui:mostrarLog', {
            titulo: mensaje.titulo,
            mensaje: mensaje.mensaje,
            tipo: mensaje.tipo,
            icono: mensaje.icono,
            datos: datosAdicionales
        });
    }

    // --- GUARDAR EN HISTORIAL (para debug de Helen) ---
    this.guardarEnHistorial(tipoMensaje, mensaje, datosAdicionales);
};

// ============================================================
// GET ESTILO CONSOLA - Estilos CSS para la consola del navegador
// ============================================================
LogsNarrativos.prototype.getEstiloConsola = function(tipo) {
    var estilos = {
        'error': {
            titulo: 'background: #ff4444; color: white; padding: 4px 8px; border-radius: 3px; font-weight: bold;',
            mensaje: 'color: #ff4444; font-size: 12px;'
        },
        'advertencia': {
            titulo: 'background: #ffaa00; color: white; padding: 4px 8px; border-radius: 3px; font-weight: bold;',
            mensaje: 'color: #ffaa00; font-size: 12px;'
        },
        'exito': {
            titulo: 'background: #44ff44; color: white; padding: 4px 8px; border-radius: 3px; font-weight: bold;',
            mensaje: 'color: #44ff44; font-size: 12px;'
        },
        'info': {
            titulo: 'background: #4444ff; color: white; padding: 4px 8px; border-radius: 3px; font-weight: bold;',
            mensaje: 'color: #4444ff; font-size: 12px;'
        }
    };

    return estilos[tipo] || estilos['info'];
};

// ============================================================
// GUARDAR EN HISTORIAL - Para debug y análisis de Helen
// ============================================================
LogsNarrativos.prototype.guardarEnHistorial = function(tipo, mensaje, datos) {
    if (!this.historial) {
        this.historial = [];
    }

    this.historial.push({
        timestamp: Date.now(),
        tipo: tipo,
        mensaje: mensaje,
        datos: datos
    });

    // Limitar historial a 50 entradas
    if (this.historial.length > 50) {
        this.historial.shift();
    }
};

// ============================================================
// GET HISTORIAL - Para que Helen pueda revisar los logs
// ============================================================
LogsNarrativos.prototype.getHistorial = function() {
    return this.historial || [];
};

// ============================================================
// LIMPIAR HISTORIAL
// ============================================================
LogsNarrativos.prototype.limpiarHistorial = function() {
    this.historial = [];
    console.log("[LogsNarrativos] Historial limpiado");
};

// ============================================================
// AGREGAR MENSAJE PERSONALIZADO - Para que Helen agregue nuevos mensajes
// ============================================================
LogsNarrativos.prototype.agregarMensaje = function(tipo, titulo, mensaje, categoria, icono) {
    this.mensajes[tipo] = {
        titulo: titulo,
        mensaje: mensaje,
        tipo: categoria || 'info',
        icono: icono || 'ℹ️'
    };
    console.log("[LogsNarrativos] Nuevo mensaje agregado: " + tipo);
};

// ============================================================
// CLEANUP
// ============================================================
LogsNarrativos.prototype.destroy = function() {
    this.app.off('error:detected', this.onErrorDetected, this);
    this.app.off('success:detected', this.onSuccessDetected, this);
    this.app.off('info:detected', this.onInfoDetected, this);
    this.app.off('robot:caida', this.onRobotCaida, this);
    this.app.off('robot:colision', this.onRobotColision, this);
    this.app.off('robot:fueraDeLimites', this.onRobotFueraDeLimites, this);
    this.app.off('queue:secuenciaVacia', this.onSecuenciaVacia, this);
    this.app.off('state:estadoIncorrecto', this.onEstadoIncorrecto, this);
    this.app.off('level:completado', this.onNivelCompletado, this);
};
