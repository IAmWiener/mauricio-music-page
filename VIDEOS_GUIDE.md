# 📋 Guía para Agregar Más Videos

## 🎬 Ubicación del Código para Modificar Videos

Los videos se configuran en el archivo: 
`components/video/VideoModalsInterfaceHTML.tsx`

### 📍 Líneas 8-26: Configuración de Videos

```tsx
// Datos de los videos para cada modal
const videoData = {
  1: [
    // MODAL IZQUIERDO - Agrega más videos aquí
    { title: "Tutorial Básico", duration: "5:42", progress: 45, url: "/Video/VideoModalLeft.mp4" },
    { title: "Conceptos Avanzados", duration: "8:15", progress: 0, url: "/Video/VideoModalLeft.mp4" },
    // AGREGAR MÁS VIDEOS AQUÍ para el modal izquierdo
  ],
  2: [
    // MODAL CENTRAL - Agrega más videos aquí
    { title: "Presentación Principal", duration: "12:35", progress: 73, url: "/Video/VideoModalCenter.mp4" },
    { title: "Demo Interactiva", duration: "15:22", progress: 12, url: "/Video/VideoModalCenter.mp4" },
    // AGREGAR MÁS VIDEOS AQUÍ para el modal central
  ],
  3: [
    // MODAL DERECHO - Agrega más videos aquí
    { title: "Tips y Trucos", duration: "8:21", progress: 28, url: "/Video/VideoModalRight.mp4" },
    { title: "Errores Comunes", duration: "6:45", progress: 0, url: "/Video/VideoModalRight.mp4" },
    // AGREGAR MÁS VIDEOS AQUÍ para el modal derecho
  ]
};
```

## 🔧 Cómo Agregar Videos

### 1. **Subir archivos de video**
   - Coloca tus videos en: `public/Video/`
   - Formato recomendado: `.mp4`
   - Nombres sugeridos: `MiVideo1.mp4`, `MiVideo2.mp4`, etc.

### 2. **Agregar al array de datos**
```tsx
// Ejemplo para agregar un nuevo video al modal izquierdo (1):
1: [
  { title: "Tutorial Básico", duration: "5:42", progress: 45, url: "/Video/VideoModalLeft.mp4" },
  { title: "Conceptos Avanzados", duration: "8:15", progress: 0, url: "/Video/VideoModalLeft.mp4" },
  // ✅ NUEVO VIDEO AGREGADO
  { title: "Mi Nuevo Video", duration: "10:30", progress: 25, url: "/Video/MiVideo1.mp4" },
  { title: "Otro Video", duration: "7:15", progress: 0, url: "/Video/MiVideo2.mp4" }
],
```

### 3. **Campos obligatorios**
- `title`: Título que aparece en la lista y en el modal
- `duration`: Duración en formato "MM:SS"
- `progress`: Progreso en porcentaje (0-100) para la barra de progreso
- `url`: Ruta del archivo (siempre empezar con "/Video/")

### 4. **Actualizar el HTML de las listas**
Ubicación: **Líneas 750-830 aproximadamente**

Para cada modal, agrega elementos `<div className="video-list-item">` correspondientes:

```tsx
// Ejemplo para el modal izquierdo
<div className="video-list-item" onClick={() => (window as any).selectVideo(1, 2)}>
  <div className="video-list-title">Mi Nuevo Video</div>
  <div className="video-list-duration">10:30</div>
</div>
<div className="video-list-item" onClick={() => (window as any).selectVideo(1, 3)}>
  <div className="video-list-title">Otro Video</div>
  <div className="video-list-duration">7:15</div>
</div>
```

**⚠️ Importante**: El índice en `selectVideo(modalNumber, índice)` debe coincidir con la posición en el array (empezando desde 0).

## 📱 Mejoras Implementadas para Mobile

✅ **Z-index alto** (`z-index: 9999`) para que las listas aparezcan por encima de todo
✅ **Position fixed** en responsive para evitar solapamientos
✅ **Box-shadow mejorada** para mejor visibilidad
✅ **Posicionamiento centrado** para el modal central
✅ **Bordes adicionales** en móviles pequeños para destacar las listas

## 🎯 Resultado

- Las listas de videos ahora se muestran **por encima de todas las cards** en mobile
- **Posicionamiento mejorado** para cada modal
- **Mejor visibilidad** con sombras y bordes más pronunciados
- **Centrado automático** para el modal central en dispositivos pequeños
