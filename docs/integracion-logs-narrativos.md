# Integración de Logs Narrativos - Guía para Daniel

## 📋 Resumen

Este documento explica cómo integrar el sistema de logs narrativos de Helen con los scripts de detección de errores de Daniel.

## 🔄 Flujo de Trabajo

```
Daniel detecta error
        ↓
this.app.fire('error:detected', {...})
        ↓
LogsNarrativos.js escucha
        ↓
Se muestra log narrativo
```

## 🎯 Cómo Disparar Eventos desde los Scripts de Daniel

### Método 1: Evento Genérico (RECOMENDADO)

```javascript
// En cualquier script de Daniel, cuando detectes un error:
this.app.fire('error:detected', {
    type: 'caida',           // Tipo de error (ver lista abajo)
    data: {                  // Datos adicionales opcionales
        posicion: this.entity.getPosition(),
        velocidad: this.rb.linearVelocity
    }
});
```

### Método 2: Evento Específico

```javascript
// También puedes disparar eventos específicos:
this.app.fire('robot:caida', {
    posicion: this.entity.getPosition()
});
```

## 📝 Tipos de Eventos Disponibles

### Errores de Movimiento
- `caida` - Robot cae al vacío
- `colision` - Robot choca con obstáculo
- `fueraDeLimites` - Robot sale del área de juego

### Errores de Secuencia
- `secuenciaVacia` - No hay comandos para ejecutar
- `secuenciaMuyLarga` - Demasiados comandos

### Errores de Estado
- `estadoIncorrecto` - Estado equivocado para la plataforma
- `plataformaInactiva` - Plataforma no activa

### Mensajes de Éxito
- `nivelCompletado` - Nivel completado exitosamente
- `objetivoAlcanzado` - Robot llegó a la meta

### Mensajes Informativos
- `primerComando` - Primer comando agregado
- `primerCambioEstado` - Cambio de estado detectado

## 🔧 Ejemplos de Integración

### Ejemplo 1: Detectar Caída en PhysicsController

```javascript
// En physics-controller.js
PhysicsController.prototype.update = function(dt) {
    // ... código existente ...
    
    // Detectar si el robot cayó muy abajo
    var pos = this.entity.getPosition();
    if (pos.y < -10) {
        // DISPARAR EVENTO DE ERROR
        this.app.fire('error:detected', {
            type: 'caida',
            data: {
                posicion: pos.clone(),
                mensaje: 'El robot cayó por debajo de Y = -10'
            }
        });
        
        // Reiniciar posición
        this.resetPosition();
    }
};
```

### Ejemplo 2: Detectar Secuencia Vacía en ActionQueue

```javascript
// En action-queue.js
ActionQueue.prototype.executeAll = function() {
    // Si la cola está vacía, disparar evento
    if (this.queue.length === 0) {
        // DISPARAR EVENTO DE ERROR
        this.app.fire('error:detected', {
            type: 'secuenciaVacia',
            data: {
                mensaje: 'El jugador intentó ejecutar sin comandos'
            }
        });
        return;
    }
    
    // ... resto del código ...
};
```

### Ejemplo 3: Detectar Colisión en PhysicsController

```javascript
// En physics-controller.js
PhysicsController.prototype.onCollisionStart = function(result) {
    // Verificar si chocó con un obstáculo
    var otherEntity = result.other;
    
    if (otherEntity.tags && otherEntity.tags.has('obstaculo')) {
        // DISPARAR EVENTO DE ERROR
        this.app.fire('error:detected', {
            type: 'colision',
            data: {
                obstaculo: otherEntity.name,
                posicion: this.entity.getPosition().clone()
            }
        });
    }
    
    // ... resto del código de detección de suelo ...
};
```

### Ejemplo 4: Detectar Estado Incorrecto en StateManager

```javascript
// En state-manager.js
StateManager.prototype.checkPlatformCompatibility = function(platformState) {
    if (this.currentState !== platformState) {
        // DISPARAR EVENTO DE ADVERTENCIA
        this.app.fire('error:detected', {
            type: 'estadoIncorrecto',
            data: {
                estadoActual: this.currentState,
                estadoRequerido: platformState
            }
        });
        return false;
    }
    return true;
};
```

### Ejemplo 5: Detectar Nivel Completado

```javascript
// En un script de nivel o zona de meta
MetaZone.prototype.onTriggerEnter = function(entity) {
    if (entity.name === 'Playbot' || entity.tags.has('robot')) {
        // DISPARAR EVENTO DE ÉXITO
        this.app.fire('success:detected', {
            type: 'nivelCompletado',
            data: {
                tiempo: this.tiempoTranscurrido,
                comandosUsados: this.cantidadComandos
            }
        });
    }
};
```

### Ejemplo 6: Detectar Secuencia Muy Larga

```javascript
// En action-queue.js
ActionQueue.prototype.addAction = function(actionName) {
    // ... código existente ...
    
    this.queue.push(actionName);
    
    // Verificar si la secuencia es muy larga
    if (this.queue.length > 20) {
        this.app.fire('error:detected', {
            type: 'secuenciaMuyLarga',
            data: {
                cantidadComandos: this.queue.length,
                limite: 20
            }
        });
    }
    
    // ... resto del código ...
};
```

