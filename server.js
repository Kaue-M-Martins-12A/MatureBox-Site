import express from "express";
import cors from "cors";
import mysql2 from "mysql2";

const app = express();

app.use(cors());
app.use(express.json());

const database = mysql2.createPool({
    host: "benserverplex.ddns.net",
    user: "aluno_projetos",
    password: "aluno@projeto",
    database: "aluno_projetos_maturebox_db"
});

app.get("/", (request, response) => {
    response.json({
        message: "Você acessou a rota principal"
    });
});

app.post("/create-user", (request, response) => {
    const { nome_completo, usuario, senha } = request.body;

    const insertCommand = `
        INSERT INTO usuarios
        (nome_completo, usuario, senha)
        VALUES (?, ?, ?)
    `;

    database.query(
        insertCommand,
        [nome_completo, usuario, senha],
        (error) => {
            if (error) {
                console.error("Erro ao cadastrar usuário:", error);

                return response.status(500).json({
                    message: "Erro ao cadastrar usuário."
                });
            }

            return response.status(201).json({
                message: "Conta cadastrada com sucesso!"
            });
        }
    );
});

app.listen(3333, () => {
    console.log("Servidor online na porta 3333");
});