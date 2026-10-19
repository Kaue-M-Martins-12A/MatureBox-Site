import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Força SSL direto na porta 465 (evita o bloqueio da porta 587 no Railway)
  family: 4,    // Força IPv4
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

export async function enviarEmailVerificacao(emailDestino, token) {
  const urlBase = process.env.URL_BASE || "http://localhost:3333";
  const linkVerificacao = `${urlBase}/api/verificar?token=${token}`;

  const mailOptions = {
    from: `"MatureBox" <${process.env.EMAIL_USER}>`,
    to: emailDestino,
    subject: "Ative a sua conta no MatureBox",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #d97706;">Bem-vindo ao MatureBox!</h2>
        <p>Para ativar a sua conta e começar a utilizar a plataforma, clique no botão abaixo:</p>
        <p style="margin: 25px 0;">
          <a href="${linkVerificacao}" style="background-color: #d97706; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Ativar Minha Conta
          </a>
        </p>
        <p style="font-size: 0.85em; color: #666;">Se não solicitou este registo, pode ignorar este e-mail.</p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
}