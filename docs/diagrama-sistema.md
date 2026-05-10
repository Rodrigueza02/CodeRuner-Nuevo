# 📊 Diagrama del Sistema de Logs Narrativos

## 🎯 Arquitectura General

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CODERUNNER - SISTEMA DE LOGS                 │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│                  │         │                  │         │                  │
│     DANIEL       │         │      HELEN       │         │      MARIA       │
│  (Programación)  │────────▶│   (Narrativa)    │────────▶│     (UI/UX)      │
│                  │         │                  │         │                  │
└──────────────────┘         └──────────────────┘         └──────────────────┘
        │                            │                            │
        │                            │                            │
        ▼                            ▼                            ▼
┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│  Scripts de      │         │  LogsNarrativos  │         │  Notificaciones  │
│  Detección       │         │  .js             │         │  en Pantalla     │
│                  │         │                  │         │                  │
│ • physics-       │         │ • Diccionario    │         │ • Toast          │
│   controller.js  │         │   de mensajes    │         │ • Modal          │
│ • action-queue   │         │ • Escucha        │         │ • Animaciones    │
│   .js            │         │   eventos        │         │                  │
│ • state-manager  │         │ • Dispara UI     │         │                  │
│   .js            │         │                  │         │                  │
└──────────────────┘         └──────────────────┘         └──────────────────┘
```

## 🔄 Flujo de Datos Detallado

```
PASO 1: DETECCIÓN DE ERROR
┌─────────────────────────────────────────────────────────┐
│  physics-controller.js (Daniel)                         │
│                                                         │
│  update(dt) {                                           │
│    var pos = this.entity.getPosition();                 │
│    if (pos.y < -10) {                                   │
│      // ¡Robot cayó!                                    │
│      this.app.fire('error:detected', {                  │
│        type: 'caida',                                   │
│        data: { posicion: pos }                          │
│      });                                                │
│    }                                                    │
│  }                                                      │
└─────────────────────────────────────────────────────────┘
                        │
                        │ app.fire('error:detected')
                        ▼
PASO 2: PROCESAMIENTO DEL MENSAJE
┌─────────────────────────────────────────────────────────┐
│  logs-narrativos.js (Helen)                             │
│                                                         │
│  onErrorDetected(errorData) {                           │
│    var tipo = errorData.type; // 'caida'               │
│    var mensaje = this.mensajes[tipo];                   │
│    // mensaje = {                                       │
│    //   titulo: '¡Ups! El robot cayó al vacío',        │
│    //   mensaje: 'Parece que el robot...',             │
│    //   tipo: 'error',                                  │
│    //   icono: '⚠️'                                     │
│    // }                                                 │
│    this.mostrarLog(tipo, errorData.data);               │
│  }                                                      │
└─────────────────────────────────────────────────────────┘
                        │
                        │ app.fire('ui:mostrarLog')
                        ▼
PASO 3: VISUALIZACIÓN EN UI
┌─────────────────────────────────────────────────────────┐
│  ui-manager.js (Maria)                                  │
│                                                         │
│  this.app.on('ui:mostrarLog', function(logData) {       │
│    mostrarNotificacion(                                 │
│      logData.titulo,    // '¡Ups! El robot cayó...'    │
│      logData.mensaje,   // 'Parece que el robot...'    │
│      logData.tipo,      // 'error'                      │
│      logData.icono      // '⚠️'                         │
│    );                                                   │
│  });                                                    │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
PASO 4: JUGADOR VE EL MENSAJE
┌─────────────────────────────────────────────────────────┐
│  Pantalla del Juego                                     │
│                                                         │
│  ┌──────────────────────────────────────────────┐      │
│  │ ⚠️ ¡Ups! El robot cayó al vacío         [×] │      │
│  │                                              │      │
│  │ Parece que el robot no tenía suelo debajo.  │      │
│  │ Recuerda verificar que haya una plataforma  │      │
│  │ antes de avanzar.                            │      │
│  └──────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────┘
```

## 📋 Tipos de Eventos

```
┌─────────────────────────────────────────────────────────────────┐
│                      EVENTOS DISPONIBLES                        │
└─────────────────────────────────────────────────────────────────┘

ERROR (Rojo 🔴)
├── caida                  → Robot cae al vacío
├── colision               → Robot choca con obstáculo
├── fueraDeLimites         → Robot sale del área
├── secuenciaVacia         → No hay comandos
└── errorGenerico          → Error desconocido

