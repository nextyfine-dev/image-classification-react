import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import dotenv from "dotenv";
import { expand } from "dotenv-expand";

expand(dotenv.config());

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      stream: "stream-browserify",
      path: "path-browserify",
      zlib: "browserify-zlib",
    },
  },
  define: {
    "process.browser": true,
    Buffer: ["buffer", "Buffer"],
    "process.env": process.env,
  },
});
