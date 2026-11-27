import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import { CarritoProvider } from "./context/CarritoContext.jsx";
import { PreferenciasProvider } from "./context/PreferenciasContext.jsx";
import { SesionProvider } from "./context/SesionContext.jsx";
import { router } from "./router.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PreferenciasProvider>
      <SesionProvider>
        <CarritoProvider>
          <RouterProvider router={router} />
        </CarritoProvider>
      </SesionProvider>
    </PreferenciasProvider>
  </StrictMode>
);