## 🎨 Cómo Helen Puede Agregar Nuevos Mensajes

Helen puede agregar nuevos mensajes directamente en `logs-narrativos.js`:

```javascript
// En el método initialize, agregar al diccionario this.mensajes:
this.mensajes = {
    // ... mensajes existentes ...
    
    'nuevoTipoError': {
        titulo: 'Título del error',
        mensaje: 'Descripción educativa del error',
        tipo: 'error',  // 'error', 'advertencia', 'exito', 'info'
        icono: '⚠️'
    }
};
```

O usar el método `agregarMensaje`:

```javascript
// Desde la consola del navegador o desde otro script:
var logsSystem = this.app.root.findByName('SistemaLogs').script.logsNarrativos;
logsSystem.agregarMensaje(
    'robotAtascado',
    '¡El robot está atascado!',
    'Parece que el robot no puede moverse. Intenta reiniciar el nivel.',
    'advertencia',
    '🚫'
);
```

## 🧪 Cómo Probar el Sistema

### Desde la Consola del Navegador (F12):

```javascript
// Probar un error de caída
app.fire('error:detected', { type: 'caida' });

// Probar un mensaje de éxito
app.fire('success:detected', { type: 'nivelCompletado' });

// Probar un mensaje informativo
app.fire('info:detected', { type: 'primerComando' });

// Ver el historial de logs
var logsSystem = app.root.findByName('SistemaLogs').script.logsNarrativos;
console.log(logsSystem.getHistorial());
```

## 📦 Instalación en PlayCanvas

1. **Crear la entidad SistemaLogs:**
   - En la jerarquía, crear una entidad vacía llamada "SistemaLogs"
   - Agregar el script `logs-narrativos.js` como componente

2. **Configurar el script:**
   - En el Inspector, ajustar:
     - ✅ Mostrar en consola (para debug)
     - ✅ Mostrar en UI (para el jugador)

3. **Integrar con los scripts de Daniel:**
   - Seguir los ejemplos de arriba para agregar `this.app.fire()` en los lugares donde se detectan errores

4. **Conectar con la UI de Maria:**
   - La UI debe escuchar el evento `ui:mostrarLog` para mostrar los mensajes en pantalla

## 🔗 Eventos que la UI Debe Escuchar

```javascript
// En el script de UI de Maria:
this.app.on('ui:mostrarLog', function(logData) {
    // logData contiene:
    // - titulo: string
    // - mensaje: string
    // - tipo: 'error' | 'advertencia' | 'exito' | 'info'
    // - icono: string (emoji)
    // - datos: object (datos adicionales opcionales)
    
    // Mostrar el mensaje en la UI
    mostrarNotificacion(logData.titulo, logData.mensaje, logData.tipo);
});
```

## 📊 Diagrama de Flujo Completo

```
┌─────────────────────────────────────────────────────────────┐
│                    SISTEMA DE LOGS                          │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Daniel     │         │    Helen     │         │    Maria     │
│  (Scripts)   │────────▶│ (LogsNarr.)  │────────▶│    (UI)      │
└──────────────┘         └──────────────┘         └──────────────┘
     │                          │                         │
     │ fire('error:detected')   │                         │
     │─────────────────────────▶│                         │
     │                          │ fire('ui:mostrarLog')   │
     │                          │────────────────────────▶│
     │                          │                         │
     │                          │                    Muestra en
     │                          │                    pantalla
```

## ✅ Checklist de Integración

- [ ] Script `logs-narrativos.js` agregado a PlayCanvas
- [ ] Entidad "SistemaLogs" creada con el script
- [ ] Scripts de Daniel actualizados para disparar eventos
- [ ] UI de Maria escucha `ui:mostrarLog`
- [ ] Probado desde la consola del navegador
- [ ] Probado en el juego real

## 🐛 Troubleshooting

**Problema:** Los logs no se muestran
- ✅ Verificar que la entidad "SistemaLogs" existe
- ✅ Verificar que el script está activo (enabled)
- ✅ Abrir consola (F12) y buscar "[LogsNarrativos] Sistema de logs narrativos inicializado"

**Problema:** Los eventos no se disparan
- ✅ Verificar que Daniel está usando `this.app.fire()` correctamente
- ✅ Verificar que el tipo de evento existe en el diccionario de mensajes
- ✅ Revisar la consola por errores de JavaScript

**Problema:** Los mensajes se muestran en consola pero no en UI
- ✅ Verificar que `mostrarEnUI` está activado en el Inspector
- ✅ Verificar que la UI de Maria está escuchando `ui:mostrarLog`

## 📞 Contacto

- **Daniel:** Programación y detección de errores
- **Helen:** Narrativa, mensajes educativos y QA
- **Maria:** UI/UX y visualización de mensajes

---

**Última actualización:** Mayo 2026
**Versión:** 1.0
**Proyecto:** CodeRunner
