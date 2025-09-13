# Componentes de Video

Este directorio contiene los componentes para la interfaz de modales de video, que replica exactamente el diseño y funcionalidad del HTML/CSS/JS vanilla original.

## Componentes

### `VideoModalsInterface`
Componente principal que renderiza los tres modales de video (izquierdo, central y derecho) con efectos interactivos.

**Características:**
- Tres modales de video con diseño responsive
- Dropdowns para selección de videos
- Efectos de hover y animaciones
- Reproducción de video en pantalla completa
- Partículas interactivas
- Barras de progreso personalizadas

### `VideoSection`
Wrapper que envuelve el `VideoModalsInterface` con título y subtítulo opcionales.

**Props:**
- `className`: Clases CSS adicionales
- `title`: Título de la sección (por defecto: "Videos Premium")
- `subtitle`: Subtítulo (por defecto: "Explora nuestro contenido exclusivo")
- `showHeader`: Mostrar/ocultar header (por defecto: true)
- `id`: ID del elemento HTML (por defecto: "videos")

### `FullscreenVideoModal`
Modal para reproducir videos en pantalla completa con controles personalizados.

**Props:**
- `isOpen`: Estado del modal
- `videoUrl`: URL del video a reproducir
- `title`: Título del video
- `onClose`: Función para cerrar el modal

## Uso

```tsx
import { VideoSection } from '@/components/video';

// Uso básico
<VideoSection />

// Uso con props personalizadas
<VideoSection 
  id="music"
  title="Videos Premium" 
  subtitle="Explora nuestro contenido exclusivo"
  className="relative bg-black"
/>
```

## Videos

Los videos se cargan desde la carpeta `public/Video/`:
- `VideoModalLeft.mp4` - Videos del modal izquierdo
- `VideoModalCenter.mp4` - Videos del modal central
- `VideoModalRight.mp4` - Videos del modal derecho

## Estilos

Los estilos están integrados en `app/globals.css` con el prefijo `.video-modals-interface` para evitar conflictos.

## Funcionalidades

1. **Dropdowns interactivos**: Cada modal tiene un dropdown con lista de videos
2. **Selección de videos**: Clic en un elemento del dropdown cambia el video activo
3. **Reproducción**: Clic en el modal abre el video en pantalla completa
4. **Efectos visuales**: Partículas que siguen el mouse y animaciones suaves
5. **Responsive**: Adaptativo a móviles y tablets
6. **Accesibilidad**: Controles de teclado y navegación

## Personalización

Para personalizar los videos, edita el objeto `videoData` en `VideoModalsInterface.tsx`:

```tsx
const videoData: VideoData = {
  1: [
    { title: "Mi Video", duration: "5:42", progress: 45, url: "/Video/MiVideo.mp4" }
  ],
  // ...
};
```
