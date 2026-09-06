import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initMonitoring } from "@/lib/monitoring";

initMonitoring();

createRoot(document.getElementById("root")!).render(<App />);
