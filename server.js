// Servidor para rodar localmente (npm run dev).
// Na Vercel o backend usa o app.js e o frontend é um projeto separado (pasta frontend).
import express from "express";
import app from "./app.js";

app.use(express.static("frontend"));

app.listen(3333, () => {
    console.log("Servidor online em http://localhost:3333");
});