ADVERTENCIA (Naranja 🟠)
├── secuenciaMuyLarga      → Demasiados comandos
├── estadoIncorrecto       → Estado equivocado
└── plataformaInactiva     → Plataforma no activa

ÉXITO (Verde 🟢)
├── nivelCompletado        → Nivel completado
└── objetivoAlcanzado      → Robot llegó a la meta

INFO (Azul 🔵)
├── primerComando          → Primer comando agregado
└── primerCambioEstado     → Primer cambio de estado
```

## 🎨 Estructura de un Mensaje

```
┌─────────────────────────────────────────────────────────────────┐
│                    ESTRUCTURA DE MENSAJE                        │
└─────────────────────────────────────────────────────────────────┘

{
  'caida': {                           ← Identificador único
    titulo: '¡Ups! El robot cayó',     ← Título corto (1 línea)
    mensaje: 'Parece que...',          ← Mensaje educativo (2-3 líneas)
    tipo: 'error',                     ← Categoría visual
    icono: '⚠️'                        ← Emoji/icono
  }
}

                    ↓ Se convierte en ↓

┌──────────────────────────────────────────────┐
│ ⚠️ ¡Ups! El robot cayó al vacío         [×] │  ← titulo + icono
│                                              │
│ Parece que el robot no tenía suelo debajo.  │  ← mensaje
│ Recuerda verificar que haya una plataforma  │
│ antes de avanzar.                            │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │  ← barra de progreso
└──────────────────────────────────────────────┘
   ↑
   Borde rojo (tipo: 'error')
```

## 🔧 Puntos de Integración

```
┌─────────────────────────────────────────────────────────────────┐
│              DÓNDE INTEGRAR EN CADA SCRIPT                      │
└─────────────────────────────────────────────────────────────────┘

physics-controller.js
├── update()
│   ├── Detectar caída (pos.y < -10)
│   └── Detectar fuera de límites
├── onCollisionStart()
│   └── Detectar colisión con obstáculos
└── doJump()
    └── Detectar salto sin suelo

action-queue.js
├── executeAll()
│   └── Detectar secuencia vacía
├── addAction()
│   ├── Detectar primer comando
│   └── Detectar secuencia muy larga
└── finishExecution()
    └── Detectar nivel completado

state-manager.js
├── changeState()
│   └── Detectar primer cambio de estado
└── applyState()
    └── Detectar estado incorrecto

meta-zone.js (nuevo)
└── onTriggerEnter()
    └── Detectar objetivo alcanzado
```

## 📊 Diagrama de Clases

```
┌─────────────────────────────────────────────────────────────────┐
│                      CLASES Y RELACIONES                        │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│  PhysicsController   │
│  (Daniel)            │
├──────────────────────┤
│ + update()           │
│ + doMove()           │
│ + doJump()           │
│ + onCollisionStart() │
└──────────────────────┘
          │
          │ fire('error:detected')
          ▼
┌──────────────────────┐
│  LogsNarrativos      │
│  (Helen)             │
├──────────────────────┤
│ - mensajes: {}       │
│ - historial: []      │
├──────────────────────┤
│ + onErrorDetected()  │
│ + mostrarLog()       │
│ + agregarMensaje()   │
│ + getHistorial()     │
└──────────────────────┘
          │
          │ fire('ui:mostrarLog')
          ▼
┌──────────────────────┐
│  UIManager           │
│  (Maria)             │
├──────────────────────┤
│ + mostrarNotif()     │
│ + cerrarNotif()      │
│ + mostrarModal()     │
└──────────────────────┘
```

## 🎮 Ejemplo de Uso Completo

```
┌─────────────────────────────────────────────────────────────────┐
│                    EJEMPLO: ROBOT CAE AL VACÍO                  │
└─────────────────────────────────────────────────────────────────┘

TIEMPO: T=0
┌────────────────────────────────────┐
│  Jugador programa:                 │
│  1. Avanzar                        │
│  2. Avanzar                        │
│  3. Avanzar (no hay plataforma)    │
└────────────────────────────────────┘

TIEMPO: T=1
┌────────────────────────────────────┐
│  Robot ejecuta comandos 1 y 2      │
│  Robot está en el borde            │
└────────────────────────────────────┘

