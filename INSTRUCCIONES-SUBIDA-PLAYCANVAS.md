# 📤 Instrucciones de Subida a PlayCanvas

## 🎯 Resumen

Este documento indica **qué archivos debe subir cada persona** a PlayCanvas después de hacer merge de la rama `dev-helen-qa`.

---

## 👥 HELEN (Narrativa y QA)

### Archivos que HELEN debe subir a PlayCanvas:

#### ✅ Script Principal (OBLIGATORIO)
```
scripts/logs-narrativos.js
```
**Qué hacer:**
1. En PlayCanvas, ir a carpeta `scripts/`
2. Crear nuevo script: `logs-narrativos.js`
3. Copiar el contenido del archivo
4. Guardar

#### ✅ Crear Entidad (OBLIGATORIO)
**Qué hacer:**
1. En la jerarquía de PlayCanvas, crear entidad vacía
2. Nombrarla: **SistemaLogs**
3. Agregar el script `logs-narrativos.js` a la entidad
4. Configurar:
   - ✅ Mostrar en consola: ON
   - ✅ Mostrar en UI: ON

#### ✅ Script de Meta (OBLIGATORIO)
```
scripts/meta-zone.js
```
**Qué hacer:**
1. En PlayCanvas, ir a carpeta `scripts/`
2. Crear nuevo script: `meta-zone.js`
3. Copiar el contenido del archivo
4. Guardar
5. Agregar a la entidad de la zona de meta (crear una si no existe)

#### 📄 Archivos de Documentación (NO subir a PlayCanvas)
Estos archivos son solo para el equipo, NO van a PlayCanvas:
- ❌ `RESUMEN-HELEN.md`
- ❌ `CHECKLIST-IMPLEMENTACION.md`
- ❌ `docs/README-LOGS-NARRATIVOS.md`
- ❌ `docs/integracion-logs-narrativos.md`
- ❌ `docs/diagrama-sistema.md`
- ❌ `docs/comandos-consola.md`
- ❌ `tests/pruebas-logs-narrativos.md`
- ❌ `scripts/ejemplos-integracion-daniel.js`

---

## 👨‍💻 DANIEL (Programación)

### Archivos que DANIEL debe ACTUALIZAR en PlayCanvas:

Daniel ya tiene estos archivos en PlayCanvas, pero ahora tienen **eventos nuevos** que debe actualizar:

#### ✅ Scripts a ACTUALIZAR (OBLIGATORIO)

1. **`scripts/physics/physics-controller.js`**
   - **Qué cambió:** Agregados eventos de detección de errores
   - **Nuevos eventos:**
     - Detección de caída (cuando Y < -10)
     - Detección de fuera de límites
     - Detección de colisión con obstáculos
   - **Qué hacer:** Reemplazar el archivo completo en PlayCanvas

2. **`scripts/actions/action-queue.js`**
   - **Qué cambió:** Agregados eventos de validación
   - **Nuevos eventos:**
     - Secuencia vacía
     - Primer comando agregado
     - Secuencia muy larga (>20 comandos)
   - **Qué hacer:** Reemplazar el archivo completo en PlayCanvas

3. **`scripts/state-system/state-manager.js`**
   - **Qué cambió:** Agregado evento de primer cambio de estado
   - **Nuevos eventos:**
     - Primer cambio de estado
   - **Qué hacer:** Reemplazar el archivo completo en PlayCanvas

#### 📋 Scripts que NO necesitan cambios
Estos scripts de Daniel NO cambiaron, no necesita hacer nada:
- ✅ `scripts/player/robot-controller.js` (sin cambios)
- ✅ `scripts/robot-movement.js` (sin cambios)
- ✅ `scripts/state-system/state-platform.js` (sin cambios)
- ✅ `scripts/actions/ui-bridge.js` (sin cambios)
- ✅ `scripts/ui-manager.js` (sin cambios)

---

## 👩‍🎨 JULIANA/MARIA (UI/UX)

### Archivos que MARIA debe subir/actualizar en PlayCanvas:

#### ✅ Archivo HTML de Ejemplo (REFERENCIA)
```
ui/ejemplo-notificacion-log.html
```
**Qué hacer:**
- ❌ NO subir este archivo a PlayCanvas directamente
- ✅ Abrir el archivo en navegador para ver el demo
- ✅ Copiar los estilos CSS a tu archivo de UI existente
- ✅ Copiar las funciones JavaScript a tu código de UI
- ✅ Agregar el listener de eventos en tu script de UI

#### ✅ Integración en UI Manager
**Qué hacer:**
1. Abrir tu script de UI en PlayCanvas (probablemente `ui-manager.js`)
2. Agregar este código:

```javascript
// INTEGRACIÓN CON SISTEMA DE LOGS DE HELEN
this.app.on('ui:mostrarLog', function(logData) {
    // logData contiene:
    // - titulo: string
    // - mensaje: string
    // - tipo: 'error' | 'advertencia' | 'exito' | 'info'
    // - icono: string (emoji)
    // - datos: object (opcional)
    
    // Llamar a tu función de mostrar notificación
    mostrarNotificacion(
        logData.titulo,
        logData.mensaje,
        logData.tipo,
        logData.icono
    );
});
```

#### 📋 Archivos de UI que NO necesitan cambios
Estos archivos de Maria NO cambiaron:
- ✅ `ui/action-panel.html` (sin cambios)
- ✅ `ui/main-menu.html` (sin cambios)
- ✅ `ui/terminal-interface.html` (sin cambios)

---

## 🔄 Flujo de Trabajo Recomendado

