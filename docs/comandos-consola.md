# 🎮 Comandos de Consola - Sistema de Logs Narrativos

## 📋 Guía Rápida de Comandos

Esta es una referencia rápida de comandos que puedes ejecutar en la consola del navegador (F12) para probar y debuggear el sistema de logs narrativos.

---

## 🚀 Comandos Básicos

### Obtener Referencia al Sistema

```javascript
// Guardar referencia al sistema de logs
var logs = app.root.findByName('SistemaLogs').script.logsNarrativos;
```

---

## 🧪 Probar Mensajes

### Errores (Rojo)

```javascript
// Probar mensaje de caída
app.fire('error:detected', { type: 'caida' });

// Probar mensaje de colisión
app.fire('error:detected', { type: 'colision' });

// Probar mensaje de fuera de límites
app.fire('error:detected', { type: 'fueraDeLimites' });

// Probar mensaje de secuencia vacía
app.fire('error:detected', { type: 'secuenciaVacia' });

// Probar mensaje de error genérico
app.fire('error:detected', { type: 'errorGenerico' });
```

### Advertencias (Naranja)

```javascript
// Probar mensaje de secuencia muy larga
app.fire('error:detected', { type: 'secuenciaMuyLarga' });

// Probar mensaje de estado incorrecto
app.fire('error:detected', { type: 'estadoIncorrecto' });

// Probar mensaje de plataforma inactiva
app.fire('error:detected', { type: 'plataformaInactiva' });
```

### Éxitos (Verde)

```javascript
// Probar mensaje de nivel completado
app.fire('success:detected', { type: 'nivelCompletado' });

// Probar mensaje de objetivo alcanzado
app.fire('success:detected', { type: 'objetivoAlcanzado' });
```

### Informativos (Azul)

```javascript
// Probar mensaje de primer comando
app.fire('info:detected', { type: 'primerComando' });

// Probar mensaje de primer cambio de estado
app.fire('info:detected', { type: 'primerCambioEstado' });
```

---

## 📊 Ver Información del Sistema

### Ver Historial de Logs

```javascript
// Ver todos los logs
var logs = app.root.findByName('SistemaLogs').script.logsNarrativos;
console.log(logs.getHistorial());

// Ver solo los últimos 5 logs
var historial = logs.getHistorial();
console.log(historial.slice(-5));

// Contar logs por tipo
var historial = logs.getHistorial();
var conteo = {};
historial.forEach(function(log) {
    conteo[log.tipo] = (conteo[log.tipo] || 0) + 1;
});
console.log('Logs por tipo:', conteo);
```

### Ver Mensajes Disponibles

```javascript
// Ver todos los tipos de mensajes disponibles
var logs = app.root.findByName('SistemaLogs').script.logsNarrativos;
console.log(Object.keys(logs.mensajes));

// Ver detalles de un mensaje específico
console.log(logs.mensajes['caida']);

// Ver todos los mensajes con detalles
console.log(logs.mensajes);
```

---

## 🔧 Modificar el Sistema

### Agregar Nuevo Mensaje

```javascript
// Agregar un mensaje personalizado
var logs = app.root.findByName('SistemaLogs').script.logsNarrativos;
logs.agregarMensaje(
    'robotLento',                           // ID del mensaje
    'El robot va muy lento',                // Título
    'Intenta usar menos comandos "esperar".', // Mensaje
    'advertencia',                          // Tipo
    '🐌'                                    // Icono
);

// Probar el nuevo mensaje
app.fire('error:detected', { type: 'robotLento' });
```

### Limpiar Historial

```javascript
// Limpiar todo el historial
var logs = app.root.findByName('SistemaLogs').script.logsNarrativos;
logs.limpiarHistorial();
console.log('Historial limpiado');
```

---

## 🎯 Probar con Datos Adicionales

### Mensaje con Datos Simples

```javascript
// Mensaje de caída con posición
app.fire('error:detected', {
    type: 'caida',
    data: {
        posicion: { x: 10, y: -15, z: 5 },
        velocidad: 20
    }
});
```

### Mensaje con Datos Complejos

