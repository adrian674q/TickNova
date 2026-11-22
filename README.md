# TickNova

Plataforma de venta y gestión de boletos para eventos, hecha con React 19, Vite 8 y JavaScript. Proyecto de Programación Orientada al Usuario (UCA). Esta segunda entrega convierte el prototipo de Figma en una aplicación React funcional, con datos simulados y persistencia en el navegador.

## Descripción

El cliente busca eventos, abre el detalle, elige zona y asientos (o cantidad en la zona General), revisa el carrito, paga con una tarjeta simulada y recibe su boleto con código QR, que luego consulta en Mis boletos. Los administradores y organizadores tienen un panel con dashboard, eventos (crear y editar), inventario, usuarios y reportes. La aplicación cubre los ocho módulos del MVP.

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
npm run preview   # sirve la versión de producción
npm run lint      # revisa el código con ESLint
```

La aplicación utiliza datos simulados y no necesita un backend ni una base de datos real. Cada cambio que se sube a la rama `main` se publica automáticamente en GitHub Pages con el flujo `.github/workflows/deploy.yml`.

## Cuentas de prueba

- Cliente: matt@ejemplo.com / Cliente123
- Administrador: ariadna@ejemplo.com / Admin123
- Organizador: fernanda@ejemplo.com / Organizador123

La tarjeta `4000 0000 0000 0002` siempre es rechazada, para ver el error del pago. Cualquier otra tarjeta de 16 dígitos con fecha vigente y CVV de 3 dígitos es aceptada.

## Estructura

- `src/api`: servicios que simulan las peticiones con promesas y `setTimeout`.
- `src/components`: componentes reutilizables del Design System, cada uno con su CSS.
- `src/context`: estado compartido de navegación, sesión, carrito y preferencias.
- `src/data`: datos simulados.
- `src/hooks`: `usePeticion`, `useEventos`, `useLocalStorage` y `useTitulo`.
- `src/layout`: estructuras de página (tienda, compra, acceso y panel).
- `src/pages`: vistas; las del panel están en `src/pages/admin`.
- `src/utils`: formatos, filtros, asientos, reportes y validaciones.
- `src/App.jsx`: elige la vista actual y controla el acceso por sesión y rol.

## Componentes

- `Boton`, `Enlace`, `Campo`, `Chips`, `Insignia` e `Icono`: controles y elementos básicos.
- `Cargando`, `MensajeError` y `EstadoVacio`: estados de carga, error con reintento y vacío.
- `Encabezado`, `PiePagina`, `BarraLateral`, `Migas`, `Logo`, `Avatar` y `EnlaceSaltar`: navegación e identidad.
- `BarraBusqueda`, `TarjetaEvento`, `TarjetaDestacada` y `SeccionEventos`: búsqueda y listados de eventos.
- `TarjetaZona`, `MapaAsientos`, `SelectorCantidad`, `IndicadorPasos`, `ItemCarrito` y `ResumenCompra`: proceso de compra.
- `CodigoQR` y `TarjetaBoleto`: boletos con código QR generado en el navegador.
- `TarjetaEstadistica`, `GraficoBarras`, `ListaValores` y `TablaDatos`: dashboard, inventario, usuarios y reportes.

## Estado y persistencia

- La sesión, el carrito y las preferencias (filtro de fechas y correo recordado) se comparten con Context y se guardan en `localStorage`.
- Las compras, los eventos editados en el panel y las cuentas registradas también se guardan en `localStorage`.
- La pantalla actual se guarda en `sessionStorage` para conservarla al recargar.
- Subtotal, cargo y total se calculan a partir del carrito; no se guardan aparte.
- Las vistas cargan datos con `usePeticion`, que muestra carga, error con reintento y éxito, e ignora resultados obsoletos.

El detalle está en [docs/arquitectura.md](docs/arquitectura.md).

## Datos simulados

- `src/data/eventos.js`: 15 eventos del prototipo, 3 destacados, cada uno con zonas General, Preferencial y VIP, precios y disponibilidad. Fechas de noviembre de 2026 a enero de 2027.
- `src/data/usuarios.js`: los cinco usuarios del prototipo con roles cliente, administrador y organizador. Correos y contraseñas ficticios.
- `src/data/ordenes.js`: 36 compras de junio a noviembre de 2026, con las que se calculan el dashboard y los reportes.

La carga del listado de eventos falla de vez en cuando a propósito para mostrar el estado de error con reintento.

## Capturas

Las capturas de las 15 pantallas principales en 375, 768 y 1440 px están en [docs/capturas/](docs/capturas/).

## Limitaciones

- No hay backend, base de datos, pago real ni envío de correos; la autenticación es simulada.
- Los datos se guardan solo en el navegador; al borrar el `localStorage` vuelven los datos iniciales.
- La navegación es por estado de vista, así que el botón "atrás" del navegador no cambia de pantalla. React Router se incorpora en la entrega final.
- El mapa de asientos representa una sección de la zona.

## Decisiones de diseño

- Se respetan la paleta (`#504E76`, `#F1642E`, `#FDF8E2`), las tipografías Poppins e Inter y la jerarquía del prototipo en los tres breakpoints.
- El naranja de los botones se oscureció a `#CC4A15` para cumplir el contraste mínimo con texto blanco.
- "Crear evento" y "Edita tu evento" usan la misma pantalla; al editar se elige el evento arriba.
- VIP y Preferencial tienen asientos numerados; General se compra por cantidad.
- El cargo por servicio es del 6 %, como en el resumen del prototipo.
- Estilos con CSS propio; la única dependencia adicional es `qrcode`.
