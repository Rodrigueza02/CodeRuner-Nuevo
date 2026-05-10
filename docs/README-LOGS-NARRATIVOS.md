# 📚 Sistema de Logs Narrativos - Guía Rápida

## 🎯 ¿Qué es esto?

Un sistema que muestra mensajes educativos cuando el robot comete errores o completa objetivos en el juego CodeRunner.

## 👥 Roles

- **Daniel:** Detecta errores en sus scripts → Dispara eventos
- **Helen:** Escribe mensajes narrativos educativos → Configura el sistema
- **Maria:** Muestra los mensajes en la UI → Escucha eventos

## 🚀 Instalación Rápida en PlayCanvas

### Paso 1: Subir el Script

1. En PlayCanvas, ir a la carpeta `scripts/`
2. Crear un nuevo script llamado `logs-narrativos.js`
3. Copiar el contenido del archivo `scripts/logs-narrativos.js` de este proyecto
4. Guardar

### Paso 2: Crear la Entidad

1. En la jerarquía, crear una entidad vacía
2. Nombrarla: **SistemaLogs**
3. Agregar el script `logs-narrativos.js` como componente
4. Configurar:
   - ✅ Mostrar en consola: ON
   - ✅ Mostrar en UI: ON

### Paso 3: Probar

1. Presionar F12 para abrir la consola
2. Ejecutar:
   ```javascript
   app.fire('error:detected', { type: 'caida' });
   ```
3. Deberías ver: "⚠️ ¡Ups! El robot cayó al vacío"

¡Listo! El sistema está funcionando ✅

## 📖 Archivos Importantes

### Para Helen (Narrativa y QA):

1. **`scripts/logs-narrativos.js`**
   - El script principal que va en PlayCanvas
   - Aquí editas los mensajes narrativos
   - Aquí agregas nuevos tipos de mensajes

2. **`tests/pruebas-logs-narrativos.md`**
   - Lista de pruebas para verificar que todo funciona
   - Casos de prueba paso a paso
   - Checklist de QA

3. **`docs/integracion-logs-narrativos.md`**
   - Documentación completa del sistema
   - Cómo funciona el flujo de trabajo
   - Referencia de todos los tipos de mensajes

### Para Daniel (Programación):

1. **`scripts/ejemplos-integracion-daniel.js`**
   - Ejemplos de código para copiar y pegar
   - Cómo disparar eventos desde sus scripts
   - Código listo para usar

2. **`docs/integracion-logs-narrativos.md`**
   - Guía completa de integración
   - Todos los tipos de eventos disponibles
   - Troubleshooting

### Para Maria (UI/UX):

1. **`docs/integracion-logs-narrativos.md`**
   - Sección sobre cómo conectar la UI
   - Evento `ui:mostrarLog` que debe escuchar
   - Estructura de datos del log

## 🔥 Uso Rápido

### Para Helen: Agregar un Nuevo Mensaje

**Opción 1: Editar el script directamente**

En `logs-narrativos.js`, buscar el diccionario `this.mensajes` y agregar:

```javascript
this.mensajes = {
    // ... mensajes existentes ...
    
    'nuevoMensaje': {
        titulo: 'Título del mensaje',
        mensaje: 'Descripción educativa para el jugador',
        tipo: 'error',  // 'error', 'advertencia', 'exito', 'info'
        icono: '⚠️'
    }
};
```

**Opción 2: Desde la consola del navegador**

```javascript
var logs = app.root.findByName('SistemaLogs').script.logsNarrativos;
logs.agregarMensaje(
    'robotLento',
    'El robot va muy lento',
    'Intenta usar menos comandos "esperar".',
    'advertencia',
    '🐌'
);
```

### Para Daniel: Disparar un Evento

En cualquier script de PlayCanvas:

```javascript
// Cuando detectes un error:
this.app.fire('error:detected', {
    type: 'caida',  // Tipo de mensaje (ver lista abajo)
    data: {         // Datos opcionales
        posicion: this.entity.getPosition(),
        velocidad: 20
    }
});
```