```javascript
// Mensaje de nivel completado con estadísticas
app.fire('success:detected', {
    type: 'nivelCompletado',
    data: {
        tiempo: 45.5,
        comandosUsados: 12,
        intentos: 3,
        estrellas: 3
    }
});
```

---

## 🔍 Debugging

### Verificar que el Sistema Está Activo

```javascript
// Verificar que la entidad existe
var entity = app.root.findByName('SistemaLogs');
if (entity) {
    console.log('✅ Entidad SistemaLogs encontrada');
} else {
    console.log('❌ Entidad SistemaLogs NO encontrada');
}

// Verificar que el script está cargado
var logs = app.root.findByName('SistemaLogs').script.logsNarrativos;
if (logs) {
    console.log('✅ Script logsNarrativos cargado');
} else {
    console.log('❌ Script logsNarrativos NO cargado');
}

// Verificar configuración
console.log('Mostrar en consola:', logs.mostrarEnConsola);
console.log('Mostrar en UI:', logs.mostrarEnUI);
```

### Ver Eventos Activos

```javascript
// Listar todos los eventos que el sistema escucha
// (Esto es más avanzado, para debugging profundo)
console.log('Eventos escuchados por el sistema:');
console.log('- error:detected');
console.log('- success:detected');
console.log('- info:detected');
console.log('- robot:caida');
console.log('- robot:colision');
console.log('- robot:fueraDeLimites');
console.log('- queue:secuenciaVacia');
console.log('- state:estadoIncorrecto');
console.log('- level:completado');
```

---

## 🎨 Probar Secuencias

### Secuencia de Errores

```javascript
// Simular una secuencia de errores
setTimeout(function() {
    app.fire('error:detected', { type: 'caida' });
}, 0);

setTimeout(function() {
    app.fire('error:detected', { type: 'colision' });
}, 2000);

setTimeout(function() {
    app.fire('error:detected', { type: 'fueraDeLimites' });
}, 4000);

console.log('Secuencia de 3 errores iniciada (cada 2 segundos)');
```

### Secuencia de Progreso

```javascript
// Simular progreso del jugador
setTimeout(function() {
    app.fire('info:detected', { type: 'primerComando' });
}, 0);

setTimeout(function() {
    app.fire('info:detected', { type: 'primerCambioEstado' });
}, 2000);

setTimeout(function() {
    app.fire('success:detected', { type: 'objetivoAlcanzado' });
}, 4000);

setTimeout(function() {
    app.fire('success:detected', { type: 'nivelCompletado' });
}, 6000);

console.log('Secuencia de progreso iniciada');
```

---

## 📈 Análisis de Datos

### Estadísticas del Historial

```javascript
// Obtener estadísticas completas
var logs = app.root.findByName('SistemaLogs').script.logsNarrativos;
var historial = logs.getHistorial();

console.log('=== ESTADÍSTICAS DEL SISTEMA ===');
console.log('Total de logs:', historial.length);

// Contar por tipo
var porTipo = {};
historial.forEach(function(log) {
    porTipo[log.tipo] = (porTipo[log.tipo] || 0) + 1;
});
console.log('Logs por tipo:', porTipo);

// Contar por categoría
var porCategoria = {};
historial.forEach(function(log) {
    var cat = log.mensaje.tipo;
    porCategoria[cat] = (porCategoria[cat] || 0) + 1;
});
console.log('Logs por categoría:', porCategoria);

// Tiempo entre logs
if (historial.length > 1) {
    var primerLog = historial[0].timestamp;
    var ultimoLog = historial[historial.length - 1].timestamp;
    var duracion = (ultimoLog - primerLog) / 1000;
    console.log('Duración de la sesión:', duracion.toFixed(2), 'segundos');
}
```

### Exportar Historial

```javascript
// Exportar historial como JSON
var logs = app.root.findByName('SistemaLogs').script.logsNarrativos;
var historial = logs.getHistorial();
var json = JSON.stringify(historial, null, 2);
console.log(json);

// Copiar al portapapeles (si el navegador lo permite)
// navigator.clipboard.writeText(json);
```

---

## 🛠️ Comandos Avanzados

### Modificar Mensaje Existente

