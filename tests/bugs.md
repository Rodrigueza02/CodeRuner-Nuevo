# Bugs detectados

## Bug 1
El robot se cae al ejecutar saltar

## Bug 2
El robot debe hacer un salto mas largo para que se evite caer

---

## 🎯 Sistema de Logs Narrativos - NUEVO

### Estado: ✅ Implementado (Mayo 2026)

**Responsable:** Helen (Narrativa y QA)

**Descripción:**
Sistema que escucha los errores detectados por Daniel y muestra mensajes narrativos educativos para el jugador.

**Archivos Creados:**
- ✅ `scripts/logs-narrativos.js` - Script principal para PlayCanvas
- ✅ `docs/integracion-logs-narrativos.md` - Documentación completa
- ✅ `scripts/ejemplos-integracion-daniel.js` - Ejemplos para Daniel
- ✅ `tests/pruebas-logs-narrativos.md` - Casos de prueba
- ✅ `ui/ejemplo-notificacion-log.html` - Ejemplo visual para Maria
- ✅ `docs/README-LOGS-NARRATIVOS.md` - Guía rápida

**Próximos Pasos:**
1. [ ] Helen: Subir `logs-narrativos.js` a PlayCanvas
2. [ ] Helen: Crear entidad "SistemaLogs" en PlayCanvas
3. [ ] Helen: Probar con los casos de `tests/pruebas-logs-narrativos.md`
4. [ ] Daniel: Integrar eventos en sus scripts usando `scripts/ejemplos-integracion-daniel.js`
5. [ ] Maria: Implementar UI de notificaciones usando `ui/ejemplo-notificacion-log.html`
6. [ ] Todos: Prueba integrada completa

**Flujo de Trabajo:**
```
Daniel detecta error
        ↓
this.app.fire('error:detected', {...})
        ↓
LogsNarrativos.js escucha
        ↓
Se muestra log narrativo
```