### Para Maria: Escuchar el Evento en la UI

En el script de UI:

```javascript
this.app.on('ui:mostrarLog', function(logData) {
    // logData contiene:
    // - titulo: "¡Ups! El robot cayó al vacío"
    // - mensaje: "Parece que el robot no tenía suelo..."
    // - tipo: "error"
    // - icono: "⚠️"
    // - datos: { posicion: {...}, velocidad: 20 }
    
    // Mostrar en la UI
    mostrarNotificacion(logData.titulo, logData.mensaje, logData.tipo);
});
```

## 📋 Tipos de Mensajes Disponibles

### Errores (tipo: 'error')
- `caida` - Robot cae al vacío
- `colision` - Robot choca con obstáculo
- `fueraDeLimites` - Robot sale del área
- `secuenciaVacia` - No hay comandos
- `errorGenerico` - Error desconocido

### Advertencias (tipo: 'advertencia')
- `secuenciaMuyLarga` - Demasiados comandos
- `estadoIncorrecto` - Estado equivocado
- `plataformaInactiva` - Plataforma no activa

### Éxitos (tipo: 'exito')
- `nivelCompletado` - Nivel completado
- `objetivoAlcanzado` - Robot llegó a la meta

### Informativos (tipo: 'info')
- `primerComando` - Primer comando agregado
- `primerCambioEstado` - Primer cambio de estado

## 🧪 Probar el Sistema

### Prueba Rápida (Consola del Navegador)

```javascript
// Probar un error
app.fire('error:detected', { type: 'caida' });

// Probar un éxito
app.fire('success:detected', { type: 'nivelCompletado' });

// Probar un mensaje informativo
app.fire('info:detected', { type: 'primerComando' });

// Ver el historial
var logs = app.root.findByName('SistemaLogs').script.logsNarrativos;
console.log(logs.getHistorial());
```

## 🔄 Flujo de Trabajo Completo

```
1. Helen escribe los mensajes narrativos
   ↓
2. Helen sube logs-narrativos.js a PlayCanvas
   ↓
3. Helen crea la entidad SistemaLogs
   ↓
4. Daniel integra los eventos en sus scripts
   ↓
5. Maria conecta la UI para mostrar los mensajes
   ↓
6. Helen prueba todo con tests/pruebas-logs-narrativos.md
   ↓
7. ¡El sistema funciona! 🎉
```

## 🐛 Solución de Problemas

### Los logs no aparecen

1. ✅ Verificar que la entidad "SistemaLogs" existe
2. ✅ Verificar que el script está enabled
3. ✅ Abrir consola (F12) y buscar: "[LogsNarrativos] Sistema de logs narrativos inicializado"

### Los eventos no se disparan

1. ✅ Verificar que Daniel está usando `this.app.fire()` correctamente
2. ✅ Verificar que el tipo de evento existe en el diccionario
3. ✅ Revisar la consola por errores de JavaScript

### Los mensajes no se ven en la UI

1. ✅ Verificar que `mostrarEnUI` está ON en el Inspector
2. ✅ Verificar que Maria está escuchando `ui:mostrarLog`
3. ✅ Verificar que la UI tiene una función para mostrar notificaciones

## 📞 Contacto

- **Helen:** Narrativa, mensajes educativos, QA
- **Daniel:** Programación, detección de errores
- **Maria:** UI/UX, visualización de mensajes

## 📚 Documentación Completa

- **Guía de Integración:** `docs/integracion-logs-narrativos.md`
- **Ejemplos de Código:** `scripts/ejemplos-integracion-daniel.js`
- **Casos de Prueba:** `tests/pruebas-logs-narrativos.md`

---

**Proyecto:** CodeRunner  
**Versión:** 1.0  
**Fecha:** Mayo 2026  
**Creado por:** Helen (con ayuda de Kiro)
