
# TickNova

Plataforma de venta y gestión de boletos para eventos, desarrollada con React 19, Vite 8 y JavaScript.

Proyecto académico de la asignatura Programación Orientada al Usuario de la Universidad Centroamericana José Simeón Cañas (UCA).

## Instalación y ejecución

### Requisitos previos

- Node.js compatible con Vite 8
- npm
- Git
- Visual Studio Code o un editor similar

### Instalación

1. Clonar el repositorio:

    git clone https://github.com/adrian674q/TickNova.git

2. Entrar a la carpeta del proyecto:

    cd TickNova

3. Instalar las dependencias:

    npm install

4. Ejecutar el proyecto:

    npm run dev

5. Abrir en el navegador la dirección indicada por Vite, normalmente:

    http://localhost:5173/

La aplicación utiliza datos simulados y no necesita un backend ni una base de datos real.

## Datos simulados

Los datos de TickNova se encuentran en la carpeta src/data/ y permiten representar eventos, usuarios y compras sin utilizar servicios externos.

### Eventos

Archivo: src/data/eventos.js

Contiene 12 eventos basados en el prototipo original de Figma.

Cada evento incluye:

- Identificador
- Nombre
- Categoría
- Fecha y hora
- Lugar y ciudad
- Imagen
- Descripción
- Estado de disponibilidad
- Zonas, precios, capacidades y boletos disponibles

Cada evento cuenta con tres zonas: General, Preferencial y VIP.

Las fechas corresponden a noviembre y diciembre de 2026 y enero de 2027.

### Usuarios

Archivo: src/data/usuarios.js

Contiene cinco usuarios ficticios distribuidos en tres roles:

- Cliente
- Administrador
- Organizador

Cada usuario tiene un identificador, nombre, correo electrónico, contraseña simulada y rol.

Todos los correos utilizan el dominio @ejemplo.com.

Las credenciales son únicamente para pruebas académicas y no representan un sistema de autenticación seguro.

### Órdenes

Archivo: src/data/ordenes.js

Contiene 20 compras simuladas distribuidas entre septiembre, octubre y noviembre de 2026.

Cada orden incluye:

- Identificador
- Usuario
- Evento
- Zona
- Cantidad de boletos
- Total
- Fecha de compra
- Estado
- Código de orden

Las órdenes pueden encontrarse en estado pagada o cancelada.

Estos datos permiten generar reportes y estadísticas de ventas.

## Utilidades

La carpeta src/utils/ contiene tres archivos.

### almacenamiento.js

Permite leer, guardar y eliminar información del navegador utilizando localStorage.

### simularPeticion.js

Simula operaciones asíncronas mediante promesas y setTimeout. También permite simular errores.

### formatos.js

Contiene funciones para mostrar cantidades monetarias en dólares estadounidenses y fechas en español.

## Servicios

La carpeta src/services/ contiene tres archivos.

### eventosService.js

Permite obtener el listado de eventos y consultar un evento específico mediante su identificador.

### usuariosService.js

Permite simular el inicio de sesión de clientes, administradores y organizadores.

### ordenesService.js

Permite consultar las órdenes existentes y registrar nuevas compras simuladas.

Las nuevas órdenes se almacenan en localStorage.

## Estructura del proyecto

TickNova/
- public/
  - img/
    - eventos/
- src/
  - assets/
  - components/
  - pages/
  - data/
  - utils/
  - services/
  - styles/
  - App.jsx
  - main.jsx
- .gitignore
- README.md
- package.json
- index.html

## Persistencia local

TickNova dispone de funciones para almacenar información en localStorage.

Actualmente, el servicio de órdenes permite conservar nuevas compras simuladas al actualizar la página.

La persistencia del carrito, la sesión y las preferencias se integrará con las pantallas correspondientes.

## Limitaciones

- No utiliza una base de datos real.
- No tiene backend.
- No procesa pagos reales.
- No envía correos electrónicos.
- La autenticación es simulada.
- Los datos son ficticios y se utilizan con fines académicos.
- Las imágenes de los eventos deben incorporarse en public/img/eventos/.
