import { Router } from "express";
import database from "../config/database.js";

const router = Router();

router.post("/create-user", (request, response) => {
    const { nome_completo, usuario, senha } = request.body;

    if (!nome_completo || !usuario || !senha) {
        return response.status(400).json({
            message: "Preencha todos os campos."
        });
    }

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
                if (error.code === "ER_DUP_ENTRY") {
                    return response.status(409).json({
                        message: "Esse nome de usuário já está em uso."
                    });
                }

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

router.post("/login", (request, response) => {
    const { usuario, senha } = request.body;

    if (!usuario || !senha) {
        return response.status(400).json({
            message: "Preencha usuário e senha."
        });
    }

    const selectCommand = `
        SELECT nome_completo, usuario
        FROM usuarios
        WHERE usuario = ? AND senha = ?
        LIMIT 1
    `;

    database.query(
        selectCommand,
        [usuario, senha],
        (error, results) => {
            if (error) {
                console.error("Erro ao fazer login:", error);

                return response.status(500).json({
                    message: "Erro ao fazer login."
                });
            }

            if (results.length === 0) {
                return response.status(401).json({
                    message: "Usuário ou senha incorretos."
                });
            }

            return response.status(200).json({
                message: "Login realizado com sucesso!",
                usuario: results[0]
            });
        }
    );
});

export default router;
