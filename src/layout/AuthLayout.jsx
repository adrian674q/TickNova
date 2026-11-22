import EnlaceSaltar from "../components/EnlaceSaltar.jsx";
import Logo from "../components/Logo.jsx";
import "./AuthLayout.css";

export default function AuthLayout({ children }){
  return (
    <div className="auth">
      <EnlaceSaltar />
      <section className="auth__marca" aria-label="TickNova">
        <Logo />
        <p className="auth__lema">Tus eventos favoritos, a un clic de distancia</p>
        <p className="auth__texto">Compra boletos para conciertos, teatro y deportes con código QR al instante.</p>
      </section>
      <main id="contenido" className="auth__principal" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
