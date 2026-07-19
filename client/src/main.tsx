import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Suppress benign ResizeObserver loop limit exceeded warnings
if (typeof window !== "undefined") {
  window.addEventListener("error", (e) => {
    if (e.message && (
      e.message.includes("ResizeObserver loop completed with undelivered notifications") ||
      e.message.includes("ResizeObserver loop limit exceeded")
    )) {
      e.stopImmediatePropagation();
    }
  });
}

createRoot(document.getElementById("root")!).render(<App />);
