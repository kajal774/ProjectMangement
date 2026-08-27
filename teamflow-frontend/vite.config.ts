import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Standard Vite + React setup. Nothing custom here on purpose —
// keeping build tooling boring so the app code stays the focus.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
