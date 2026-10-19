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

// Porta dinâmica para o Railway (process.env.PORT) ou 3333 para testes locais
const PORT = process.env.PORT || 3333;

// No Railway, o servidor precisa rodar o app.listen SEMPRE
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;