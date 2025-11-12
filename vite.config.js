import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    base: "/todo-app/",
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                admin: resolve(__dirname, "/about/index.html"),
                user: resolve(__dirname, "/contact/index.html"),
            },
        },
    },
    server: {
        open: "/",
    },
});
