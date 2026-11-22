import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { CarritoProvider } from "./context/CarritoContext.jsx";
import { NavegacionProvider } from "./context/NavegacionContext.jsx";
import { PreferenciasProvider } from "./context/PreferenciasContext.jsx";
import { SesionProvider } from "./context/SesionContext.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PreferenciasProvider>
      <SesionProvider>
        <CarritoProvider>
          <NavegacionProvider>
            <App />
          </NavegacionProvider>
        </CarritoProvider>
      </SesionProvider>
    </PreferenciasProvider>
  </StrictMode>
);
