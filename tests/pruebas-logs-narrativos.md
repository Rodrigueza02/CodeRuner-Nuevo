# Pruebas del Sistema de Logs Narrativos

## 📋 Información General

**Responsable:** Helen (Narrativa y QA)  
**Sistema:** LogsNarrativos.js  
**Fecha:** Mayo 2026  
**Proyecto:** CodeRunner

## 🎯 Objetivo

Verificar que el sistema de logs narrativos funciona correctamente y muestra los mensajes educativos apropiados cuando Daniel detecta errores.

## 🔧 Configuración Inicial

### Paso 1: Verificar que el script está instalado

1. Abrir PlayCanvas
2. Buscar la entidad "SistemaLogs" en la jerarquía
3. Verificar que tiene el script `logs-narrativos.js` agregado
4. Verificar que el script está **enabled** (activado)

### Paso 2: Configurar opciones

En el Inspector de la entidad "SistemaLogs":
- ✅ **Mostrar en consola:** ON (para ver logs en F12)
- ✅ **Mostrar en UI:** ON (para ver en pantalla)

### Paso 3: Abrir la consola del navegador

1. Presionar **F12** en el navegador
2. Ir a la pestaña **Console**
3. Buscar el mensaje: `[LogsNarrativos] Sistema de logs narrativos inicializado por Helen`

Si ves ese mensaje, el sistema está funcionando ✅

## 🧪 Casos de Prueba

### Prueba 1: Mensaje de Caída

**Objetivo:** Verificar que se muestra el mensaje cuando el robot cae al vacío

**Pasos:**
1. Abrir la consola del navegador (F12)
2. Ejecutar el siguiente comando:
   ```javascript
   app.fire('error:detected', { type: 'caida' });
   ```

**Resultado Esperado:**
- ✅ En la consola aparece: "⚠️ ¡Ups! El robot cayó al vacío"
- ✅ Aparece el mensaje educativo
- ✅ Si la UI está conectada, aparece en pantalla

**Estado:** [ ] Pasó [ ] Falló [ ] No probado

---

### Prueba 2: Mensaje de Colisión

**Objetivo:** Verificar que se muestra el mensaje cuando el robot choca

**Pasos:**
1. Ejecutar en consola:
   ```javascript
   app.fire('error:detected', { type: 'colision' });
   ```

**Resultado Esperado:**
- ✅ Aparece: "🚧 El robot chocó con un obstáculo"
- ✅ Mensaje educativo correcto

**Estado:** [ ] Pasó [ ] Falló [ ] No probado

---

### Prueba 3: Mensaje de Secuencia Vacía

**Objetivo:** Verificar que se muestra cuando no hay comandos

**Pasos:**
1. Ejecutar en consola:
   ```javascript
   app.fire('error:detected', { type: 'secuenciaVacia' });
   ```

**Resultado Esperado:**
- ✅ Aparece: "ℹ️ No hay comandos para ejecutar"
- ✅ Mensaje sugiere agregar comandos

**Estado:** [ ] Pasó [ ] Falló [ ] No probado

---

### Prueba 4: Mensaje de Nivel Completado

**Objetivo:** Verificar mensaje de éxito

**Pasos:**
1. Ejecutar en consola:
   ```javascript
   app.fire('success:detected', { type: 'nivelCompletado' });
   ```

**Resultado Esperado:**
- ✅ Aparece: "✅ ¡Nivel completado! 🎉"
- ✅ Mensaje de felicitación

**Estado:** [ ] Pasó [ ] Falló [ ] No probado

---

### Prueba 5: Mensaje de Primer Comando

**Objetivo:** Verificar mensaje educativo informativo

**Pasos:**
1. Ejecutar en consola:
   ```javascript
   app.fire('info:detected', { type: 'primerComando' });
   ```

**Resultado Esperado:**
- ✅ Aparece: "🎓 Primer comando agregado"
- ✅ Mensaje educativo apropiado

**Estado:** [ ] Pasó [ ] Falló [ ] No probado

---

### Prueba 6: Mensaje de Estado Incorrecto

**Objetivo:** Verificar mensaje de estado

**Pasos:**
1. Ejecutar en consola:
   ```javascript
   app.fire('error:detected', { type: 'estadoIncorrecto' });
   ```

**Resultado Esperado:**
- ✅ Aparece: "🔄 Estado incorrecto"
- ✅ Mensaje sugiere cambiar estado

**Estado:** [ ] Pasó [ ] Falló [ ] No probado

---

### Prueba 7: Mensaje con Datos Adicionales

**Objetivo:** Verificar que los datos adicionales se muestran

**Pasos:**
1. Ejecutar en consola:
   ```javascript
   app.fire('error:detected', {
       type: 'caida',
       data: {
           posicion: { x: 10, y: -15, z: 5 },
           velocidad: 20
       }
   });
   ```

**Resultado Esperado:**
- ✅ Aparece el mensaje de caída
- ✅ En la consola aparecen los datos adicionales

**Estado:** [ ] Pasó [ ] Falló [ ] No probado

---

### Prueba 8: Historial de Logs

**Objetivo:** Verificar que se guarda el historial

**Pasos:**
1. Disparar varios eventos:
   ```javascript
   app.fire('error:detected', { type: 'caida' });
   app.fire('error:detected', { type: 'colision' });
   app.fire('success:detected', { type: 'objetivoAlcanzado' });
   ```

2. Ver el historial:
   ```javascript
   var logs = app.root.findByName('SistemaLogs').script.logsNarrativos;
   console.log(logs.getHistorial());
   ```

