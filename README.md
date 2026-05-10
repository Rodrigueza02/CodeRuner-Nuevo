# CodeRunner

Juego 3D educativo donde un robot ejecuta acciones programadas.

## 👥 Equipo
- **Daniel:** Programación y sistemas
- **Maria:** UI/UX y diseño
- **Helen:** Narrativa y QA

## 🎮 Tecnologías
- PlayCanvas (Motor 3D)
- JavaScript (Lógica del juego)

## 🎯 Objetivo
Enseñar lógica de programación a niños mediante juego interactivo.

---

## 🆕 Sistema de Logs Narrativos (Mayo 2026)

### ✨ ¿Qué es?
Sistema que muestra mensajes educativos cuando el jugador comete errores o completa objetivos.

### 📚 Documentación Rápida

**Para empezar:**
1. Lee [`RESUMEN-HELEN.md`](RESUMEN-HELEN.md) - Guía rápida para Helen
2. Lee [`docs/README-LOGS-NARRATIVOS.md`](docs/README-LOGS-NARRATIVOS.md) - Guía de instalación

**Documentación completa:**
- [`docs/integracion-logs-narrativos.md`](docs/integracion-logs-narrativos.md) - Guía completa de integración
- [`docs/diagrama-sistema.md`](docs/diagrama-sistema.md) - Diagramas y arquitectura
- [`CHECKLIST-IMPLEMENTACION.md`](CHECKLIST-IMPLEMENTACION.md) - Checklist de implementación

**Para cada rol:**
- **Helen:** [`tests/pruebas-logs-narrativos.md`](tests/pruebas-logs-narrativos.md) - Casos de prueba
- **Daniel:** [`scripts/ejemplos-integracion-daniel.js`](scripts/ejemplos-integracion-daniel.js) - Ejemplos de código
- **Maria:** [`ui/ejemplo-notificacion-log.html`](ui/ejemplo-notificacion-log.html) - Ejemplo visual de UI

### 🚀 Instalación Rápida

1. **Subir script a PlayCanvas:**
   - Copiar `scripts/logs-narrativos.js` a PlayCanvas
   
2. **Crear entidad:**
   - Crear entidad "SistemaLogs"
   - Agregar script `logs-narrativos.js`
   
3. **Probar:**
   ```javascript
   app.fire('error:detected', { type: 'caida' });
   ```

### 📋 Estado del Proyecto

```
✅ Sistema de logs narrativos implementado
⏳ Integración con scripts de Daniel (pendiente)
⏳ Integración con UI de Maria (pendiente)
⏳ Pruebas completas (pendiente)
```

Ver [`CHECKLIST-IMPLEMENTACION.md`](CHECKLIST-IMPLEMENTACION.md) para seguimiento detallado.

---

## 📁 Estructura del Proyecto

```
CodeRunner/
├── docs/                          # Documentación
│   ├── README-LOGS-NARRATIVOS.md  # Guía rápida del sistema
│   ├── integracion-logs-narrativos.md
│   ├── diagrama-sistema.md
│   ├── game-design.md
│   ├── mechanics.md
│   └── ui-design-spec.md
├── scripts/                       # Scripts de PlayCanvas
│   ├── logs-narrativos.js         # ⭐ Sistema de logs
│   ├── ejemplos-integracion-daniel.js
│   ├── actions/
│   │   ├── action-queue.js
│   │   └── ui-bridge.js
│   ├── physics/
│   │   └── physics-controller.js
│   ├── player/
│   │   └── robot-controller.js
│   └── state-system/
│       ├── state-manager.js
│       └── state-platform.js
├── ui/                            # Interfaces de usuario
│   ├── ejemplo-notificacion-log.html  # ⭐ Demo para Maria
│   ├── action-panel.html
│   ├── main-menu.html
│   └── terminal-interface.html
├── tests/                         # Pruebas y QA
│   ├── pruebas-logs-narrativos.md # ⭐ Casos de prueba
│   ├── bugs.md
│   └── test-cases.md
├── narrative/                     # Contenido narrativo
│   └── story.md
├── RESUMEN-HELEN.md              # ⭐ Guía para Helen
├── CHECKLIST-IMPLEMENTACION.md   # ⭐ Checklist de progreso
└── README.md                      # Este archivo
```

---

## 🔄 Flujo de Trabajo

### Sistema de Logs Narrativos

```
Daniel detecta error
        ↓
this.app.fire('error:detected', {...})
        ↓
LogsNarrativos.js escucha
        ↓
Se muestra log narrativo en UI
```

### Desarrollo General

1. **Daniel:** Implementa mecánicas y detecta errores
2. **Helen:** Escribe mensajes narrativos y prueba
3. **Maria:** Diseña y implementa la UI
4. **Todos:** Prueban e iteran

---

## 📞 Contacto

- **Helen:** Narrativa, mensajes educativos, QA
- **Daniel:** Programación, detección de errores, sistemas
- **Maria:** UI/UX, visualización de mensajes

---

**Última actualización:** Mayo 2026  
**Versión:** 1.0
