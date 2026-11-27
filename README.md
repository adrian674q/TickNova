# TickNova

Plataforma de venta y gestión de boletos para eventos, hecha con React 19, Vite 8 y JavaScript. Proyecto de Programación Orientada al Usuario (UCA). La entrega final convierte la aplicación en una PWA instalable que funciona sin conexión, con React Router, estado global con Context y `useReducer`, una API falsa y publicación en GitHub Pages.

## Descripción y alcance

El cliente busca eventos, abre el detalle, elige zona y asientos (o cantidad en la zona General), revisa el carrito, paga con una tarjeta simulada y recibe su boleto con código QR, que luego consulta en Mis boletos. Los administradores y organizadores tienen un panel con dashboard, eventos (crear, editar y eliminar), inventario y precios; el administrador además ve usuarios y reportes. La aplicación cubre los ocho módulos del MVP.

## Instalación y ejecución

La versión publicada se puede abrir directamente en GitHub Pages, sin instalar nada:

**https://adrian674q.github.io/TickNova/**

Para ejecutarla localmente se necesita Node.js 20.19 o superior, npm y Git:

```bash
git clone https://github.com/adrian674q/TickNova.git
cd TickNova
npm install
npm run dev
```

Luego se abre la dirección que indica Vite, normalmente http://localhost:5173/

Otros comandos:

```bash
npm run build     # genera la versión de producción en dist/
npm run preview   # sirve la versión de producción (con service worker)
npm run lint      # revisa el código con ESLint
```

La aplicación utiliza datos simulados y no necesita un backend ni una base de datos real. Cada cambio que se sube a la rama `main` se publica automáticamente en GitHub Pages con el flujo `.github/workflows/deploy.yml`.

## Cuentas de prueba y roles

- Cliente: matt@ejemplo.com / Cliente123. Compra boletos y ve Mis boletos y su perfil.
- Administrador: ariadna@ejemplo.com / Admin123. Acceso completo al panel, incluidos Usuarios y Reportes.
- Organizador: fernanda@ejemplo.com / Organizador123. Panel con Dashboard, Eventos e Inventario.

La tarjeta `4000 0000 0000 0002` siempre es rechazada, para ver el error del pago. Cualquier otra tarjeta de 16 dígitos con fecha vigente y CVV de 3 dígitos es aceptada. La autenticación, los pagos y el envío de correos son simulados.

## Arquitectura de carpetas

- `public/api`: archivos JSON de la API falsa (eventos, usuarios y órdenes).
- `public/icons`: íconos de la PWA (192, 512 y maskable).
- `src/api`: capa de acceso a datos. `cliente.js` lee los JSON con `fetch`; los servicios aplican las reglas y guardan las escrituras en `localStorage`.
- `src/components`: componentes reutilizables del Design System, cada uno con su CSS.
- `src/context`: Context y reducers de sesión, carrito y preferencias (`reductores.js`).
- `src/hooks`: `usePeticion`, `useEventos`, `useReducerPersistente` y `useTitulo`.
- `src/layout`: estructuras de página (tienda, compra, acceso y panel).
- `src/pages`: vistas; las del panel están en `src/pages/admin` y se cargan de forma diferida.
- `src/utils`: formatos, filtros, asientos, reportes y validaciones.
- `src/router.jsx`: rutas de la aplicación.
- `scripts/copy-404.mjs`: copia `index.html` a `404.html` para GitHub Pages.

## Mapa de rutas

Públicas:
- `/` inicio con destacados y secciones.
- `/eventos` listado con búsqueda y filtros (`?q=`, `?categoria=`, `?fecha=`, `?ciudad=`).
- `/eventos/:id` detalle del evento y `/eventos/:id/boletos?zona=` selección de asientos o cantidad.
- `/carrito` carrito y resumen.
- `/checkout` pago simulado. Es pública, pero para pagar se pide iniciar sesión y luego se vuelve aquí.
- `/ingresar` (con `?modo=registro` para crear cuenta) y `/recuperar`.
- `*` página 404.

Con sesión:
- `/boletos` boletos del usuario, `/perfil` perfil y `/confirmacion?codigos=` confirmación de la compra.

Panel:
- `/admin`, `/admin/eventos`, `/admin/eventos/nuevo`, `/admin/eventos/:id/editar` y `/admin/inventario`: administrador u organizador.
- `/admin/usuarios` y `/admin/reportes`: solo administrador.

`RutaProtegida` envía a `/ingresar` cuando no hay sesión (y recuerda la ruta de origen) y al inicio cuando el rol no alcanza.

## API falsa y mapeo de datos

- `eventos.json`: 15 eventos con categoría, fecha, lugar, ciudad, imagen, estado (`disponible`, `pocos`, `agotado`, `cancelado` o `borrador`) y tres zonas (General, Preferencial y VIP) con precio, capacidad y disponibles.
- `usuarios.json`: los cinco usuarios del prototipo con su rol. Correos y contraseñas ficticios.
- `ordenes.json`: 36 compras con usuario, evento, zona, cantidad, asientos, total, fecha, estado y código.

