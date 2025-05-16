import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/aso-backend-ui/", // IMPORTANT: Match your repo name!
});
