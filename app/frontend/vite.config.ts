import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "url";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
  plugins: [react(), tailwindcss(), basicSsl()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // This function intercepts every file being bundled
        manualChunks(id) {
          // If the file is inside the lucide-react icons directory
          if (id.includes("node_modules/lucide-react/dist/esm/icons")) {
            return "lucide-icons-bundle"; // Force all icons into this ONE file
          }
          // Bundle the rest of the library normally
          if (id.includes("node_modules/lucide-react")) {
            return "lucide-react-core";
          }
        },
      },
    },
  },
  // Ensure development mode doesn't flood the network tab either
  optimizeDeps: {
    include: ["lucide-react"],
  },
});