```javascript
// Cambiar el mensaje de caída
var logs = app.root.findByName('SistemaLogs').script.logsNarrativos;
logs.mensajes['caida'].mensaje = 'Nuevo mensaje personalizado para caída';

// Probar el mensaje modificado
app.fire('error:detected', { type: 'caida' });
```

### Deshabilitar/Habilitar Consola

```javascript
// Deshabilitar logs en consola
var logs = app.root.findByName('SistemaLogs').script.logsNarrativos;
logs.mostrarEnConsola = false;

// Habilitar logs en consola
logs.mostrarEnConsola = true;
```

### Deshabilitar/Habilitar UI

```javascript
// Deshabilitar logs en UI
var logs = app.root.findByName('SistemaLogs').script.logsNarrativos;
logs.mostrarEnUI = false;

// Habilitar logs en UI
logs.mostrarEnUI = true;
```

---

## 🎯 Comandos para QA (Helen)

### Suite de Pruebas Rápida

```javascript
// Ejecutar todas las pruebas básicas
console.log('=== INICIANDO SUITE DE PRUEBAS ===');

var tipos = [
    'caida', 'colision', 'fueraDeLimites', 'secuenciaVacia',
    'secuenciaMuyLarga', 'estadoIncorrecto', 'plataformaInactiva',
    'nivelCompletado', 'objetivoAlcanzado',
    'primerComando', 'primerCambioEstado'
];

tipos.forEach(function(tipo, index) {
    setTimeout(function() {
        var categoria = index < 7 ? 'error' : (index < 9 ? 'success' : 'info');
        app.fire(categoria + ':detected', { type: tipo });
        console.log('✅ Probado:', tipo);
    }, index * 1000);
});

console.log('Suite de pruebas iniciada. Duración: ' + tipos.length + ' segundos');
```

### Verificar Todos los Mensajes

```javascript
// Verificar que todos los mensajes tienen los campos requeridos
var logs = app.root.findByName('SistemaLogs').script.logsNarrativos;
var mensajes = logs.mensajes;
var errores = [];

Object.keys(mensajes).forEach(function(key) {
    var msg = mensajes[key];
    if (!msg.titulo) errores.push(key + ': falta titulo');
    if (!msg.mensaje) errores.push(key + ': falta mensaje');
    if (!msg.tipo) errores.push(key + ': falta tipo');
    if (!msg.icono) errores.push(key + ': falta icono');
});

if (errores.length === 0) {
    console.log('✅ Todos los mensajes están completos');
} else {
    console.log('❌ Errores encontrados:');
    errores.forEach(function(e) { console.log('  -', e); });
}
```

---

## 📋 Comandos de Referencia Rápida

```javascript
// COPIAR Y PEGAR ESTOS COMANDOS

// 1. Obtener referencia
var logs = app.root.findByName('SistemaLogs').script.logsNarrativos;

// 2. Probar error
app.fire('error:detected', { type: 'caida' });

// 3. Probar éxito
app.fire('success:detected', { type: 'nivelCompletado' });

// 4. Ver historial
console.log(logs.getHistorial());

// 5. Ver mensajes disponibles
console.log(Object.keys(logs.mensajes));

// 6. Limpiar historial
logs.limpiarHistorial();

// 7. Agregar mensaje
logs.agregarMensaje('miMensaje', 'Título', 'Mensaje', 'info', '💡');

// 8. Verificar sistema
console.log('Sistema activo:', !!logs);
```

---

## 🆘 Solución de Problemas

### Error: "Cannot read property 'script' of null"

```javascript
// Verificar que la entidad existe
var entity = app.root.findByName('SistemaLogs');
if (!entity) {
    console.log('❌ La entidad SistemaLogs no existe');
    console.log('Solución: Crear la entidad en PlayCanvas');
} else {
    console.log('✅ Entidad encontrada');
}
```

### Error: "logs.mensajes is undefined"

```javascript
// Verificar que el script está cargado correctamente
var entity = app.root.findByName('SistemaLogs');
if (entity && !entity.script.logsNarrativos) {
    console.log('❌ El script no está cargado');
    console.log('Solución: Verificar que el script está agregado a la entidad');
}
```

---

**Proyecto:** CodeRunner  
**Sistema:** Logs Narrativos  
**Versión:** 1.0  
**Fecha:** Mayo 2026
