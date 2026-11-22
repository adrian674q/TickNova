const ESTADOS_EVENTO = {
  disponible: { texto: "Publicado", tono: "lavanda" },
  pocos: { texto: "Últimos boletos", tono: "aviso" },
  agotado: { texto: "Agotado", tono: "peligro" },
  cancelado: { texto: "Cancelado", tono: "neutro" },
  borrador: { texto: "Borrador", tono: "neutro" }
};

export const ROLES = { cliente: "Cliente", administrador: "Administrador", organizador: "Organizador" };

export function datosEstadoEvento(estado){
  return ESTADOS_EVENTO[estado] || ESTADOS_EVENTO.disponible;
}
