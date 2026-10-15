import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import usuariosRoutes from "./routes/usuarios.js";

const app = express();

const frontendPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../frontend");

app.use(cors());
app.use(express.json());

// Serve o site (pasta frontend) em http://localhost:3333
app.use(express.static(frontendPath));

app.use(usuariosRoutes);

app.listen(3333, () => {
    console.log("Servidor online em http://localhost:3333");
});