### Paso 1: Mergear la rama de Helen

Cada persona debe hacer esto en su rama:

```bash
# Daniel en su rama
git checkout dev-daniel-logica
git merge dev-helen-qa

# Maria en su rama
git checkout dev-maria-ui
git merge dev-helen-qa
```

### Paso 2: Revisar los cambios

Después del merge, cada persona debe revisar qué archivos cambiaron:

```bash
git log --oneline -5
git diff HEAD~1
```

### Paso 3: Subir a PlayCanvas

Cada persona sube **solo sus archivos** según la lista de arriba.

### Paso 4: Probar en PlayCanvas

1. **Helen:** Probar que el sistema de logs funciona
2. **Daniel:** Probar que los eventos se disparan correctamente
3. **Maria:** Probar que las notificaciones se muestran en la UI

---

## 📋 Checklist de Subida

### ✅ HELEN
- [ ] Subir `scripts/logs-narrativos.js` a PlayCanvas
- [ ] Crear entidad "SistemaLogs" en PlayCanvas
- [ ] Agregar script a la entidad
- [ ] Configurar opciones (mostrar en consola, mostrar en UI)
- [ ] Subir `scripts/meta-zone.js` a PlayCanvas
- [ ] Crear entidad de zona de meta
- [ ] Probar con F12 → `app.fire('error:detected', { type: 'caida' });`

### ✅ DANIEL
- [ ] Hacer merge de `dev-helen-qa` a `dev-daniel-logica`
- [ ] Actualizar `scripts/physics/physics-controller.js` en PlayCanvas
- [ ] Actualizar `scripts/actions/action-queue.js` en PlayCanvas
- [ ] Actualizar `scripts/state-system/state-manager.js` en PlayCanvas
- [ ] Probar que los eventos se disparan cuando hay errores
- [ ] Commit y push de los cambios a git

### ✅ MARIA/JULIANA
- [ ] Hacer merge de `dev-helen-qa` a `dev-maria-ui`
- [ ] Abrir `ui/ejemplo-notificacion-log.html` en navegador
- [ ] Copiar estilos CSS a tu archivo de UI
- [ ] Copiar funciones JavaScript
- [ ] Agregar listener `app.on('ui:mostrarLog', ...)` en tu script
- [ ] Probar que las notificaciones se muestran
- [ ] Commit y push de los cambios a git

---

## 🧪 Cómo Probar que Todo Funciona

### Prueba 1: Sistema de Logs (Helen)
```javascript
// En consola de PlayCanvas (F12)
app.fire('error:detected', { type: 'caida' });
// Debe aparecer: "⚠️ ¡Ups! El robot cayó al vacío"
```

### Prueba 2: Detección de Errores (Daniel)
1. Programar al robot para que caiga al vacío
2. Ejecutar la secuencia
3. Debe aparecer el mensaje de caída automáticamente

### Prueba 3: UI de Notificaciones (Maria)
1. Disparar un evento de error
2. Debe aparecer una notificación visual en pantalla
3. La notificación debe tener el color correcto según el tipo

---

## 📊 Resumen Visual

```
┌─────────────────────────────────────────────────────────────┐
│                    QUIÉN SUBE QUÉ                           │
└─────────────────────────────────────────────────────────────┘

HELEN (Narrativa y QA)
├── ✅ logs-narrativos.js (NUEVO)
├── ✅ meta-zone.js (NUEVO)
└── ✅ Crear entidad SistemaLogs

DANIEL (Programación)
├── ✅ physics-controller.js (ACTUALIZAR)
├── ✅ action-queue.js (ACTUALIZAR)
└── ✅ state-manager.js (ACTUALIZAR)

MARIA/JULIANA (UI/UX)
├── ✅ Copiar estilos de ejemplo-notificacion-log.html
├── ✅ Copiar funciones JavaScript
└── ✅ Agregar listener en ui-manager.js
```

---

## 🆘 Solución de Problemas

### Problema: Conflictos al hacer merge
**Solución:**
1. Revisar qué archivos tienen conflictos: `git status`
2. Abrir los archivos con conflictos
3. Resolver manualmente (buscar `<<<<<<<`, `=======`, `>>>>>>>`)
4. Hacer `git add .` y `git commit`

### Problema: No sé si mi archivo cambió
**Solución:**
```bash
git diff dev-helen-qa -- ruta/al/archivo.js
```

### Problema: Los eventos no se disparan
**Solución:**
1. Verificar que la entidad SistemaLogs existe
2. Verificar que el script está enabled
3. Abrir consola (F12) y buscar: `[LogsNarrativos] Sistema inicializado`

---

## 📞 Coordinación del Equipo

### Orden Recomendado de Subida:

1. **HELEN primero** (30 min)
   - Sube `logs-narrativos.js` y `meta-zone.js`
   - Crea la entidad SistemaLogs
   - Prueba que funciona

2. **DANIEL segundo** (30 min)
   - Hace merge de la rama de Helen
   - Actualiza sus 3 scripts
   - Prueba que los eventos se disparan

3. **MARIA tercero** (1 hora)
   - Hace merge de la rama de Helen
   - Implementa la UI de notificaciones
   - Prueba que se muestran correctamente

4. **TODOS juntos** (30 min)
   - Prueba integrada completa
   - Jugar un nivel y verificar que todo funciona

---

**Proyecto:** CodeRunner  
**Sistema:** Logs Narrativos  
**Rama:** dev-helen-qa  
**Fecha:** Mayo 2026  
**Estado:** ✅ Listo para subir a PlayCanvas
