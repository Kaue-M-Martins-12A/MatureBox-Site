import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import app from "./app.js";

// Resolver __dirname em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir os arquivos estáticos da pasta frontend
app.use(express.static(path.join(__dirname, "frontend")));

// Rota principal para carregar o index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// Executa app.listen apenas quando estiver rodando localmente
if (process.env.NODE_ENV !== "production") {
  app.listen(3333, () => {
    console.log("Servidor online em http://localhost:3333");
  });
}

// Exporta o app para a Vercel entender como Serverless Function
export default app;