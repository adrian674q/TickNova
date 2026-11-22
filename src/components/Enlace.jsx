import { useNavegacion } from "../context/NavegacionContext.jsx";

// Enlace interno: cambia la vista sin recargar la página.
export default function Enlace({ vista, params, children, activo, onClick, ...props }){
  const { ir } = useNavegacion();

  function navegar(evento){
    evento.preventDefault();
    onClick?.();
    ir(vista, params);
  }

  return (
    <a href="#" onClick={navegar} aria-current={activo ? "page" : undefined} {...props}>
      {children}
    </a>
  );
}
