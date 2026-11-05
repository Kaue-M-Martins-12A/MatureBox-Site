import express from "express";
import cors from "cors";
import usuariosRoutes from "./routes/usuarios.js";
import dispositivoRoutes from "./routes/dispositivo.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", usuariosRoutes);
app.use("/api", dispositivoRoutes);

export default app;