**Resultado Esperado:**
- ✅ Aparecen los 3 eventos en el historial
- ✅ Cada evento tiene timestamp, tipo, mensaje y datos

**Estado:** [ ] Pasó [ ] Falló [ ] No probado

---

### Prueba 9: Limpiar Historial

**Objetivo:** Verificar que se puede limpiar el historial

**Pasos:**
1. Disparar algunos eventos
2. Ejecutar:
   ```javascript
   var logs = app.root.findByName('SistemaLogs').script.logsNarrativos;
   logs.limpiarHistorial();
   console.log(logs.getHistorial());
   ```

**Resultado Esperado:**
- ✅ El historial está vacío (array vacío [])

**Estado:** [ ] Pasó [ ] Falló [ ] No probado

---

### Prueba 10: Agregar Mensaje Personalizado

**Objetivo:** Verificar que Helen puede agregar nuevos mensajes

**Pasos:**
1. Ejecutar:
   ```javascript
   var logs = app.root.findByName('SistemaLogs').script.logsNarrativos;
   logs.agregarMensaje(
       'robotAtascado',
       '¡El robot está atascado!',
       'El robot no puede moverse. Intenta reiniciar.',
       'advertencia',
       '🚫'
   );
   ```

2. Probar el nuevo mensaje:
   ```javascript
   app.fire('error:detected', { type: 'robotAtascado' });
   ```

**Resultado Esperado:**
- ✅ Aparece el nuevo mensaje personalizado
- ✅ Con el icono y estilo correcto

**Estado:** [ ] Pasó [ ] Falló [ ] No probado

---

## 🎮 Pruebas de Integración con el Juego

### Prueba 11: Caída Real del Robot

**Objetivo:** Verificar que funciona cuando el robot realmente cae

**Requisitos:** Daniel debe haber integrado el evento en physics-controller.js

**Pasos:**
1. Iniciar el juego
2. Programar al robot para que caiga al vacío
3. Ejecutar la secuencia

**Resultado Esperado:**
- ✅ Cuando el robot cae, aparece el mensaje de caída
- ✅ El mensaje es claro y educativo

**Estado:** [ ] Pasó [ ] Falló [ ] No probado

---

### Prueba 12: Secuencia Vacía Real

**Objetivo:** Verificar que funciona cuando se intenta ejecutar sin comandos

**Requisitos:** Daniel debe haber integrado el evento en action-queue.js

**Pasos:**
1. Iniciar el juego
2. NO agregar ningún comando
3. Presionar el botón "EJECUTAR"

**Resultado Esperado:**
- ✅ Aparece el mensaje de secuencia vacía
- ✅ El robot no se mueve

**Estado:** [ ] Pasó [ ] Falló [ ] No probado

---

### Prueba 13: Nivel Completado Real

**Objetivo:** Verificar que funciona cuando se completa un nivel

**Requisitos:** Daniel debe haber creado una zona de meta con el evento

**Pasos:**
1. Iniciar el juego
2. Programar al robot correctamente
3. Llegar a la meta

**Resultado Esperado:**
- ✅ Aparece el mensaje de nivel completado
- ✅ Mensaje de felicitación

**Estado:** [ ] Pasó [ ] Falló [ ] No probado

---

## 🐛 Pruebas de Errores

### Prueba 14: Tipo de Mensaje Inexistente

**Objetivo:** Verificar que maneja mensajes no definidos

**Pasos:**
1. Ejecutar:
   ```javascript
   app.fire('error:detected', { type: 'mensajeQueNoExiste' });
   ```

**Resultado Esperado:**
- ✅ Aparece el mensaje genérico de error
- ✅ En consola aparece warning sobre tipo no encontrado

**Estado:** [ ] Pasó [ ] Falló [ ] No probado

---

### Prueba 15: Evento sin Tipo

**Objetivo:** Verificar que maneja eventos mal formados

**Pasos:**
1. Ejecutar:
   ```javascript
   app.fire('error:detected', { data: { algo: 'valor' } });
   ```

**Resultado Esperado:**
- ✅ Aparece el mensaje genérico de error
- ✅ No hay errores de JavaScript

**Estado:** [ ] Pasó [ ] Falló [ ] No probado

---

## 📊 Resumen de Pruebas

| Categoría | Total | Pasó | Falló | No Probado |
|-----------|-------|------|-------|------------|
| Mensajes Básicos | 6 | | | |
| Funcionalidad | 4 | | | |
| Integración | 3 | | | |
| Manejo de Errores | 2 | | | |
| **TOTAL** | **15** | | | |

## 📝 Notas de Helen

### Mensajes que Funcionan Bien:
- 

### Mensajes que Necesitan Mejora:
- 

### Sugerencias para Daniel:
- 

### Ideas para Nuevos Mensajes:
- 

## ✅ Checklist Final

- [ ] Todos los mensajes básicos funcionan
- [ ] El historial se guarda correctamente
- [ ] Se pueden agregar mensajes personalizados
- [ ] La integración con los scripts de Daniel funciona
- [ ] Los mensajes son educativos y claros
- [ ] Los iconos y colores son apropiados
- [ ] La UI muestra los mensajes correctamente
- [ ] No hay errores en la consola

## 🔄 Próximos Pasos

1. [ ] Completar todas las pruebas
2. [ ] Reportar bugs a Daniel
3. [ ] Mejorar mensajes según feedback
4. [ ] Agregar más mensajes educativos
5. [ ] Crear guía para jugadores

---

**Última actualización:** Mayo 2026  
**Responsable:** Helen  
**Estado:** En progreso
