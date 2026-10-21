import { Router } from "express";
import crypto from "crypto";
import database from "../config/database.js";
import { enviarEmailVerificacao } from "../config/email.js";

const router = Router();

// ----------------------------------------------------
// 1. ROTA DE CADASTRO (/api/create-user)
// ----------------------------------------------------
router.post("/create-user", (request, response) => {
  const { nome_completo, usuario, email, senha } = request.body;

  if (!nome_completo || !usuario || !email || !senha) {
    return response.status(400).json({
      message: "Preencha todos os campos, incluindo o e-mail."
    });
  }

  // Gerar token aleatório e único para verificação
  const token = crypto.randomBytes(32).toString("hex");

  const insertCommand = `
    INSERT INTO usuarios (nome_completo, usuario, email, senha, verificado, token_verificacao)
    VALUES (?, ?, ?, ?, 0, ?)
  `;

  database.query(
    insertCommand,
    [nome_completo, usuario, email, senha, token],
    async (error) => {
      if (error) {
        if (error.code === "ER_DUP_ENTRY") {
          return response.status(409).json({
            message: "Nome de utilizador ou e-mail já está em uso."
          });
        }

        console.error("Erro ao cadastrar utilizador:", error);
        return response.status(500).json({
          message: "Erro ao cadastrar utilizador."
        });
      }

      try {
        // Enviar o e-mail com o link de ativação
        await enviarEmailVerificacao(email, token);

        return response.status(201).json({
          message: "Conta registada com sucesso! Verifique o seu e-mail para ativar a conta."
        });
      } catch (emailError) {
        console.error("Erro ao enviar e-mail de verificação:", emailError);
        return response.status(500).json({
          message: "Conta criada, mas ocorreu um erro ao enviar o e-mail de verificação."
        });
      }
    }
  );
});

// ----------------------------------------------------
// 2. ROTA DE VERIFICAÇÃO DE E-MAIL (/api/verificar)
// ----------------------------------------------------
router.get("/verificar", (request, response) => {
  const { token } = request.query;

  if (!token) {
    return response.status(400).send("Token de verificação ausente.");
  }

  const selectCommand = `
    SELECT id FROM usuarios WHERE token_verificacao = ? LIMIT 1
  `;

  database.query(selectCommand, [token], (error, results) => {
    if (error) {
      console.error("Erro ao procurar token:", error);
      return response.status(500).send("Erro interno na verificação.");
    }

    if (results.length === 0) {
      return response.status(400).send("Link de verificação inválido ou expirado.");
    }

    const userId = results[0].id;
    const updateCommand = `
      UPDATE usuarios SET verificado = 1, token_verificacao = NULL WHERE id = ?
    `;

    database.query(updateCommand, [userId], (updateError) => {
      if (updateError) {
        console.error("Erro ao ativar conta:", updateError);
        return response.status(500).send("Erro ao ativar a conta.");
      }

      // Redireciona para a página de login
      return response.redirect("/login.html?verificado=true");
    });
  });
});

// ----------------------------------------------------
// 3. ROTA DE LOGIN (/api/login)
// ----------------------------------------------------
router.post("/login", (request, response) => {
  const { usuario, senha } = request.body;

  if (!usuario || !senha) {
    return response.status(400).json({
      message: "Preencha utilizador e palavra-passe."
    });
  }

  const selectCommand = `
    SELECT id, nome_completo, usuario, verificado 
    FROM usuarios 
    WHERE usuario = ? AND senha = ? 
    LIMIT 1
  `;

  database.query(selectCommand, [usuario, senha], (error, results) => {
    if (error) {
      console.error("Erro ao fazer login:", error);
      return response.status(500).json({
        message: "Erro ao fazer login."
      });
    }

    if (results.length === 0) {
      return response.status(401).json({
        message: "Utilizador ou palavra-passe incorretos."
      });
    }

    const user = results[0];

    // Bloqueia o login se a conta ainda não estiver verificada pelo e-mail
    if (user.verificado !== 1) {
      return response.status(403).json({
        message: "Conta não verificada. Confirme o e-mail de ativação antes de entrar."
      });
    }

    return response.status(200).json({
      message: "Login realizado com sucesso!",
      usuario: {
        id: user.id,
        nome_completo: user.nome_completo,
        usuario: user.usuario
      }
    });
  });
});

export default router;