Cada lectura simula la latencia del servidor y luego hace `fetch` al JSON. Todas reciben un `AbortSignal`: `usePeticion` crea un `AbortController` y cancela la petición si el usuario cambia de página. Las escrituras (crear, editar y eliminar eventos, compras, registro y perfil) se guardan en `localStorage` y se combinan con los datos del JSON. Eliminar un evento es una baja lógica: deja de mostrarse, pero sus ventas siguen en los reportes y en los boletos. La carga del listado falla de vez en cuando a propósito para mostrar el estado de error con reintento.

## Estado global

- Sesión, carrito y preferencias usan Context con `useReducer`. Las acciones están en `src/context/reductores.js` (`INICIAR_SESION`, `CERRAR_SESION`, `AGREGAR`, `QUITAR`, `VACIAR`, `CAMBIAR_PREFERENCIA`, entre otras).
- `useReducerPersistente` carga el estado desde `localStorage` y lo guarda en cada cambio.
- Subtotal, cargo y total se calculan a partir del carrito; no se guardan aparte.

El detalle está en [docs/arquitectura.md](docs/arquitectura.md).

## PWA y caché

- `vite-plugin-pwa` genera el `manifest.webmanifest` (nombre, descripción, `start_url`, `scope`, `display: standalone`, colores e íconos de 192, 512 y maskable) y el service worker con Workbox.
- Precache del app shell: HTML, JS, CSS e íconos.
- API (`/api/*.json`): NetworkFirst, con 3 segundos de espera antes de usar la copia guardada.
- Imágenes (`/img/`): CacheFirst, hasta 60 imágenes por 30 días.
- Fuentes de Google: StaleWhileRevalidate para el CSS y CacheFirst para los archivos.
- `navigateFallback` a `index.html`, para que las rutas profundas abran también sin conexión.
- Avisos: "nueva versión disponible" con botón Actualizar, "lista para usarse sin conexión" y una barra de "Sin conexión" mientras no hay internet.

Para instalarla, abre el sitio en Chrome o Edge y usa el ícono de instalar en la barra de direcciones. Para probar el modo offline: visita algunas páginas, activa "Offline" en DevTools > Network y recarga.

## Despliegue

El flujo `.github/workflows/deploy.yml` se ejecuta con cada push a `main`: instala con `npm ci`, compila con `VITE_BASE=/TickNova/` (base de Vite, `basename` del router y `scope` de la PWA) y publica `dist/` en GitHub Pages. El build genera `404.html` como copia de `index.html` para que las rutas profundas carguen al recargar, y `public/.nojekyll` evita el procesamiento de Jekyll. En el repositorio, Settings > Pages debe tener como fuente "GitHub Actions".

## Componentes

- `Boton`, `Campo`, `Chips`, `Insignia` e `Icono`: controles y elementos básicos.
- `Cargando`, `MensajeError` y `EstadoVacio`: estados de carga, error con reintento y vacío.
- `Encabezado`, `PiePagina`, `BarraLateral`, `Migas`, `Logo`, `Avatar` y `EnlaceSaltar`: navegación e identidad.
- `RutaProtegida`: acceso por sesión y rol.
- `AvisoPWA` y `AvisoConexion`: avisos de actualización y de modo sin conexión.
- `BarraBusqueda`, `TarjetaEvento`, `TarjetaDestacada` y `SeccionEventos`: búsqueda y listados de eventos.
- `TarjetaZona`, `MapaAsientos`, `SelectorCantidad`, `IndicadorPasos`, `ItemCarrito` y `ResumenCompra`: proceso de compra.
- `CodigoQR` y `TarjetaBoleto`: boletos con código QR generado en el navegador; el QR codifica el código de la orden.
- `TarjetaEstadistica`, `GraficoBarras`, `ListaValores` y `TablaDatos`: dashboard, inventario, usuarios y reportes.

## Capturas

Las capturas de las pantallas principales (listado, detalle, carrito y checkout, boleto con QR, panel, reportes y modo offline) en 375, 768 y 1440 px están en [docs/capturas/](docs/capturas/), junto con las del manifest y el service worker en DevTools.

## Limitaciones

- No hay backend, base de datos, pago real ni envío de correos; la autenticación y las escrituras son simuladas y se guardan solo en el navegador.
- Al borrar el `localStorage` vuelven los datos iniciales.
- Sin conexión solo están disponibles las páginas y datos visitados antes; las compras y cambios del panel necesitan conexión.
- El mapa de asientos representa una sección de la zona; además de los vendidos, algunos asientos aparecen ocupados como ejemplo.

## Decisiones de diseño

- Se respetan la paleta (`#504E76`, `#F1642E`, `#FDF8E2`), las tipografías Poppins e Inter y la jerarquía del prototipo en los tres breakpoints.
- El naranja de los botones se oscureció a `#CC4A15` para cumplir el contraste mínimo con texto blanco.
- "Crear evento" y "Edita tu evento" usan la misma pantalla; al editar se elige el evento arriba.
- VIP y Preferencial tienen asientos numerados; General se compra por cantidad.
- El cargo por servicio es del 6 %, como en el resumen del prototipo.
- Estilos con CSS propio; las dependencias adicionales son `react-router`, `qrcode` y `vite-plugin-pwa`.
