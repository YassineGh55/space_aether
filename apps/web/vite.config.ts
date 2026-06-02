import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const webEnv = loadEnv(mode, process.cwd(), "");
  const apiEnv = loadEnv(mode, path.resolve(__dirname, "../api"), "");
  const googleClientId = webEnv.VITE_GOOGLE_CLIENT_ID || apiEnv.GOOGLE_CLIENT_ID || "";

  return {
    plugins: [react(), tailwindcss()],
    define: {
      "import.meta.env.VITE_GOOGLE_CLIENT_ID": JSON.stringify(googleClientId),
    },
    server: {
      proxy: {
        "/api": apiEnv.API_URL || webEnv.API_URL || "http://127.0.0.1:3001",
      },
    },
  };
});
