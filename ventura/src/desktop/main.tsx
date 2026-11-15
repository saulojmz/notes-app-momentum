import { createRoot } from "react-dom/client";
import "@fontsource-variable/instrument-sans";
import "@fontsource/instrument-serif/400.css";
import DesktopApp from "./DesktopApp";
import { ensureSeed } from "@/features/trips";
import "@/index.css";

ensureSeed();

createRoot(document.getElementById("root")!).render(<DesktopApp />);
