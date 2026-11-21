export const eventos = [
  {
    id: 1,
    nombre: "Artista en vivo",
    categoria: "Música",
    fecha: "2026-11-14",
    hora: "20:00",
    lugar: "Estadio Cuscatlán",
    ciudad: "San Salvador",
    imagen: "/img/eventos/artista-en-vivo.jpg",
    descripcion: "Una noche llena de música en vivo, luces y entretenimiento para disfrutar con amigos.",
    estado: "agotado",
    zonas: [
      { id: 1, nombre: "General", precio: 25, capacidad: 5000, disponibles: 0 },
      { id: 2, nombre: "Preferencial", precio: 50, capacidad: 2000, disponibles: 0 },
      { id: 3, nombre: "VIP", precio: 85, capacidad: 500, disponibles: 0 }
    ]
  },
  {
    id: 2,
    nombre: "Noche de concierto",
    categoria: "Música",
    fecha: "2026-11-20",
    hora: "19:30",
    lugar: "Teatro Nacional",
    ciudad: "San Salvador",
    imagen: "/img/eventos/noche-de-concierto.jpg",
    descripcion: "Una experiencia musical especial con artistas invitados y grandes interpretaciones.",
    estado: "pocos",
    zonas: [
      { id: 1, nombre: "General", precio: 20, capacidad: 400, disponibles: 35 },
      { id: 2, nombre: "Preferencial", precio: 35, capacidad: 200, disponibles: 12 },
      { id: 3, nombre: "VIP", precio: 60, capacidad: 80, disponibles: 5 }
    ]
  },
  {
    id: 3,
    nombre: "Gran final",
    categoria: "Deportes",
    fecha: "2026-11-22",
    hora: "18:00",
    lugar: "Gimnasio Nacional",
    ciudad: "San Salvador",
    imagen: "/img/eventos/gran-final.jpg",
    descripcion: "La emoción del deporte llega a su máximo nivel en una final llena de energía.",
    estado: "disponible",
    zonas: [
      { id: 1, nombre: "General", precio: 15, capacidad: 1500, disponibles: 900 },
      { id: 2, nombre: "Preferencial", precio: 30, capacidad: 600, disponibles: 350 },
      { id: 3, nombre: "VIP", precio: 50, capacidad: 150, disponibles: 80 }
    ]
  },
  {
    id: 4,
    nombre: "Obra destacada",
    categoria: "Teatro",
    fecha: "2026-11-27",
    hora: "20:00",
    lugar: "Centro Cultural",
    ciudad: "San Salvador",
    imagen: "/img/eventos/obra-destacada.jpg",
    descripcion: "Una presentación teatral que combina talento, emoción y una historia inolvidable.",
    estado: "disponible",
    zonas: [
      { id: 1, nombre: "General", precio: 15, capacidad: 250, disponibles: 180 },
      { id: 2, nombre: "Preferencial", precio: 25, capacidad: 120, disponibles: 85 },
      { id: 3, nombre: "VIP", precio: 40, capacidad: 50, disponibles: 30 }
    ]
  },
  {
    id: 5,
    nombre: "Gira Acústica",
    categoria: "Música",
    fecha: "2026-12-05",
    hora: "20:00",
    lugar: "Café Teatro",
    ciudad: "San Salvador",
    imagen: "/img/eventos/gira-acustica.jpg",
    descripcion: "Un concierto acústico íntimo para disfrutar de grandes canciones en un ambiente especial.",
    estado: "disponible",
    zonas: [
      { id: 1, nombre: "General", precio: 15, capacidad: 150, disponibles: 100 },
      { id: 2, nombre: "Preferencial", precio: 25, capacidad: 80, disponibles: 55 },
      { id: 3, nombre: "VIP", precio: 40, capacidad: 30, disponibles: 20 }
    ]
  },
  {
    id: 6,
    nombre: "DJ Set Nocturno",
    categoria: "Música",
    fecha: "2026-12-12",
    hora: "22:00",
    lugar: "Club Central",
    ciudad: "San Salvador",
    imagen: "/img/eventos/dj-set-nocturno.jpg",
    descripcion: "Una noche de música electrónica con mezclas en vivo y un ambiente lleno de energía.",
    estado: "disponible",
    zonas: [
      { id: 1, nombre: "General", precio: 20, capacidad: 500, disponibles: 350 },
      { id: 2, nombre: "Preferencial", precio: 35, capacidad: 200, disponibles: 120 },
      { id: 3, nombre: "VIP", precio: 60, capacidad: 80, disponibles: 45 }
    ]
  },
  {
    id: 7,
    nombre: "Stand-up Comedy",
    categoria: "Comedia",
    fecha: "2026-12-13",
    hora: "19:00",
    lugar: "Sala Mayor",
    ciudad: "San Salvador",
    imagen: "/img/eventos/stand-up-comedy.jpg",
    descripcion: "Una noche de humor con comediantes que prometen hacer reír al público.",
    estado: "disponible",
    zonas: [
      { id: 1, nombre: "General", precio: 15, capacidad: 300, disponibles: 200 },
      { id: 2, nombre: "Preferencial", precio: 25, capacidad: 150, disponibles: 90 },
      { id: 3, nombre: "VIP", precio: 40, capacidad: 50, disponibles: 25 }
    ]
  },
  {
    id: 8,
    nombre: "Ballet de Temporada",
    categoria: "Teatro",
    fecha: "2026-12-14",
    hora: "17:00",
    lugar: "Teatro Nacional",
    ciudad: "San Salvador",
    imagen: "/img/eventos/ballet-de-temporada.jpg",
    descripcion: "Una presentación artística de danza clásica con música y coreografías especiales.",
    estado: "disponible",
    zonas: [
      { id: 1, nombre: "General", precio: 20, capacidad: 350, disponibles: 240 },
      { id: 2, nombre: "Preferencial", precio: 35, capacidad: 180, disponibles: 100 },
      { id: 3, nombre: "VIP", precio: 55, capacidad: 70, disponibles: 40 }
    ]
  },
  {
    id: 9,
    nombre: "Rock en el Parque",
    categoria: "Música",
    fecha: "2027-01-10",
    hora: "19:00",
    lugar: "Parque Cuscatlán",
    ciudad: "San Salvador",
    imagen: "/img/eventos/rock-en-el-parque.jpg",
    descripcion: "Un festival de rock al aire libre con bandas y mucha energía.",
    estado: "disponible",
    zonas: [
      { id: 1, nombre: "General", precio: 15, capacidad: 2000, disponibles: 1500 },
      { id: 2, nombre: "Preferencial", precio: 30, capacidad: 700, disponibles: 450 },
      { id: 3, nombre: "VIP", precio: 50, capacidad: 200, disponibles: 120 }
    ]
  },
  {
    id: 10,
    nombre: "Sinfónica Nacional",
    categoria: "Música",
    fecha: "2027-01-18",
    hora: "18:00",
    lugar: "Teatro Nacional",
    ciudad: "San Salvador",
    imagen: "/img/eventos/sinfonica-nacional.jpg",
    descripcion: "Un concierto de música sinfónica con interpretaciones de grandes obras musicales.",
    estado: "disponible",
    zonas: [
      { id: 1, nombre: "General", precio: 20, capacidad: 400, disponibles: 280 },
      { id: 2, nombre: "Preferencial", precio: 35, capacidad: 200, disponibles: 130 },
      { id: 3, nombre: "VIP", precio: 55, capacidad: 80, disponibles: 50 }
    ]
  },
  {
    id: 11,
    nombre: "Pop Latino Fest",
    categoria: "Música",
    fecha: "2027-01-24",
    hora: "20:00",
    lugar: "Estadio Cuscatlán",
    ciudad: "San Salvador",
    imagen: "/img/eventos/pop-latino-fest.jpg",
    descripcion: "Un festival de música pop latina con artistas invitados y grandes éxitos.",
    estado: "disponible",
    zonas: [
      { id: 1, nombre: "General", precio: 30, capacidad: 5000, disponibles: 3500 },
      { id: 2, nombre: "Preferencial", precio: 60, capacidad: 2000, disponibles: 1200 },
      { id: 3, nombre: "VIP", precio: 100, capacidad: 500, disponibles: 250 }
    ]
  },
  {
    id: 12,
    nombre: "Indie Night",
    categoria: "Música",
    fecha: "2027-01-30",
    hora: "21:00",
    lugar: "Club Central",
    ciudad: "San Salvador",
    imagen: "/img/eventos/indie-night.jpg",
    descripcion: "Una noche dedicada a la música indie con bandas emergentes y sonidos alternativos.",
    estado: "disponible",
    zonas: [
      { id: 1, nombre: "General", precio: 20, capacidad: 450, disponibles: 300 },
      { id: 2, nombre: "Preferencial", precio: 35, capacidad: 180, disponibles: 110 },
      { id: 3, nombre: "VIP", precio: 55, capacidad: 70, disponibles: 40 }
    ]
  }
];
export default eventos;