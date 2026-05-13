# Eco Tips - Documentación y Arquitectura del Proyecto

Esta es la guía técnica completa para entender cómo funciona, cómo se escala y cómo realizar ajustes futuros en el proyecto **Eco Tips**.

## 1. Visión General
Eco Tips es una plataforma social moderna diseñada para compartir prácticas medioambientales sustentables. Está construida usando **React (Vite)** para el frontend y **Firebase (Auth & Firestore)** para el backend. Su interfaz visual toma elementos de diseño modernos (glass-morphism, diseño de tarjetas asimétricas estilo Pinterest, modo oscuro/claro implícito).

---

## 2. Estructura de Directorios (`/src`)

El código está organizado de manera modular para garantizar máxima mantenibilidad:

- **`/components`**: Contiene componentes de interfaz reutilizables.
  - `Navbar.jsx` / `Footer.jsx`: Navegación principal adaptativa.
  - `TipCard.jsx`: Elemento vital del diseño, representa un post-it o tarjeta interactiva.
  - Varios `*Modal.jsx` (CreateTip, EditTip, Auth, Report, TipDetails, EditProfile): Sistema unificado de ventanas flotantes.

- **`/context`**: El «cerebro» del estado global de React. Se usa la API Context para evitar pasar datos componente por componente (*prop drilling*).
  - `AuthContext.jsx`: Maneja la sesión del usuario vigente.
  - `DataContext.jsx`: Se comunica con Firebase. Carga tips, maneja likes, comentarios y scroll infinito.
  - `LanguageContext.jsx`: Sistema de internacionalización (i18n) para traducción en tiempo real (Inglés / Español).

- **`/pages`**: Vistas de la aplicación.
  - `Home.jsx`: El feed principal estilo Pinterest.
  - `Profile.jsx`: Información del usuario, sus propios tips y notificaciones.
  - `ModeratorDashboard.jsx`: Un panel de control visible solo para cuentas administradoras.
  - `LegalAndStandards.jsx`: Normativas de diseño y privacidad de la comunidad.

- **`App.jsx`**: Enrutador principal usando `react-router-dom`. Define las URLs (p.ej: `/`, `/profile`).
- **`index.css`**: Archivo universal de estilos Vanilla CSS. Contiene el *Design System*.
- **`firebase.js`**: Credenciales nativas del proyecto conectado a Google.

---

## 3. ¿Cómo funciona el "Escalamiento" (Scaling)?

El término escalamiento en este proyecto se abordó desde dos frentes clave: **Visual Front-end (UI)** y **Base de Datos (Back-end)**.

### A. Escalamiento Visual (Diseño Responsive)
1. **El Tablero de Tips (`.tips-board`)**:
   Los posts en el feed principal no se ordenan en una cuadrícula (grid) cuadrada clásica, sino que fluyen en **columnas CSS puras** (`columns: 3` en desktop). 
   - A medida que las pantallas se reducen (tablets, teléfonos), un *Media Query* en `index.css` ajusta la densidad de columnas a 2 o hasta 1 de forma automática. 
   - Las tarjetas no se cortan gracias a las propiedades `avoid-break-inside`. 
2. **Sistema Híbrido Mobile-First**: 
   Todo el diseño (márgenes, iconos y modales) asume un tamaño de móvil primero. Elementos adicionales o extensiones de barra lateral se "sueltan" (escalan) únicamente en escritorio. Por ejemplo, los botones de sesión se achican a íconos redondos en smartphones para ahorrar espacio.
3. **Optimización con `whiteSpace: nowrap` y `overflowX: auto`**:
   Las barras de pestañas (Tabs) en paneles no se destrozan verticalmente, sino que pasan a ser escroleables horizontalmente en teléfonos pequeños.

### B. Escalamiento de la Base de Datos (Firebase Firestore)
Si la app pasa de tener 100 tips a 10,000,000 de tips, **no colapsará**. ¿Por qué?
1. **Carga Perezosa (Lazy Loading / Scroll Infinito)**: 
   En `DataContext.jsx`, `onSnapshot(limit(15))` no lee toda la base de datos de inicio. Solo descarga los 15 posts más recientes. 
   Cuando un usuario hace scroll hacia abajo en la pantalla, el método `loadMoreTips()` pide los siguientes 15 apoyándose en un "Cursor" de página (`startAfter`). Esto consume apenas recursos.
2. **Operaciones Atómicas Batch**: 
   Los likes y borrados utilizan operaciones `writeBatch` (lotes divisibles y transacciones). En lugar de modificar el contador del tip, esperar, y luego guardar quién dio like, lo envían como un paquete encriptado a prueba de pérdida de datos.
3. **Listeners en Tiempo Real con Caché Optimizada**:
   Se implementó *Optimistic UI* (Actualización Optimista). La aplicación reacciona **antes** de que el servidor responda, dando ilusión de velocidad instantánea; sin embargo, Firebase sincroniza todo silenciosamente en segundo plano.

---

## 4. Guía Rápida para Modificar o Ajustar el Proyecto

###  4.1 Cambiar colores, tamaños o fuentes
**Dónde mirar:** `src/index.css`
Casi toda la identidad del proyecto está controlada por variables de CSS en la raíz (línea 10 en adelante):
```css
:root {
  --primary: #16a34a;      /* Verde principal de botones */
  --bg: #f8fafc;           /* Fondo gris claro global */
  --surface: #ffffff;      /* Tarjetas y ventanas */
  --radius-xl: 18px;       /* Redondez global de Modales */
}
```
**Para ajustarlo:** Simplemente cambia un código de color aquí y se propagará mágicamente por todos los modales, botones y bordes del proyecto.

###  4.2 Cambiar, agregar o corregir textos (Añadir un idioma)
**Dónde mirar:** `src/context/LanguageContext.jsx`
- Ubica el objeto de idiomas (`translations.es` para español y `translations.en` para inglés).
- Si necesitas un nuevo mensaje de alerta, agrégalo ahí (por ejemplo: `nuevaAlerta: "Hola Mundo"`).
- Para mostrarlo en el código, importa `{ useLanguage }` en el componente y usa interpolación: `<p>{t('nuevaAlerta')}</p>`

###  4.3 Actualizar campos en Base de Datos
**Dónde mirar:** `src/context/DataContext.jsx` y `firestore.rules`
- El backend corre solo y requiere poco mantenimiento, la configuración que otorga la estructura (Like = +1, Report = +1, Date, etc.) se encuentra en la lógica directa de creación en `DataContext.jsx`.
- Para proteger tu servidor si tu aplicación crece y entran hackers: La protección está codificada en `firestore.rules` (en la carpeta base del proyecto). Este archivo dicta quién tiene permiso para alterar un contenido de tip específico basado en tokens de sesión (`request.auth`). Para publicarlas debes abrir la consola y teclear: `firebase deploy --only firestore:rules`

###  4.4 Modos de Interfaz
Actualmente, Eco Tips implementa iconos del paquete **`lucide-react`**. 
Para cambiar formas de icono, solo importa sus nombres (ej. `<CheckCircle2 />` o `<Settings />`). El diseño está precompilado para tomar la tonalidad y el grosor del texto más cercano usando `strokeWidth={...}`.