TIEMPO: T=2
┌────────────────────────────────────┐
│  Robot ejecuta comando 3           │
│  Robot avanza al vacío             │
│  pos.y empieza a bajar             │
└────────────────────────────────────┘

TIEMPO: T=3
┌────────────────────────────────────┐
│  physics-controller.js detecta:    │
│  pos.y = -12 (< -10)               │
│                                    │
│  this.app.fire('error:detected', { │
│    type: 'caida',                  │
│    data: { posicion: pos }         │
│  });                               │
└────────────────────────────────────┘
              ↓
TIEMPO: T=3.001
┌────────────────────────────────────┐
│  logs-narrativos.js recibe evento  │
│  Busca mensaje tipo 'caida'        │
│  Encuentra:                        │
│  {                                 │
│    titulo: '¡Ups! Robot cayó',    │
│    mensaje: 'Parece que...',      │
│    tipo: 'error',                  │
│    icono: '⚠️'                     │
│  }                                 │
└────────────────────────────────────┘
              ↓
TIEMPO: T=3.002
┌────────────────────────────────────┐
│  logs-narrativos.js dispara:       │
│  this.app.fire('ui:mostrarLog', {  │
│    titulo: '¡Ups! Robot cayó',    │
│    mensaje: 'Parece que...',      │
│    tipo: 'error',                  │
│    icono: '⚠️'                     │
│  });                               │
└────────────────────────────────────┘
              ↓
TIEMPO: T=3.003
┌────────────────────────────────────┐
│  ui-manager.js recibe evento       │
│  Llama a mostrarNotificacion()     │
│  Crea elemento HTML                │
│  Agrega animación de entrada       │
└────────────────────────────────────┘
              ↓
TIEMPO: T=3.1
┌────────────────────────────────────┐
│  JUGADOR VE EN PANTALLA:           │
│                                    │
│  ┌──────────────────────────────┐ │
│  │ ⚠️ ¡Ups! Robot cayó     [×] │ │
│  │                              │ │
│  │ Parece que el robot no tenía │ │
│  │ suelo debajo. Recuerda...    │ │
│  └──────────────────────────────┘ │
└────────────────────────────────────┘
              ↓
TIEMPO: T=8.1
┌────────────────────────────────────┐
│  Notificación se cierra            │
│  automáticamente (5 segundos)      │
│  O jugador la cierra manualmente   │
└────────────────────────────────────┘
```

## 🔍 Debugging y Monitoreo

```
┌─────────────────────────────────────────────────────────────────┐
│                    HERRAMIENTAS DE DEBUG                        │
└─────────────────────────────────────────────────────────────────┘

CONSOLA DEL NAVEGADOR (F12)
├── Ver inicialización
│   └── "[LogsNarrativos] Sistema inicializado"
├── Ver eventos disparados
│   └── "[LogsNarrativos] Mostrando log: caida"
├── Ver historial
│   └── logs.getHistorial()
└── Probar eventos manualmente
    └── app.fire('error:detected', { type: 'caida' })

HISTORIAL INTERNO
├── Guarda últimos 50 eventos
├── Incluye timestamp
├── Incluye datos adicionales
└── Accesible vía logs.getHistorial()

INSPECTOR DE PLAYCANVAS
├── Ver entidad "SistemaLogs"
├── Ver script enabled/disabled
├── Ver configuración
│   ├── mostrarEnConsola
│   └── mostrarEnUI
└── Ver errores de script
```

## 📈 Métricas y Análisis

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATOS QUE SE PUEDEN ANALIZAR                 │
└─────────────────────────────────────────────────────────────────┘

HISTORIAL DE LOGS
├── Tipo de error más común
├── Frecuencia de errores
├── Secuencia de errores
└── Datos adicionales por error

EJEMPLO DE ANÁLISIS:
var logs = app.root.findByName('SistemaLogs').script.logsNarrativos;
var historial = logs.getHistorial();

// Contar errores por tipo
var conteo = {};
historial.forEach(function(log) {
  conteo[log.tipo] = (conteo[log.tipo] || 0) + 1;
});
console.log(conteo);
// { caida: 5, colision: 2, secuenciaVacia: 1 }
```

---

**Proyecto:** CodeRunner  
**Fecha:** Mayo 2026  
**Creado por:** Helen con ayuda de Kiro
