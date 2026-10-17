import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";

const BASE = import.meta.env.BASE_URL; // "/" in dev, "/meridian/" in production
createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename={BASE.replace(/\/$/, "") || "/"}><App /></BrowserRouter>,
);
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => navigator.serviceWorker.register(`${BASE}sw.js`, { scope: BASE }));
}
