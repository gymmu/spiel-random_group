import { defineConfig } from "vite"
import { resolve } from "path"

export default defineConfig({
  define: {
    "process.env": {},
  },
  server: {
    host: "0.0.0.0",
  },
  test: {
    globals: true,
    environment: "jsdom",
    testIdAttribute: "id",
  },
  build: {
    outDir: "docs",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        game: resolve(__dirname, "game.html"),
        // Optional: Kann einkommentiert werden.
        // pres: resolve(__dirname, "pres.html"),
      },
    },
  },
  // TODO: Das hier muss angepasst werden!!!
  base: "/phaser-playground/",
})
